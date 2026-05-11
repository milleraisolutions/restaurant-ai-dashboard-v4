import Stripe from "stripe";

export const runtime = "nodejs";

// ✅ make sure env is loaded
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(req) {
  try {
    console.log("✅ CHECKOUT API HIT");

    const { plan } = await req.json();
    console.log("PLAN:", plan);

    let priceId;

    if (plan === "starter") priceId = "price_1TBAgi4Cch36DkUPw01JvbQ6";
    if (plan === "growth") priceId = "price_1TBAhA4Cch36DkUPBaPVkLN2";
    if (plan === "pro") priceId = "price_1TBAhX4Cch36DkUPaH71mBKS";

    if (!priceId) {
      return Response.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
     success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    });

    console.log("✅ SESSION URL:", session.url);

    return Response.json({ url: session.url });

  } catch (err) {
    console.error("❌ CHECKOUT ERROR:", err);

    return Response.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}