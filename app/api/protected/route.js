import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { userId, feature } = await req.json();

    if (!userId) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    // ✅ Create client INSIDE function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return Response.json(
        { error: "Missing Supabase config" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: user, error } = await supabase
      .from("users")
      .select("plan")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const plan = user.plan;

    // 🔐 ACCESS LOGIC
    if (feature === "growth" && plan === "starter") {
      return Response.json({ error: "Upgrade required" }, { status: 403 });
    }

    if (feature === "pro" && plan !== "pro") {
      return Response.json({ error: "Upgrade required" }, { status: 403 });
    }

    return Response.json({ success: true });

  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}