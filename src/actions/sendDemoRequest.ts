"use server";

interface DemoRequestForm {
  name: string;
  email: string;
  org?: string;
  message?: string;
}

export async function sendDemoRequest(form: DemoRequestForm) {
  const { name, email, org, message } = form;

  const emailBodyHtml = `
    <h2>New Demo Request</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${org ? `<p><strong>Organization:</strong> ${org}</p>` : ""}
    ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
  `;

  const requestBody = {
    from: "OGSTAT <donotreply@ogstat.app>",
    to: "support@ogstat.app",
    subject: `Demo Request from ${name}`,
    html: emailBodyHtml,
    tags: [{ name: "demo-request", value: "ogstat" }],
  };

  const response = await fetch("https://api.picaos.com/v1/passthrough/email", {
    method: "POST",
    headers: {
      "x-pica-secret": process.env.PICA_SECRET_KEY!,
      "x-pica-connection-key": process.env.PICA_RESEND_CONNECTION_KEY!,
      "x-pica-action-id": "conn_mod_def::GC4q4JE4I28::x8Elxo0VRMK1X-uH1C3NeA",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to send email: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data;
}
