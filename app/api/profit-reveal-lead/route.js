import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();

    const { data, error } = await supabaseAdmin
      .from("profit_reveal_leads")
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    await resend.emails.send({
      from: process.env.ALERT_FROM_EMAIL,
      to: process.env.OWNER_ALERT_EMAIL,
      subject: `New Profit Reveal Lead: ${body.restaurant_name || "Restaurant"}`,
      html: `
        <h2>New Profit Reveal Lead</h2>

        <p><b>Name:</b> ${body.name || "N/A"}</p>
        <p><b>Restaurant:</b> ${body.restaurant_name || "N/A"}</p>
        <p><b>Email:</b> ${body.email || "N/A"}</p>
        <p><b>Phone:</b> ${body.phone || "N/A"}</p>

        <hr />

        <p><b>Monthly Revenue:</b> $${Number(body.monthly_revenue || 0).toLocaleString()}</p>
        <p><b>Food Spend:</b> $${Number(body.monthly_food_spend || 0).toLocaleString()}</p>
        <p><b>Labor Spend:</b> $${Number(body.monthly_labor_spend || 0).toLocaleString()}</p>
        <p><b>Average Order Value:</b> $${Number(body.average_order_value || 0).toLocaleString()}</p>

        <hr />

        <p><b>Food Cost %:</b> ${Number(body.food_cost_percent || 0).toFixed(1)}%</p>
        <p><b>Labor Cost %:</b> ${Number(body.labor_cost_percent || 0).toFixed(1)}%</p>

        <h3>Estimated Opportunity</h3>
        <p><b>Monthly:</b> $${Number(body.low_opportunity || 0).toLocaleString()} - $${Number(body.high_opportunity || 0).toLocaleString()}</p>
        <p><b>Yearly:</b> $${Number(body.yearly_low || 0).toLocaleString()} - $${Number(body.yearly_high || 0).toLocaleString()}</p>
      `,
    });

    return NextResponse.json({ success: true, lead: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Lead save failed" },
      { status: 500 }
    );
  }
}