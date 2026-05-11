"use client";

import { useState } from "react";
import Papa from "papaparse";
import { supabase } from "../lib/supabaseClient";

/* ===============================
   DETECT COLUMN
=============================== */
const detectColumn = (row, possibleNames) => {
  const keys = Object.keys(row);

  for (let name of possibleNames) {
    const found = keys.find(
      (k) => k.toLowerCase().trim() === name.toLowerCase()
    );
    if (found) return found;
  }

  return "";
};

export default function UploadPage() {
  const [rows, setRows] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [mapping, setMapping] = useState({});
  const [uploadType, setUploadType] = useState("menu");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  /* ===============================
     STEP 1: PARSE + PREVIEW
  =============================== */
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;

        if (!data.length) {
          setMessage("Empty file");
          return;
        }

        const sample = data[0];
        const cols = Object.keys(sample);

        setRows(data);
        setHeaders(cols);

        // 🔥 AUTO MAP
        setMapping({
          name: detectColumn(sample, ["name", "item", "product"]),
          category: detectColumn(sample, ["category", "type"]),
          quantity: detectColumn(sample, ["quantity", "qty", "units"]),
          revenue: detectColumn(sample, ["revenue", "sales", "total"]),
          date: detectColumn(sample, ["date", "time"]),
          price: detectColumn(sample, ["price"]),
          cost: detectColumn(sample, ["ingredient_cost", "cost"]),
          labor: detectColumn(sample, ["labor"]),
        });

        setMessage("Preview loaded 👇 confirm mapping");
      },
    });
  };
const handleImportMappedSales = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      setMessage("You must be logged in");
      return;
    }

    if (!rows?.length) {
      setMessage("No rows to import");
      return;
    }

    if (!mapping?.name || !mapping?.quantity || !mapping?.revenue) {
      setMessage("Please confirm your column mapping first");
      return;
    }

    const { data: uploadedFileRow, error: uploadInsertError } = await supabase
      .from("uploads")
      .insert([
        {
          user_id: user.id,
          file_name: "POS Upload",
          source_name: selectedDataSource || "Manual Upload",
          row_count: Number(rows.length || 0),
          upload_type: "pos",
          status: "completed",
        },
      ])
      .select()
      .single();

    if (uploadInsertError) {
      console.error("Uploads table insert failed:", uploadInsertError);
      setMessage("Failed to create upload record");
      return;
    }

    const salesRows = rows.map((row) => ({
      user_id: user.id,
      upload_id: uploadedFileRow?.id || null,
      name: row[mapping.name] || "Unknown",
      category: mapping.category
        ? row[mapping.category] || "Uncategorized"
        : "Uncategorized",
      quantity: Number(row[mapping.quantity] || 0),
      revenue: Number(row[mapping.revenue] || 0),
      date: mapping.date ? row[mapping.date] || null : null,
      labor: mapping.labor ? Number(row[mapping.labor] || 0) : 0,
    }));

    const { error: salesInsertError } = await supabase
      .from("sales")
      .insert(salesRows);

    if (salesInsertError) {
      console.error("Sales insert failed:", salesInsertError);
      setMessage("Failed to import sales rows");
      return;
    }

    setMessage("Imported completed successfully");
  } catch (error) {
    console.error("Import mapped sales failed:", error);
    setMessage("Import failed");
  }
};

  /* ===============================
     STEP 2: CONFIRM + UPLOAD
  =============================== */
  const handleUpload = async () => {
    try {
      setUploading(true);

      const { data: userData } = await supabase.auth.getUser();
const userPlan = userData?.plan;

const allowedPlans = ["starter", "growth", "pro"];

if (!allowedPlans.includes(userPlan)) {
  router.push("/pricing");
  return;
}

      const userId = userData?.user?.id;

      let formattedRows = [];

      if (uploadType === "menu") {
        formattedRows = rows.map((row) => ({
          user_id: userId,
          name: row[mapping.name],
          category: row[mapping.category],
          price: Number(row[mapping.price] || 0),
          ingredient_cost: Number(row[mapping.cost] || 0),
          weekly_sales: Number(row[mapping.quantity] || 0),
        }));

        await supabase.from("menu_items").insert(formattedRows);
      }

      if (uploadType === "sales") {
        formattedRows = rows.map((row) => ({
          user_id: userId,
          name: row[mapping.name],
          category: row[mapping.category],
          quantity: Number(row[mapping.quantity] || 0),
          revenue: Number(row[mapping.revenue] || 0),
          date: row[mapping.date],
          labor: Number(row[mapping.labor] || 0),
        }));

        await supabase.from("sales").insert(formattedRows);
      }

      setMessage("Upload complete 🚀");

    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    }

    setUploading(false);
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div style={{ padding: 40, maxWidth: 800 }}>
      <h1>Upload CSV</h1>

      {/* TYPE */}
      <select
        value={uploadType}
        onChange={(e) => setUploadType(e.target.value)}
      >
        <option value="menu">Menu</option>
        <option value="sales">Sales</option>
      </select>

      {/* FILE */}
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      <p>{message}</p>

      {/* ===============================
         PREVIEW TABLE
      =============================== */}
      {rows.length > 0 && (
        <>
          <h3>Preview</h3>

          <table border="1" cellPadding="5">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 5).map((row, i) => (
                <tr key={i}>
                  {headers.map((h, j) => (
                    <td key={j}>{row[h]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* ===============================
             MAPPING UI
          =============================== */}
          <h3 style={{ marginTop: 20 }}>Map Columns</h3>

          {Object.keys(mapping).map((field) => (
            <div key={field} style={{ marginBottom: 10 }}>
              <label>{field} → </label>

              <select
                value={mapping[field]}
                onChange={(e) =>
                  setMapping((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
              >
                <option value="">-- Select Column --</option>
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* UPLOAD BUTTON */}
          <button
            onClick={handleUpload}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              background: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: 8,
            }}
          >
            Confirm & Upload
          </button>
        </>
      )}

      {uploading && <p>Uploading...</p>}
    </div>
  );
}