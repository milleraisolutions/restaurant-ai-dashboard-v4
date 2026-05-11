export default function DashboardHeader() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px"
    }}>
      <div>
        <h1 style={{ margin: 0 }}>ServeIntel</h1>
        <p style={{ margin: 0, color: "#6b7280" }}>
          AI Restaurant Intelligence
        </p>
      </div>

      <div style={{
        background: "#4f46e5",
        color: "white",
        padding: "8px 14px",
        borderRadius: "8px",
        fontWeight: "600"
      }}>
        Pro Dashboard
      </div>
    </div>
  );
}