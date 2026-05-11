import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("custom_plan_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return Response.json([], { status: 500 });
    }

    return Response.json(data);
  } catch {
    return Response.json([]);
  }
}