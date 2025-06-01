import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface AIAssessmentAnalyzerProps {
  clientId: string;
  assessments?: any[];
}

const AIAssessmentAnalyzer: React.FC<AIAssessmentAnalyzerProps> = ({
  clientId,
  assessments: propAssessments,
}) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [assessments, setAssessments] = useState<any[]>([]);

  // Load assessments if not provided as props
  useEffect(() => {
    if (propAssessments) {
      setAssessments(propAssessments);
    } else {
      // Get assessments from localStorage
      const savedAssessments = JSON.parse(
        localStorage.getItem("assessments") || "[]",
      );
      const clientAssessments = savedAssessments.filter(
        (a: any) => a.clientId === clientId && a.status === "completed",
      );
      setAssessments(clientAssessments);
    }
  }, [clientId, propAssessments]);

  const analyzeAssessments = () => {
    setLoading(true);

    // In a real implementation, this would call an AI service
    // For now, we'll simulate AI processing with setTimeout
    setTimeout(() => {
      if (assessments.length === 0) {
        setAnalysis({
          message: "No completed assessments found for analysis.",
          categories: [],
          trends: [],
        });
        setLoading(false);
        return;
      }

      // Sort assessments by date
      const sortedAssessments = [...assessments].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      // Extract categories from all assessments
      const allCategories = new Set<string>();
      sortedAssessments.forEach((assessment) => {
        if (assessment.answers) {
          Object.keys(assessment.answers).forEach((category) => {
            allCategories.add(category);
          });
        }
      });

      // Calculate scores for each category across assessments
      const categoryScores = {};
      allCategories.forEach((category) => {
        categoryScores[category] = [];

        sortedAssessments.forEach((assessment) => {
          if (assessment.answers && assessment.answers[category]) {
            const categoryAnswers = assessment.answers[category];
            let sum = 0;
            let count = 0;

            Object.keys(categoryAnswers).forEach((questionId) => {
              const answer = categoryAnswers[questionId];
              if (typeof answer.value === "number") {
                sum += answer.value;
                count++;
              }
            });

            if (count > 0) {
              categoryScores[category].push({
                date: assessment.date,
                score: sum / count,
                assessmentType: assessment.type,
              });
            }
          }
        });
      });

      // Calculate trends for each category
      const categoryTrends = {};
      Object.keys(categoryScores).forEach((category) => {
        const scores = categoryScores[category];
        if (scores.length >= 2) {
          const firstScore = scores[0].score;
          const lastScore = scores[scores.length - 1].score;
          const difference = lastScore - firstScore;

          categoryTrends[category] = {
            trend:
              difference > 0.5
                ? "improving"
                : difference < -0.5
                  ? "declining"
                  : "stable",
            difference: difference,
            firstScore,
            lastScore,
            firstDate: scores[0].date,
            lastDate: scores[scores.length - 1].date,
          };
        } else if (scores.length === 1) {
          categoryTrends[category] = {
            trend: "baseline",
            firstScore: scores[0].score,
            lastScore: scores[0].score,
            firstDate: scores[0].date,
            lastDate: scores[0].date,
          };
        }
      });

      // Format categories for display
      const formattedCategories = Object.keys(categoryTrends).map(
        (category) => ({
          name: category.replace(/_/g, " "),
          id: category,
          ...categoryTrends[category],
          scores: categoryScores[category],
        }),
      );

      // Generate overall trends and insights
      const trends = [];

      // Count improving, declining, and stable categories
      const improving = formattedCategories.filter(
        (c) => c.trend === "improving",
      ).length;
      const declining = formattedCategories.filter(
        (c) => c.trend === "declining",
      ).length;
      const stable = formattedCategories.filter(
        (c) => c.trend === "stable",
      ).length;
      const baseline = formattedCategories.filter(
        (c) => c.trend === "baseline",
      ).length;

      if (improving > declining && improving > 0) {
        trends.push(
          `Client is showing improvement in ${improving} out of ${formattedCategories.length} areas.`,
        );
      } else if (declining > improving && declining > 0) {
        trends.push(
          `Client is showing decline in ${declining} out of ${formattedCategories.length} areas.`,
        );
      } else if (stable > 0) {
        trends.push(
          `Client is showing stable scores in ${stable} out of ${formattedCategories.length} areas.`,
        );
      }

      if (baseline > 0) {
        trends.push(
          `${baseline} areas have only baseline measurements and need follow-up assessments.`,
        );
      }

      // Identify areas with lowest scores
      const lowestScores = formattedCategories
        .filter((c) => c.lastScore !== undefined)
        .sort((a, b) => a.lastScore - b.lastScore)
        .slice(0, 2);

      if (lowestScores.length > 0) {
        trends.push(
          `Areas needing most attention: ${lowestScores.map((c) => c.name).join(", ")}.`,
        );
      }

      // Identify areas with highest scores
      const highestScores = formattedCategories
        .filter((c) => c.lastScore !== undefined)
        .sort((a, b) => b.lastScore - a.lastScore)
        .slice(0, 2);

      if (highestScores.length > 0) {
        trends.push(
          `Client's strongest areas: ${highestScores.map((c) => c.name).join(", ")}.`,
        );
      }

      setAnalysis({
        message:
          sortedAssessments.length > 1
            ? `Analysis based on ${sortedAssessments.length} assessments from ${new Date(sortedAssessments[0].date).toLocaleDateString()} to ${new Date(sortedAssessments[sortedAssessments.length - 1].date).toLocaleDateString()}.`
            : `Analysis based on 1 assessment from ${new Date(sortedAssessments[0].date).toLocaleDateString()}.`,
        categories: formattedCategories,
        trends,
      });

      setLoading(false);
    }, 1500);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Assessment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!analysis && !loading ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Sparkles className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground max-w-md">
              Generate AI-powered analysis of client assessment data to identify
              trends and insights.
            </p>
            <Button
              onClick={analyzeAssessments}
              className="mt-4"
              disabled={assessments.length === 0}
            >
              {assessments.length === 0
                ? "No Assessments Available"
                : "Analyze Assessments"}
            </Button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">
              Analyzing assessment data...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">{analysis.message}</p>

            {/* Trends and Insights */}
            {analysis.trends.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Key Insights</h4>
                <ul className="space-y-1">
                  {analysis.trends.map((trend, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{trend}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Category Analysis */}
            {analysis.categories.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Category Analysis</h4>

                {analysis.categories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">
                          {category.name}
                        </span>
                        {category.trend !== "baseline" &&
                          getTrendIcon(category.trend)}
                      </div>
                      <span className="text-sm">
                        {category.trend === "baseline"
                          ? `Baseline: ${category.lastScore.toFixed(1)}/5`
                          : `${category.firstScore.toFixed(1)} → ${category.lastScore.toFixed(1)}`}
                      </span>
                    </div>

                    <Progress
                      value={category.lastScore * 20}
                      className={`h-2 ${category.trend === "improving" ? "bg-green-100" : category.trend === "declining" ? "bg-red-100" : ""}`}
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={analyzeAssessments}>
                Refresh Analysis
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssessmentAnalyzer;
