import React from "react";
import AddInteractionForm from "./AddInteractionForm";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

const AddInteractionPage: React.FC = () => {
  const { clientId } = useParams();
  const [searchParams] = useSearchParams();
  const clientIdFromQuery = searchParams.get("clientId");
  const navigate = useNavigate();

  // Use clientId from URL params first, then from query params
  const effectiveClientId = clientId || clientIdFromQuery;

  return (
    <div className="container mx-auto py-6">
      <AddInteractionForm
        clientId={effectiveClientId || undefined}
        onSuccess={() => {
          // Navigate back to client profile if we have a client ID
          if (effectiveClientId) {
            // Use navigate instead of direct window.location for better SPA behavior
            navigate(`/client/${effectiveClientId}`);
          } else {
            // Otherwise go to clients list
            navigate("/clients");
          }
        }}
      />
    </div>
  );
};

export default AddInteractionPage;
