export default function DashboardTabs({ data }) {
  const tabs = ["overview", "ai", "labor", "marketing"];

  return (
    <div style={{ display: "flex", gap: "10px", margin: "20px 0" }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => data.setActiveTab(tab)}
          style={{
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            background:
              data.activeTab === tab ? "#4f46e5" : "#e5e7eb",
            color:
              data.activeTab === tab ? "white" : "black",
          }}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
}