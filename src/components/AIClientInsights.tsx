import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertCircle, Loader2 } from "lucide-react";

interface AIClientInsightsProps {
  clientId: string;
  interactionData?: any[];
  assessmentData?: any[];
}

const AIClientInsights: React.FC<AIClientInsightsProps> = ({
  clientId,
  interactionData = [],
  assessmentData = [],
}) => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");

  // Generate insights based on client data
  const generateInsights = () => {
    setLoading(true);

    // In a real implementation, this would call an AI service
    // For now, we'll simulate AI processing with setTimeout
    setTimeout(() => {
      // Get client data from localStorage
      const clients = JSON.parse(localStorage.getItem("clients") || "[]");
      const client = clients.find((c: any) => c.id === clientId);

      // Get interactions from localStorage
      const interactions = JSON.parse(
        localStorage.getItem(`interactions_${clientId}`) || "[]",
      );

      // Get assessments from localStorage
      const allAssessments = JSON.parse(
        localStorage.getItem("assessments") || "[]",
      );
      const clientAssessments = allAssessments.filter(
        (a: any) => a.clientId === clientId,
      );

      // Generate mock insights based on available data
      const mockInsights = {
        summary: generateSummary(client, interactions, clientAssessments),
        trends: generateTrends(interactions, clientAssessments),
        recommendations: generateRecommendations(
          client,
          interactions,
          clientAssessments,
        ),
        riskFactors: generateRiskFactors(
          client,
          interactions,
          clientAssessments,
        ),
      };

      setInsights(mockInsights);
      setLoading(false);
    }, 1500);
  };

  // Generate a summary of client data
  const generateSummary = (
    client: any,
    interactions: any[],
    assessments: any[],
  ) => {
    if (!client) return "No client data available";

    const interactionCount = interactions.length;
    const completedAssessments = assessments.filter(
      (a) => a.status === "completed",
    ).length;
    const lastInteraction = interactions[0];

    let summary = `${client.name} has had ${interactionCount} recorded interactions`;
    summary += ` and completed ${completedAssessments} assessments.`;

    if (lastInteraction) {
      summary += ` The most recent interaction was on ${new Date(lastInteraction.date).toLocaleDateString()}`;
      summary += ` regarding ${lastInteraction.topicsCovered?.join(", ") || "unspecified topics"}.`;
    }

    // Add assessment insights if available
    if (assessments.length > 0) {
      const latestAssessment = assessments.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0];

      if (latestAssessment?.answers) {
        summary += " Based on the latest assessment, ";

        // Look for low scores in the assessment
        let lowScoreAreas = [];
        Object.keys(latestAssessment.answers).forEach((categoryId) => {
          const category = latestAssessment.answers[categoryId];
          let categorySum = 0;
          let categoryCount = 0;

          Object.keys(category).forEach((questionId) => {
            const answer = category[questionId];
            if (typeof answer.value === "number") {
              categorySum += answer.value;
              categoryCount++;
            }
          });

          if (categoryCount > 0) {
            const avgScore = categorySum / categoryCount;
            if (avgScore <= 2.5) {
              lowScoreAreas.push(categoryId.replace(/_/g, " "));
            }
          }
        });

        if (lowScoreAreas.length > 0) {
          summary += ` the client may need additional support in: ${lowScoreAreas.join(", ")}.`;
        } else {
          summary +=
            " the client appears to be progressing well across all areas.";
        }
      }
    }

    return summary;
  };

  // Generate trends based on interactions and assessments
  const generateTrends = (interactions: any[], assessments: any[]) => {
    if (interactions.length === 0 && assessments.length === 0) {
      return "Insufficient data to identify trends.";
    }

    let trends = [];

    // Analyze interaction frequency
    if (interactions.length >= 2) {
      const sortedInteractions = [...interactions].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      const firstDate = new Date(sortedInteractions[0].date);
      const lastDate = new Date(
        sortedInteractions[sortedInteractions.length - 1].date,
      );
      const daysDiff = Math.round(
        (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff > 0) {
        const interactionsPerMonth = (interactions.length / daysDiff) * 30;

        if (interactionsPerMonth < 1) {
          trends.push(
            "Interaction frequency is low (less than once per month).",
          );
        } else if (interactionsPerMonth > 4) {
          trends.push("Interaction frequency is high (more than weekly).");
        }
      }

      // Identify common topics
      const topicCounts = {};
      interactions.forEach((interaction) => {
        if (interaction.topicsCovered) {
          interaction.topicsCovered.forEach((topic) => {
            topicCounts[topic] = (topicCounts[topic] || 0) + 1;
          });
        }
      });

      const sortedTopics = Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      if (sortedTopics.length > 0) {
        trends.push(
          `Most discussed topics: ${sortedTopics.map((t) => t[0]).join(", ")}.`,
        );
      }
    }

    // Analyze assessment progress
    if (assessments.length >= 2) {
      const sortedAssessments = [...assessments]
        .filter((a) => a.status === "completed")
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

      if (sortedAssessments.length >= 2) {
        const firstAssessment = sortedAssessments[0];
        const lastAssessment = sortedAssessments[sortedAssessments.length - 1];

        // Compare average scores if available
        if (firstAssessment.answers && lastAssessment.answers) {
          let firstAvg = calculateAssessmentAverage(firstAssessment);
          let lastAvg = calculateAssessmentAverage(lastAssessment);

          if (firstAvg && lastAvg) {
            const diff = lastAvg - firstAvg;
            if (diff > 0.5) {
              trends.push(
                `Assessment scores show improvement (${firstAvg.toFixed(1)} → ${lastAvg.toFixed(1)}).`,
              );
            } else if (diff < -0.5) {
              trends.push(
                `Assessment scores show decline (${firstAvg.toFixed(1)} → ${lastAvg.toFixed(1)}).`,
              );
            } else {
              trends.push(
                `Assessment scores remain stable (${lastAvg.toFixed(1)}).`,
              );
            }
          }
        }
      }
    }

    return trends.length > 0
      ? trends
      : "Insufficient data to identify clear trends.";
  };

  // Generate recommendations based on client data
  const generateRecommendations = (
    client: any,
    interactions: any[],
    assessments: any[],
  ) => {
    let recommendations = [];

    // Check interaction frequency
    if (interactions.length === 0) {
      recommendations.push(
        "Schedule an initial meeting with the client to establish rapport.",
      );
    } else {
      const sortedInteractions = [...interactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      const lastInteractionDate = new Date(sortedInteractions[0].date);
      const daysSinceLastInteraction = Math.round(
        (new Date().getTime() - lastInteractionDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (daysSinceLastInteraction > 30) {
        recommendations.push(
          `Follow up with client - ${daysSinceLastInteraction} days since last interaction.`,
        );
      }
    }

    // Check assessment completion
    if (assessments.length === 0) {
      recommendations.push(
        "Complete an introduction assessment to establish baseline needs.",
      );
    } else {
      const completedAssessments = assessments.filter(
        (a) => a.status === "completed",
      );
      const hasIntro = completedAssessments.some((a) =>
        a.type.toLowerCase().includes("intro"),
      );
      const hasProgress = completedAssessments.some((a) =>
        a.type.toLowerCase().includes("progress"),
      );
      const hasExit = completedAssessments.some((a) =>
        a.type.toLowerCase().includes("exit"),
      );

      if (!hasIntro) {
        recommendations.push(
          "Complete an introduction assessment to establish baseline needs.",
        );
      } else if (!hasProgress && hasIntro) {
        recommendations.push(
          "Schedule a progress assessment to evaluate ongoing support effectiveness.",
        );
      }

      // Check for low scores in latest assessment
      const latestAssessment = completedAssessments.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0];

      if (latestAssessment?.answers) {
        Object.keys(latestAssessment.answers).forEach((categoryId) => {
          const category = latestAssessment.answers[categoryId];
          let categorySum = 0;
          let categoryCount = 0;

          Object.keys(category).forEach((questionId) => {
            const answer = category[questionId];
            if (typeof answer.value === "number") {
              categorySum += answer.value;
              categoryCount++;
            }
          });

          if (categoryCount > 0) {
            const avgScore = categorySum / categoryCount;
            if (avgScore <= 2) {
              recommendations.push(
                `Provide additional support for ${categoryId.replace(/_/g, " ")} (low assessment score).`,
              );
            }
          }
        });
      }
    }

    // Add general recommendations if we don't have many specific ones
    if (recommendations.length < 2) {
      recommendations.push(
        "Consider scheduling a follow-up meeting to discuss progress.",
      );
      recommendations.push(
        "Review client goals and adjust support plan as needed.",
      );
    }

    return recommendations;
  };

  // Generate risk factors based on client data
  const generateRiskFactors = (
    client: any,
    interactions: any[],
    assessments: any[],
  ) => {
    let riskFactors = [];
    let riskLevel = "low";

    // Check for engagement risks
    if (interactions.length === 0) {
      riskFactors.push("No recorded interactions - client engagement unknown.");
      riskLevel = "medium";
    } else {
      const sortedInteractions = [...interactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      const lastInteractionDate = new Date(sortedInteractions[0].date);
      const daysSinceLastInteraction = Math.round(
        (new Date().getTime() - lastInteractionDate.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (daysSinceLastInteraction > 60) {
        riskFactors.push(
          `No recent engagement - ${daysSinceLastInteraction} days since last interaction.`,
        );
        riskLevel = "high";
      } else if (daysSinceLastInteraction > 30) {
        riskFactors.push(
          `Limited recent engagement - ${daysSinceLastInteraction} days since last interaction.`,
        );
        riskLevel = "medium";
      }
    }

    // Check assessment risks
    if (assessments.length > 0) {
      const completedAssessments = assessments.filter(
        (a) => a.status === "completed",
      );
      const latestAssessment = completedAssessments.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0];

      if (latestAssessment?.answers) {
        // Check for very low scores in critical areas
        let criticalLowScores = [];

        // Mental health is considered a critical area
        if (latestAssessment.answers.mental) {
          let mentalSum = 0;
          let mentalCount = 0;

          Object.keys(latestAssessment.answers.mental).forEach((questionId) => {
            const answer = latestAssessment.answers.mental[questionId];
            if (typeof answer.value === "number") {
              mentalSum += answer.value;
              mentalCount++;
            }
          });

          if (mentalCount > 0) {
            const avgScore = mentalSum / mentalCount;
            if (avgScore <= 2) {
              criticalLowScores.push("mental health");
              riskLevel = "high";
            }
          }
        }

        if (criticalLowScores.length > 0) {
          riskFactors.push(
            `Critical low assessment scores in: ${criticalLowScores.join(", ")}.`,
          );
        }
      }
    } else {
      riskFactors.push(
        "No assessments completed - unable to evaluate needs and risks.",
      );
      riskLevel = "medium";
    }

    // If we don't have any specific risk factors, add a general statement
    if (riskFactors.length === 0) {
      riskFactors.push(
        "No significant risk factors identified based on available data.",
      );
    }

    return { factors: riskFactors, level: riskLevel };
  };

  // Helper function to calculate assessment average
  const calculateAssessmentAverage = (assessment: any) => {
    if (!assessment.answers) return null;

    let totalScore = 0;
    let totalQuestions = 0;

    Object.keys(assessment.answers).forEach((categoryId) => {
      const category = assessment.answers[categoryId];

      Object.keys(category).forEach((questionId) => {
        const answer = category[questionId];
        if (typeof answer.value === "number") {
          totalScore += answer.value;
          totalQuestions++;
        }
      });
    });

    return totalQuestions > 0 ? totalScore / totalQuestions : null;
  };

  // Get risk level badge color
  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "bg-green-100 text-green-800 hover:bg-green-200";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Client Insights
        </CardTitle>
        <Button
          onClick={generateInsights}
          disabled={loading}
          variant="outline"
          size="sm"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
            </>
          ) : (
            <>Generate Insights</>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {!insights && !loading && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">AI-Powered Client Insights</h3>
            <p className="text-muted-foreground max-w-md mt-2">
              Generate AI-powered insights based on client interactions,
              assessments, and history.
            </p>
            <Button onClick={generateInsights} className="mt-4">
              Generate Insights
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">
              Analyzing client data...
            </p>
          </div>
        )}

        {insights && !loading && (
          <div className="space-y-4">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="recommendations">
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="risks">Risk Factors</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="mt-4">
                <div className="p-4 bg-muted/30 rounded-md">
                  <p>{insights.summary}</p>
                </div>
              </TabsContent>

              <TabsContent value="trends" className="mt-4">
                <div className="space-y-2">
                  {Array.isArray(insights.trends) ? (
                    insights.trends.map((trend, index) => (
                      <div key={index} className="p-3 bg-muted/30 rounded-md">
                        <p>{trend}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-muted/30 rounded-md">
                      <p>{insights.trends}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="mt-4">
                <div className="space-y-2">
                  {insights.recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-start gap-2"
                    >
                      <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-1 mt-0.5">
                        <span className="text-blue-800 dark:text-blue-200 text-xs font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <p>{recommendation}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="risks" className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      Overall Risk Level:
                    </span>
                    <Badge
                      className={getRiskBadgeColor(insights.riskFactors.level)}
                    >
                      {insights.riskFactors.level.charAt(0).toUpperCase() +
                        insights.riskFactors.level.slice(1)}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {insights.riskFactors.factors.map((factor, index) => (
                      <div
                        key={index}
                        className="p-3 bg-muted/30 rounded-md flex items-start gap-2"
                      >
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p>{factor}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIClientInsights;
