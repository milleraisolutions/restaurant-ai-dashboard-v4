"use client";

import { useState } from "react";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [revenue, setRevenue] = useState(50000);

  const progress = (step / 3) * 100;

  return (
    <div style={{
      maxWidth: "600px",
      margin: "auto",
      padding: "60px 20px",
      textAlign: "center"
    }}>

      {/* 🔥 PROGRESS BAR */}
      <div style={{
        width: "100%",
        height: "6px",
        background: "#eee",
        borderRadius: "10px",
        marginBottom: "30px"
      }}>
        <div style={{
          width: `${progress}%`,
          height: "100%",
          background: "#6D3DF5",
          borderRadius: "10px",
          transition: "0.3s"
        }} />
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <h1>Let’s Increase Your Profit</h1>

          <p style={{ color:"#6b7280", marginTop:"10px" }}>
            This takes less than 30 seconds
          </p>

          <p style={{
            marginTop: "20px",
            fontWeight: "600"
          }}>
            Most restaurants are losing thousands every month without realizing it.
          </p>

          <button
            onClick={() => setStep(2)}
            style={btnPrimary}
          >
            Continue →
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <h2>What’s your monthly revenue?</h2>

          <p style={{ color:"#6b7280", marginTop:"10px" }}>
            We’ll calculate how much profit you can recover
          </p>

          <input
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
            style={input}
          />

          <button
            onClick={() => setStep(3)}
            style={btnPrimary}
          >
            Calculate My Profit →
          </button>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <h2>You’re Likely Losing</h2>

          <h1 style={{
            color:"#dc2626",
            marginTop:"10px",
            fontSize:"42px"
          }}>
            ${Math.round(revenue * 0.04).toLocaleString()} – ${Math.round(revenue * 0.12).toLocaleString()}
          </h1>

          <p style={{
            color:"#6b7280",
            marginTop:"10px"
          }}>
            every month from hidden inefficiencies
          </p>

          <p style={{
            marginTop:"20px",
            fontWeight:"600"
          }}>
            This is profit you could be keeping starting today.
          </p>

          <button
            onClick={() => window.location.href = "/pricing"}
            style={btnPrimary}
          >
            Fix This Now →
          </button>

          <p style={{
            marginTop:"10px",
            fontSize:"12px",
            color:"#6b7280"
          }}>
            Takes 2 minutes • No risk
          </p>
        </>
      )}

    </div>
  );
}

/* STYLES */
const btnPrimary = {
  marginTop: "30px",
  padding: "14px 28px",
  background: "#6D3DF5",
  color: "white",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px"
};

const input = {
  marginTop: "20px",
  padding: "12px",
  fontSize: "18px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  width: "200px",
  textAlign: "center"
};