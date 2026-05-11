import Link from "next/link";

export default function Navbar() {
  return (
    <div
      style={{
        width: "100%",
        background: "#111",
        color: "white",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <h2>Restaurant AI</h2>

      <div style={{ display: "flex", gap: "25px" }}>
        <Link href="/" style={{ color: "white" }}>Home</Link>
        <Link href="/dashboard" style={{ color: "white" }}>Dashboard</Link>
        <Link href="/menu-intelligence" style={{ color: "white" }}>Menu Intelligence</Link>
        <Link href="/inventory-ai" style={{ color: "white" }}>Inventory AI</Link>
        <Link href="/forecasting" style={{ color: "white" }}>Forecasting</Link>
        <Link href="/profit-reveal" style={{ color: "white" }}>
          Profit Reveal
        </Link>
      </div>
    </div>
  );
}