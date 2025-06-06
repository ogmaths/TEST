import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    const { to, subject, html, from } = await req.json();

    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: to, subject, html",
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          status: 400,
        },
      );
    }

    // Use PICA passthrough endpoint for Resend
    const response = await fetch(
      "https://api.pica.dev/v1/passthrough/resend/emails",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("PICA_SECRET_KEY")}`,
          "X-Connection-Key": Deno.env.get("PICA_RESEND_CONNECTION_KEY"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: from || "info@ogstat.app",
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Resend API error:", result);
      return new Response(
        JSON.stringify({
          success: false,
          error: result.message || "Failed to send email",
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          status: response.status,
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        result,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      },
    );
  }
});
