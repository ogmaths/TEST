import { corsHeaders } from "@shared/cors.ts";

interface SendFormParams {
  clientEmail: string;
  clientId: string;
  workerId: string;
  type: "assessment" | "feedback";
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
      status: 200,
    });
  }

  try {
    const { clientEmail, clientId, workerId, type }: SendFormParams =
      await req.json();

    // Validate required fields
    if (!clientEmail || !clientId || !workerId || !type) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Missing required fields: clientEmail, clientId, workerId, type",
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

    // Construct form link
    const formLink = `https://ogstat.app/forms/${type}?clientId=${clientId}`;

    // Email subject and HTML content
    const subject =
      type === "assessment"
        ? "Please complete your assessment"
        : "We'd love your feedback";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; color: #666; }
          .button { display: inline-block; padding: 12px 24px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${type === "assessment" ? "Assessment Request" : "Feedback Request"}</h1>
          </div>
          <div class="content">
            <h2>Hello,</h2>
            <p>Please complete the following ${type} form:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${formLink}" class="button">Start ${type} form</a>
            </p>
            <p>Thank you,<br/>OGSTAT Team</p>
          </div>
          <div class="footer">
            <p>© 2024 OGSTAT. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email via PICA passthrough to Resend
    const resendResponse = await fetch(
      "https://api.picaos.com/v1/passthrough/email",
      {
        method: "POST",
        headers: {
          "x-pica-secret": Deno.env.get("PICA_SECRET_KEY")!,
          "x-pica-connection-key": Deno.env.get("PICA_RESEND_CONNECTION_KEY")!,
          "x-pica-action-id":
            "conn_mod_def::GC4q4JE4I28::x8Elxo0VRMK1X-uH1C3NeA",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "OGSTAT <donotreply@ogstat.app>",
          to: clientEmail,
          subject,
          html: htmlContent,
          tags: [{ name: "form_type", value: type }],
        }),
      },
    );

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Resend API error:", errorText);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to send email: ${resendResponse.statusText}`,
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
          status: resendResponse.status,
        },
      );
    }

    const resendData = await resendResponse.json();
    const emailId = resendData.id;

    // Log email send event in Supabase via PICA passthrough
    const supabaseProjectRef = Deno.env.get("SUPABASE_PROJECT_ID")!;
    const sqlQuery = `INSERT INTO form_sends (client_id, client_email, form_type, worker_id, sent_timestamp, email_id) VALUES ('${clientId}', '${clientEmail}', '${type}', '${workerId}', NOW(), '${emailId}');`;

    const supabaseResponse = await fetch(
      `https://api.picaos.com/v1/passthrough/v1/projects/${supabaseProjectRef}/database/query`,
      {
        method: "POST",
        headers: {
          "x-pica-secret": Deno.env.get("PICA_SECRET_KEY")!,
          "x-pica-connection-key": Deno.env.get(
            "PICA_SUPABASE_CONNECTION_KEY",
          )!,
          "x-pica-action-id":
            "conn_mod_def::GC40SckOddE::NFFu2-49QLyGsPBdfweitg",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: sqlQuery }),
      },
    );

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text();
      console.error("Supabase logging error:", errorText);
      // Don't fail the whole operation if logging fails
      console.warn("Email sent successfully but failed to log to database");
    }

    return new Response(
      JSON.stringify({
        success: true,
        emailId,
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
    console.error("Error in sendFormToClient:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
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
