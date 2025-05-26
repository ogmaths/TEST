import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { generateAssessmentPDF } from "@/utils/pdfGenerator";
import Logo from "./Logo";

interface Assessment {
  id: string;
  clientName: string;
  clientId: string;
  type: "introduction" | "progress" | "exit";
  date: string;
  completedBy: string;
  score?: number;
}

const AssessmentsPage: React.FC = () => {
  // Mock assessments data
  const assessments: Assessment[] = [
    {
      id: "1",
      clientName: "Jane Smith",
      clientId: "1",
      type: "introduction",
      date: "2023-03-10",
      completedBy: "Michael Johnson",
      score: 3.2,
    },
    {
      id: "2",
      clientName: "Robert Chen",
      clientId: "2",
      type: "introduction",
      date: "2023-04-05",
      completedBy: "Sarah Williams",
      score: 2.8,
    },
    {
      id: "3",
      clientName: "Maria Garcia",
      clientId: "3",
      type: "exit",
      date: "2023-05-20",
      completedBy: "Michael Johnson",
      score: 7.5,
    },
    {
      id: "4",
      clientName: "David Wilson",
      clientId: "4",
      type: "progress",
      date: "2023-05-12",
      completedBy: "Lisa Chen",
      score: 5.2,
    },
    {
      id: "5",
      clientName: "Jane Smith",
      clientId: "1",
      type: "progress",
      date: "2023-06-10",
      completedBy: "Sarah Williams",
      score: 6.1,
    },
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "introduction":
        return "Introduction";
      case "progress":
        return "Progress";
      case "exit":
        return "Exit";
      default:
        return type;
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "introduction":
        return "default";
      case "progress":
        return "secondary";
      case "exit":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6 bg-background">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <BackButton />
        </div>
        <Link to="/events">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> View Events
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Assessment Records</h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Assessment Records</h2>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Assessment List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left font-medium w-1/3">Client</th>
                  <th className="p-4 text-left font-medium w-1/6">Type</th>
                  <th className="p-4 text-left font-medium w-1/6">Date</th>
                  <th className="p-4 text-left font-medium w-1/12">Score</th>
                  <th className="p-4 text-left font-medium w-1/4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assessments.map((assessment) => (
                  <tr key={assessment.id} className="border-b">
                    <td className="p-4">
                      <div className="font-medium">{assessment.clientName}</div>
                      <div className="text-sm text-muted-foreground">
                        Completed by {assessment.completedBy}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={getTypeBadgeVariant(assessment.type)}>
                        {getTypeLabel(assessment.type)}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">
                      {new Date(assessment.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-sm font-medium">
                      {assessment.score ? assessment.score.toFixed(1) : "N/A"}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link to={`/client/${assessment.clientId}`}>
                          <Button variant="ghost" size="sm">
                            View Client
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => generateAssessmentPDF(assessment)}
                        >
                          <Download className="h-3 w-3" /> PDF
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentsPage;
