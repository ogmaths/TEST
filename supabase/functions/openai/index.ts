// This Edge Function has been removed as part of the AI Assistant functionality removal

import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  return new Response(
    JSON.stringify({
      message:
        "This endpoint has been deprecated. AI Assistant functionality has been removed.",
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 410, // Gone status code
    },
  );
});
