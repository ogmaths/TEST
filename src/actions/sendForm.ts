import { supabase } from "@/lib/supabase";

interface SendFormParams {
  clientEmail: string;
  clientId: string;
  workerId: string;
  type: "assessment" | "feedback";
}

interface SendFormResponse {
  success: boolean;
  error?: string;
  emailId?: string;
}

export async function sendFormToClient(
  params: SendFormParams,
): Promise<SendFormResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-send-form-to-client",
      {
        body: params,
      },
    );

    if (error) {
      console.error("Edge function error:", error);
      return { success: false, error: error.message };
    }

    return data;
  } catch (error) {
    console.error("Send form error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

interface SubmitFormResponseParams {
  clientId: string;
  workerId?: string;
  type: "assessment" | "feedback";
  data: any;
}

interface SubmitFormResponseResult {
  success: boolean;
  error?: string;
}

export async function submitFormResponse({
  clientId,
  workerId,
  type,
  data,
}: SubmitFormResponseParams): Promise<SubmitFormResponseResult> {
  try {
    const { error } = await supabase.from("form_responses").insert({
      client_id: clientId,
      worker_id: workerId,
      type,
      data,
      submitted_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error inserting form response:", error);
      return { success: false, error: error.message };
    }

    // Optional: update CRM progress tracker
    if (type === "assessment") {
      const { error: updateError } = await supabase
        .from("clients")
        .update({ last_assessment: new Date().toISOString() })
        .eq("id", clientId);

      if (updateError) {
        console.error("Error updating client last_assessment:", updateError);
        // Don't fail the whole operation if this update fails
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Submit form response error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getWorkerResponses(workerId: string) {
  const { data, error } = await supabase
    .from("form_responses")
    .select("*")
    .eq("worker_id", workerId)
    .order("submitted_at", { ascending: false });

  return { data, error };
}
