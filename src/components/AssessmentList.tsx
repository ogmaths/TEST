import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, Plus, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { generateAssessmentPDF } from "@/utils/pdfGenerator";
import { Assessment } from "@/types/assessment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssessmentListProps {
  assessments?: Assessment[];
  showAddButton?: boolean;
  showFilters?: boolean;
  onAddAssessment?: () => void;
}

const AssessmentList: React.FC<AssessmentListProps> = ({
  assessments: propAssessments,
  showAddButton = true,
  showFilters = true,
  onAddAssessment,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  // Load assessments from props or use mock data if none exists
  useEffect(() => {
    if (propAssessments && propAssessments.length > 0) {
      setAssessments(propAssessments);
    } else {
      // Mock assessments data as fallback
      setAssessments([
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
      ]);
    }
  }, [propAssessments]);

  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch =
      !searchQuery ||
      assessment.clientName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assessment.completedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = !typeFilter || assessment.type === typeFilter;

    return matchesSearch && matchesType;
  });

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
    <div className="space-y-4">
      {showFilters && (
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by client or staff name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={typeFilter || ""}
              onValueChange={(value) => setTypeFilter(value || null)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="introduction">Introduction</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="exit">Exit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {showAddButton && (
            <Button
              onClick={onAddAssessment}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> New Assessment
            </Button>
          )}
        </div>
      )}

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
                {filteredAssessments.length > 0 ? (
                  filteredAssessments.map((assessment) => (
                    <tr key={assessment.id} className="border-b">
                      <td className="p-4">
                        <div className="font-medium">
                          {assessment.clientName}
                        </div>
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
                          <Link to={`/assessment/${assessment.id}`}>
                            <Button variant="ghost" size="sm">
                              View
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
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-muted-foreground"
                    >
                      No assessments found.{" "}
                      {showAddButton && (
                        <Button
                          variant="link"
                          onClick={onAddAssessment}
                          className="p-0 h-auto"
                        >
                          Create a new assessment
                        </Button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentList;
