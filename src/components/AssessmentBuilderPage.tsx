import React from "react";
import { useNavigate } from "react-router-dom";
import AssessmentBuilder from "./AssessmentBuilder";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Logo from "./Logo";

const AssessmentBuilderPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.close()}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Logo size="md" />
          <h1 className="ml-4 text-3xl font-bold">Assessment Builder</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <AssessmentBuilder />
      </main>
    </div>
  );
};

export default AssessmentBuilderPage;
