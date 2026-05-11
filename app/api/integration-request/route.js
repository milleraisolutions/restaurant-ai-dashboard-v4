import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim();
    const integrationName = String(body?.integrationName || "").trim();

    if (!email || !integrationName) {
      return NextResponse.json(
        { error: "Email and integration name are required." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("integration_requests").insert([
      {
        email,
        integration_name: integrationName,
      },
    ]);

    if (error) {
      console.error("Supabase insert failed:", error);
      return NextResponse.json(
        { error: "Failed to save integration request." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Integration request API error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}