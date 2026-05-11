"use client";

const menuItems = [
  { name: "Grilled Salmon", price: 24, cost: 9, weeklySales: 80 },
  { name: "Steak Frites", price: 32, cost: 14, weeklySales: 60 },
  { name: "Chicken Alfredo", price: 18, cost: 7, weeklySales: 95 },
  { name: "Margherita Pizza", price: 16, cost: 5, weeklySales: 120 },
  { name: "Shrimp Tacos", price: 19, cost: 8, weeklySales: 70 }
];

export default function MenuIntelligence() {

  const avgSales =
    menuItems.reduce((sum, item) => sum + item.weeklySales, 0) /
    menuItems.length;

  const analysis = menuItems.map(item => {

    const profit = item.price - item.cost;
    const margin = ((profit / item.price) * 100).toFixed(1);

    const demand = item.weeklySales >= avgSales ? "high" : "low";
    const profitLevel = margin >= 60 ? "high" : "low";

    let category = "";

    if (profitLevel === "high" && demand === "high") category = "Star ⭐";
    if (profitLevel === "low" && demand === "high") category = "Plowhorse 🐎";
    if (profitLevel === "high" && demand === "low") category = "Puzzle 🧩";
    if (profitLevel === "low" && demand === "low") category = "Dog 🐶";

    return {
      ...item,
      profit,
      margin,
      category
    };

  });

  return (
    <div>

      <h1>Menu Intelligence AI</h1>

      <h2>Menu Performance Analysis</h2>

      {analysis.map((item, index) => (
        <p key={index}>
          {item.name} — Profit: ${item.profit} | Margin: {item.margin}% | Category: {item.category}
        </p>
      ))}

    </div>
  );
}