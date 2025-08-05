// deno-lint-ignore-file
// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // 1. Kullanıcı kimliğini doğrula
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const authHeader = req.headers.get("authorization");
  const jwt = authHeader?.replace("Bearer ", "");

  if (!jwt) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 2. JWT'den kullanıcıyı al
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser(jwt);

  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 3. Waitlist'e ekle
  try {
    const { error } = await supabaseClient
      .from("pro_waitlist")
      .insert({ user_id: user.id });

    // 5. Unique constraint violation (zaten ekli) ise özel mesaj dön
    if (error && error.code === "23505") {
      return new Response(JSON.stringify({ message: "User is already on the waitlist." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Diğer hatalar
    if (error) {
      throw error;
    }

    // 7. Başarılı ekleme
    return new Response(JSON.stringify({ message: "User successfully added to the waitlist." }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    // 6. Diğer hatalar
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}); 