"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function ProfitRevealPage() {
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [monthlyFoodSpend, setMonthlyFoodSpend] = useState("");
  const [monthlyLaborSpend, setMonthlyLaborSpend] = useState("");
  const [averageOrderValue, setAverageOrderValue] = useState("");
  const [hasCalculated, setHasCalculated] = useState(false);
const [leadName, setLeadName] = useState("");
const [leadEmail, setLeadEmail] = useState("");
const [leadPhone, setLeadPhone] = useState("");
const [restaurantName, setRestaurantName] = useState("");
const [savingLead, setSavingLead] = useState(false);
const [leadSaved, setLeadSaved] = useState(false);
const [leadError, setLeadError] = useState("");
const [formError, setFormError] = useState("");
  const numbers = useMemo(() => {
    const revenue = Number(monthlyRevenue || 0);
    const foodSpend = Number(monthlyFoodSpend || 0);
    const laborSpend = Number(monthlyLaborSpend || 0);
    const aov = Number(averageOrderValue || 0);

    const foodCostPercent = revenue > 0 ? (foodSpend / revenue) * 100 : 0;
    const laborCostPercent = revenue > 0 ? (laborSpend / revenue) * 100 : 0;

    const foodOpportunity =
      foodCostPercent > 35
        ? revenue * 0.035
        : foodCostPercent > 30
        ? revenue * 0.022
        : revenue * 0.012;

    const laborOpportunity =
      laborCostPercent > 32
        ? revenue * 0.028
        : laborCostPercent > 27
        ? revenue * 0.018
        : revenue * 0.01;

    const pricingOpportunity = revenue * 0.018;
    const wasteOpportunity = revenue * 0.015;

    const lowOpportunity =
      foodOpportunity + laborOpportunity + pricingOpportunity + wasteOpportunity;

    const highOpportunity = lowOpportunity * 1.65;

    const insights = [];

    if (foodCostPercent > 35) {
      insights.push({
        title: "Food cost appears high",
        severity: "Critical",
        text: `Your estimated food cost is ${foodCostPercent.toFixed(
          1
        )}%. Serven would look for supplier price increases, waste, low-margin items, and menu pricing issues.`,
      });
    } else if (foodCostPercent > 30) {
      insights.push({
        title: "Food cost has room to improve",
        severity: "Opportunity",
        text: `Your estimated food cost is ${foodCostPercent.toFixed(
          1
        )}%. Serven may be able to recover profit by improving pricing, portions, and ingredient cost tracking.`,
      });
    } else {
      insights.push({
        title: "Food cost looks manageable",
        severity: "Healthy",
        text: `Your estimated food cost is ${foodCostPercent.toFixed(
          1
        )}%. Serven would still monitor supplier spikes and item-level margins automatically.`,
      });
    }

    if (laborCostPercent > 32) {
      insights.push({
        title: "Labor efficiency risk detected",
        severity: "Critical",
        text: `Your estimated labor cost is ${laborCostPercent.toFixed(
          1
        )}%. Serven would flag slow shifts, overstaffed periods, and scheduling inefficiencies.`,
      });
    } else if (laborCostPercent > 27) {
      insights.push({
        title: "Labor optimization opportunity",
        severity: "Opportunity",
        text: `Your estimated labor cost is ${laborCostPercent.toFixed(
          1
        )}%. Serven may help identify where labor can be better aligned with sales patterns.`,
      });
    } else {
      insights.push({
        title: "Labor cost looks controlled",
        severity: "Healthy",
        text: `Your estimated labor cost is ${laborCostPercent.toFixed(
          1
        )}%. Serven would continue watching for slow-day inefficiencies.`,
      });
    }

    insights.push({
      title: "Menu pricing opportunity",
      severity: "Opportunity",
      text:
        aov > 0
          ? `With an average order value of $${aov.toFixed(
              2
            )}, small menu price improvements could create meaningful monthly profit without increasing traffic.`
          : "Serven can identify items that may be underpriced or hurting margins.",
    });

    return {
      revenue,
      foodCostPercent,
      laborCostPercent,
      foodOpportunity,
      laborOpportunity,
      pricingOpportunity,
      wasteOpportunity,
      lowOpportunity,
      highOpportunity,
      yearlyLow: lowOpportunity * 12,
      yearlyHigh: highOpportunity * 12,
      insights,
    };
  }, [monthlyRevenue, monthlyFoodSpend, monthlyLaborSpend, averageOrderValue]);

  const formatMoney = (value) =>
    `$${Math.round(Number(value || 0)).toLocaleString()}`;

const saveProfitRevealLead = async () => {
  setLeadError("");
  setLeadSaved(false);

  if (!leadEmail) {
  setLeadError("Please enter your email so we can send your profit breakdown.");
  return;
}

if (!leadEmail.includes("@") || !leadEmail.includes(".")) {
  setLeadError("Please enter a valid email address.");
  return;
}

  try {
    setSavingLead(true);

    const res = await fetch("/api/profit-reveal-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: leadName,
        email: leadEmail,
        phone: leadPhone,
        restaurant_name: restaurantName,
        monthly_revenue: numbers.revenue,
        monthly_food_spend: Number(monthlyFoodSpend || 0),
        monthly_labor_spend: Number(monthlyLaborSpend || 0),
        average_order_value: Number(averageOrderValue || 0),
        food_cost_percent: numbers.foodCostPercent,
        labor_cost_percent: numbers.laborCostPercent,
        low_opportunity: numbers.lowOpportunity,
        high_opportunity: numbers.highOpportunity,
        yearly_low: numbers.yearlyLow,
        yearly_high: numbers.yearlyHigh,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result?.error || "Could not save your report.");
    }

    setLeadSaved(true);
  } catch (err) {
    setLeadError(err.message || "Could not save your report right now.");
  } finally {
    setSavingLead(false);
  }
};





  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(109,61,245,0.28), transparent 34%), radial-gradient(circle at top right, rgba(212,175,55,0.18), transparent 30%), #020617",
        color: "white",
        padding: "70px 20px",
      }}
    >
      <section style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: "850px", margin: "0 auto 42px" }}>
          <div style={badgeStyle}>Serven Profit Reveal</div>

          <h1 style={heroTitle}>
            See how much profit your restaurant is losing every month.
          </h1>

          <p style={heroText}>
            Enter a few simple numbers. Serven estimates where profit may be
            leaking from food cost, labor, pricing, and waste.
          </p>
        </div>

        <div style={gridStyle}>
          <div style={panelStyle}>
            <div style={sectionLabel}>Step 1</div>
            <h2 style={sectionTitle}>Tell us about your restaurant</h2>
            <p style={sectionText}>
              Use your best estimate. Serven calculates the percentages for you.
            </p>

            <div style={{ display: "grid", gap: "14px", marginTop: "24px" }}>
              <Field
                label="Monthly revenue"
                placeholder="Example: 80000"
                value={monthlyRevenue}
                onChange={setMonthlyRevenue}
              />

              <Field
                label="Monthly food spend"
                placeholder="Example: 26000"
                value={monthlyFoodSpend}
                onChange={setMonthlyFoodSpend}
              />

              <Field
                label="Monthly labor spend"
                placeholder="Example: 24000"
                value={monthlyLaborSpend}
                onChange={setMonthlyLaborSpend}
              />

              <Field
                label="Average order value"
                placeholder="Example: 28"
                value={averageOrderValue}
                onChange={setAverageOrderValue}
              />
            </div>

            <button
  onClick={() => {
    setFormError("");

    if (!monthlyRevenue || Number(monthlyRevenue) <= 0) {
      setFormError("Please enter your monthly revenue first.");
      return;
    }

    if (!monthlyFoodSpend || Number(monthlyFoodSpend) < 0) {
      setFormError("Please enter your monthly food spend.");
      return;
    }

    if (!monthlyLaborSpend || Number(monthlyLaborSpend) < 0) {
      setFormError("Please enter your monthly labor spend.");
      return;
    }

    setHasCalculated(true);
  }}
  style={primaryButton}
>
  Show My Profit Opportunity →
</button>
{formError && (
  <div
    style={{
      marginTop: "12px",
      padding: "12px",
      borderRadius: "12px",
      background: "rgba(239,68,68,0.10)",
      border: "1px solid rgba(239,68,68,0.22)",
      color: "#fca5a5",
      fontSize: "13px",
      fontWeight: "800",
    }}
  >
    {formError}
  </div>
)}
          </div>

          <div style={revealPanelStyle}>
            {!hasCalculated ? (
              <>
                <div style={sectionLabel}>Step 2</div>
                <h2 style={sectionTitle}>Your AI reveal will appear here</h2>
                <p style={sectionText}>
                  Serven will estimate profit opportunity and show AI-style
                  recommendations based on your numbers.
                </p>
              </>
            ) : (
              <>
                <div style={sectionLabel}>Profit Reveal</div>

                {/* ========================= */}
{/* 💰 PREMIUM PROFIT REVEAL NUMBER */}
{/* ========================= */}
<div
  style={{
    marginTop: "14px",
    padding: "22px",
    borderRadius: "24px",
    background:
      "radial-gradient(circle at top left, rgba(34,197,94,0.18), transparent 36%), linear-gradient(135deg, rgba(15,23,42,0.95), rgba(2,6,23,0.92))",
    border: "1px solid rgba(34,197,94,0.22)",
    boxShadow: "0 24px 70px rgba(0,0,0,0.35)",
  }}
>
  <div
    style={{
      fontSize: "12px",
      fontWeight: "950",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      color: "#86efac",
      marginBottom: "10px",
    }}
  >
    Estimated Profit Opportunity
  </div>

  <div
    style={{
      fontSize: "clamp(34px, 5vw, 58px)",
      lineHeight: 1,
      fontWeight: "950",
      letterSpacing: "-1.8px",
      color: "white",
    }}
  >
    {formatMoney(numbers.lowOpportunity)} –{" "}
    {formatMoney(numbers.highOpportunity)}
  </div>

  <div
    style={{
      marginTop: "10px",
      fontSize: "15px",
      color: "#cbd5e1",
      fontWeight: "800",
    }}
  >
    potential monthly profit recovery
  </div>

  <div
    style={{
      marginTop: "16px",
      padding: "14px",
      borderRadius: "18px",
      background: "rgba(34,197,94,0.08)",
      border: "1px solid rgba(34,197,94,0.18)",
      color: "#bbf7d0",
      fontSize: "13px",
      lineHeight: 1.6,
      fontWeight: "700",
    }}
  >
    With Serven AI, this becomes a daily profit recovery system — not just a
    one-time estimate.
  </div>
  <div
  style={{
    marginTop: "10px",
    fontSize: "13px",
    color: "#fca5a5",
    fontWeight: "900",
    textAlign: "center",
  }}
>
  Every month this continues = real money lost
</div>
</div>

                <p style={sectionText}>
                  That could be roughly{" "}
                  <b style={{ color: "#fde68a" }}>
                    {formatMoney(numbers.yearlyLow)} –{" "}
                    {formatMoney(numbers.yearlyHigh)}
                  </b>{" "}
                  per year in potential profit improvement.
                </p>

                <div style={metricGrid}>
                  <MetricCard
                    label="Food cost"
                    value={`${numbers.foodCostPercent.toFixed(1)}%`}
                  />
                  <MetricCard
                    label="Labor cost"
                    value={`${numbers.laborCostPercent.toFixed(1)}%`}
                  />
                </div>

                <h3 style={aiTitle}>AI Insights</h3>

                <div style={{ display: "grid", gap: "12px" }}>
                  {numbers.insights.map((insight, index) => (
                    <AIInsight key={index} insight={insight} />
                  ))}
                </div>

                <h3 style={aiTitle}>Estimated Opportunity Breakdown</h3>

                <div style={{ display: "grid", gap: "12px" }}>
                  <OpportunityRow title="Food cost recovery" value={numbers.foodOpportunity} />
                  <OpportunityRow title="Labor efficiency" value={numbers.laborOpportunity} />
                  <OpportunityRow title="Menu pricing lift" value={numbers.pricingOpportunity} />
                  <OpportunityRow title="Waste reduction" value={numbers.wasteOpportunity} />
                </div>
{/* ========================= */}
{/* 🔥 LEAD CAPTURE SECTION */}
{/* PASTE THIS RIGHT ABOVE CTA BUTTONS */}
{/* ========================= */}
<div
  style={{
    marginTop: "24px",
    padding: "18px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg, rgba(109,61,245,0.14), rgba(212,175,55,0.08))",
    border: "1px solid rgba(255,255,255,0.10)",
  }}
>
  <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: "950" }}>
    Get your full AI profit breakdown
  </h3>

  <p style={{ margin: "0 0 14px", color: "#94a3b8", fontSize: "13px" }}>
    Save this estimate and we’ll use it to help show where Serven can recover
    profit for your restaurant.
  </p>

  <div style={{ display: "grid", gap: "10px" }}>
    <input
      placeholder="Your name"
      value={leadName}
      onChange={(e) => setLeadName(e.target.value)}
      style={inputStyle}
    />

    <input
      placeholder="Restaurant name"
      value={restaurantName}
      onChange={(e) => setRestaurantName(e.target.value)}
      style={inputStyle}
    />

    <input
      placeholder="Email address"
      type="email"
      value={leadEmail}
      onChange={(e) => setLeadEmail(e.target.value)}
      style={inputStyle}
    />

    <input
      placeholder="Phone number optional"
      value={leadPhone}
      onChange={(e) => setLeadPhone(e.target.value)}
      style={inputStyle}
    />
  </div>

  <button
    onClick={saveProfitRevealLead}
    disabled={savingLead}
    style={{
      ...primaryButton,
      marginTop: "14px",
      opacity: savingLead ? 0.7 : 1,
      cursor: savingLead ? "not-allowed" : "pointer",
    }}
  >
    {savingLead ? "Saving..." : "Save My Profit Report →"}
  </button>

  {leadSaved && (
    <div style={{ marginTop: "10px", color: "#86efac", fontWeight: "800" }}>
      Saved. Your profit reveal report was captured.
    </div>
  )}

  {leadError && (
    <div style={{ marginTop: "10px", color: "#fca5a5", fontWeight: "800" }}>
      {leadError}
    </div>
  )}
</div>
{/* ========================= */}
{/* END LEAD CAPTURE SECTION */}
{/* ========================= */}
                <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <div
  style={{
    marginTop: "24px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  }}
>
  <Link
    href="/pricing"
    style={{
      padding: "16px 20px",
      borderRadius: "16px",
      background: "linear-gradient(135deg, #22c55e, #16a34a)",
      color: "white",
      textDecoration: "none",
      fontWeight: "950",
      fontSize: "15px",
      boxShadow: "0 18px 40px rgba(34,197,94,0.35)",
    }}
  >
    Fix This With Serven →
  </Link>

  <Link
    href="/signup"
    style={{
      padding: "16px 20px",
      borderRadius: "16px",
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.12)",
      color: "white",
      textDecoration: "none",
      fontWeight: "900",
      fontSize: "14px",
    }}
  >
    Start Recovering My Profit →
  </Link>
</div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, placeholder, value, onChange }) {
  return (
    <label style={{ display: "grid", gap: "8px" }}>
      <span style={{ color: "#e2e8f0", fontSize: "14px", fontWeight: "800" }}>
        {label}
      </span>

      <input
        type="number"
        inputMode="decimal"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

function MetricCard({ label, value }) {
  return (
    <div style={metricCard}>
      <div style={{ color: "#94a3b8", fontSize: "12px", fontWeight: "800" }}>
        {label}
      </div>
      <div style={{ marginTop: "6px", fontSize: "28px", fontWeight: "950" }}>
        {value}
      </div>
    </div>
  );
}

function AIInsight({ insight }) {
  const color =
    insight.severity === "Critical"
      ? "#fca5a5"
      : insight.severity === "Healthy"
      ? "#86efac"
      : "#fde68a";

  return (
    <div style={insightCard}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
        <strong>{insight.title}</strong>
        <span style={{ color, fontSize: "12px", fontWeight: "900" }}>
          {insight.severity}
        </span>
      </div>

      <p style={{ margin: "8px 0 0", color: "#94a3b8", fontSize: "13px", lineHeight: 1.6 }}>
        {insight.text}
      </p>
    </div>
  );
}

function OpportunityRow({ title, value }) {
  return (
    <div style={opportunityRow}>
      <span>{title}</span>
      <strong style={{ color: "#86efac" }}>
        ${Math.round(Number(value || 0)).toLocaleString()}/mo
      </strong>
    </div>
  );
}

const panelStyle = {
  padding: "28px",
  borderRadius: "28px",
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.92), rgba(30,41,59,0.72))",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
};

const revealPanelStyle = {
  ...panelStyle,
  position: "sticky",
  top: "100px",
};

const badgeStyle = {
  display: "inline-flex",
  padding: "8px 12px",
  borderRadius: "999px",
  background: "rgba(212,175,55,0.12)",
  border: "1px solid rgba(212,175,55,0.25)",
  color: "#fde68a",
  fontSize: "12px",
  fontWeight: "900",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "18px",
};

const heroTitle = {
  fontSize: "clamp(38px, 6vw, 72px)",
  lineHeight: 1,
  margin: 0,
  fontWeight: "950",
  letterSpacing: "-2px",
};

const heroText = {
  margin: "20px auto 0",
  color: "#cbd5e1",
  fontSize: "18px",
  lineHeight: 1.7,
  maxWidth: "720px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 0.95fr) minmax(0, 1.05fr)",
  gap: "24px",
  alignItems: "start",
};

const sectionLabel = {
  color: "#fde68a",
  fontSize: "12px",
  fontWeight: "950",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
};

const sectionTitle = {
  margin: "10px 0 8px",
  fontSize: "28px",
  fontWeight: "950",
};

const sectionText = {
  margin: 0,
  color: "#94a3b8",
  fontSize: "15px",
  lineHeight: 1.7,
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid rgba(148,163,184,0.22)",
  background: "rgba(15,23,42,0.74)",
  color: "white",
  outline: "none",
  fontSize: "15px",
  boxSizing: "border-box",
};

const primaryButton = {
  width: "100%",
  marginTop: "22px",
  padding: "16px 18px",
  borderRadius: "16px",
  border: "none",
  background: "linear-gradient(135deg, #d4af37, #6D3DF5)",
  color: "white",
  fontWeight: "950",
  fontSize: "15px",
  cursor: "pointer",
};

const bigNumber = {
  margin: "10px 0 8px",
  fontSize: "clamp(30px, 4vw, 50px)",
  lineHeight: 1,
  fontWeight: "950",
};

const bigNumberSub = {
  display: "block",
  marginTop: "8px",
  fontSize: "18px",
  color: "#cbd5e1",
  fontWeight: "800",
};

const metricGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "14px",
  marginTop: "24px",
};

const metricCard = {
  padding: "16px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const aiTitle = {
  margin: "24px 0 12px",
  fontSize: "18px",
  fontWeight: "950",
};

const insightCard = {
  padding: "14px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const opportunityRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  padding: "14px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const ctaButton = {
  padding: "14px 18px",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #d4af37, #6D3DF5)",
  color: "white",
  textDecoration: "none",
  fontWeight: "950",
};

const secondaryButton = {
  padding: "14px 18px",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "white",
  textDecoration: "none",
  fontWeight: "900",
};