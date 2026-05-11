export default function FilterBar({ data }) {
  return (
    <div style={{
      display: "flex",
      gap: "12px",
      marginBottom: "20px",
      flexWrap: "wrap",
      background: "white",
      padding: "12px",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
    }}>
      
      <select
        value={data.timeFilter}
        onChange={(e) => data.setTimeFilter(e.target.value)}
        style={select}
      >
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>

      <select
        value={data.categoryFilter}
        onChange={(e) => data.setCategoryFilter(e.target.value)}
        style={select}
      >
        <option value="all">All Items</option>
        <option value="food">Food</option>
        <option value="coffee">Coffee</option>
        <option value="alcohol">Alcohol</option>
      </select>
    </div>
  );
}

const select = {
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  fontWeight: "500",
  cursor: "pointer"
};