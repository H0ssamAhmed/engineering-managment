import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Step 1: Check auth header
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Step 2: Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Step 3: Verify token
    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user: caller },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !caller) {
      const message =
        userError?.message?.toLowerCase().includes("expired") ||
        userError?.message?.toLowerCase().includes("jwt")
          ? "Session expired - please sign in again"
          : "Unauthorized - invalid token";
      return new Response(
        JSON.stringify({
          error: message,
          details: userError?.message,
        }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Step 4: Get user profile

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", caller.id)
      .single();

    if (profileError) {
      return new Response(
        JSON.stringify({
          error: "Could not fetch user profile",
          details: profileError.message,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (profile?.role !== "MANAGER") {
      return new Response(
        JSON.stringify({
          error: "فقط مدير المكتب يمكنه إضافة مستخدمين جديدين",
          yourRole: profile?.role,
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { email, password, name, role } = await req.json();

    if (!email || !password || !name || !role) {
      return new Response(
        JSON.stringify({
          error: "البريد الإلكتروني وكلمة المرور والاسم والدور مطلوبة",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data: authUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role },
      });

    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!authUser?.user?.id) {
      return new Response(JSON.stringify({ error: "فشل إنشاء المستخدم" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: dbUser, error: insertError } = await supabaseAdmin
      .from("users")
      .insert({
        id: authUser.user.id,
        name,
        email,
        role,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ user: dbUser }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("UNEXPECTED ERROR:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "خطأ غير متوقع",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
