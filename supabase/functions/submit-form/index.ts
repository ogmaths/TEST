import { corsHeaders } from "@shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const body = await req.json();
    const { clientId, workerId, type, data } = body;

    // Validate required fields
    if (!clientId || !type || !data) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Missing required fields: clientId, type, and data are required",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Insert form response into database
    const { error } = await supabase.from("form_responses").insert({
      client_id: clientId,
      worker_id: workerId,
      type,
      data,
      submitted_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Form submit error:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : "Invalid request",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
