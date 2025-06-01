import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AIRecommendationEngineProps {
  clientId?: string;
  assessmentData?: any[];
  interactionData?: any[];
  onRecommendationSelect?: (recommendation: string) => void;
}

const AIRecommendationEngine: React.FC<AIRecommendationEngineProps> = ({
  clientId,
  assessmentData = [],
  interactionData = [],
  onRecommendationSelect,
}) => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<
    string | null
  >(null);

  const generateRecommendations = () => {
    setLoading(true);

    // In a real implementation, this would call an AI service
    // For now, we'll simulate AI processing with setTimeout
    setTimeout(() => {
      // Get client data from localStorage
      const clients = JSON.parse(localStorage.getItem("clients") || "[]");
      const client = clients.find((c: any) => c.id === clientId);

      // Generate recommendations based on available data
      const generatedRecommendations = [
        "Schedule a follow-up meeting to discuss progress on financial goals.",
        "Refer client to the community support group for additional peer support.",
        "Provide information about the upcoming job skills workshop.",
        "Connect client with housing resources based on recent assessment needs.",
        "Share mental health resources and check in on emotional wellbeing.",
        "Review client's progress on their personal development plan.",
        "Discuss potential barriers to service engagement and develop solutions.",
      ];

      // If we have assessment data, add more specific recommendations
      if (assessmentData && assessmentData.length > 0) {
        const latestAssessment = [...assessmentData].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )[0];

        if (latestAssessment?.answers?.mental) {
          generatedRecommendations.push(
            "Follow up on mental health support needs identified in recent assessment.",
          );
        }

        if (latestAssessment?.answers?.financial) {
          generatedRecommendations.push(
            "Review financial stability plan and adjust support as needed.",
          );
        }
      }

      // If we have interaction data, add recommendations based on that
      if (interactionData && interactionData.length > 0) {
        const topics = new Set<string>();
        interactionData.forEach((interaction) => {
          if (interaction.topicsCovered) {
            interaction.topicsCovered.forEach((topic) => topics.add(topic));
          }
        });

        if (topics.has("housing")) {
          generatedRecommendations.push(
            "Continue housing support and check on recent housing applications.",
          );
        }

        if (topics.has("employment")) {
          generatedRecommendations.push(
            "Follow up on recent job applications and employment opportunities.",
          );
        }
      }

      // Shuffle and select a subset of recommendations
      const shuffled = [...generatedRecommendations].sort(
        () => 0.5 - Math.random(),
      );
      setRecommendations(shuffled.slice(0, 5));
      setLoading(false);
    }, 1500);
  };

  const handleSelectRecommendation = (recommendation: string) => {
    setSelectedRecommendation(recommendation);
    if (onRecommendationSelect) {
      onRecommendationSelect(recommendation);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Action Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Sparkles className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground max-w-md">
              Generate AI-powered recommendations for next steps with this
              client.
            </p>
            <Button onClick={generateRecommendations} className="mt-4">
              Generate Recommendations
            </Button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">
              Generating recommendations...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div
                key={index}
                className={`p-3 rounded-md flex items-start gap-2 cursor-pointer transition-colors ${selectedRecommendation === recommendation ? "bg-primary/10 border border-primary/30" : "bg-muted/30 hover:bg-muted/50"}`}
                onClick={() => handleSelectRecommendation(recommendation)}
              >
                {selectedRecommendation === recommendation ? (
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                ) : (
                  <Badge className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/20 text-primary flex-shrink-0">
                    {index + 1}
                  </Badge>
                )}
                <p>{recommendation}</p>
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateRecommendations}
              >
                Refresh Recommendations
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendationEngine;
