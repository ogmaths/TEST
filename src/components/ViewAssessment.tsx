import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { useNotifications } from "@/context/NotificationContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Edit, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface ViewAssessmentProps {
  assessmentId?: string;
  onBack?: () => void;
}

const ViewAssessment: React.FC<ViewAssessmentProps> = ({
  assessmentId: propAssessmentId,
  onBack = () => {},
}) => {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { addNotification } = useNotifications();

  // Use the ID from props or from URL params
  const assessmentId = propAssessmentId || params.id;

  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (!assessmentId) {
      setLoading(false);
      return;
    }

    // Get assessment from localStorage
    const assessments = JSON.parse(localStorage.getItem("assessments") || "[]");
    const foundAssessment = assessments.find((a: any) => a.id === assessmentId);

    if (foundAssessment) {
      setAssessment(foundAssessment);

      // Check if current user is the one who completed the assessment
      if (user && foundAssessment.completedBy === user.name) {
        setCanEdit(true);
      }
    } else {
      addNotification({
        type: "error",
        title: "Assessment Not Found",
        message: "The requested assessment could not be found",
        priority: "high",
      });
    }

    setLoading(false);
  }, [assessmentId, user, addNotification]);

  const handleEdit = () => {
    navigate(`/assessment/edit/${assessmentId}`);
  };

  const getAssessmentTypeTitle = (type: string) => {
    switch (type?.toLowerCase()) {
      case "introduction":
        return "Introduction Assessment";
      case "exit":
        return "Exit Assessment";
      case "progress":
        return "Progress Assessment";
      default:
        return "Assessment";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h3 className="mt-2 text-lg font-medium">Assessment Not Found</h3>
          <p className="mt-1 text-muted-foreground">
            The requested assessment could not be found
          </p>
          <Button onClick={onBack} variant="outline" className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background w-full max-w-4xl mx-auto p-4">
      <Button
        variant="ghost"
        className="mb-4 flex items-center"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{getAssessmentTypeTitle(assessment.type)}</CardTitle>
            {canEdit && (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}
          </div>
          <CardDescription>
            Completed by {assessment.completedBy} on{" "}
            {new Date(assessment.date).toLocaleDateString()}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-8">
            {assessment.answers &&
              Object.keys(assessment.answers).map((categoryId) => {
                const category = assessment.answers[categoryId];
                return (
                  <motion.div
                    key={categoryId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <h3 className="text-lg font-semibold capitalize">
                      {categoryId.replace(/_/g, " ")}
                    </h3>

                    {category &&
                      Object.keys(category).map((questionId) => {
                        const answer = category[questionId];
                        return (
                          <div
                            key={questionId}
                            className="space-y-2 border-l-2 border-muted pl-4 py-2"
                          >
                            <p className="font-medium">
                              {answer.question || "Question not available"}
                            </p>

                            {answer.value !== undefined && (
                              <div className="space-y-1">
                                {typeof answer.value === "number" ? (
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">
                                      {answer.value}/5
                                    </span>
                                    <Progress
                                      value={answer.value * 20}
                                      className="h-2 w-32"
                                    />
                                  </div>
                                ) : (
                                  <p className="text-sm">{answer.value}</p>
                                )}

                                {answer.notes && (
                                  <div className="mt-2">
                                    <p className="text-xs text-muted-foreground">
                                      Additional notes:
                                    </p>
                                    <p className="text-sm mt-1 bg-muted/50 p-2 rounded">
                                      {answer.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </motion.div>
                );
              })}

            {assessment.recommendations && (
              <div className="space-y-2 mt-6">
                <h3 className="text-lg font-semibold">Recommendations</h3>
                <div className="bg-muted/50 p-3 rounded">
                  <p>{assessment.recommendations}</p>
                </div>
              </div>
            )}

            {assessment.overallNotes && (
              <div className="space-y-2 mt-6">
                <h3 className="text-lg font-semibold">Overall Notes</h3>
                <div className="bg-muted/50 p-3 rounded">
                  <p>{assessment.overallNotes}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button variant="outline" onClick={onBack} className="w-full">
            Close
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ViewAssessment;
