import { supabase } from "@/lib/supabase";
import { createFormEmailTemplate } from "@/utils/emailTemplates";

interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

interface EmailResponse {
  success: boolean;
  result?: any;
  error?: string;
}

interface SendFormToClientParams {
  clientEmail: string;
  clientId: string;
  type: "assessment" | "feedback";
  workerId: string;
}

export const useEmailService = () => {
  const sendEmail = async (emailData: EmailData): Promise<EmailResponse> => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-send-email",
        {
          body: emailData,
        },
      );

      if (error) {
        console.error("Edge function error:", error);
        return { success: false, error: error.message };
      }

      return data;
    } catch (error) {
      console.error("Email service error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  const sendFormToClient = async ({
    clientEmail,
    clientId,
    type,
    workerId,
  }: SendFormToClientParams): Promise<EmailResponse> => {
    try {
      const formLink = `https://ogstat.app/forms/${type}?clientId=${clientId}`;

      const subject =
        type === "assessment"
          ? "Please complete your assessment"
          : "We'd love your feedback";

      const html = createFormEmailTemplate(type, formLink);

      // Send the email
      const emailResult = await sendEmail({
        to: clientEmail,
        subject,
        html,
        from: "OGSTAT <donotreply@ogstat.app>",
      });

      if (!emailResult.success) {
        return emailResult;
      }

      // Log the email send in Supabase
      const { error: logError } = await supabase.from("form_sends").insert({
        client_id: clientId,
        client_email: clientEmail,
        form_type: type,
        worker_id: workerId,
        sent_at: new Date().toISOString(),
        email_id: emailResult.result?.id,
      });

      if (logError) {
        console.error("Error logging email send:", logError);
        // Don't fail the whole operation if logging fails
      }

      return emailResult;
    } catch (error) {
      console.error("Error sending form to client:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  };

  return { sendEmail, sendFormToClient };
};
