import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function RevenueChart({ data }) {
  return (
    <div style={{ marginTop: "40px" }}>
      <h2>📈 Weekly Revenue</h2>

      <LineChart width={700} height={300} data={data.revenueData}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />

        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#4f46e5"
          strokeWidth={3}
        />
      </LineChart>
    </div>
  );
}