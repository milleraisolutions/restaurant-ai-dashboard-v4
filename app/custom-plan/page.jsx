"use client";

import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function CustomPlanPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    restaurant: "",
    email: "",
    phone: "",
    monthlyRevenue: "",
    staffCount: "",
    menuItems: "",
    locations: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user || null);
    };

    loadUser();
  }, []);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (submitting) return;

    if (!form.name || !form.restaurant || !form.email) {
      alert("Please fill in your name, restaurant, and email.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/custom-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          userId: user?.id || null,
        }),
      });

      const text = await res.text();
      console.log("API STATUS:", res.status);
      console.log("API RAW RESPONSE:", text);

      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        alert("API route not found. Check app/api/custom-plan/route.js");
        return;
      }

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={pageStyle}>
        <div style={successCard}>
          <h2 style={{ color: "#0f172a" }}>Request Received ✅</h2>
          <p style={{ color: "#475569", marginTop: "10px" }}>
            We’ll review your restaurant and reach out shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={eyebrowStyle}>CUSTOM SERVEN PLAN</div>

        <h1 style={titleStyle}>Request your custom plan</h1>

        <p style={subtitleStyle}>
          Share a few details and we’ll review your restaurant setup before
          sending your agreement and Stripe activation link.
        </p>

        <div style={formGrid}>
          {[
            ["name", "Your Name"],
            ["restaurant", "Restaurant Name"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["monthlyRevenue", "Estimated Monthly Revenue"],
            ["staffCount", "Staff Count"],
            ["menuItems", "Menu Items"],
            ["locations", "Locations"],
          ].map(([field, label]) => (
            <input
              key={field}
              placeholder={label}
              value={form[field]}
              onChange={(e) => updateForm(field, e.target.value)}
              style={inputStyle}
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            ...buttonStyle,
            opacity: submitting ? 0.7 : 1,
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit Custom Plan Request"}
        </button>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const pageStyle = {
  minHeight: "100vh",
  background: "#f8fafc",
  padding: "60px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cardStyle = {
  width: "100%",
  maxWidth: "720px",
  background: "white",
  borderRadius: "24px",
  padding: "32px",
  boxShadow: "0 20px 60px rgba(15,23,42,0.10)",
  border: "1px solid rgba(15,23,42,0.08)",
};

const successCard = {
  background: "white",
  padding: "40px",
  borderRadius: "20px",
  textAlign: "center",
  boxShadow: "0 20px 60px rgba(15,23,42,0.12)",
};

const eyebrowStyle = {
  color: "#7c3aed",
  fontWeight: 900,
  fontSize: "13px",
};

const titleStyle = {
  fontSize: "36px",
  margin: "10px 0",
  color: "#0f172a",
};

const subtitleStyle = {
  color: "#475569",
  lineHeight: 1.6,
};

const formGrid = {
  display: "grid",
  gap: "14px",
  marginTop: "24px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid rgba(15,23,42,0.14)",
  fontSize: "14px",
  outline: "none",
};

const buttonStyle = {
  marginTop: "22px",
  width: "100%",
  padding: "15px",
  borderRadius: "16px",
  border: "none",
  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
  color: "white",
  fontWeight: 900,
};