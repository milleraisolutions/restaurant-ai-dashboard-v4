import Link from "next/link";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "220px",
        background: "#111",
        color: "white",
        height: "100vh",
        padding: "20px",
        position: "fixed",
        left: 0,
        top: 0
      }}
    >
      <h2>Restaurant AI</h2>

      <div style={{ marginTop: "30px", display: "flex", flexDirection: "column", gap: "15px" }}>
        <Link href="/dashboard" style={{ color: "white" }}>Dashboard</Link>
        <Link href="/menu-intelligence" style={{ color: "white" }}>Menu Intelligence</Link>
        <Link href="/inventory-ai" style={{ color: "white" }}>Inventory AI</Link>
        <Link href="/supplier-monitoring" style={{ color: "white" }}>Supplier Monitoring</Link>
        <Link href="/forecasting" style={{ color: "white" }}>Forecasting</Link>
      </div>
    </div>
  );
}