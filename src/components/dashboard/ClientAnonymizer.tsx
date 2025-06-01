import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Download, RefreshCw } from "lucide-react";

interface ClientAnonymizerProps {
  onAnonymizationChange?: (isAnonymized: boolean) => void;
}

const ClientAnonymizer: React.FC<ClientAnonymizerProps> = ({
  onAnonymizationChange,
}) => {
  const [isAnonymized, setIsAnonymized] = useState(false);
  const [anonymizationLevel, setAnonymizationLevel] = useState<
    "partial" | "full"
  >("partial");

  const handleAnonymizationChange = (checked: boolean) => {
    setIsAnonymized(checked);
    if (onAnonymizationChange) {
      onAnonymizationChange(checked);
    }
  };

  const handleLevelChange = (level: "partial" | "full") => {
    setAnonymizationLevel(level);
  };

  const handleExportAnonymizedData = () => {
    // In a real implementation, this would trigger an API call to export anonymized data
    console.log("Exporting anonymized data with level:", anonymizationLevel);
    // Mock export functionality
    const mockData = {
      clients: [
        { id: "C001", metrics: { assessments: 3, sessions: 5 } },
        { id: "C002", metrics: { assessments: 2, sessions: 4 } },
        { id: "C003", metrics: { assessments: 5, sessions: 8 } },
      ],
      anonymizationLevel,
      exportDate: new Date().toISOString(),
    };

    // Create a downloadable JSON file
    const dataStr = JSON.stringify(mockData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `anonymized_client_data_${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleRegenerateClientIds = () => {
    // In a real implementation, this would trigger an API call to regenerate client IDs
    console.log("Regenerating client IDs");
    // Show a success message or notification
    alert("Client IDs have been regenerated for reporting purposes");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Client Anonymization</span>
          {isAnonymized ? (
            <EyeOff className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Eye className="h-5 w-5 text-muted-foreground" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="anonymize-clients"
            checked={isAnonymized}
            onCheckedChange={handleAnonymizationChange}
          />
          <Label htmlFor="anonymize-clients">
            {isAnonymized
              ? "Client data is anonymized"
              : "Show actual client data"}
          </Label>
        </div>

        {isAnonymized && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-4">
              <Button
                variant={
                  anonymizationLevel === "partial" ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleLevelChange("partial")}
              >
                Partial (IDs only)
              </Button>
              <Button
                variant={anonymizationLevel === "full" ? "default" : "outline"}
                size="sm"
                onClick={() => handleLevelChange("full")}
              >
                Full (All personal data)
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              {anonymizationLevel === "partial"
                ? "Partial anonymization replaces client names with ID numbers while preserving other data."
                : "Full anonymization removes all personally identifiable information from reports and visualizations."}
            </div>

            <div className="flex flex-col space-y-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleExportAnonymizedData}
              >
                <Download className="h-4 w-4" />
                Export Anonymized Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleRegenerateClientIds}
              >
                <RefreshCw className="h-4 w-4" />
                Regenerate Client IDs
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientAnonymizer;
