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
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import BackButton from "@/components/BackButton";
import JourneyTimeline from "@/components/JourneyTimeline";

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
  journeyTypeId?: string;
  journeyTypeName?: string;
  journeyStatus?: "active" | "completed" | "completed_early";
  completionReason?: string;
  completionDate?: string;
  completedBy?: string;
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
  summary: string;
  description?: string;
  date: string;
  score?: number;
  riskLevel?: string;
  duration?: string;
  outcome?: string;
  followUpRequired?: boolean;
  priority?: "low" | "medium" | "high";
  staffMember?: string;
  location?: string;
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
  const [showJourneyTypeDialog, setShowJourneyTypeDialog] = useState(false);
  const [availableJourneyTypes, setAvailableJourneyTypes] = useState<any[]>([]);
  const [filteredJourneyTypes, setFilteredJourneyTypes] = useState<any[]>([]);
  const [showCompleteJourneyDialog, setShowCompleteJourneyDialog] =
    useState(false);
  const [completionReason, setCompletionReason] = useState("");

  // Form states
  const [journeyEditForm, setJourneyEditForm] = useState({
    stage: "",
    completedDate: new Date(),
    status: "Pending" as "Pending" | "In Progress" | "Completed",
  });

  const [journeyTypeForm, setJourneyTypeForm] = useState({
    journeyTypeId: "",
  });

  const [assessmentForm, setAssessmentForm] = useState({
    formId: "",
    dueDate: new Date(),
    status: "scheduled" as "scheduled" | "completed" | "cancelled",
  });

  const [timelineForm, setTimelineForm] = useState({
    type: "Phone Call" as
      | "Assessment"
      | "Phone Call"
      | "Text Message"
      | "Email"
      | "In-Person Visit"
      | "Note"
      | "Referral"
      | "Task"
      | "Milestone",
    summary: "",
    description: "",
    date: new Date(),
    score: "",
    riskLevel: "" as "" | "low" | "mild" | "moderate" | "high",
    duration: "",
    outcome: "",
    followUpRequired: false,
    priority: "medium" as "low" | "medium" | "high",
    staffMember: "",
    location: "",
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
    loadJourneyTypes();
  }, [clientId]);

  const loadJourneyTypes = () => {
    const savedJourneyTypes = JSON.parse(
      localStorage.getItem("journeyTypes") || "[]",
    );
    setAvailableJourneyTypes(savedJourneyTypes);

    // Filter journey types based on user's tenant and active status
    const filtered = savedJourneyTypes.filter((journey: any) => {
      return (
        journey.isActive &&
        journey.assignedTenants &&
        journey.assignedTenants.includes(user?.tenantId || "")
      );
    });
    setFilteredJourneyTypes(filtered);
  };

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
        // Create mock journey progress with postnatal journey type
        const mockProgress: JourneyProgress = {
          id: `progress_${clientId}`,
          clientId,
          currentStage: 3,
          stages: [
            "Initial Contact",
            "7 Day Contact",
            "3 Week Contact",
            "3 Month Contact",
            "Exit",
          ],
          completedStages: [0, 1, 2],
          updatedAt: new Date().toISOString(),
          journeyTypeId: "postnatal",
          journeyTypeName: "Postnatal",
          journeyStatus: "active",
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
            summary: "EPDS Assessment, Depression screening, Risk evaluation",
            description: "Edinburgh Postnatal Depression Scale completed",
            date: "2024-03-01T10:00:00Z",
            score: 13,
            riskLevel: "moderate",
            staffMember: "Sarah Johnson",
            duration: "30 minutes",
            outcome: "Moderate risk identified, follow-up scheduled",
            followUpRequired: true,
            priority: "high",
          },
          {
            id: "event_2",
            clientId,
            type: "Phone Call",
            summary: "Weekly Support Call, Coping strategies, Mood check",
            description: "Discussed coping strategies and current mood",
            date: "2024-03-08T15:00:00Z",
            staffMember: "Sarah Johnson",
            duration: "20 minutes",
            outcome: "Client feeling more positive, strategies working well",
            followUpRequired: false,
            priority: "medium",
          },
          {
            id: "event_3",
            clientId,
            type: "Assessment",
            summary: "GAD-7 Assessment, Anxiety screening, Mental health check",
            description: "Generalized Anxiety Disorder 7-item scale",
            date: "2024-03-15T14:30:00Z",
            score: 8,
            riskLevel: "mild",
            staffMember: "Sarah Johnson",
            duration: "15 minutes",
            outcome: "Mild anxiety levels, continue current support",
            followUpRequired: false,
            priority: "medium",
          },
          {
            id: "event_4",
            clientId,
            type: "Referral",
            summary:
              "Counselling Referral, Specialist support, Mental health services",
            description:
              "Referred to specialist perinatal mental health service",
            date: "2024-03-16T11:00:00Z",
            staffMember: "Sarah Johnson",
            outcome: "Referral accepted, appointment scheduled for next week",
            followUpRequired: true,
            priority: "high",
          },
          {
            id: "event_5",
            clientId,
            type: "Text Message",
            summary: "Check-in Message, Appointment reminder, Support contact",
            description: "Sent supportive message and appointment reminder",
            date: "2024-03-20T09:30:00Z",
            staffMember: "Sarah Johnson",
            outcome: "Client responded positively",
            followUpRequired: false,
            priority: "low",
          },
          {
            id: "event_6",
            clientId,
            type: "Email",
            summary: "Resource Sharing, Self-care tips, Educational materials",
            description: "Sent helpful resources and self-care tips",
            date: "2024-03-22T14:00:00Z",
            staffMember: "Sarah Johnson",
            outcome: "Resources well received",
            followUpRequired: false,
            priority: "low",
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

  const handleChangeJourneyType = () => {
    setJourneyTypeForm({
      journeyTypeId: journeyProgress?.journeyTypeId || "",
    });
    setShowJourneyTypeDialog(true);
  };

  const handleCompleteJourney = () => {
    setCompletionReason("");
    setShowCompleteJourneyDialog(true);
  };

  const handleSaveJourneyTypeChange = async () => {
    try {
      if (!journeyTypeForm.journeyTypeId) return;

      const selectedJourneyType = filteredJourneyTypes.find(
        (jt) => jt.id === journeyTypeForm.journeyTypeId,
      );
      if (!selectedJourneyType) return;

      const updatedProgress = {
        ...journeyProgress!,
        journeyTypeId: selectedJourneyType.id,
        journeyTypeName: selectedJourneyType.name,
        stages: selectedJourneyType.stages || defaultStages,
        currentStage: 0,
        completedStages: [],
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
        summary: `Journey Type Changed to ${selectedJourneyType.name}`,
        description: `Journey type changed from ${journeyProgress?.journeyTypeName || "Default"} to ${selectedJourneyType.name}. Progress has been reset.`,
        date: new Date().toISOString(),
        staffMember: user?.name || "Support Worker",
        outcome: "Journey type updated - client progress reset to beginning",
        priority: "medium",
      };

      const updatedTimeline = [newTimelineEvent, ...timelineEvents];
      setTimelineEvents(updatedTimeline);
      localStorage.setItem(
        `timeline_events_${clientId}`,
        JSON.stringify(updatedTimeline),
      );

      setShowJourneyTypeDialog(false);
      addNotification({
        type: "success",
        title: "Journey Type Changed",
        message: `Journey type has been changed to ${selectedJourneyType.name}`,
      });
    } catch (error) {
      addNotification({
        type: "system",
        title: "Error",
        message: "Failed to change journey type",
      });
    }
  };

  const handleConfirmCompleteJourney = async () => {
    try {
      if (!journeyProgress) return;

      const updatedProgress = {
        ...journeyProgress,
        journeyStatus: "completed_early" as const,
        completionReason: completionReason.trim() || undefined,
        completionDate: new Date().toISOString(),
        completedBy: user?.id || "unknown",
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
        summary: "Journey Marked as Complete",
        description: `Journey marked as completed early by ${user?.name || "Support Worker"}${completionReason.trim() ? `. Reason: ${completionReason.trim()}` : ""}`,
        date: new Date().toISOString(),
        staffMember: user?.name || "Support Worker",
        outcome:
          "Journey completed early - client no longer requires ongoing support",
        priority: "high",
      };

      const updatedTimeline = [newTimelineEvent, ...timelineEvents];
      setTimelineEvents(updatedTimeline);
      localStorage.setItem(
        `timeline_events_${clientId}`,
        JSON.stringify(updatedTimeline),
      );

      setShowCompleteJourneyDialog(false);
      addNotification({
        type: "success",
        title: "Journey Completed",
        message: "Client journey has been marked as completed successfully",
      });
    } catch (error) {
      addNotification({
        type: "system",
        title: "Error",
        message: "Failed to complete journey",
      });
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
        summary: `Journey Stage Updated: ${journeyEditForm.stage}`,
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
        summary: `${selectedForm.name} Scheduled`,
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
      type: "Phone Call",
      summary: "",
      description: "",
      date: new Date(),
      score: "",
      riskLevel: "",
      duration: "",
      outcome: "",
      followUpRequired: false,
      priority: "medium",
      staffMember: "",
      location: "",
    });
    setEditingTimelineEvent(null);
    setShowAddTimelineDialog(true);
  };

  const handleEditTimelineEvent = (event: TimelineEvent) => {
    setTimelineForm({
      type: event.type as
        | "Assessment"
        | "Phone Call"
        | "Text Message"
        | "Email"
        | "In-Person Visit"
        | "Note"
        | "Referral"
        | "Task"
        | "Milestone",
      summary: event.summary,
      description: event.description || "",
      date: new Date(event.date),
      score: event.score?.toString() || "",
      riskLevel: event.riskLevel || "",
      duration: event.duration || "",
      outcome: event.outcome || "",
      followUpRequired: event.followUpRequired || false,
      priority: event.priority || "medium",
      staffMember: event.staffMember || "",
      location: event.location || "",
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
        summary: timelineForm.summary,
        description: timelineForm.description,
        date: timelineForm.date.toISOString(),
        score: timelineForm.score ? parseInt(timelineForm.score) : undefined,
        riskLevel: timelineForm.riskLevel || undefined,
        duration: timelineForm.duration || undefined,
        outcome: timelineForm.outcome || undefined,
        followUpRequired: timelineForm.followUpRequired,
        priority: timelineForm.priority,
        staffMember: timelineForm.staffMember || undefined,
        location: timelineForm.location || undefined,
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
      case "Phone Call":
        return <Phone className="h-4 w-4" />;
      case "Text Message":
        return <MessageSquare className="h-4 w-4" />;
      case "Email":
        return <Mail className="h-4 w-4" />;
      case "In-Person Visit":
        return <User className="h-4 w-4" />;
      case "Referral":
        return <TrendingUp className="h-4 w-4" />;
      case "Task":
        return <Clock className="h-4 w-4" />;
      case "Milestone":
        return <CheckCircle className="h-4 w-4" />;
      case "Note":
        return <Edit className="h-4 w-4" />;
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
      <ScrollArea className="h-screen">
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

          <div className="space-y-6 pb-6">
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
                      Journey Type:{" "}
                      {journeyProgress?.journeyTypeName || "Default"} • Current
                      stage:{" "}
                      {journeyProgress?.stages[journeyProgress.currentStage]}(
                      {getProgressPercentage(
                        journeyProgress?.currentStage || 0,
                        journeyProgress?.stages.length || 6,
                      )}
                      % complete)
                    </CardDescription>
                  </div>
                  {canEdit && (
                    <div className="flex items-center gap-2">
                      {journeyProgress?.journeyStatus !== "completed_early" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleChangeJourneyType}
                            className="flex items-center gap-2"
                          >
                            <TrendingUp className="h-4 w-4" />
                            Change Journey Type
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEditJourney}
                            className="flex items-center gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            Edit Journey
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCompleteJourney}
                            className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Mark as Complete
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {journeyProgress?.journeyStatus === "completed_early" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center p-6 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-center">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                          Journey Completed
                        </h3>
                        <p className="text-sm text-green-700 mb-2">
                          Marked as completed on{" "}
                          {journeyProgress.completionDate
                            ? formatDate(journeyProgress.completionDate)
                            : "Unknown date"}
                        </p>
                        {journeyProgress.completionReason && (
                          <div className="mt-3 p-3 bg-white rounded border border-green-200">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Reason:</span>{" "}
                              {journeyProgress.completionReason}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
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
                )}
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
                  {canEdit &&
                    journeyProgress?.journeyStatus !== "completed_early" && (
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
                              variant={getRiskBadgeVariant(
                                assessment.riskLevel,
                              )}
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
                            onClick={() =>
                              handleCancelAssessment(assessment.id)
                            }
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

            {/* 5. Client Journey Timeline */}
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Client Journey Timeline
                </CardTitle>
                <CardDescription>
                  Interactive timeline showing client interactions and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <JourneyTimeline
                  clientId={clientId}
                  showDetails={true}
                  compact={false}
                />
              </CardContent>
            </Card>

            {/* 6. Client Timeline Table */}
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
                  {canEdit &&
                    journeyProgress?.journeyStatus !== "completed_early" && (
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
                                {event.summary}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {event.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
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
                                    variant={getRiskBadgeVariant(
                                      event.riskLevel,
                                    )}
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
                                {event.duration && (
                                  <span className="text-xs text-gray-500">
                                    Duration: {event.duration}
                                  </span>
                                )}
                                {event.staffMember && (
                                  <span className="text-xs text-gray-500">
                                    Staff: {event.staffMember}
                                  </span>
                                )}
                                {event.followUpRequired && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Follow-up Required
                                  </Badge>
                                )}
                                {event.priority &&
                                  event.priority !== "medium" && (
                                    <Badge
                                      variant={
                                        event.priority === "high"
                                          ? "destructive"
                                          : "outline"
                                      }
                                      className="text-xs"
                                    >
                                      {event.priority} priority
                                    </Badge>
                                  )}
                              </div>
                              {event.outcome && (
                                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                  <span className="font-medium text-gray-700">
                                    Outcome:{" "}
                                  </span>
                                  <span className="text-gray-600">
                                    {event.outcome}
                                  </span>
                                </div>
                              )}
                            </div>
                            {canEdit &&
                              journeyProgress?.journeyStatus !==
                                "completed_early" && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleEditTimelineEvent(event)
                                    }
                                    className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
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
      </ScrollArea>

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
                  value:
                    | "Assessment"
                    | "Phone Call"
                    | "Text Message"
                    | "Email"
                    | "In-Person Visit"
                    | "Note"
                    | "Referral"
                    | "Task"
                    | "Milestone",
                ) => setTimelineForm((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Assessment">Assessment</SelectItem>
                  <SelectItem value="Phone Call">Phone Call</SelectItem>
                  <SelectItem value="Text Message">Text Message</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="In-Person Visit">
                    In-Person Visit
                  </SelectItem>
                  <SelectItem value="Note">Note</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Task">Task</SelectItem>
                  <SelectItem value="Milestone">Milestone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventSummary">
                Summary Areas (comma-separated)
              </Label>
              <Input
                id="eventSummary"
                value={timelineForm.summary}
                onChange={(e) =>
                  setTimelineForm((prev) => ({
                    ...prev,
                    summary: e.target.value,
                  }))
                }
                placeholder="e.g. Assessment, Risk evaluation, Follow-up required"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={timelineForm.duration}
                  onChange={(e) =>
                    setTimelineForm((prev) => ({
                      ...prev,
                      duration: e.target.value,
                    }))
                  }
                  placeholder="e.g. 30 minutes"
                />
              </div>
            </div>

            {timelineForm.type === "Assessment" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="score">Assessment Score</Label>
                  <Input
                    id="score"
                    type="number"
                    value={timelineForm.score}
                    onChange={(e) =>
                      setTimelineForm((prev) => ({
                        ...prev,
                        score: e.target.value,
                      }))
                    }
                    placeholder="Enter score"
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskLevel">Risk Level</Label>
                  <Select
                    value={timelineForm.riskLevel}
                    onValueChange={(
                      value: "" | "low" | "mild" | "moderate" | "high",
                    ) =>
                      setTimelineForm((prev) => ({ ...prev, riskLevel: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Not Specified</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="staffMember">Staff Member</Label>
                <Input
                  id="staffMember"
                  value={timelineForm.staffMember}
                  onChange={(e) =>
                    setTimelineForm((prev) => ({
                      ...prev,
                      staffMember: e.target.value,
                    }))
                  }
                  placeholder="Staff member name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={timelineForm.priority}
                  onValueChange={(value: "low" | "medium" | "high") =>
                    setTimelineForm((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(timelineForm.type === "In-Person Visit" ||
              timelineForm.type === "Assessment") && (
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={timelineForm.location}
                  onChange={(e) =>
                    setTimelineForm((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Meeting location"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="outcome">Outcome</Label>
              <Textarea
                id="outcome"
                value={timelineForm.outcome}
                onChange={(e) =>
                  setTimelineForm((prev) => ({
                    ...prev,
                    outcome: e.target.value,
                  }))
                }
                placeholder="Describe the outcome or result"
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="followUpRequired"
                checked={timelineForm.followUpRequired}
                onChange={(e) =>
                  setTimelineForm((prev) => ({
                    ...prev,
                    followUpRequired: e.target.checked,
                  }))
                }
                className="rounded border-gray-300"
              />
              <Label htmlFor="followUpRequired" className="text-sm">
                Follow-up required
              </Label>
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
              disabled={!timelineForm.summary}
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
              Are you sure you want to delete "{deletingTimelineEvent?.summary}
              "? This action cannot be undone.
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

      {/* Change Journey Type Dialog */}
      <Dialog
        open={showJourneyTypeDialog}
        onOpenChange={setShowJourneyTypeDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Journey Type</DialogTitle>
            <DialogDescription>
              Select a different journey type for this client. This will reset
              their progress.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="journeyType">Journey Type</Label>
              <Select
                value={journeyTypeForm.journeyTypeId}
                onValueChange={(value) =>
                  setJourneyTypeForm((prev) => ({
                    ...prev,
                    journeyTypeId: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select journey type" />
                </SelectTrigger>
                <SelectContent>
                  {filteredJourneyTypes.length > 0 ? (
                    filteredJourneyTypes.map((journeyType) => (
                      <SelectItem key={journeyType.id} value={journeyType.id}>
                        {journeyType.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      No journeys available. Please contact your administrator.
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {journeyTypeForm.journeyTypeId && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> Changing the journey type will reset
                  the client's progress and they will start from the first stage
                  of the new journey type.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowJourneyTypeDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveJourneyTypeChange}
              disabled={
                !journeyTypeForm.journeyTypeId ||
                filteredJourneyTypes.length === 0
              }
            >
              <Save className="mr-2 h-4 w-4" />
              Change Journey Type
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Journey Dialog */}
      <Dialog
        open={showCompleteJourneyDialog}
        onOpenChange={setShowCompleteJourneyDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Early Completion</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this journey as completed? This will
              prevent further stage updates.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="completionReason">
                Reason for Early Completion (Optional)
              </Label>
              <Textarea
                id="completionReason"
                value={completionReason}
                onChange={(e) => setCompletionReason(e.target.value)}
                placeholder="e.g., Client no longer requires support, moved out of area, achieved goals early..."
                rows={3}
              />
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Once marked as complete, you will not be
                able to add new assessments, edit journey stages, or add
                timeline events for this client.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCompleteJourneyDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmCompleteJourney}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Completion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDashboard;
