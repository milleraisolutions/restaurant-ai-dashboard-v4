export const runtime = "nodejs";

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ STRIPE_SECRET_KEY is missing in .env.local");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

const PRICE_MAP = {
  starter: "price_1TE1uC4Cch36DkUP0eSZfhjM",
  growth_6: "price_1TE24u4Cch36DkUP1Pg2RmvB",
  growth_12: "price_1TE26O4Cch36DkUPVOxOgSTE",
  pro_6: "price_1TE28u4Cch36DkUPXVanABiW",
  pro_12: "price_1TE28T4Cch36DkUPy84YJHtm",
};

export async function POST(req) {
  try {
    console.log("✅ CHECKOUT API HIT");

    const body = await req.json();
    const { plan, userId } = body;

    console.log("PLAN:", plan);
    console.log("USER ID:", userId);

    if (!userId) {
      return Response.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!plan) {
      return Response.json({ error: "No plan selected" }, { status: 400 });
    }

    const priceId = PRICE_MAP[plan];

    if (!priceId) {
      return Response.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    let cleanPlan = "starter";
    let duration = "monthly";

    if (plan.includes("growth")) cleanPlan = "growth";
    if (plan.includes("pro")) cleanPlan = "pro";

    if (plan.includes("_6")) duration = "6_months";
    if (plan.includes("_12")) duration = "12_months";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],

      customer_creation: "always",
      client_reference_id: userId,

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,

      metadata: {
        plan: cleanPlan,
        selectedPlan: plan,
        duration,
        userId,
      },

      subscription_data: {
        metadata: {
          plan: cleanPlan,
          selectedPlan: plan,
          duration,
          userId,
        },
      },
    });

    console.log("✅ STRIPE SESSION CREATED:", session.url);

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("❌ STRIPE CHECKOUT ERROR:", err);

    return Response.json(
      { error: err.message || "Server crash" },
      { status: 500 }
    );
  }
}