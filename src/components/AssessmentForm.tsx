import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useNotifications } from "@/context/NotificationContext";
import { useUser } from "@/context/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";

interface AssessmentFormProps {
  clientId?: string;
  type?: "introduction" | "exit" | "progress";
  onComplete?: () => void;
  onCancel?: () => void;
  onBack?: () => void;
  assessmentId?: string;
}

interface Question {
  id: string;
  text: string;
  type: "rating" | "text";
}

interface Category {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({
  clientId: initialClientId = "1",
  type: initialType = "introduction",
  onComplete = () => {},
  onCancel = () => {},
  onBack = () => {},
  assessmentId: propAssessmentId,
}) => {
  const { id: assessmentIdFromUrl } = useParams();
  const [searchParams] = useState(new URLSearchParams(window.location.search));
  const assessmentIdParam =
    assessmentIdFromUrl || searchParams.get("assessmentId");
  const navigate = useNavigate();
  const [clientId, setClientId] = useState(initialClientId);
  const [type, setType] = useState(initialType);
  const { addNotification } = useNotifications();
  const { user } = useUser();

  // Debug the assessment ID from different sources
  useEffect(() => {
    console.log("Assessment ID sources:", {
      fromParams: assessmentIdParam,
      fromProps: propAssessmentId,
      fromURL: new URLSearchParams(window.location.search).get("assessmentId"),
    });
  }, [assessmentIdParam, propAssessmentId]);

  // If we have an assessment ID in the URL, load that assessment
  useEffect(() => {
    if (assessmentIdParam || propAssessmentId) {
      const assessmentId = assessmentIdParam || propAssessmentId;
      console.log("Loading assessment with ID:", assessmentId);
      const existingAssessments = JSON.parse(
        localStorage.getItem("assessments") || "[]",
      );

      console.log("All assessments:", existingAssessments);

      // Use string comparison to ensure we find the right assessment
      const existingAssessment = existingAssessments.find(
        (a) => String(a.id) === String(assessmentId),
      );

      console.log("Loading assessment by ID:", {
        assessmentId,
        existingAssessment,
        allAssessments: existingAssessments,
      });

      if (existingAssessment) {
        // Check if current user is allowed to edit
        if (
          existingAssessment.completedBy &&
          existingAssessment.completedBy !== user?.name &&
          existingAssessment.status === "completed" &&
          user?.role !== "admin" && // Allow admins to edit any assessment
          existingAssessment.assignedTo !== user?.id // Allow assigned workers to edit
        ) {
          addNotification({
            type: "error",
            title: "Access Denied",
            message:
              "You can only edit assessments that you created or are assigned to you",
            priority: "high",
          });
          navigate(`/assessment/view/${assessmentId}`);
          return;
        }

        // Set form values from existing assessment
        setFormValues(existingAssessment.answers || {});
        setRecommendations(existingAssessment.recommendations || "");
        setOverallNotes(existingAssessment.overallNotes || "");

        // Set other properties
        setClientId(existingAssessment.clientId);
        setType(existingAssessment.type.toLowerCase());
      }
    }
  }, [assessmentIdParam, propAssessmentId, user, addNotification, navigate]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [formValues, setFormValues] = useState({});

  // Mock categories and questions
  const categories: Category[] = [
    {
      id: "financial",
      name: "Financial Wellbeing",
      description: "Assessment of financial stability and management",
      questions: [
        {
          id: "fin1",
          text: "How would you rate your ability to meet your basic financial needs?",
          type: "rating",
        },
        {
          id: "fin2",
          text: "How confident are you in managing your finances?",
          type: "rating",
        },
        {
          id: "fin3",
          text: "Do you have any specific financial concerns?",
          type: "text",
        },
      ],
    },
    {
      id: "mental",
      name: "Mental Health",
      description: "Assessment of mental wellbeing and emotional state",
      questions: [
        {
          id: "men1",
          text: "How would you rate your overall mental wellbeing?",
          type: "rating",
        },
        {
          id: "men2",
          text: "How often do you feel stressed or anxious?",
          type: "rating",
        },
        {
          id: "men3",
          text: "What support do you currently have for your mental health?",
          type: "text",
        },
      ],
    },
    {
      id: "physical",
      name: "Physical Health",
      description: "Assessment of physical health and wellbeing",
      questions: [
        {
          id: "phy1",
          text: "How would you rate your overall physical health?",
          type: "rating",
        },
        {
          id: "phy2",
          text: "Do you have any ongoing health conditions that affect your daily life?",
          type: "rating",
        },
        {
          id: "phy3",
          text: "What are your main physical health concerns?",
          type: "text",
        },
      ],
    },
    {
      id: "information",
      name: "Information Access",
      description: "Assessment of access to information and resources",
      questions: [
        {
          id: "inf1",
          text: "How easily can you access information about services you need?",
          type: "rating",
        },
        {
          id: "inf2",
          text: "Do you know where to go for help with different issues?",
          type: "rating",
        },
        {
          id: "inf3",
          text: "What information would be most helpful to you right now?",
          type: "text",
        },
      ],
    },
    {
      id: "support",
      name: "Local Support Network",
      description: "Assessment of local community support and connections",
      questions: [
        {
          id: "sup1",
          text: "How connected do you feel to your local community?",
          type: "rating",
        },
        {
          id: "sup2",
          text: "Do you have people you can rely on for help when needed?",
          type: "rating",
        },
        {
          id: "sup3",
          text: "What additional support would be beneficial to you?",
          type: "text",
        },
      ],
    },
    {
      id: "emotional",
      name: "Emotional Wellbeing",
      description: "Assessment of emotional state and resilience",
      questions: [
        {
          id: "emo1",
          text: "How would you rate your overall happiness?",
          type: "rating",
        },
        {
          id: "emo2",
          text: "How confident do you feel about your future?",
          type: "rating",
        },
        {
          id: "emo3",
          text: "What brings you joy or satisfaction in your life?",
          type: "text",
        },
      ],
    },
  ];

  const currentCategory = categories[currentCategoryIndex];
  const progress = ((currentCategoryIndex + 1) / (categories.length + 1)) * 100;

  const handleRatingChange = (questionId: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [currentCategory.id]: {
        ...prev[currentCategory.id],
        [questionId]: {
          ...prev[currentCategory.id]?.[questionId],
          value: parseInt(value),
        },
      },
    }));
  };

  const handleTextChange = (questionId: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [currentCategory.id]: {
        ...prev[currentCategory.id],
        [questionId]: {
          ...prev[currentCategory.id]?.[questionId],
          value,
        },
      },
    }));
  };

  const handleNotesChange = (questionId: string, notes: string) => {
    setFormValues((prev) => ({
      ...prev,
      [currentCategory.id]: {
        ...prev[currentCategory.id],
        [questionId]: {
          ...prev[currentCategory.id]?.[questionId],
          notes,
        },
      },
    }));
  };

  const handleNext = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    } else if (currentCategoryIndex === categories.length - 1) {
      setCurrentCategoryIndex(categories.length); // Move to recommendations page
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    } else {
      onBack();
    }
  };

  const [recommendations, setRecommendations] = useState("");
  const [overallNotes, setOverallNotes] = useState("");

  const saveAssessment = (status: "in-progress" | "completed") => {
    setIsSubmitting(true);

    // Process answers to include question text
    const processedAnswers = {};

    Object.keys(formValues).forEach((categoryId) => {
      processedAnswers[categoryId] = {};

      Object.keys(formValues[categoryId] || {}).forEach((questionId) => {
        // Find the category and question
        const category = categories.find((c) => c.id === categoryId);
        const question = category?.questions.find((q) => q.id === questionId);

        processedAnswers[categoryId][questionId] = {
          ...formValues[categoryId][questionId],
          question: question?.text || questionId,
        };
      });
    });

    // Create assessment record
    // Use the consistent ID format for assessments
    const assessmentId = assessmentIdParam || `${type}-${clientId}`;
    const newAssessment = {
      id: assessmentId,
      clientId,
      type: type.charAt(0).toUpperCase() + type.slice(1),
      date: new Date().toISOString().split("T")[0],
      completedBy: user?.name || "Anonymous User",
      assignedTo: user?.id, // Track which worker the assessment is assigned to
      status,
      answers: processedAnswers,
      recommendations,
      overallNotes,
    };

    console.log("Saving assessment:", {
      assessmentIdParam,
      newAssessment,
      isEditing: !!assessmentIdParam,
      status,
    });

    // Save to localStorage
    const existingAssessments = JSON.parse(
      localStorage.getItem("assessments") || "[]",
    );

    // If editing an existing assessment, replace it; otherwise add new
    let updatedAssessments;
    if (assessmentIdParam) {
      updatedAssessments = existingAssessments.map((a) =>
        a.id === assessmentIdParam ? newAssessment : a,
      );
    } else {
      // Check if there's already an assessment for this client and type
      const existingIndex = existingAssessments.findIndex(
        (a) =>
          a.clientId === clientId &&
          a.type.toLowerCase() === type.toLowerCase(),
      );

      if (existingIndex !== -1) {
        // Replace the existing assessment
        updatedAssessments = [...existingAssessments];
        updatedAssessments[existingIndex] = newAssessment;
      } else {
        // Add new assessment
        updatedAssessments = [...existingAssessments, newAssessment];
      }
    }

    // Save the updated assessments to localStorage
    localStorage.setItem("assessments", JSON.stringify(updatedAssessments));

    // Force a refresh of the assessments in any open ClientProfile components
    const event = new CustomEvent("assessment-updated", {
      detail: { clientId, status },
    });
    window.dispatchEvent(event);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);

      // Show notification
      addNotification({
        type: "success",
        title:
          status === "completed" ? "Assessment Submitted" : "Assessment Saved",
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} assessment has been ${status === "completed" ? "submitted" : "saved"} successfully`,
        priority: "high",
      });

      // Set success message state for both completed and in-progress
      setShowSuccessMessage(true);

      // Show different message based on status
      const messageTimeout = status === "completed" ? 2000 : 1500;

      // Hide success message after timeout and redirect to client profile
      setTimeout(() => {
        setShowSuccessMessage(false);
        // If we're in a standalone route, navigate to client profile
        if (!propAssessmentId) {
          // Navigate to client profile with assessments tab active
          navigate(`/client/${clientId}?tab=assessments`);
        } else {
          // If used as a component with onComplete prop
          onComplete();
        }
      }, messageTimeout);
    }, 1500);
  };

  const handleSubmit = () => {
    saveAssessment("completed");
  };

  const handleSaveProgress = () => {
    saveAssessment("in-progress");
  };

  const getAssessmentTypeTitle = () => {
    switch (type) {
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

  return (
    <div className="bg-background w-full max-w-4xl mx-auto p-4 relative">
      {showSuccessMessage && (
        <div className="absolute top-0 left-0 right-0 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-md shadow-md z-50 mx-4 mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">
              {type.charAt(0).toUpperCase() + type.slice(1)} assessment
              {isSubmitting ? "..." : " saved successfully!"}
            </span>
          </div>
          <span className="text-sm">Redirecting to assessment history...</span>
        </div>
      )}
      <Button
        variant="ghost"
        className="mb-4 flex items-center"
        onClick={() => onBack()}
        type="button"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{getAssessmentTypeTitle()}</span>
            <span className="text-sm font-normal text-muted-foreground">
              {currentCategoryIndex + 1} of {categories.length + 1}
            </span>
          </CardTitle>
          <div className="flex justify-between items-center mt-2">
            <CardDescription>
              {currentCategoryIndex < categories.length
                ? `${currentCategory.name}: ${currentCategory.description}`
                : "Summary and Recommendations"}
            </CardDescription>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent>
          {currentCategoryIndex < categories.length ? (
            <motion.div
              key={currentCategory.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {currentCategory.questions.map((question) => (
                <div key={question.id} className="space-y-4">
                  <h3 className="font-medium">{question.text}</h3>

                  {question.type === "rating" && (
                    <RadioGroup
                      value={
                        formValues[currentCategory.id]?.[
                          question.id
                        ]?.value?.toString() || ""
                      }
                      onValueChange={(value) =>
                        handleRatingChange(question.id, value)
                      }
                      className="flex space-x-2"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div
                          key={rating}
                          className="flex flex-col items-center"
                        >
                          <RadioGroupItem
                            value={rating.toString()}
                            id={`${question.id}-${rating}`}
                            className="mb-1"
                          />
                          <Label htmlFor={`${question.id}-${rating}`}>
                            {rating}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {question.type === "text" && (
                    <Textarea
                      value={
                        formValues[currentCategory.id]?.[
                          question.id
                        ]?.value?.toString() || ""
                      }
                      onChange={(e) =>
                        handleTextChange(question.id, e.target.value)
                      }
                      placeholder="Enter your response"
                      className="w-full"
                    />
                  )}

                  <div className="pt-2">
                    <Label
                      htmlFor={`${question.id}-notes`}
                      className="text-sm text-muted-foreground"
                    >
                      Additional notes
                    </Label>
                    <Textarea
                      id={`${question.id}-notes`}
                      value={
                        formValues[currentCategory.id]?.[question.id]?.notes ||
                        ""
                      }
                      onChange={(e) =>
                        handleNotesChange(question.id, e.target.value)
                      }
                      placeholder="Add any additional context or notes"
                      className="w-full mt-1"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="font-medium">Overall Assessment Notes</h3>
                <Textarea
                  value={overallNotes}
                  onChange={(e) => setOverallNotes(e.target.value)}
                  placeholder="Enter overall notes about the client's assessment"
                  className="w-full"
                  rows={4}
                />
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Recommendations</h3>
                <Textarea
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  placeholder="Enter recommendations for the client based on this assessment"
                  className="w-full"
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  These recommendations will appear in the client's Impact
                  Report
                </p>
              </div>
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Button variant="outline" onClick={onCancel} className="mr-2">
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentCategoryIndex === 0}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSaveProgress}
              disabled={isSubmitting || Object.keys(formValues).length === 0}
            >
              {isSubmitting ? "Saving..." : "Save Progress"}
            </Button>
            {currentCategoryIndex < categories.length ? (
              <Button onClick={handleNext}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    Complete <Save className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AssessmentForm;
