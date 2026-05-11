import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature error:", err.message);
    return new Response("Webhook Error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object;

      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items"],
      });

      const metadata = fullSession.metadata || {};

      const metadataUserId = metadata.userId || metadata.user_id || null;
      const metadataLeadId = metadata.leadId || metadata.lead_id || null;
      const metadataPlan = metadata.plan || null;

      const customerEmail =
        fullSession.customer_details?.email ||
        fullSession.customer_email ||
        null;

      const priceId = fullSession.line_items?.data?.[0]?.price?.id;

      let plan = metadataPlan || "starter";

      if (!metadataPlan) {
        if (priceId === process.env.STRIPE_GROWTH_PRICE_ID) {
          plan = "growth";
        }

        if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          plan = "pro";
        }
      }

      console.log("✅ Stripe checkout completed:", {
        customerEmail,
        metadataUserId,
        metadataLeadId,
        plan,
        priceId,
      });

      if (metadataUserId) {
        const { error: userUpdateError } = await supabaseAdmin
          .from("users")
          .update({ plan })
          .eq("id", metadataUserId);

        if (userUpdateError) {
          console.error("❌ User update by ID failed:", userUpdateError.message);
        } else {
          console.log("✅ User upgraded by ID successfully");
        }
      } else if (customerEmail) {
        const { error: userUpdateError } = await supabaseAdmin
          .from("users")
          .update({ plan })
          .eq("email", customerEmail);

        if (userUpdateError) {
          console.error(
            "❌ User update by email failed:",
            userUpdateError.message
          );
        } else {
          console.log("✅ User upgraded by email successfully");
        }
      } else {
        console.warn("⚠️ No userId or email found to unlock dashboard");
      }

      if (metadataLeadId) {
        const { error: leadUpdateError } = await supabaseAdmin
          .from("custom_plan_requests")
          .update({
            status: "closed",
            payment_status: "paid",
          })
          .eq("id", metadataLeadId);

        if (leadUpdateError) {
          console.error("❌ Lead update failed:", leadUpdateError.message);
        } else {
          console.log("✅ Lead marked closed + paid");
        }
      }
    } catch (err) {
      console.error("❌ Webhook processing error:", err.message);
    }
  }

  return NextResponse.json({ received: true });
}