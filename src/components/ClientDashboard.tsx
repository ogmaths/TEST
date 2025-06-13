import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CheckCircle,
  Circle,
  AlertTriangle,
  Calendar,
  FileText,
  Phone,
  MessageSquare,
  Clock,
  TrendingUp,
  User,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import BackButton from "@/components/BackButton";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  status: string;
  joinDate: string;
  supportProgram?: string;
  caseWorker?: string;
  organizationId?: string;
}

interface JourneyProgress {
  id: string;
  clientId: string;
  currentStage: number;
  stages: string[];
  completedStages: number[];
  updatedAt: string;
}

interface AssessmentResult {
  id: string;
  clientId: string;
  type: string;
  score: number;
  riskLevel: string;
  completedAt: string;
  status: string;
}

interface TimelineEvent {
  id: string;
  clientId: string;
  type: string;
  title: string;
  description?: string;
  date: string;
  score?: number;
  riskLevel?: string;
}

interface Recommendation {
  id: string;
  type: string;
  message: string;
  priority: "high" | "medium" | "low";
  triggeredBy: string;
}

const ClientDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const clientId = id || searchParams.get("clientId") || "1";

  const { user } = useUser();
  const { addNotification } = useNotifications();

  const [client, setClient] = useState<Client | null>(null);
  const [journeyProgress, setJourneyProgress] =
    useState<JourneyProgress | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<
    AssessmentResult[]
  >([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit states
  const [showEditJourneyDialog, setShowEditJourneyDialog] = useState(false);
  const [showScheduleAssessmentDialog, setShowScheduleAssessmentDialog] =
    useState(false);
  const [showAddTimelineDialog, setShowAddTimelineDialog] = useState(false);
  const [showDeleteTimelineDialog, setShowDeleteTimelineDialog] =
    useState(false);
  const [editingTimelineEvent, setEditingTimelineEvent] =
    useState<TimelineEvent | null>(null);
  const [deletingTimelineEvent, setDeletingTimelineEvent] =
    useState<TimelineEvent | null>(null);

  // Form states
  const [journeyEditForm, setJourneyEditForm] = useState({
    stage: "",
    completedDate: new Date(),
    status: "Pending" as "Pending" | "In Progress" | "Completed",
  });

  const [assessmentForm, setAssessmentForm] = useState({
    formId: "",
    dueDate: new Date(),
    status: "scheduled" as "scheduled" | "completed" | "cancelled",
  });

  const [timelineForm, setTimelineForm] = useState({
    type: "Contact" as "Assessment" | "Contact" | "Note" | "Referral",
    title: "",
    description: "",
    date: new Date(),
  });

  // Default journey stages
  const defaultStages = [
    "Initial Contact",
    "Antenatal Support",
    "Birth",
    "6-Week Check-In",
    "3-Month Check-In",
    "Exit",
  ];

  // Available assessment forms
  const availableAssessmentForms = [
    { id: "epds", name: "EPDS Assessment" },
    { id: "gad7", name: "GAD-7 Assessment" },
    { id: "bonding", name: "Bonding Scale" },
    { id: "progress", name: "Progress Review" },
    { id: "exit", name: "Exit Assessment" },
  ];

  // Check if user can edit (Support Workers, Admins, Super Admins)
  const canEdit =
    user?.role === "support_worker" ||
    user?.role === "admin" ||
    user?.role === "super_admin" ||
    user?.role === "org_admin";
  const canDelete =
    user?.role === "admin" ||
    user?.role === "super_admin" ||
    user?.role === "org_admin";

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  const loadClientData = async () => {
    try {
      setLoading(true);

      // Load client data from localStorage (simulating Supabase)
      const storedClients = JSON.parse(localStorage.getItem("clients") || "[]");
      const foundClient = storedClients.find((c: any) => c.id === clientId);

      if (foundClient) {
        setClient(foundClient);
      } else {
        // Create mock client if not found
        const mockClient: Client = {
          id: clientId,
          name: "Rosie Nelson",
          email: "rosie.nelson@example.com",
          phone: "+44 7700 900123",
          address: "123 Oak Street, London, SW1A 1AA",
          dateOfBirth: "1992-03-15",
          status: "active",
          joinDate: "2024-01-15",
          supportProgram: "Perinatal Mental Health Support",
          caseWorker: "Sarah Johnson",
          organizationId: user?.organizationId || "1",
        };
        setClient(mockClient);

        // Save to localStorage
        localStorage.setItem(
          "clients",
          JSON.stringify([...storedClients, mockClient]),
        );
      }

      // Load journey progress
      const storedProgress = JSON.parse(
        localStorage.getItem(`journey_progress_${clientId}`) || "null",
      );
      if (storedProgress) {
        setJourneyProgress(storedProgress);
      } else {
        // Create mock journey progress
        const mockProgress: JourneyProgress = {
          id: `progress_${clientId}`,
          clientId,
          currentStage: 3,
          stages: defaultStages,
          completedStages: [0, 1, 2],
          updatedAt: new Date().toISOString(),
        };
        setJourneyProgress(mockProgress);
        localStorage.setItem(
          `journey_progress_${clientId}`,
          JSON.stringify(mockProgress),
        );
      }

      // Load assessment results
      const storedAssessments = JSON.parse(
        localStorage.getItem(`assessment_results_${clientId}`) || "[]",
      );
      if (storedAssessments.length > 0) {
        setAssessmentResults(storedAssessments);
      } else {
        // Create mock assessment results
        const mockAssessments: AssessmentResult[] = [
          {
            id: "assess_1",
            clientId,
            type: "EPDS",
            score: 13,
            riskLevel: "moderate",
            completedAt: "2024-03-01T10:00:00Z",
            status: "completed",
          },
          {
            id: "assess_2",
            clientId,
            type: "GAD-7",
            score: 8,
            riskLevel: "mild",
            completedAt: "2024-03-15T14:30:00Z",
            status: "completed",
          },
          {
            id: "assess_3",
            clientId,
            type: "Bonding Scale",
            score: 0,
            riskLevel: "pending",
            completedAt: "",
            status: "scheduled",
          },
        ];
        setAssessmentResults(mockAssessments);
        localStorage.setItem(
          `assessment_results_${clientId}`,
          JSON.stringify(mockAssessments),
        );
      }

      // Load timeline events
      const storedTimeline = JSON.parse(
        localStorage.getItem(`timeline_events_${clientId}`) || "[]",
      );
      if (storedTimeline.length > 0) {
        setTimelineEvents(storedTimeline);
      } else {
        // Create mock timeline events
        const mockTimeline: TimelineEvent[] = [
          {
            id: "event_1",
            clientId,
            type: "Assessment",
            title: "EPDS Assessment",
            description: "Edinburgh Postnatal Depression Scale completed",
            date: "2024-03-01T10:00:00Z",
            score: 13,
            riskLevel: "moderate",
          },
          {
            id: "event_2",
            clientId,
            type: "Contact",
            title: "Phone Check-in",
            description: "Weekly support call - discussed coping strategies",
            date: "2024-03-08T15:00:00Z",
          },
          {
            id: "event_3",
            clientId,
            type: "Assessment",
            title: "GAD-7 Assessment",
            description: "Generalized Anxiety Disorder 7-item scale",
            date: "2024-03-15T14:30:00Z",
            score: 8,
            riskLevel: "mild",
          },
          {
            id: "event_4",
            clientId,
            type: "Referral",
            title: "Counselling Referral",
            description:
              "Referred to specialist perinatal mental health service",
            date: "2024-03-16T11:00:00Z",
          },
        ];
        setTimelineEvents(mockTimeline);
        localStorage.setItem(
          `timeline_events_${clientId}`,
          JSON.stringify(mockTimeline),
        );
      }

      // Generate recommendations based on assessment results
      generateRecommendations(
        storedAssessments.length > 0
          ? storedAssessments
          : [
              {
                id: "assess_1",
                clientId,
                type: "EPDS",
                score: 13,
                riskLevel: "moderate",
                completedAt: "2024-03-01T10:00:00Z",
                status: "completed",
              },
            ],
      );
    } catch (error) {
      console.error("Error loading client data:", error);
      addNotification({
        type: "system",
        title: "Error",
        message: "Failed to load client dashboard data",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (assessments: AssessmentResult[]) => {
    const newRecommendations: Recommendation[] = [];

    // Check for EPDS score >= 10
    const latestEPDS = assessments
      .filter((a) => a.type === "EPDS" && a.status === "completed")
      .sort(
        (a, b) =>
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
      )[0];

    if (latestEPDS && latestEPDS.score >= 10) {
      newRecommendations.push({
        id: "rec_bonding",
        type: "assessment",
        message: `⚠️ Bonding Scale recommended — Client scored ${latestEPDS.score} on EPDS (moderate risk)`,
        priority: "high",
        triggeredBy: "EPDS >= 10",
      });
    }

    // Check for no recent contact (mock - 30+ days)
    const lastContact = new Date("2024-02-15"); // Mock last contact date
    const daysSinceContact = Math.floor(
      (new Date().getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysSinceContact > 30) {
      newRecommendations.push({
        id: "rec_followup",
        type: "contact",
        message: "⚠️ Follow-up suggested — No contact in 30+ days",
        priority: "medium",
        triggeredBy: "No recent contact",
      });
    }

    setRecommendations(newRecommendations);
  };

  // Journey stage editing functions
  const handleEditJourney = () => {
    if (journeyProgress) {
      setJourneyEditForm({
        stage: journeyProgress.stages[journeyProgress.currentStage] || "",
        completedDate: new Date(),
        status: "In Progress",
      });
      setShowEditJourneyDialog(true);
    }
  };

  const handleSaveJourneyStage = async () => {
    try {
      const updatedProgress = {
        ...journeyProgress!,
        currentStage: journeyProgress!.stages.indexOf(journeyEditForm.stage),
        completedStages:
          journeyEditForm.status === "Completed"
            ? [
                ...journeyProgress!.completedStages,
                journeyProgress!.stages.indexOf(journeyEditForm.stage),
              ]
            : journeyProgress!.completedStages,
        updatedAt: new Date().toISOString(),
      };

      setJourneyProgress(updatedProgress);
      localStorage.setItem(
        `journey_progress_${clientId}`,
        JSON.stringify(updatedProgress),
      );

      // Add timeline event
      const newTimelineEvent: TimelineEvent = {
        id: `timeline_${Date.now()}`,
        clientId,
        type: "Milestone",
        title: `Journey Stage Updated: ${journeyEditForm.stage}`,
        description: `Stage status changed to ${journeyEditForm.status}`,
        date: new Date().toISOString(),
      };

      const updatedTimeline = [newTimelineEvent, ...timelineEvents];
      setTimelineEvents(updatedTimeline);
      localStorage.setItem(
        `timeline_events_${clientId}`,
        JSON.stringify(updatedTimeline),
      );

      setShowEditJourneyDialog(false);
      addNotification({
        type: "success",
        title: "Journey Updated",
        message: "Client journey stage has been updated successfully",
      });
    } catch (error) {
      addNotification({
        type: "system",
        title: "Error",
        message: "Failed to update journey stage",
      });
    }
  };

  // Assessment scheduling functions
  const handleScheduleAssessment = () => {
    setAssessmentForm({
      formId: "",
      dueDate: new Date(),
      status: "scheduled",
    });
    setShowScheduleAssessmentDialog(true);
  };

  const handleSaveScheduledAssessment = async () => {
    try {
      const selectedForm = availableAssessmentForms.find(
        (f) => f.id === assessmentForm.formId,
      );
      if (!selectedForm) return;

      const newAssessment: AssessmentResult = {
        id: `assess_${Date.now()}`,
        clientId,
        type: selectedForm.name,
        score: 0,
        riskLevel: "pending",
        completedAt: "",
        status: assessmentForm.status,
      };

      const updatedAssessments = [...assessmentResults, newAssessment];
      setAssessmentResults(updatedAssessments);
      localStorage.setItem(
        `assessment_results_${clientId}`,
        JSON.stringify(updatedAssessments),
      );

      // Add timeline event
      const newTimelineEvent: TimelineEvent = {
        id: `timeline_${Date.now()}`,
        clientId,
        type: "Assessment",
        title: `${selectedForm.name} Scheduled`,
        description: `Assessment scheduled for ${format(assessmentForm.dueDate, "PPP")}`,
        date: new Date().toISOString(),
      };

      const updatedTimeline = [newTimelineEvent, ...timelineEvents];
      setTimelineEvents(updatedTimeline);
      localStorage.setItem(
        `timeline_events_${clientId}`,
        JSON.stringify(updatedTimeline),
      );

      setShowScheduleAssessmentDialog(false);
      addNotification({
        type: "success",
        title: "Assessment Scheduled",
        message: `${selectedForm.name} has been scheduled successfully`,
      });
    } catch (error) {
      addNotification({
        type: "system",
        title: "Error",
        message: "Failed to schedule assessment",
      });
    }
  };

  const handleCancelAssessment = async (assessmentId: string) => {
    try {
      const updatedAssessments = assessmentResults.map((a) =>
        a.id === assessmentId ? { ...a, status: "cancelled" } : a,
      );
      setAssessmentResults(updatedAssessments);
      localStorage.setItem(
        `assessment_results_${clientId}`,
        JSON.stringify(updatedAssessments),
      );

      addNotification({
        type: "success",
        title: "Assessment Cancelled",
        message: "Assessment has been cancelled successfully",
      });
    } catch (error) {
      addNotification({
        type: "system",
        title: "Error",
        message: "Failed to cancel assessment",
      });
    }
  };

  // Timeline editing functions
  const handleAddTimelineEvent = () => {
    setTimelineForm({
      type: "Contact",
      title: "",
      description: "",
      date: new Date(),
    });
    setEditingTimelineEvent(null);
    setShowAddTimelineDialog(true);
  };

  const handleEditTimelineEvent = (event: TimelineEvent) => {
    setTimelineForm({
      type: event.type as "Assessment" | "Contact" | "Note" | "Referral",
      title: event.title,
      description: event.description || "",
      date: new Date(event.date),
    });
    setEditingTimelineEvent(event);
    setShowAddTimelineDialog(true);
  };

  const handleSaveTimelineEvent = async () => {
    try {
      const eventData: TimelineEvent = {
        id: editingTimelineEvent?.id || `timeline_${Date.now()}`,
        clientId,
        type: timelineForm.type,
        title: timelineForm.title,
        description: timelineForm.description,
        date: timelineForm.date.toISOString(),
      };

      let updatedTimeline;
      if (editingTimelineEvent) {
        updatedTimeline = timelineEvents.map((e) =>
          e.id === editingTimelineEvent.id ? eventData : e,
        );
      } else {
        updatedTimeline = [eventData, ...timelineEvents];
      }

      setTimelineEvents(updatedTimeline);
      localStorage.setItem(
        `timeline_events_${clientId}`,
        JSON.stringify(updatedTimeline),
      );

      setShowAddTimelineDialog(false);
      setEditingTimelineEvent(null);
      addNotification({
        type: "success",
        title: editingTimelineEvent ? "Event Updated" : "Event Added",
        message: `Timeline event has been ${editingTimelineEvent ? "updated" : "added"} successfully`,
      });
    } catch (error) {
      addNotification({
        type: "system",
        title: "Error",
        message: `Failed to ${editingTimelineEvent ? "update" : "add"} timeline event`,
      });
    }
  };

  const handleDeleteTimelineEvent = (event: TimelineEvent) => {
    setDeletingTimelineEvent(event);
    setShowDeleteTimelineDialog(true);
  };

  const confirmDeleteTimelineEvent = async () => {
    if (!deletingTimelineEvent) return;

    try {
      const updatedTimeline = timelineEvents.filter(
        (e) => e.id !== deletingTimelineEvent.id,
      );
      setTimelineEvents(updatedTimeline);
      localStorage.setItem(
        `timeline_events_${clientId}`,
        JSON.stringify(updatedTimeline),
      );

      setShowDeleteTimelineDialog(false);
      setDeletingTimelineEvent(null);
      addNotification({
        type: "success",
        title: "Event Deleted",
        message: "Timeline event has been deleted successfully",
      });
    } catch (error) {
      addNotification({
        type: "system",
        title: "Error",
        message: "Failed to delete timeline event",
      });
    }
  };

  const getStageIcon = (
    stageIndex: number,
    currentStage: number,
    completedStages: number[],
  ) => {
    if (completedStages.includes(stageIndex)) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    } else if (stageIndex === currentStage) {
      return <Circle className="h-6 w-6 text-blue-500 fill-blue-500" />;
    } else {
      return <Circle className="h-6 w-6 text-gray-300" />;
    }
  };

  const getProgressPercentage = (currentStage: number, totalStages: number) => {
    return Math.round(((currentStage + 1) / totalStages) * 100);
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "destructive";
      case "moderate":
        return "secondary";
      case "mild":
        return "outline";
      case "low":
        return "default";
      default:
        return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "Assessment":
        return <FileText className="h-4 w-4" />;
      case "Contact":
        return <Phone className="h-4 w-4" />;
      case "Referral":
        return <TrendingUp className="h-4 w-4" />;
      case "Task":
        return <Clock className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600">Loading client dashboard...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Client Not Found</h2>
          <p className="text-gray-600">
            The client you're looking for doesn't exist.
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-3xl font-bold text-gray-900">
              Client Dashboard
            </h1>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. Client Profile Header */}
          <Card className="bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.name}`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {client.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {client.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{client.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Case Worker: {client.caseWorker}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <Badge
                      variant={
                        client.status === "active" ? "default" : "secondary"
                      }
                    >
                      {client.status.charAt(0).toUpperCase() +
                        client.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Program: {client.supportProgram}
                    </span>
                    <span className="text-sm text-gray-500">
                      Joined: {formatDate(client.joinDate)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Journey Progress Bar */}
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Journey Progress
                  </CardTitle>
                  <CardDescription>
                    Current stage:{" "}
                    {journeyProgress?.stages[journeyProgress.currentStage]}(
                    {getProgressPercentage(
                      journeyProgress?.currentStage || 0,
                      journeyProgress?.stages.length || 6,
                    )}
                    % complete)
                  </CardDescription>
                </div>
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditJourney}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Journey
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress
                  value={getProgressPercentage(
                    journeyProgress?.currentStage || 0,
                    journeyProgress?.stages.length || 6,
                  )}
                  className="h-2"
                />
                <div className="flex justify-between items-center">
                  {journeyProgress?.stages.map((stage, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center space-y-2 flex-1"
                    >
                      {getStageIcon(
                        index,
                        journeyProgress.currentStage,
                        journeyProgress.completedStages,
                      )}
                      <span
                        className={`text-xs text-center px-2 ${
                          journeyProgress.completedStages.includes(index)
                            ? "text-green-600 font-medium"
                            : index === journeyProgress.currentStage
                              ? "text-blue-600 font-medium"
                              : "text-gray-400"
                        }`}
                      >
                        {stage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Recommendations Section */}
          {recommendations.length > 0 && (
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recommendations
                </CardTitle>
                <CardDescription>
                  AI-generated suggestions based on recent assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        rec.priority === "high"
                          ? "border-red-500 bg-red-50"
                          : rec.priority === "medium"
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-blue-500 bg-blue-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {rec.message}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Triggered by: {rec.triggeredBy}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(rec.priority)}
                        >
                          {rec.priority} priority
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 4. Assessments Snapshot */}
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Assessments Snapshot
                  </CardTitle>
                  <CardDescription>
                    Overview of completed and upcoming assessments
                  </CardDescription>
                </div>
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleScheduleAssessment}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Schedule Assessment
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {assessmentResults.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg group relative"
                  >
                    {assessment.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : assessment.status === "cancelled" ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                    <div className="flex-1">
                      <span className="font-medium">{assessment.type}</span>
                      {assessment.status === "completed" && (
                        <>
                          <span className="mx-2">•</span>
                          <Badge
                            variant={getRiskBadgeVariant(assessment.riskLevel)}
                            className="text-xs"
                          >
                            {assessment.riskLevel}
                          </Badge>
                          {assessment.score > 0 && (
                            <span className="ml-2 text-sm text-gray-600">
                              Score: {assessment.score}
                            </span>
                          )}
                        </>
                      )}
                      {assessment.status === "scheduled" && (
                        <span className="ml-2 text-sm text-gray-600">
                          ⏳ Scheduled
                        </span>
                      )}
                      {assessment.status === "cancelled" && (
                        <span className="ml-2 text-sm text-red-600">
                          ❌ Cancelled
                        </span>
                      )}
                    </div>
                    {canEdit && assessment.status === "scheduled" && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelAssessment(assessment.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <span className="text-blue-700 font-medium">
                    Next: Apr 10
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Client Timeline Table */}
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Client Timeline
                  </CardTitle>
                  <CardDescription>
                    Chronological log of all key events and interactions
                  </CardDescription>
                </div>
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddTimelineEvent}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Timeline Event
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timelineEvents
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime(),
                  )
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                          {getEventIcon(event.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {event.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {event.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-gray-500">
                                {formatDate(event.date)}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {event.type}
                              </Badge>
                              {event.score && (
                                <span className="text-sm font-medium">
                                  Score: {event.score}
                                </span>
                              )}
                              {event.riskLevel && (
                                <Badge
                                  variant={getRiskBadgeVariant(event.riskLevel)}
                                  className="text-xs"
                                >
                                  {event.riskLevel === "moderate"
                                    ? "⚠️ Moderate Risk"
                                    : event.riskLevel === "high"
                                      ? "🚨 High Risk"
                                      : event.riskLevel === "mild"
                                        ? "✅ Mild Risk"
                                        : event.riskLevel}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {canEdit && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditTimelineEvent(event)}
                                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {canDelete && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteTimelineEvent(event)
                                  }
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Journey Stage Dialog */}
      <Dialog
        open={showEditJourneyDialog}
        onOpenChange={setShowEditJourneyDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Journey Stage</DialogTitle>
            <DialogDescription>
              Update the client's current journey stage and status.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Journey Stage</Label>
              <Select
                value={journeyEditForm.stage}
                onValueChange={(value) =>
                  setJourneyEditForm((prev) => ({ ...prev, stage: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {defaultStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="completedDate">Stage Completed Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(journeyEditForm.completedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={journeyEditForm.completedDate}
                    onSelect={(date) =>
                      date &&
                      setJourneyEditForm((prev) => ({
                        ...prev,
                        completedDate: date,
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={journeyEditForm.status}
                onValueChange={(
                  value: "Pending" | "In Progress" | "Completed",
                ) => setJourneyEditForm((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditJourneyDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveJourneyStage}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Assessment Dialog */}
      <Dialog
        open={showScheduleAssessmentDialog}
        onOpenChange={setShowScheduleAssessmentDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule New Assessment</DialogTitle>
            <DialogDescription>
              Schedule a new assessment for this client.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="formId">Assessment Type</Label>
              <Select
                value={assessmentForm.formId}
                onValueChange={(value) =>
                  setAssessmentForm((prev) => ({ ...prev, formId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment" />
                </SelectTrigger>
                <SelectContent>
                  {availableAssessmentForms.map((form) => (
                    <SelectItem key={form.id} value={form.id}>
                      {form.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(assessmentForm.dueDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={assessmentForm.dueDate}
                    onSelect={(date) =>
                      date &&
                      setAssessmentForm((prev) => ({ ...prev, dueDate: date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowScheduleAssessmentDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveScheduledAssessment}
              disabled={!assessmentForm.formId}
            >
              <Save className="mr-2 h-4 w-4" />
              Schedule Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Timeline Event Dialog */}
      <Dialog
        open={showAddTimelineDialog}
        onOpenChange={setShowAddTimelineDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingTimelineEvent ? "Edit" : "Add"} Timeline Event
            </DialogTitle>
            <DialogDescription>
              {editingTimelineEvent ? "Update" : "Add"} a timeline event for
              this client.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Select
                value={timelineForm.type}
                onValueChange={(
                  value: "Assessment" | "Contact" | "Note" | "Referral",
                ) => setTimelineForm((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Assessment">Assessment</SelectItem>
                  <SelectItem value="Contact">Contact</SelectItem>
                  <SelectItem value="Note">Note</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventTitle">Event Title</Label>
              <Input
                id="eventTitle"
                value={timelineForm.title}
                onChange={(e) =>
                  setTimelineForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Enter event title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDescription">Description</Label>
              <Textarea
                id="eventDescription"
                value={timelineForm.description}
                onChange={(e) =>
                  setTimelineForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter event description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(timelineForm.date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={timelineForm.date}
                    onSelect={(date) =>
                      date && setTimelineForm((prev) => ({ ...prev, date }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddTimelineDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTimelineEvent}
              disabled={!timelineForm.title}
            >
              <Save className="mr-2 h-4 w-4" />
              {editingTimelineEvent ? "Update" : "Add"} Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Timeline Event Dialog */}
      <AlertDialog
        open={showDeleteTimelineDialog}
        onOpenChange={setShowDeleteTimelineDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Timeline Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingTimelineEvent?.title}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTimelineEvent}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientDashboard;
