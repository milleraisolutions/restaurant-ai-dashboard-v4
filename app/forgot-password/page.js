"use client";

import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://serven-57x9gbtgj-milleraisolutions-projects.vercel.app/reset-password",
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password reset email sent. Check your inbox.");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
        fontFamily: "sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "380px",
          padding: "30px",
          borderRadius: "16px",
          background: "white",
          border: "1px solid #e5e7eb",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            height: "4px",
            width: "100%",
            borderRadius: "999px",
            background: "linear-gradient(90deg, #6D3DF5, #9333ea)",
            marginBottom: "20px",
          }}
        />

        <h2 style={{ marginBottom: "5px" }}>Reset Password</h2>
        <p
          style={{
            color: "#6b7280",
            fontSize: "13px",
            marginBottom: "20px",
          }}
        >
          Enter your email and we’ll send you a reset link.
        </p>

        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              fontSize: "14px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "#6D3DF5",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 10px 20px rgba(109,61,245,0.25)",
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "15px",
              fontSize: "12px",
              color: "#6b7280",
              textAlign: "center",
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}