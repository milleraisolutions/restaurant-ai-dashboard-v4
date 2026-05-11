import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      leadId,
      email,
      name,
      restaurant,
      plan,
      paymentLink,
    } = body;

    if (!email) {
      return Response.json(
        { error: "Lead email is required." },
        { status: 400 }
      );
    }

    const selectedPlan = plan || "custom";
    const clientName = name || "there";
    const restaurantName = restaurant || "your restaurant";

    const finalPaymentLink =
      paymentLink || "https://servenai.com/custom-plan";

    console.log("📤 SENDING OFFER:", {
      email,
      restaurantName,
      selectedPlan,
      finalPaymentLink,
    });

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
       from: "Serven Offers <offers@servenai.com>",
        to: [email],
        subject: `Your Serven plan for ${restaurantName}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
            <h2>Your Serven Plan</h2>

            <p>Hi ${clientName},</p>

            <p>
              Thanks for requesting a custom Serven plan for 
              <strong>${restaurantName}</strong>.
            </p>

            <p>
              Based on your request, we recommend starting with:
              <strong>${selectedPlan}</strong>.
            </p>

            <p>
              Serven helps restaurants uncover profit leaks, improve margins,
              track performance, and make smarter decisions with AI-powered insights.
            </p>

            <p>
              You can review the next step here:
            </p>

            <p>
              <a 
                href="${finalPaymentLink}" 
                style="display:inline-block;padding:12px 16px;border-radius:12px;background:#7c3aed;color:white;text-decoration:none;font-weight:bold;"
              >
                Review Your Serven Plan
              </a>
            </p>

            <p>
              If you have any questions, just reply to this email.
            </p>

            <p>
              — Serven Team
            </p>
          </div>
        `,
      }),
    });

    const emailText = await emailRes.text();

    console.log("📨 OFFER EMAIL STATUS:", emailRes.status);
    console.log("📨 OFFER EMAIL RESPONSE:", emailText);

    if (!emailRes.ok) {
      return Response.json(
        { error: "Offer email failed", details: emailText },
        { status: 500 }
      );
    }

    if (leadId) {
      await supabaseAdmin
        .from("custom_plan_requests")
        .update({ status: "proposal_sent" })
        .eq("id", leadId);
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("❌ SEND OFFER ERROR:", err);

    return Response.json(
      { error: "Failed to send offer." },
      { status: 500 }
    );
  }
}