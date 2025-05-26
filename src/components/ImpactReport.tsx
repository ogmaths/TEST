import React, { useRef, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, FileDown, Printer, Share2 } from "lucide-react";
import html2pdf from "html2pdf.js";

interface CategoryScore {
  category: string;
  initialScore: number;
  currentScore: number;
  maxScore: number;
}

interface JourneyMetric {
  metricName: string;
  value: number;
  target: number;
  unit: string;
}

interface ImpactReportProps {
  clientId?: string;
  clientName?: string;
  assessmentDate?: string;
  categories?: {
    category: string;
    initialScore: number;
    currentScore: number;
    maxScore: number;
  }[];
  overallInitialScore?: number;
  overallCurrentScore?: number;
  maxPossibleScore?: number;
  notes?: string;
  recommendations?: string;
  journeyMetrics?: JourneyMetric[];
}

const ImpactReport = ({
  clientId = "1",
  clientName = "Jane Smith",
  assessmentDate = new Date().toLocaleDateString(),
  categories = [
    {
      category: "Financial Wellbeing",
      initialScore: 3,
      currentScore: 7,
      maxScore: 10,
    },
    {
      category: "Mental Health",
      initialScore: 4,
      currentScore: 8,
      maxScore: 10,
    },
    {
      category: "Physical Health",
      initialScore: 5,
      currentScore: 7,
      maxScore: 10,
    },
    {
      category: "Information Access",
      initialScore: 2,
      currentScore: 9,
      maxScore: 10,
    },
    {
      category: "Local Support Network",
      initialScore: 3,
      currentScore: 8,
      maxScore: 10,
    },
    {
      category: "Emotional Wellbeing",
      initialScore: 4,
      currentScore: 7,
      maxScore: 10,
    },
  ],
  overallInitialScore = 21,
  overallCurrentScore = 46,
  maxPossibleScore = 60,
  notes = "",
  recommendations = "",
  journeyMetrics,
}: ImpactReportProps) => {
  // Load assessment data from localStorage
  const [loadedNotes, setLoadedNotes] = React.useState("");
  const [loadedRecommendations, setLoadedRecommendations] = React.useState("");

  React.useEffect(() => {
    const savedAssessments = JSON.parse(
      localStorage.getItem("assessments") || "[]",
    );
    const clientAssessments = savedAssessments.filter(
      (a: any) => a.clientId === clientId,
    );

    if (clientAssessments.length > 0) {
      // Find the most recent assessment
      const latestAssessment = clientAssessments.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0];

      if (latestAssessment.overallNotes || latestAssessment.recommendations) {
        setLoadedNotes(latestAssessment.overallNotes || "");
        setLoadedRecommendations(latestAssessment.recommendations || "");
      }
    }
  }, [clientId]);

  // Calculate metrics based on client events if not provided
  const calculatedMetrics = React.useMemo(() => {
    if (journeyMetrics) return journeyMetrics;

    // Get events from localStorage
    const allEvents = JSON.parse(localStorage.getItem("events") || "[]");

    // Get client attendance records
    const clientAttendance = allEvents.filter(
      (event: any) => event.attendees && event.attendees.includes(clientName),
    );

    const workshopsAttended = clientAttendance.filter(
      (event: any) => event.type === "workshop",
    ).length;

    const supportGroups = clientAttendance.filter(
      (event: any) => event.type === "support",
    ).length;

    return [
      {
        metricName: "Workshops Attended",
        value: workshopsAttended || 8, // Fallback to default if no data
        target: 10,
        unit: "sessions",
      },
      {
        metricName: "Support Group Participation",
        value: supportGroups || 6,
        target: 8,
        unit: "meetings",
      },
      {
        metricName: "Resource Utilization",
        value: 85,
        target: 100,
        unit: "%",
      },
      {
        metricName: "Goal Completion",
        value: 7,
        target: 10,
        unit: "goals",
      },
      {
        metricName: "Time in Program",
        value: 6,
        target: 12,
        unit: "months",
      },
    ];
  }, [clientName, journeyMetrics]);

  // Calculate overall improvement percentage
  const improvementPercentage = Math.round(
    ((overallCurrentScore - overallInitialScore) / overallInitialScore) * 100,
  );

  // Calculate overall score as percentage of maximum
  const initialPercentage = Math.round(
    (overallInitialScore / maxPossibleScore) * 100,
  );
  const currentPercentage = Math.round(
    (overallCurrentScore / maxPossibleScore) * 100,
  );

  // Reference for PDF export
  const reportRef = useRef<HTMLDivElement>(null);

  // Function to download the report as PDF
  // This captures the entire report (all tabs) in a single PDF document
  const downloadPDF = () => {
    if (reportRef.current) {
      const element = reportRef.current;
      const opt = {
        margin: 10,
        filename: `${clientName.replace(/\s+/g, "_")}_Impact_Report_${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        // Enable page breaks for better formatting in the PDF
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      // Make sure all SVG elements are properly rendered before capturing
      setTimeout(() => {
        // This captures the entire div referenced by reportRef, which contains all sections
        // regardless of which tab is currently active in the UI
        html2pdf().set(opt).from(element).save();
      }, 500);
    }
  };

  return (
    <div
      ref={reportRef}
      className="bg-white p-6 rounded-xl shadow-sm w-full max-w-5xl mx-auto print:w-full print:max-w-none print:mx-0 print:p-4"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Impact Report</h1>
          <p className="text-gray-500">
            Client: {clientName} | Assessment Date: {assessmentDate}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={downloadPDF}>
            <FileDown className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Overall Improvement</CardTitle>
            <CardDescription>
              From initial to current assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-center">
              <span className="text-4xl font-bold text-green-600">
                +{improvementPercentage}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Initial Assessment</CardTitle>
            <CardDescription>
              Overall score: {overallInitialScore}/{maxPossibleScore}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={initialPercentage} className="h-3" />
            <p className="text-right mt-1 text-sm text-gray-500">
              {initialPercentage}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Assessment</CardTitle>
            <CardDescription>
              Overall score: {overallCurrentScore}/{maxPossibleScore}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={currentPercentage} className="h-3" />
            <p className="text-right mt-1 text-sm text-gray-500">
              {currentPercentage}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Consolidated report with all sections displayed sequentially */}
      <div className="space-y-8">
        {/* Categories Section */}
        <div>
          <h3 className="text-xl font-medium mb-4">Categories Analysis</h3>
          <div className="space-y-4">
            {categories.map((category, index) => {
              const improvementPercent = Math.round(
                ((category.currentScore - category.initialScore) /
                  category.initialScore) *
                  100,
              );
              return (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-md">
                        {category.category}
                      </CardTitle>
                      <span className="text-sm font-medium text-green-600">
                        +{improvementPercent}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Initial: {category.initialScore}/{category.maxScore}
                        </p>
                        <Progress
                          value={
                            (category.initialScore / category.maxScore) * 100
                          }
                          className="h-2"
                        />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Current: {category.currentScore}/{category.maxScore}
                        </p>
                        <Progress
                          value={
                            (category.currentScore / category.maxScore) * 100
                          }
                          className="h-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Journey Metrics Section */}
        <div>
          <h3 className="text-xl font-medium mb-4">Journey Metrics</h3>
          <Card>
            <CardHeader>
              <CardTitle>Client Progress Metrics</CardTitle>
              <CardDescription>
                Key metrics from the client's journey through the program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {calculatedMetrics.map((metric, index) => {
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {metric.metricName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {metric.value} {metric.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="mt-8 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Journey Summary
                  </h4>
                  <p className="text-sm text-gray-700">
                    Client has attended{" "}
                    {calculatedMetrics.find(
                      (m) => m.metricName === "Workshops Attended",
                    )?.value || 0}{" "}
                    workshops and participated in{" "}
                    {calculatedMetrics.find(
                      (m) => m.metricName === "Support Group Participation",
                    )?.value || 0}{" "}
                    support group meetings. Strong progress in resource
                    utilization and workshop attendance. Recommend focusing on
                    goal completion in the next phase.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart Visualization Section */}
        <div>
          <h3 className="text-xl font-medium mb-4">Progress Visualization</h3>
          <Card>
            <CardHeader>
              <CardTitle>Assessment Progress Chart</CardTitle>
              <CardDescription>
                Comparing initial and current assessments
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="w-full h-full relative">
                {/* Radar Chart Implementation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[300px] h-[300px] relative">
                    {/* Radar Background */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full border border-gray-200 rounded-full opacity-20"></div>
                      <div className="absolute w-3/4 h-3/4 border border-gray-200 rounded-full opacity-20"></div>
                      <div className="absolute w-1/2 h-1/2 border border-gray-200 rounded-full opacity-20"></div>
                      <div className="absolute w-1/4 h-1/4 border border-gray-200 rounded-full opacity-20"></div>
                    </div>

                    {/* Radar Axes */}
                    {categories.map((category, index) => {
                      const angle =
                        (Math.PI * 2 * index) / categories.length - Math.PI / 2;
                      const x = Math.cos(angle) * 150;
                      const y = Math.sin(angle) * 150;
                      return (
                        <div key={index} className="absolute top-1/2 left-1/2">
                          <div
                            className="absolute border-t border-gray-300 origin-left"
                            style={{
                              width: "150px",
                              transform: `rotate(${angle * (180 / Math.PI)}deg)`,
                              marginLeft: "0px",
                              marginTop: "0px",
                            }}
                          ></div>
                          <div
                            className="absolute text-xs text-gray-600 whitespace-nowrap"
                            style={{
                              transform: "translate(-50%, -50%)",
                              left: `${x}px`,
                              top: `${y}px`,
                            }}
                          >
                            {category.category}
                          </div>
                        </div>
                      );
                    })}

                    {/* Initial Score Polygon */}
                    <svg
                      className="absolute inset-0"
                      viewBox="-150 -150 300 300"
                    >
                      <polygon
                        points={categories
                          .map((category, index) => {
                            const angle =
                              (Math.PI * 2 * index) / categories.length -
                              Math.PI / 2;
                            const ratio =
                              category.initialScore / category.maxScore;
                            const x = Math.cos(angle) * 150 * ratio;
                            const y = Math.sin(angle) * 150 * ratio;
                            return `${x},${y}`;
                          })
                          .join(" ")}
                        fill="rgba(59, 130, 246, 0.2)"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />
                    </svg>

                    {/* Current Score Polygon */}
                    <svg
                      className="absolute inset-0"
                      viewBox="-150 -150 300 300"
                    >
                      <polygon
                        points={categories
                          .map((category, index) => {
                            const angle =
                              (Math.PI * 2 * index) / categories.length -
                              Math.PI / 2;
                            const ratio =
                              category.currentScore / category.maxScore;
                            const x = Math.cos(angle) * 150 * ratio;
                            const y = Math.sin(angle) * 150 * ratio;
                            return `${x},${y}`;
                          })
                          .join(" ")}
                        fill="rgba(34, 197, 94, 0.2)"
                        stroke="#22c55e"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 right-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500"></div>
                    <span className="text-sm">Initial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500"></div>
                    <span className="text-sm">Current</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Notes Section */}
        <div>
          <h3 className="text-xl font-medium mb-4">Assessment Notes</h3>
          <Card>
            <CardHeader>
              <CardTitle>Professional Observations</CardTitle>
              <CardDescription>
                Observations and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                {notes ||
                  loadedNotes ||
                  "Client has shown significant improvement across all assessment areas, particularly in accessing information and building local support networks. Continue to monitor financial wellbeing progress."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Recommendations</h3>
        {recommendations || loadedRecommendations ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">
                Professional Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">
                {recommendations || loadedRecommendations}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md">Continue Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Based on progress in financial wellbeing, recommend continued
                  budgeting workshops and one-on-one financial counseling.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-md">New Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Client is ready for community leadership program based on
                  improvements in local support network and information access
                  metrics.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactReport;
