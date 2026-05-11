"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

useEffect(() => {
  setCheckingSession(false);
}, []);
const handleLogin = async () => {
  try {
    setErrorMessage("");

    const cleanEmail = String(email || "")
      .trim()
      .toLowerCase();

    const cleanPassword = String(password || "");

    if (!cleanEmail || !cleanPassword) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });

    console.log("LOGIN RESPONSE:", data);

    if (error) {
      console.error("LOGIN ERROR:", error);

      setErrorMessage(
        error.message || "Login failed."
      );

      return;
    }

    console.log("LOGIN SUCCESS");

    window.location.href = "/dashboard";
  } catch (err) {
    console.error("LOGIN FAILED:", err);

    setErrorMessage(
      err?.message || "Something went wrong during login."
    );
  } finally {
    setLoading(false);
  }
};

  if (checkingSession) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
          fontFamily: "sans-serif",
          padding: "24px",
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
            textAlign: "center",
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

          <h2 style={{ marginBottom: "8px" }}>Serven</h2>
          <p
            style={{
              color: "#6b7280",
              fontSize: "13px",
              marginBottom: "0",
            }}
          >
            Resetting session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
        fontFamily: "sans-serif",
        padding: "24px",
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

        <h2 style={{ marginBottom: "5px" }}>Serven</h2>
        <p
          style={{
            color: "#6b7280",
            fontSize: "13px",
            marginBottom: "20px",
          }}
        >
          AI-powered business insights
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            background: "#f9fafb",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleLogin();
          }}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "8px",
            borderRadius: "10px",
            border: "1px solid #d1d5db",
            background: "#f9fafb",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />

        {errorMessage && (
          <div
            style={{
              marginBottom: "12px",
              padding: "10px 12px",
              borderRadius: "10px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            {errorMessage}
          </div>
        )}

        <div style={{ textAlign: "right", marginBottom: "15px" }}>
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: "#6D3DF5",
              fontSize: "12px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Forgot password?
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            background: "#6D3DF5",
            color: "white",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            boxShadow: "0 10px 20px rgba(109,61,245,0.25)",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          style={{
            marginTop: "15px",
            fontSize: "12px",
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          Secure login powered by Supabase
        </p>
      </div>
    </div>
  );
}