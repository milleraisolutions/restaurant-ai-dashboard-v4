import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
  .from("client_data_uploads")
  .select("*")
  .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ CLIENT UPLOAD FETCH ERROR:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500 }
      );
    }

    console.log("✅ CLIENT UPLOADS RETURNED:", data?.length);

    return new Response(JSON.stringify(data || []), {
      status: 200,
    });
  } catch (err) {
    console.error("❌ SERVER ERROR:", err);

    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}