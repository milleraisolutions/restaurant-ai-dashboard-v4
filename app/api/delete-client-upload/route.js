import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase server environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST(req) {
  try {
    const body = await req.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json(
        { error: "Upload id is required." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("client_data_uploads")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete failed:", error);
      return NextResponse.json(
        {
          error: error.message || "Failed to delete upload.",
          details: error.details || null,
          hint: error.hint || null,
          code: error.code || null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete route failed:", error);
    return NextResponse.json(
      { error: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}