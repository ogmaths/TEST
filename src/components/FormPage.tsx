import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

export function FormPage() {
  const { type } = useParams<{ type: "assessment" | "feedback" }>();
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("clientId");
  const workerId = searchParams.get("workerId");

  const [formData, setFormData] = useState({ q1: "", q2: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!clientId || !type) {
      setMessage("Missing client ID or form type.");
      return;
    }

    const { error } = await supabaseClient.from("form_responses").insert({
      client_id: clientId,
      worker_id: workerId,
      type,
      data: formData,
      submitted_at: new Date().toISOString(),
    });

    if (error) {
      console.error(error);
      setMessage("Something went wrong.");
    } else {
      setMessage("Thank you for your submission!");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 capitalize">{type} Form</h1>

      <input
        type="text"
        placeholder="Question 1"
        value={formData.q1}
        onChange={(e) => setFormData({ ...formData, q1: e.target.value })}
        className="block w-full mb-3 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Question 2"
        value={formData.q2}
        onChange={(e) => setFormData({ ...formData, q2: e.target.value })}
        className="block w-full mb-3 p-2 border rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}

export default FormPage;
