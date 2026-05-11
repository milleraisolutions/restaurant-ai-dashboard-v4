"use client";

export default function WeeklyExecutiveSummary({
  weeklyExecutiveSummary,
  revenueTrend,
  avgMargin,
  foodCostPercentage,
}) {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        borderRadius: "18px",
        background: weeklyExecutiveSummary.tone.bg,
        border: weeklyExecutiveSummary.tone.border,
      }}
    >
     {/* WEEKLY EXECUTIVE SUMMARY UNDER TITLE */}
  <div
    style={{
      marginTop: "20px",
      padding: "20px",
      borderRadius: "18px",
      background: weeklyExecutiveSummary.tone.bg,
      border: weeklyExecutiveSummary.tone.border,
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "14px",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#c4b5fd",
            marginBottom: "8px",
          }}
        >
          Weekly Executive Summary
        </div>

        <div
          style={{
            fontSize: "13px",
            color: "#cbd5e1",
            lineHeight: 1.6,
            maxWidth: "620px",
          }}
        >
          A high-level AI summary of this week’s business performance, operating
          pressure, and next best focus area.
        </div>
      </div>

      <div
        style={{
          padding: "8px 12px",
          borderRadius: "999px",
          background: weeklyExecutiveSummary.tone.pillBg,
          border: weeklyExecutiveSummary.tone.border,
          color: weeklyExecutiveSummary.tone.accent,
          fontSize: "12px",
          fontWeight: "800",
        }}
      >
        {weeklyExecutiveSummary.tone.label}
      </div>
    </div>

    <div
      style={{
        fontSize: "18px",
        fontWeight: "900",
        color: "white",
        marginBottom: "8px",
      }}
    >
      {weeklyExecutiveSummary.headline}
    </div>

    <div
      style={{
        fontSize: "13px",
        color: "#e2e8f0",
        lineHeight: 1.7,
      }}
    >
      {weeklyExecutiveSummary.summary}
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "14px",
        marginTop: "16px",
      }}
    >
      <div
        style={{
          padding: "14px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(148,163,184,0.12)",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: "#94a3b8",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "8px",
          }}
        >
          This Week Revenue
        </div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: "900",
            color: "white",
          }}
        >
          ${Number(revenueTrend?.currentWeekRevenue || 0).toLocaleString()}
        </div>
      </div>

      <div
        style={{
          padding: "14px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(148,163,184,0.12)",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: "#94a3b8",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "8px",
          }}
        >
          Revenue vs Last Week
        </div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: "900",
            color:
              Number(revenueTrend?.growthPercent || 0) >= 0
                ? "#86efac"
                : "#fca5a5",
          }}
        >
          {Number(revenueTrend?.growthPercent || 0) >= 0 ? "+" : ""}
          {Number(revenueTrend?.growthPercent || 0).toFixed(1)}%
        </div>
      </div>

      <div
        style={{
          padding: "14px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(148,163,184,0.12)",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: "#94a3b8",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "8px",
          }}
        >
          Avg Margin
        </div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: "900",
            color: "white",
          }}
        >
          {Number(avgMargin || 0).toFixed(1)}%
        </div>
      </div>

      <div
        style={{
          padding: "14px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(148,163,184,0.12)",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            color: "#94a3b8",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "8px",
          }}
        >
          Food Cost
        </div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: "900",
            color: "white",
          }}
        >
          {Number(foodCostPercentage || 0).toFixed(1)}%
        </div>
      </div>
    </div>
  </div>
    </div>
  );
}