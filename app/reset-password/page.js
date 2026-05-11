"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setMessage("Please fill out both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Password updated successfully. Redirecting to login...");

    setTimeout(() => {
      router.push("/login");
    }, 1500);
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
          width: "400px",
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

        <h2 style={{ marginBottom: "5px" }}>Set New Password</h2>
        <p
          style={{
            color: "#6b7280",
            fontSize: "13px",
            marginBottom: "20px",
          }}
        >
          Enter your new password below.
        </p>

        <form onSubmit={handleUpdatePassword}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              fontSize: "14px",
            }}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Updating..." : "Update Password"}
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