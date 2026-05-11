import { Resend } from "resend";
import Stripe from "stripe";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);
const AGREEMENT_URL =
  "https://docs.google.com/document/d/1Y5QzTibDUcQ1ju4mry2vyOsr0rX4Tv19cQf2A9ztctI/edit?usp=sharing";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(req) {
  try {
    const body = await req.json();

    const {
  to,
  restaurantName = "there",
  type = "intro",
  plan = "starter",
  monthlyPrice,
  userId,
  leadId,
  agreementUrl,
} = body;

    if (!to) {
      return Response.json(
        { error: "Missing recipient email" },
        { status: 400 }
      );
    }

    let checkoutUrl = null;

    // =========================
    // CREATE CUSTOM STRIPE CHECKOUT
    // =========================
    if (type === "activation" || type === "upgrade") {
      if (!monthlyPrice || Number(monthlyPrice) <= 0) {
        return Response.json(
          { error: "Missing valid monthlyPrice for checkout email" },
          { status: 400 }
        );
      }

      if (!userId) {
        return Response.json(
          { error: "Missing userId for checkout email" },
          { status: 400 }
        );
      }

      const amountInCents = Math.round(Number(monthlyPrice) * 100);

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: to,
        client_reference_id: userId,

        line_items: [
          {
            price_data: {
              currency: "usd",
              recurring: {
                interval: "month",
              },
              product_data: {
                name: `SerVen ${plan.toUpperCase()} Plan`,
                description: `Custom monthly SerVen subscription for ${restaurantName}`,
              },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],

        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?upgraded=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,

        metadata: {
          plan,
          userId,
          leadId: leadId || "",
          monthlyPrice: String(monthlyPrice),
          pricingType: "custom",
        },

        subscription_data: {
          metadata: {
            plan,
            userId,
            leadId: leadId || "",
            monthlyPrice: String(monthlyPrice),
            pricingType: "custom",
          },
        },
      });

      checkoutUrl = session.url;
    }

    // =========================
    // DEFAULT INTRO EMAIL
    // =========================
    let subject = "Welcome to SerVen";

    let html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
        <h2>Welcome to SerVen</h2>

        <p>Hi ${restaurantName},</p>

        <p>
          Thanks for your interest in SerVen.
        </p>

        <p>
          We help restaurants improve profitability using AI-powered sales,
          labor, menu, inventory, and marketing intelligence.
        </p>

        <p>
          Our team is currently reviewing your restaurant profile and custom
          plan requirements.
        </p>

        <p>
          We’ll follow up shortly with onboarding details and next steps.
        </p>

        <p>— SerVen Team</p>
      </div>
    `;
/* ================================ */
/* AGREEMENT EMAIL */
/* ================================ */
if (type === "agreement") {
  subject = "Your Serven agreement is ready";

  html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:640px;margin:0 auto;padding:24px;">

      <h2>Your Serven agreement is ready</h2>

      <p>Hi ${restaurantName},</p>

      <p>
        Your custom Serven service agreement is ready for review.
      </p>

      <p>
        Please review and sign the agreement before dashboard activation and payment setup.
      </p>

      <div style="margin:28px 0;">
        <a
          href="${agreementUrl || AGREEMENT_URL}"
          style="
            display:inline-block;
            background:#f59e0b;
            color:white;
            text-decoration:none;
            padding:14px 22px;
            border-radius:12px;
            font-weight:800;
            font-size:15px;
          "
        >
          Review Agreement
        </a>
      </div>

      <p style="font-size:13px;color:#6b7280;">
        Once signed, Serven onboarding and payment activation will continue.
      </p>

      <p>— Serven AI</p>
    </div>
  `;
}
    // =========================
    // ACTIVATION EMAIL
    // =========================
    if (type === "activation") {
      subject = "Complete your SerVen dashboard activation";

      html = `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:640px;margin:0 auto;padding:24px;">
          
          <h2 style="margin-bottom:12px;">
            Your SerVen dashboard is ready
          </h2>

          <p>Hi ${restaurantName},</p>

          <p>
            Your custom <strong>${plan}</strong> plan has been prepared.
          </p>

          <p>
            Your monthly subscription price is
            <strong>$${Number(monthlyPrice).toLocaleString()}/month</strong>.
          </p>

          <p>
            Complete your secure checkout below to activate your dashboard
            access.
          </p>

          <div style="margin:28px 0;">
            <a
              href="${checkoutUrl}"
              style="
                display:inline-block;
                background:#6D3DF5;
                color:white;
                text-decoration:none;
                padding:14px 22px;
                border-radius:12px;
                font-weight:800;
                font-size:15px;
              "
            >
              Complete Payment
            </a>
          </div>

          <p style="font-size:13px;color:#6b7280;">
            After payment, your SerVen dashboard access will activate automatically.
          </p>

          <p style="font-size:12px;color:#6b7280;margin-top:22px;">
            By subscribing, you agree to SerVen's
            <a href="https://servenai.com/terms" style="color:#6D3DF5;">
              Terms of Service
            </a>
            and
            <a href="https://servenai.com/privacy" style="color:#6D3DF5;">
              Privacy Policy
            </a>.
          </p>

          <p>— SerVen Team</p>
        </div>
      `;
    }

    // =========================
    // UPGRADE EMAIL
    // =========================
    if (type === "upgrade") {
      subject = "Complete your SerVen plan upgrade";

      html = `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:640px;margin:0 auto;padding:24px;">
          
          <h2 style="margin-bottom:12px;">
            Your SerVen upgrade is ready
          </h2>

          <p>Hi ${restaurantName},</p>

          <p>
            Your custom upgrade to
            <strong>${plan}</strong>
            is ready.
          </p>

          <p>
            Your updated monthly subscription price is
            <strong>$${Number(monthlyPrice).toLocaleString()}/month</strong>.
          </p>

          <div style="margin:28px 0;">
            <a
              href="${checkoutUrl}"
              style="
                display:inline-block;
                background:#6D3DF5;
                color:white;
                text-decoration:none;
                padding:14px 22px;
                border-radius:12px;
                font-weight:800;
                font-size:15px;
              "
            >
              Complete Upgrade
            </a>
          </div>

          <p style="font-size:12px;color:#6b7280;margin-top:22px;">
            By subscribing, you agree to SerVen's
            <a href="https://servenai.com/terms" style="color:#6D3DF5;">
              Terms of Service
            </a>
            and
            <a href="https://servenai.com/privacy" style="color:#6D3DF5;">
              Privacy Policy
            </a>.
          </p>

          <p>— SerVen Team</p>
        </div>
      `;
    }

    // =========================
    // SEND EMAIL
    // =========================
    const { data, error } = await resend.emails.send({
      from: "SerVen <hello@servenai.com>",
      to: [to],
      subject,
      html,
      replyTo: "hello@servenai.com",
    });

    if (error) {
      console.error("RESEND ERROR:", error);

      return Response.json({ error }, { status: 500 });
    }

    return Response.json({
      success: true,
      data,
      checkoutUrl,
    });
  } catch (error) {
    console.error("SEND CLIENT EMAIL ERROR:", error);

    return Response.json(
      { error: error?.message || "Email failed" },
      { status: 500 }
    );
  }
}