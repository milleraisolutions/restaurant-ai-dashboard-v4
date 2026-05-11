import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables.");
}

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY.");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const resend = new Resend(resendApiKey);

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      userId,
      clientName,
      clientEmail,
      sourceName,
      fileName,
      rowCount,
      uploadId,
      monthRevenue,
      previousMonthRevenue,
      lastWeekRevenue,
      monthlyChangePercent,
      weeklyChangePercent,
      avgMargin,
      foodCost,
      ownerScore,
      clientScore,
      profitLeakCount,
      wasteLoss,
      laborCost,
      alertsTriggered,
      topIssue,
      
    } = body || {};
if (!userId) {
  return NextResponse.json(
    { error: "Missing userId" },
    { status: 400 }
  );
}
    if (!sourceName) {
      return NextResponse.json(
        { error: "Source name is required." },
        { status: 400 }
      );
    }

    const revenueNow = Number(monthRevenue ?? 0);
    const revenueBeforeMonth = Number(previousMonthRevenue ?? 0);
    const revenueBeforeWeek = Number(lastWeekRevenue ?? 0);

    const computedMonthlyChangePercent =
      revenueBeforeMonth > 0
        ? Number(
            (
              ((revenueNow - revenueBeforeMonth) / revenueBeforeMonth) *
              100
            ).toFixed(1)
          )
        : 0;

    const computedWeeklyChangePercent =
      revenueBeforeWeek > 0
        ? Number(
            (
              ((revenueNow - revenueBeforeWeek) / revenueBeforeWeek) *
              100
            ).toFixed(1)
          )
        : 0;

    const finalMonthlyChangePercent =
      monthlyChangePercent != null
        ? Number(monthlyChangePercent)
        : computedMonthlyChangePercent;

    const finalWeeklyChangePercent =
      weeklyChangePercent != null
        ? Number(weeklyChangePercent)
        : computedWeeklyChangePercent;

const { error: insertError } = await supabase
  .from("client_data_uploads")
  .insert([
    {
      user_id: userId || null,
      client_name: clientName || null,
      client_email: clientEmail || null,
      source_name: sourceName,
      file_name: fileName || null,
      row_count: Number(rowCount ?? 0),

      upload_id: uploadId || null,

      month_revenue: revenueNow,
      previous_month_revenue: revenueBeforeMonth,
      last_week_revenue: revenueBeforeWeek,
      monthly_change_percent: finalMonthlyChangePercent,
      weekly_change_percent: finalWeeklyChangePercent,

      avg_margin: Number(avgMargin ?? 0),
      food_cost: Number(foodCost ?? 0),
      owner_score: Number(ownerScore ?? 0),
      client_score: Number(clientScore ?? 0),

      profit_leak_count: Number(profitLeakCount ?? 0),
      waste_loss: Number(wasteLoss ?? 0),
      labor_cost: Number(laborCost ?? 0),
      alerts_triggered: Number(alertsTriggered ?? 0),
      top_issue: topIssue || null,
    },
  ]);
    if (insertError) {
      console.error("Supabase insert failed:", insertError);
      return NextResponse.json(
        { error: "Failed to save upload summary." },
        { status: 500 }
      );
    }

    try {
      const ownerEmail = process.env.OWNER_EMAIL;
      const resendFromEmail = process.env.RESEND_FROM_EMAIL;

      if (ownerEmail && resendFromEmail) {
        await resend.emails.send({
          from: resendFromEmail,
          to: ownerEmail,
          subject: `New client data upload: ${clientName || "Unknown Client"} (${sourceName})`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>New Client Data Upload</h2>

              <p><strong>Client:</strong> ${clientName || "Unknown Client"}</p>
              <p><strong>Source:</strong> ${sourceName}</p>
              <p><strong>File:</strong> ${fileName || "N/A"}</p>
              <p><strong>Rows Imported:</strong> ${Number(rowCount ?? 0).toLocaleString()}</p>

              <hr />

              <p><strong>This Month Revenue:</strong> $${revenueNow.toLocaleString()}</p>
              <p><strong>Previous Month Revenue:</strong> $${revenueBeforeMonth.toLocaleString()}</p>
              <p><strong>Last Week Revenue:</strong> $${revenueBeforeWeek.toLocaleString()}</p>

              <p><strong>Monthly Change:</strong> ${finalMonthlyChangePercent.toFixed(1)}%</p>
              <p><strong>Weekly Change:</strong> ${finalWeeklyChangePercent.toFixed(1)}%</p>

              <p><strong>Average Margin:</strong> ${Number(avgMargin ?? 0).toFixed(1)}%</p>
              <p><strong>Food Cost:</strong> ${Number(foodCost ?? 0).toFixed(1)}%</p>
              <p><strong>Owner Score:</strong> ${Number(ownerScore ?? 0).toFixed(1)}</p>
              <p><strong>Client Score:</strong> ${Number(clientScore ?? 0).toFixed(1)}</p>

              <hr />

              <p><strong>Profit Leak Count:</strong> ${Number(profitLeakCount ?? 0)}</p>
              <p><strong>Waste Loss:</strong> $${Number(wasteLoss ?? 0).toLocaleString()}</p>
              <p><strong>Labor Cost:</strong> ${Number(laborCost ?? 0).toFixed(1)}%</p>
              <p><strong>Alerts Triggered:</strong> ${Number(alertsTriggered ?? 0)}</p>
              <p><strong>Top Issue:</strong> ${topIssue || "N/A"}</p>
            </div>
          `,
        });
      } else {
        console.warn(
          "Skipping email send because OWNER_EMAIL or RESEND_FROM_EMAIL is missing."
        );
      }
    } catch (emailError) {
      console.error("Email send failed:", emailError);
    }

    return NextResponse.json({
      success: true,
      monthlyChangePercent: finalMonthlyChangePercent,
      weeklyChangePercent: finalWeeklyChangePercent,
    });
  } catch (error) {
    console.error("Upload summary API failed:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}