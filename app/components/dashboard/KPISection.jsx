export default function KPISection({ data }) {
  return (
    <div style={{
      display: "flex",
      gap: "20px",
      marginTop: "20px",
      flexWrap: "wrap"
    }}>
      
      <div style={card}>
        <h4>Total Revenue</h4>
        <p>${data.totalRevenue.toLocaleString()}</p>
      </div>

      <div style={card}>
        <h4>Food Cost %</h4>
        <p>{data.foodCostPercentage.toFixed(1)}%</p>
      </div>

      <div style={card}>
        <h4>Profit Leaks</h4>
        <p>{data.profitLeaks.length}</p>
      </div>
    </div>
  );
}

const card = {
  flex: "1",
  minWidth: "180px",
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
};