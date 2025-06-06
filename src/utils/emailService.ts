import { supabaseClient } from "@/lib/supabaseClient";
import { generateAssessmentPDF } from "./pdfGenerator";

/**
 * Sends an assessment to a client via email
 * @param clientEmail The client's email address
 * @param assessment The assessment data
 * @param includeResults Whether to include assessment results
 * @returns Promise that resolves when email is sent
 */
export const emailAssessmentToClient = async (
  clientEmail: string,
  assessment: any,
  includeResults: boolean = false,
): Promise<{ success: boolean; message: string }> => {
  try {
    // Generate PDF if results should be included
    let pdfBlob = null;
    if (includeResults && assessment.status === "completed") {
      // This will trigger the PDF download in the browser
      // In a real implementation, we would generate the PDF on the server
      // and attach it to the email
      await generateAssessmentPDF(assessment);
    }

    // In a real implementation, this would call a Supabase Edge Function
    // that would send the email with the PDF attachment
    // For now, we'll simulate the email sending

    console.log(
      `Email would be sent to ${clientEmail} with assessment ${assessment.id}`,
    );

    // Return success response
    return {
      success: true,
      message: `Assessment ${includeResults ? "and results " : ""}successfully sent to ${clientEmail}`,
    };
  } catch (error) {
    console.error("Error sending assessment email:", error);
    return {
      success: false,
      message: `Failed to send email: ${error.message}`,
    };
  }
};

/**
 * Sends a feedback form to a client via email
 * @param clientEmail The client's email address
 * @param clientName The client's name
 * @param eventId Optional event ID if feedback is for an event
 * @param feedbackForm Optional feedback form data
 * @returns Promise that resolves when email is sent
 */
export const sendFeedbackFormEmail = async (
  clientEmail: string,
  clientName: string,
  eventId?: string,
  feedbackForm?: any,
): Promise<{ success: boolean; message: string }> => {
  try {
    // In a real implementation, this would call a Supabase Edge Function
    // that would send the email with a link to a feedback form
    // The feedback form structure would be included in the email template

    console.log(
      `Feedback form would be sent to ${clientName} (${clientEmail})`,
    );
    if (feedbackForm) {
      console.log(`Form details:`, {
        title: feedbackForm.title,
        description: feedbackForm.description,
        questionCount: feedbackForm.questions?.length || 0,
      });
    }

    // Simulate potential email delivery issues for demo purposes
    const deliverySuccess = Math.random() > 0.1; // 90% success rate

    if (!deliverySuccess) {
      return {
        success: false,
        message: `Failed to deliver feedback form to ${clientName} (${clientEmail})`,
      };
    }

    // Return success response
    return {
      success: true,
      message: `Custom feedback form successfully sent to ${clientName} (${clientEmail})`,
    };
  } catch (error) {
    console.error("Error sending feedback form email:", error);
    return {
      success: false,
      message: `Failed to send feedback form: ${error.message}`,
    };
  }
};

/**
 * Generates a shareable link for a feedback form
 * @param feedbackForm The feedback form data
 * @param eventId The event ID
 * @returns A shareable URL for the feedback form
 */
export const generateFeedbackFormLink = (
  feedbackForm: any,
  eventId: string,
): string => {
  // In a real implementation, this would generate a unique URL
  // that displays the feedback form for clients to fill out
  const baseUrl = window.location.origin;
  const formId = feedbackForm.id || `form-${eventId}`;
  return `${baseUrl}/feedback/${formId}`;
};

/**
 * Saves feedback form responses
 * @param formId The feedback form ID
 * @param responses The user's responses
 * @param clientInfo Optional client information
 * @returns Promise that resolves when responses are saved
 */
export const saveFeedbackResponses = async (
  formId: string,
  responses: Record<string, any>,
  clientInfo?: { name: string; email: string },
): Promise<{ success: boolean; message: string }> => {
  try {
    // In a real implementation, this would save to Supabase
    const responseData = {
      formId,
      responses,
      clientInfo,
      submittedAt: new Date().toISOString(),
    };

    // Save to localStorage for demo purposes
    const existingResponses = JSON.parse(
      localStorage.getItem("feedbackResponses") || "[]",
    );
    existingResponses.push(responseData);
    localStorage.setItem(
      "feedbackResponses",
      JSON.stringify(existingResponses),
    );

    console.log("Feedback responses saved:", responseData);

    return {
      success: true,
      message: "Feedback submitted successfully. Thank you for your input!",
    };
  } catch (error) {
    console.error("Error saving feedback responses:", error);
    return {
      success: false,
      message: `Failed to save feedback: ${error.message}`,
    };
  }
};
