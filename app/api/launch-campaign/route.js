import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const getBillingMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const PLAN_LIMITS = {
  starter: {
    monthly_email_limit: 5000,
    monthly_sms_limit: 500,
    email_overage_rate: 0.001,
    sms_overage_rate: 0.02,
  },
  growth: {
    monthly_email_limit: 25000,
    monthly_sms_limit: 2500,
    email_overage_rate: 0.001,
    sms_overage_rate: 0.02,
  },
  pro: {
    monthly_email_limit: 100000,
    monthly_sms_limit: 10000,
    email_overage_rate: 0.001,
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

    const billingMonth = getBillingMonth();

    // =========================
    // LOAD USER / PLAN LIMITS
    // =========================
    const { data: userProfile, error: userError } = await supabaseAdmin
      .from("users")
      .select(
        "id, plan, monthly_email_limit, monthly_sms_limit, email_overage_rate, sms_overage_rate"
      )
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

    const emailLimit =
      Number(userProfile.monthly_email_limit || 0) ||
      fallbackLimits.monthly_email_limit;

    const emailOverageRate =
      Number(userProfile.email_overage_rate || 0) ||
      fallbackLimits.email_overage_rate;

    // =========================
    // LOAD CURRENT EMAIL USAGE
    // =========================
    const { data: usageRows, error: usageError } = await supabaseAdmin
      .from("marketing_usage")
      .select("quantity")
      .eq("user_id", userId)
      .eq("usage_type", "email")
      .eq("billing_month", billingMonth);

    if (usageError) {
      return NextResponse.json(
        { error: usageError.message || "Could not load marketing usage" },
        { status: 500 }
      );
    }

    const emailUsedThisMonth = (usageRows || []).reduce(
      (sum, row) => sum + Number(row.quantity || 0),
      0
    );

    // =========================
    // LOAD CAMPAIGN
    // =========================
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

    // =========================
    // LOAD OPTED-IN CUSTOMERS
    // NOTE: change "customers" to "restaurant_customers" if that is your active table
    // =========================
    const { data: customers, error: customerError } = await supabaseAdmin
      .from("restaurant_customers")
      .select("id, first_name, full_name, email, email_opt_in")
.eq("email_opt_in", true)
      .eq("email_opt_in", true)
      .not("email", "is", null);

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
        message: "Campaign marked live, but no opted-in email customers found.",
      });
    }

    // Current safety cap while testing
    const cappedRecipients = recipients.slice(0, 25);
    const sendCount = cappedRecipients.length;

    const projectedEmailUsage = emailUsedThisMonth + sendCount;
    const overageEmails = Math.max(projectedEmailUsage - emailLimit, 0);
    const estimatedOverageCost = overageEmails * emailOverageRate;

    // =========================
    // BLOCK IF WAY OVER LIMIT
    // =========================
    if (emailUsedThisMonth >= emailLimit && cleanPlan !== "pro") {
      return NextResponse.json(
        {
          error: "Monthly email limit reached",
          message:
            "This client has reached their included monthly email limit. Upgrade or approve overage billing before sending more campaigns.",
          emailUsedThisMonth,
          emailLimit,
        },
        { status: 402 }
      );
    }

    const subject =
      campaign.email_title ||
      campaign.sms_title ||
      campaign.campaign_name ||
      "Special Offer";

    const body =
      campaign.email_body ||
      campaign.generated_email ||
      campaign.promotion_title ||
      "A new offer is available now.";

    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "Serven <alerts@servenai.com>";

    const results = [];

    // =========================
    // SEND EMAILS
    // =========================
    for (const customer of cappedRecipients) {
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>${subject}</h2>
         <p>Hi ${customer.first_name || customer.full_name || "there"},</p>
          <p>${body}</p>
          <p style="color:#64748b;font-size:12px;">
            You are receiving this because you opted in to restaurant updates.
          </p>
        </div>
      `;

      const result = await resend.emails.send({
        from: fromEmail,
        to: customer.email,
        subject,
        html,
      });

      results.push(result);
    }

    // =========================
    // SAVE USAGE
    // =========================
    const includedEmailsUsed = Math.min(sendCount, Math.max(emailLimit - emailUsedThisMonth, 0));
    const overageQuantity = Math.max(sendCount - includedEmailsUsed, 0);

    const { error: usageInsertError } = await supabaseAdmin
      .from("marketing_usage")
      .insert([
        {
          user_id: userId,
          usage_type: "email",
          quantity: sendCount,
          campaign_id: campaignId,
          campaign_name:
            campaign.campaign_name || campaign.name || campaign.promotion_title,
          billing_month: billingMonth,
          unit_cost: emailOverageRate,
          estimated_cost: overageQuantity * emailOverageRate,
        },
      ]);

    if (usageInsertError) {
      console.error("Marketing usage save failed:", usageInsertError);
    }

    // =========================
    // MARK CAMPAIGN LIVE
    // =========================
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
      message: `Campaign launched to ${results.length} opted-in customers.`,
      usage: {
        billingMonth,
        emailUsedBefore: emailUsedThisMonth,
        emailSentNow: sendCount,
        emailLimit,
        projectedEmailUsage,
        overageEmails,
        estimatedOverageCost,
      },
    });
  } catch (error) {
    console.error("Launch campaign error:", error);

    return NextResponse.json(
      { error: error?.message || "Launch failed" },
      { status: 500 }
    );
  }
}