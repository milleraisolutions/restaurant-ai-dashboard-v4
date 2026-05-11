import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function compareMetric(metricValue, operator, threshold) {
  const value = Number(metricValue || 0);
  const target = Number(threshold || 0);

  switch (operator) {
    case ">":
      return value > target;
    case ">=":
      return value >= target;
    case "<":
      return value < target;
    case "<=":
      return value <= target;
    case "=":
    case "==":
      return value === target;
    default:
      return false;
  }
}

function evaluateAlertRules(rules = [], metrics = {}) {
  const triggered = [];

  for (const rule of rules) {
    if (!rule?.is_active) continue;

    const metricValue = Number(metrics?.[rule.metric_key] ?? 0);
    const hit = compareMetric(metricValue, rule.operator, rule.threshold);

    if (hit) {
      triggered.push({
        rule_name: rule.rule_name || "Alert Triggered",
        metric_key: rule.metric_key,
        metric_value: metricValue,
        operator: rule.operator,
        threshold: Number(rule.threshold || 0),
        severity: rule.severity || "warning",
      });
    }
  }

  return triggered;
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("CHECK ALERTS BODY:", body);

    const {
      userId,
      clientId,
      clientName,
      metrics = {},
      ownerEmail,
    } = body || {};

    if (!userId || !clientName) {
      console.error("Missing required values:", { userId, clientName });
      return NextResponse.json(
        { error: "Missing userId or clientName" },
        { status: 400 }
      );
    }

    const safeClientId = clientId && clientId !== userId ? clientId : null;

    const { data: rules, error: rulesError } = await supabase
      .from("alert_rules")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true);

    console.log("ALERT RULES:", rules);

    if (rulesError) {
      console.error("rulesError:", rulesError);
      return NextResponse.json(
        { error: "Failed to load rules", details: rulesError.message },
        { status: 500 }
      );
    }

    const triggeredAlerts = evaluateAlertRules(rules || [], metrics);
    console.log("TRIGGERED ALERTS:", triggeredAlerts);

    if (!triggeredAlerts.length) {
  return NextResponse.json({
    success: true,
    rulesLoaded: rules || [],
    triggered: [],
    inserted: [],
    message: "No alerts triggered",
  });
}

    let existingAlertsQuery = supabase
      .from("client_alerts")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "open");

    if (safeClientId) {
      existingAlertsQuery = existingAlertsQuery.eq("client_id", safeClientId);
    } else {
      existingAlertsQuery = existingAlertsQuery.is("client_id", null);
    }

    const { data: existingAlerts, error: existingAlertsError } =
      await existingAlertsQuery;

    console.log("EXISTING ALERTS:", existingAlerts);

    if (existingAlertsError) {
      console.error("existingAlertsError:", existingAlertsError);
      return NextResponse.json(
        {
          error: "Failed to load existing alerts",
          details: existingAlertsError.message,
        },
        { status: 500 }
      );
    }

    const alertRows = [];

    for (const alert of triggeredAlerts) {
      const duplicateOpenAlert = (existingAlerts || []).find(
        (existing) =>
          existing.metric_key === alert.metric_key &&
          existing.rule_name === alert.rule_name &&
          existing.status === "open"
      );

      if (!duplicateOpenAlert) {
        alertRows.push({
          user_id: userId,
          client_id: safeClientId,
          client_name: clientName,
          metric_key: alert.metric_key,
          metric_value: alert.metric_value,
          operator: alert.operator,
          threshold: alert.threshold,
          severity: alert.severity,
          rule_name: alert.rule_name,
          status: "open",
          email_sent: false,
        });
      }
    }

    console.log("ALERT ROWS TO INSERT:", alertRows);

    if (!alertRows.length) {
  return NextResponse.json({
    success: true,
    rulesLoaded: rules || [],
    triggered: triggeredAlerts,
    inserted: [],
    message: "Alerts already exist as open alerts",
  });
}

    const { data: insertedAlerts, error: insertError } = await supabase
      .from("client_alerts")
      .insert(alertRows)
      .select("*");

    if (insertError) {
      console.error("insertError:", insertError);
      return NextResponse.json(
        { error: "Failed to save alerts", details: insertError.message },
        { status: 500 }
      );
    }

    console.log("INSERTED ALERTS:", insertedAlerts);

  return NextResponse.json({
  success: true,
  rulesLoaded: rules || [],
  triggered: triggeredAlerts,
  inserted: insertedAlerts || [],
});
  } catch (error) {
    console.error("check-client-alerts error:", error);
    return NextResponse.json(
      {
        error: "Failed to check alerts",
        details: error?.message || "Unknown server error",
      },
      { status: 500 }
    );
  }
}