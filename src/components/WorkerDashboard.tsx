"use client";

import { getWorkerResponses } from "@/actions/sendForm";
import { useEffect, useState } from "react";

interface FormResponse {
  id: string;
  client_id: string;
  type: "assessment" | "feedback";
  submitted_at: string;
  data: any;
}

export default function WorkerDashboard({ workerId }: { workerId: string }) {
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResponses() {
      try {
        setLoading(true);
        const { data, error } = await getWorkerResponses(workerId);

        if (error) {
          setError(error.message);
        } else {
          setResponses(data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (workerId) {
      fetchResponses();
    }
  }, [workerId]);

  if (loading) {
    return <div className="p-4">Loading responses...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">Form Responses</h1>
      {responses.length === 0 ? (
        <p className="text-gray-500">No responses found for this worker.</p>
      ) : (
        responses.map((res) => (
          <div key={res.id} className="border p-4 mb-3 rounded shadow">
            <div className="mb-2">
              <span className="font-semibold">Client:</span> {res.client_id}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Type:</span>
              <span
                className={`ml-2 px-2 py-1 rounded text-sm ${
                  res.type === "assessment"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {res.type}
              </span>
            </div>
            <div className="mb-3">
              <span className="font-semibold">Submitted:</span>{" "}
              {new Date(res.submitted_at).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Response Data:</span>
              <pre className="bg-gray-100 p-2 rounded mt-2">
                {JSON.stringify(res.data, null, 2)}
              </pre>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
