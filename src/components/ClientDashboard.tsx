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
} from "lucide-react";
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

  // Default journey stages
  const defaultStages = [
    "Initial Contact",
    "Antenatal Support",
    "Birth",
    "6-Week Check-In",
    "3-Month Check-In",
    "Exit",
  ];

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
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Assessments Snapshot
              </CardTitle>
              <CardDescription>
                Overview of completed and upcoming assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {assessmentResults.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                  >
                    {assessment.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                    <div>
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
                    </div>
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
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Client Timeline
              </CardTitle>
              <CardDescription>
                Chronological log of all key events and interactions
              </CardDescription>
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
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                          {getEventIcon(event.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
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
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
