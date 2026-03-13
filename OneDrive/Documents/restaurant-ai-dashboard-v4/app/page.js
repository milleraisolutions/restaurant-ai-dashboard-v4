export default function Home() {
	return (
		<main style={{padding:"40px", fontFamily:"Arial"}}>
			<h1>Restaurant AI Dash</h1>
			<p>Welcome to your AI-powered restaurant analytics platform.</p>

			<h2>Today's Metrics</h2>
			<ul>
				<li>Revenue: $4,250</li>
				<li>Orders: 132</li>
				<li>Food Cost: 28%</li>
				<li>Top Item: Smash Burger</li>
			</ul>

			<h2>AI Insights</h2>
			<p>
				Sales are trending up 12% today. Consider promoting fries and milkshakes to increase average order value.
			</p>	
		</main>
	);
}