import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useNotifications } from "@/context/NotificationContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText } from "lucide-react";

const WorkerAssessments: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assigned");

  useEffect(() => {
    const loadAssessments = () => {
      setLoading(true);
      // In a real app, this would be an API call filtered by the worker's ID
      const allAssessments = JSON.parse(
        localStorage.getItem("assessments") || "[]",
      );

      // Filter assessments based on the current user
      const workerAssessments = allAssessments.filter(
        (assessment: any) => assessment.assignedTo === user?.id,
      );

      setAssessments(workerAssessments);
      setLoading(false);
    };

    loadAssessments();

    // Listen for assessment updates
    const handleAssessmentUpdate = () => loadAssessments();
    window.addEventListener("assessment-updated", handleAssessmentUpdate);

    return () => {
      window.removeEventListener("assessment-updated", handleAssessmentUpdate);
    };
  }, [user]);

  const assignedAssessments = assessments.filter(
    (assessment) =>
      assessment.status === "in-progress" || assessment.status === "scheduled",
  );

  const completedAssessments = assessments.filter(
    (assessment) => assessment.status === "completed",
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Assessments</h1>
      </div>

      <Tabs
        defaultValue="assigned"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assigned">
            Assigned
            {assignedAssessments.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {assignedAssessments.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            {completedAssessments.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {completedAssessments.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Assessments</CardTitle>
              <CardDescription>
                Assessments that have been assigned to you to complete
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedAssessments.length > 0 ? (
                  assignedAssessments
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                    )
                    .map((assessment) => (
                      <div
                        key={assessment.id}
                        className="border rounded-lg p-4 hover:bg-accent/10 cursor-pointer"
                        onClick={() =>
                          window.open(
                            `/assessment/edit/${assessment.id}`,
                            "_blank",
                          )
                        }
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium flex items-center">
                              <FileText className="h-4 w-4 mr-2" />
                              {assessment.type.charAt(0).toUpperCase() +
                                assessment.type.slice(1)}{" "}
                              Assessment
                              <Badge
                                variant={
                                  assessment.status === "scheduled"
                                    ? "outline"
                                    : "secondary"
                                }
                                className="ml-2"
                              >
                                {assessment.status === "scheduled"
                                  ? "Scheduled"
                                  : "In Progress"}
                              </Badge>
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Client ID: {assessment.clientId}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(assessment.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                `/assessment/edit/${assessment.id}`,
                                "_blank",
                              );
                            }}
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No assigned assessments found.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Assessments</CardTitle>
              <CardDescription>Assessments you have completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedAssessments.length > 0 ? (
                  completedAssessments
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                    )
                    .map((assessment) => (
                      <div
                        key={assessment.id}
                        className="border rounded-lg p-4 hover:bg-accent/10 cursor-pointer"
                        onClick={() =>
                          window.open(
                            `/assessment/view/${assessment.id}`,
                            "_blank",
                          )
                        }
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium flex items-center">
                              <FileText className="h-4 w-4 mr-2" />
                              {assessment.type.charAt(0).toUpperCase() +
                                assessment.type.slice(1)}{" "}
                              Assessment
                              <Badge variant="success" className="ml-2">
                                Completed
                              </Badge>
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Client ID: {assessment.clientId}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(assessment.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                `/assessment/view/${assessment.id}`,
                                "_blank",
                              );
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No completed assessments found.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkerAssessments;
