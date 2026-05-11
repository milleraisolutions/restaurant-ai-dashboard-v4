export default function AIInsightsPanel({ data }) {
  return (
    <div style={{
      background: "#111",
      color: "white",
      padding: "25px",
      borderRadius: "20px",
      height: "fit-content"
    }}>
      <h2>🧠 AI Insights</h2>

      <h3>Score</h3>
      <p>{data.score}/100</p>

      <h3>💡 Top Recommendations</h3>
      {data.aiRecommendations.slice(0, 3).map((r, i) => (
        <p key={i}>{r}</p>
      ))}

      <h3>🚨 Alerts</h3>
      {data.aiAlerts.length === 0 && <p>No issues ✅</p>}
      {data.aiAlerts.map((a, i) => (
        <p key={i}>{a}</p>
      ))}

      <h3>💸 Monthly Labor Loss</h3>
      <p>${data.monthlyLaborLoss.toLocaleString()}</p>
    </div>
  );
}