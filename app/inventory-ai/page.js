"use client";

const menuItems = [
  { name: "Grilled Salmon", weeklySales: 80 },
  { name: "Steak Frites", weeklySales: 60 },
  { name: "Chicken Alfredo", weeklySales: 95 },
  { name: "Margherita Pizza", weeklySales: 120 }
];

const inventoryLevels = {
  "Grilled Salmon": 200,
  "Steak Frites": 150,
  "Chicken Alfredo": 250,
  "Margherita Pizza": 300
};

export default function InventoryAI() {

  const forecast = menuItems.map(item => {

    const inventory = inventoryLevels[item.name] || 0;

    const weeksRemaining =
      item.weeklySales > 0
        ? (inventory / item.weeklySales).toFixed(1)
        : "N/A";

    return {
      name: item.name,
      inventory,
      weeksRemaining
    };

  });

  return (
    <div>

      <h1>Inventory Forecast AI</h1>

      <h2>Inventory Depletion Forecast</h2>

      {forecast.map((item,index)=>(
        <p key={index}>
          {item.name} — Inventory: {item.inventory} units | Weeks Remaining: {item.weeksRemaining}
        </p>
      ))}

    </div>
  );
}