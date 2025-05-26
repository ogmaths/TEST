import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`flex items-center gap-1 ${className}`}
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
};

export default BackButton;
