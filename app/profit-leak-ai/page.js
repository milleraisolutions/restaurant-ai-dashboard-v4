"use client";

const menuItems = [
  { name: "Grilled Salmon", price: 24, cost: 18 },
  { name: "Steak Frites", price: 32, cost: 21 },
  { name: "Chicken Alfredo", price: 18, cost: 12 },
  { name: "Margherita Pizza", price: 16, cost: 6 }
];

export default function ProfitLeakAI() {

  const analysis = menuItems.map(item => {

    const profit = item.price - item.cost;
    const margin = ((profit / item.price) * 100).toFixed(1);

    return {
      ...item,
      profit,
      margin
    };

  });

  const leaks = analysis.filter(item => item.margin < 50);

  return (
    <div>

      <h1>Profit Leak Detection AI</h1>

      <h2>Detected Profit Leaks</h2>

      {leaks.length === 0 ? (
        <p>No profit leaks detected</p>
      ) : (
        leaks.map((item,index)=>(
          <p key={index}>
            ⚠ {item.name} — Margin {item.margin}% (Low Profit)
          </p>
        ))
      )}

    </div>
  );
}