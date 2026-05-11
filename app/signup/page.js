"use client";

import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();

  const [restaurantName, setRestaurantName] = useState("");
  const [size, setSize] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [businessType, setBusinessType] = useState("restaurant");
  const [errorMessage, setErrorMessage] = useState("");

  const getRecommendedPlan = (selectedSize) => {
    if (selectedSize === "large") return "pro";
    if (selectedSize === "medium") return "growth";
    return "starter";
  };

  const getEstimatedPriceRange = (selectedSize) => {
    if (selectedSize === "large") return "$499-$999/mo";
    if (selectedSize === "medium") return "$299-$599/mo";
    return "$149-$249/mo";
  };

  const saveLeadToSupabase = async ({ userId, cleanEmail, cleanPhone }) => {
    const recommendedPlan = getRecommendedPlan(size);
    const estimatedPriceRange = getEstimatedPriceRange(size);

    const { error } = await supabase.from("leads").insert([
      {
        user_id: userId,
        full_name: restaurantName.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        restaurant_name: restaurantName.trim(),
        business_type: businessType,
        recommended_plan: recommendedPlan,
        estimated_price_range: estimatedPriceRange,
        status: "new",
        notes: `Signup lead. Restaurant size: ${size}`,
      },
    ]);

    if (error) {
      console.error("LEAD SAVE ERROR:", error);
    }
  };

  const handleSignup = async () => {
    try {
      setErrorMessage("");

      const cleanEmail = String(email || "").trim().toLowerCase();
      const cleanPhone = String(phone || "").trim();
      const cleanPassword = String(password || "");
      const cleanConfirmPassword = String(confirmPassword || "");

      if (!restaurantName.trim()) {
        setErrorMessage("Please enter your restaurant name.");
        return;
      }

      if (!cleanPhone) {
        setErrorMessage("Please enter your phone number.");
        return;
      }

      if (!businessType) {
        setErrorMessage("Please select a business type.");
        return;
      }

      if (!size) {
        setErrorMessage("Please select your restaurant size.");
        return;
      }

      if (!cleanEmail || !cleanPassword) {
        setErrorMessage("Please enter your email and password.");
        return;
      }

      if (cleanPassword.length < 6) {
        setErrorMessage("Password must be at least 6 characters.");
        return;
      }

      if (cleanPassword !== cleanConfirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }

      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) {
        setErrorMessage(error.message || "Signup failed.");
        return;
      }

      const userId = data?.user?.id;

      if (!userId) {
        setErrorMessage("Account created, but user profile was not returned.");
        return;
      }

      const { error: profileError } = await supabase
        .from("users")
        .upsert(
          {
            id: userId,
            email: cleanEmail,
            phone: cleanPhone || null,
            restaurant_name: restaurantName.trim(),
            business_type: businessType || "",
            size: size || "",
            plan: "none",
            customer_status: "lead",
            subscription_status: "pending",
            created_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

      if (profileError) {
        console.error("PROFILE SAVE ERROR:", profileError);
        setErrorMessage(profileError.message || "Profile save failed.");
        return;
      }

      await saveLeadToSupabase({ userId, cleanEmail, cleanPhone });

      router.push("/dashboard");
    } catch (err) {
      console.error("SIGNUP FAILED:", err);
      setErrorMessage(err?.message || "Something went wrong during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageWrapper}>
      <div style={cardStyle}>
        <div style={accentBar} />

        <h2 style={{ marginBottom: "6px" }}>
          Start Unlocking Hidden Profit in Your Business
        </h2>

        <p style={subText}>
          Connect your data and discover where your business is losing money
        </p>

        {errorMessage && <div style={errorBox}>{errorMessage}</div>}

        <input
          type="text"
          placeholder="Restaurant Name"
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />

        <div style={{ marginTop: "16px" }}>
          <label style={labelStyle}>Business Type</label>

          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            style={selectStyle}
          >
            <option value="restaurant">Full-Service Restaurant</option>
            <option value="coffee">Coffee Shop</option>
            <option value="smoothie">Smoothie / Juice Bar</option>
          </select>

          <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "6px" }}>
            We customize your dashboard based on your business type
          </p>
        </div>

        <select
          value={size}
          onChange={(e) => setSize(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select Restaurant Size</option>
          <option value="small">Small (0–50 seats)</option>
          <option value="medium">Medium (50–150 seats)</option>
          <option value="large">Large (150+ seats)</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={toggleStyle}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating account..." : "Create My Demo Profile"}
        </button>

        <p style={footerText}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#6D3DF5", fontWeight: "600" }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const pageWrapper = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  fontFamily: "sans-serif",
  padding: "20px",
};

const cardStyle = {
  width: "420px",
  padding: "32px",
  borderRadius: "16px",
  background: "white",
  border: "1px solid #e5e7eb",
  boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
};

const accentBar = {
  height: "4px",
  width: "100%",
  borderRadius: "999px",
  background: "linear-gradient(90deg, #6D3DF5, #9333ea)",
  marginBottom: "20px",
};

const subText = {
  color: "#6b7280",
  fontSize: "13px",
  marginBottom: "20px",
};

const errorBox = {
  background: "#fee2e2",
  color: "#991b1b",
  border: "1px solid #fecaca",
  padding: "12px",
  borderRadius: "10px",
  fontSize: "13px",
  marginBottom: "14px",
};

const labelStyle = {
  display: "block",
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "8px",
  color: "#0f172a",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "14px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

const selectStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "14px",
  background: "white",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  color: "white",
  fontSize: "15px",
  fontWeight: "600",
  transition: "0.2s",
  background: "#6D3DF5",
  boxShadow: "0 10px 20px rgba(109,61,245,0.25)",
};

const toggleStyle = {
  position: "absolute",
  right: "10px",
  top: "10px",
  cursor: "pointer",
  fontSize: "12px",
  color: "#6D3DF5",
};

const footerText = {
  marginTop: "15px",
  fontSize: "12px",
  color: "#9ca3af",
  textAlign: "center",
};