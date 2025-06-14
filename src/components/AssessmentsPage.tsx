import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { generateAssessmentPDF } from "@/utils/pdfGenerator";
import { Progress } from "@/components/ui/progress";
import Logo from "./Logo";

interface Assessment {
  id: string;
  clientName: string;
  clientId: string;
  type: "introduction" | "progress" | "exit";
  date: string;
  completedBy: string;
  score?: number;
  status?: "completed" | "in-progress" | "pending";
}

const AssessmentsPage: React.FC = () => {
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  // Load assessments from localStorage
  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const savedAssessments = JSON.parse(
      localStorage.getItem("assessments") || "[]",
    );

    // Load clients data to get full names
    const savedClients = JSON.parse(localStorage.getItem("clients") || "[]");

    // If we have saved assessments, use them
    if (savedAssessments.length > 0) {
      // Map the saved assessments to match our Assessment interface
      const mappedAssessments = savedAssessments.map((assessment: any) => {
        // Find the client by ID to get the full name
        const client = savedClients.find(
          (c: any) => c.id === assessment.clientId,
        );

        return {
          id: assessment.id,
          clientName: client?.name || assessment.clientName || "Unknown Client",
          clientId: assessment.clientId,
          type: assessment.type?.toLowerCase() || "introduction",
          date: assessment.date,
          completedBy: assessment.completedBy || "",
          score: assessment.score || assessment.overallScore,
          status:
            assessment.status || (assessment.score ? "completed" : "pending"),
          // Add client organization info for filtering
          clientOrganizationId: client?.organizationId,
          clientOrganizationSlug: client?.organizationSlug,
        };
      });

      // Filter assessments based on user's tenant_id for security
      if (user?.role === "super_admin" || user?.tenantId === "0") {
        // Super admin can see all assessments
        return mappedAssessments;
      } else {
        // Workers can only see assessments for clients from their organization
        return mappedAssessments.filter((assessment: any) => {
          return (
            assessment.clientOrganizationId === user?.tenantId ||
            assessment.clientOrganizationSlug === user?.organizationSlug
          );
        });
      }
    }

    // Fallback to mock data if no assessments found
    return [
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

  // Filter assessments by date range if dates are selected
  const filteredAssessments = assessments.filter((assessment) => {
    const assessmentDate = new Date(assessment.date);

    // If no date filters are set, include all assessments
    if (!dateFrom && !dateTo) return true;

    // If only dateFrom is set
    if (dateFrom && !dateTo) {
      return assessmentDate >= dateFrom;
    }

    // If only dateTo is set
    if (!dateFrom && dateTo) {
      // Include the entire day of dateTo
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      return assessmentDate <= endOfDay;
    }

    // If both dates are set
    if (dateFrom && dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      return assessmentDate >= dateFrom && assessmentDate <= endOfDay;
    }

    return true;
  });

  // Calculate status counts and percentages
  const statusCounts = filteredAssessments.reduce(
    (acc, assessment) => {
      const status = assessment.status || "pending";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalAssessments = filteredAssessments.length;
  const completedCount = statusCounts["completed"] || 0;
  const inProgressCount = statusCounts["in-progress"] || 0;
  const pendingCount = statusCounts["pending"] || 0;

  const completedPercentage =
    Math.round((completedCount / totalAssessments) * 100) || 0;
  const inProgressPercentage =
    Math.round((inProgressCount / totalAssessments) * 100) || 0;
  const pendingPercentage =
    Math.round((pendingCount / totalAssessments) * 100) || 0;

  // Reset date filters
  const resetDateFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
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

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Assessment Status Overview</CardTitle>
              <CardDescription>
                Distribution of assessment statuses
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? (
                        format(dateFrom, "PPP")
                      ) : (
                        <span>From date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : <span>To date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {(dateFrom || dateTo) && (
                <Button variant="ghost" size="sm" onClick={resetDateFilters}>
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Completed</span>
              </div>
              <span className="font-medium">
                {completedCount} ({completedPercentage}%)
              </span>
            </div>
            <Progress value={completedPercentage} className="h-2 bg-muted" />

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>In Progress</span>
              </div>
              <span className="font-medium">
                {inProgressCount} ({inProgressPercentage}%)
              </span>
            </div>
            <Progress value={inProgressPercentage} className="h-2 bg-muted" />

            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>Pending</span>
              </div>
              <span className="font-medium">
                {pendingCount} ({pendingPercentage}%)
              </span>
            </div>
            <Progress value={pendingPercentage} className="h-2 bg-muted" />

            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>Total Assessments: {totalAssessments}</span>
              {(dateFrom || dateTo) && (
                <span>
                  {dateFrom && dateTo
                    ? `Date range: ${format(dateFrom, "PP")} - ${format(dateTo, "PP")}`
                    : dateFrom
                      ? `From: ${format(dateFrom, "PP")}`
                      : `To: ${format(dateTo!, "PP")}`}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <th className="p-4 text-left font-medium w-1/4">Client</th>
                  <th className="p-4 text-left font-medium w-1/8">Type</th>
                  <th className="p-4 text-left font-medium w-1/8">Date</th>
                  <th className="p-4 text-left font-medium w-1/12">Score</th>
                  <th className="p-4 text-left font-medium w-1/8">Status</th>
                  <th className="p-4 text-left font-medium w-1/4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssessments.map((assessment) => (
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
                      {assessment.score
                        ? Number(assessment.score).toFixed(1)
                        : "N/A"}
                    </td>
                    <td className="p-4">
                      {assessment.status === "completed" && (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" /> Completed
                        </Badge>
                      )}
                      {assessment.status === "in-progress" && (
                        <Badge variant="default" className="bg-blue-500">
                          <Clock className="h-3 w-3 mr-1" /> In Progress
                        </Badge>
                      )}
                      {assessment.status === "pending" && (
                        <Badge
                          variant="outline"
                          className="text-amber-500 border-amber-500"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" /> Pending
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `/client/${assessment.clientId}`,
                              "_blank",
                            )
                          }
                        >
                          View Client
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `/assessment/view/${assessment.id}`,
                              "_blank",
                            )
                          }
                        >
                          View Assessment
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `/assessment/edit/${assessment.id}`,
                              "_blank",
                            )
                          }
                        >
                          Edit Assessment
                        </Button>
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
