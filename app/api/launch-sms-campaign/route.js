import { NextResponse } from "next/server";
import twilio from "twilio";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const getBillingMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const PLAN_LIMITS = {
  starter: {
    monthly_sms_limit: 500,
    sms_overage_rate: 0.02,
  },
  growth: {
    monthly_sms_limit: 2500,
    sms_overage_rate: 0.02,
  },
  pro: {
    monthly_sms_limit: 10000,
    sms_overage_rate: 0.02,
  },
};

export async function POST(req) {
  try {
    const { campaignId, userId } = await req.json();

    if (!campaignId || !userId) {
      return NextResponse.json(
        { error: "Missing campaignId or userId" },
        { status: 400 }
      );
    }

    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_PHONE_NUMBER
    ) {
      return NextResponse.json(
        { error: "Missing Twilio environment variables" },
        { status: 500 }
      );
    }

    const billingMonth = getBillingMonth();

    const { data: userProfile, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, plan, monthly_sms_limit, sms_overage_rate")
      .eq("id", userId)
      .single();

    if (userError || !userProfile) {
      return NextResponse.json(
        { error: userError?.message || "User profile not found" },
        { status: 404 }
      );
    }

    const cleanPlan = String(userProfile.plan || "starter").toLowerCase();
    const fallbackLimits = PLAN_LIMITS[cleanPlan] || PLAN_LIMITS.starter;

    const smsLimit =
      Number(userProfile.monthly_sms_limit || 0) ||
      fallbackLimits.monthly_sms_limit;

    const smsOverageRate =
      Number(userProfile.sms_overage_rate || 0) ||
      fallbackLimits.sms_overage_rate;

    const { data: usageRows, error: usageError } = await supabaseAdmin
      .from("marketing_usage")
      .select("quantity")
      .eq("user_id", userId)
      .eq("usage_type", "sms")
      .eq("billing_month", billingMonth);

    if (usageError) {
      return NextResponse.json(
        { error: usageError.message || "Could not load SMS usage" },
        { status: 500 }
      );
    }

    const smsUsedThisMonth = (usageRows || []).reduce(
      (sum, row) => sum + Number(row.quantity || 0),
      0
    );

    const { data: campaign, error: campaignError } = await supabaseAdmin
      .from("marketing_campaigns")
      .select("*")
      .eq("id", campaignId)
      .eq("user_id", userId)
      .single();

    if (campaignError || !campaign) {
      return NextResponse.json(
        { error: campaignError?.message || "Campaign not found" },
        { status: 404 }
      );
    }

    const { data: customers, error: customerError } = await supabaseAdmin
      .from("restaurant_customers")
      .select("id, first_name, full_name, phone, sms_opt_in")
      .eq("user_id", userId)
      .eq("sms_opt_in", true)
      .not("phone", "is", null);

    if (customerError) {
      return NextResponse.json(
        { error: customerError.message },
        { status: 500 }
      );
    }

    const recipients = customers || [];

    if (!recipients.length) {
      return NextResponse.json({
        success: true,
        sent: 0,
        message: "Campaign marked live, but no opted-in SMS customers found.",
      });
    }

    // Safety cap while testing
    const cappedRecipients = recipients.slice(0, 25);
    const sendCount = cappedRecipients.length;

    const projectedSmsUsage = smsUsedThisMonth + sendCount;
    const overageSms = Math.max(projectedSmsUsage - smsLimit, 0);
    const estimatedOverageCost = overageSms * smsOverageRate;

    if (smsUsedThisMonth >= smsLimit && cleanPlan !== "pro") {
      return NextResponse.json(
        {
          error: "Monthly SMS limit reached",
          message:
            "This client has reached their included monthly SMS limit. Upgrade or approve overage billing before sending more campaigns.",
          smsUsedThisMonth,
          smsLimit,
        },
        { status: 402 }
      );
    }

    const smsBody =
      campaign.sms_body ||
      campaign.generated_sms ||
      campaign.promotion_title ||
      campaign.campaign_name ||
      "A new restaurant offer is available now.";

    const results = [];

    for (const customer of cappedRecipients) {
      const messageBody = `Hi ${
        customer.first_name || customer.full_name || "there"
      }, ${smsBody}\n\nReply STOP to opt out.`;

      const result = await twilioClient.messages.create({
        body: messageBody.slice(0, 1500),
        from: process.env.TWILIO_PHONE_NUMBER,
        to: customer.phone,
      });

      results.push(result);
    }

    const includedSmsUsed = Math.min(
      sendCount,
      Math.max(smsLimit - smsUsedThisMonth, 0)
    );

    const overageQuantity = Math.max(sendCount - includedSmsUsed, 0);

    const { error: usageInsertError } = await supabaseAdmin
      .from("marketing_usage")
      .insert([
        {
          user_id: userId,
          usage_type: "sms",
          quantity: sendCount,
          campaign_id: campaignId,
          campaign_name:
            campaign.campaign_name || campaign.name || campaign.promotion_title,
          billing_month: billingMonth,
          unit_cost: smsOverageRate,
          estimated_cost: overageQuantity * smsOverageRate,
        },
      ]);

    if (usageInsertError) {
      console.error("SMS marketing usage save failed:", usageInsertError);
    }

    await supabaseAdmin
      .from("marketing_campaigns")
      .update({
        active: true,
        published_to_website: true,
      })
      .eq("id", campaignId)
      .eq("user_id", userId);

    return NextResponse.json({
      success: true,
      sent: results.length,
      message: `SMS campaign launched to ${results.length} opted-in customers.`,
      usage: {
        billingMonth,
        smsUsedBefore: smsUsedThisMonth,
        smsSentNow: sendCount,
        smsLimit,
        projectedSmsUsage,
        overageSms,
        estimatedOverageCost,
      },
    });
  } catch (error) {
    console.error("Launch SMS campaign error:", error);

    return NextResponse.json(
      { error: error?.message || "SMS launch failed" },
      { status: 500 }
    );
  }
}