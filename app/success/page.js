export default function Success() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>✅ Payment Successful</h1>
      <p>Your subscription is now active.</p>

      <a href="/dashboard">
        <button style={{ marginTop: "20px", padding: "10px 20px" }}>
          Go to Dashboard
        </button>
      </a>
    </div>
  );
}