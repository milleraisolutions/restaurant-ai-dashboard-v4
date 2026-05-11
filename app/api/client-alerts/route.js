import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
        alert_rule_id: rule.id || null,
        rule_name: rule.rule_name,
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
    const { user, client, metrics, rules } = body || {};

    console.log("CLIENT ALERTS BODY:", body);
    console.log("USER:", user);
    console.log("CLIENT:", client);
    console.log("METRICS:", metrics);
    console.log("RULES:", rules);

    if (!user?.id) {
      return NextResponse.json(
        { error: "Missing user.id" },
        { status: 400 }
      );
    }

    if (!client?.id) {
      return NextResponse.json(
        { error: "Missing client.id" },
        { status: 400 }
      );
    }

    const triggeredAlerts = evaluateAlertRules(rules || [], metrics || {});
    console.log("TRIGGERED ALERTS:", triggeredAlerts);

    const { data: existingAlerts, error: existingAlertsError } = await supabase
      .from("client_alerts")
      .select("*")
      .eq("client_id", client.id)
      .eq("status", "open");

    console.log("EXISTING ALERTS:", existingAlerts);
    console.log("EXISTING ALERTS ERROR:", existingAlertsError);

    if (existingAlertsError) {
      return NextResponse.json(
        { error: existingAlertsError.message },
        { status: 500 }
      );
    }

    const alertsToInsert = [];

    for (const alert of triggeredAlerts) {
      const existingAlert = (existingAlerts || []).find(
        (a) =>
          a.metric_key === alert.metric_key &&
          a.status === "open"
      );

      if (!existingAlert) {
        alertsToInsert.push({
          user_id: user.id,
          client_id: client.id,
          client_name: client.name || "Unnamed Client",
          alert_rule_id: alert.alert_rule_id,
          rule_name: alert.rule_name,
          metric_key: alert.metric_key,
          metric_value: alert.metric_value,
          operator: alert.operator,
          threshold: alert.threshold,
          severity: alert.severity,
          status: "open",
          email_sent: false,
        });
      }
    }

    console.log("ALERTS TO INSERT:", alertsToInsert);

    let insertedAlerts = [];
    let insertError = null;

    if (alertsToInsert.length > 0) {
      const result = await supabase
        .from("client_alerts")
        .insert(alertsToInsert)
        .select();

      insertedAlerts = result.data || [];
      insertError = result.error || null;

      console.log("INSERTED ALERTS:", insertedAlerts);
      console.log("INSERT ERROR:", insertError);

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
    }

    // ✅ TEMP DEBUG FALLBACK:
    // If no rules triggered and no alerts were inserted,
    // create one test alert so you can confirm client_alerts works.
    let debugInsertedAlert = null;

    if (triggeredAlerts.length === 0 && alertsToInsert.length === 0) {
      console.log("NO ALERTS TRIGGERED - INSERTING DEBUG TEST ALERT");

      const debugResult = await supabase
        .from("client_alerts")
        .insert([
          {
            user_id: user.id,
            client_id: client.id,
            client_name: client.name || "Test Client",
            alert_rule_id: null,
            rule_name: "High Food Cost",
            metric_key: "food_cost",
            metric_value: 42,
            operator: ">",
            threshold: 30,
            severity: "warning",
            status: "open",
            email_sent: false,
          },
        ])
        .select();

      debugInsertedAlert = debugResult.data || null;

      console.log("DEBUG INSERTED ALERT:", debugResult.data);
      console.log("DEBUG INSERT ERROR:", debugResult.error);

      if (debugResult.error) {
        return NextResponse.json(
          { error: debugResult.error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      triggeredCount: triggeredAlerts.length,
      insertedCount: insertedAlerts.length,
      triggeredAlerts,
      insertedAlerts,
      debugInsertedAlert,
    });
  } catch (err) {
    console.error("CLIENT ALERT ROUTE ERROR:", err);

    return NextResponse.json(
      { error: err.message || "Failed to process client alerts" },
      { status: 500 }
    );
  }
}