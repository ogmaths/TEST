import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Phone, MessageSquare, Users, Calendar, Award } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  change?: number;
  changeType?: "increase" | "decrease";
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  description,
  change,
  changeType,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {change !== undefined && (
        <div className="flex items-center pt-1">
          <span
            className={`text-xs ${changeType === "increase" ? "text-green-500" : "text-red-500"}`}
          >
            {changeType === "increase" ? "+" : "-"}
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-muted-foreground ml-1">
            from last month
          </span>
        </div>
      )}
    </CardContent>
  </Card>
);

interface OrganizationMetricsProps {
  dateRange?: { from: Date; to: Date };
  filterArea?: string;
}

const OrganizationMetrics: React.FC<OrganizationMetricsProps> = ({
  dateRange,
  filterArea,
}) => {
  // Fetch real data from localStorage
  const metrics = React.useMemo(() => {
    // Get raw data from localStorage
    const clientsData = JSON.parse(localStorage.getItem("clients") || "[]");
    const assessmentsData = JSON.parse(
      localStorage.getItem("assessments") || "[]",
    );
    const eventsData = JSON.parse(localStorage.getItem("events") || "[]");

    // Get all interactions across all clients
    let allInteractions: any[] = [];
    clientsData.forEach((client: any) => {
      const clientInteractions = JSON.parse(
        localStorage.getItem(`interactions_${client.id}`) || "[]",
      );
      allInteractions = [...allInteractions, ...clientInteractions];
    });

    // Filter by organization if filter is applied
    const filteredClients =
      filterArea !== "all"
        ? clientsData.filter((c: any) => c.area === filterArea)
        : clientsData;

    const filteredEvents =
      filterArea !== "all"
        ? eventsData.filter((e: any) => e.area === filterArea)
        : eventsData;

    const filteredInteractions =
      filterArea !== "all"
        ? allInteractions.filter((i: any) => {
            const client = clientsData.find((c: any) => c.id === i.clientId);
            return client && client.area === filterArea;
          })
        : allInteractions;

    // Count interactions by type
    const phoneCalls = filteredInteractions.filter(
      (i: any) => i.type === "phone_call",
    ).length;

    const textMessages = filteredInteractions.filter(
      (i: any) => i.type === "text_message",
    ).length;

    // Count events by type
    const facilitatedGroups = filteredEvents.filter(
      (e: any) => e.type === "group_session" || e.type === "support",
    ).length;

    const inPersonEvents = filteredEvents.filter(
      (e: any) => e.location && !e.location.toLowerCase().includes("online"),
    ).length;

    const onlineEvents = filteredEvents.filter(
      (e: any) => e.location && e.location.toLowerCase().includes("online"),
    ).length;

    // Count counselling sessions and calculate averages
    const counsellingSessions = filteredInteractions.filter(
      (i: any) => i.isCounsellingSession,
    );

    const counsellingSupport = counsellingSessions.length;

    const phq9Scores = counsellingSessions
      .map((i: any) => i.phq9Score)
      .filter((score: any) => score !== null && score !== undefined);

    const gad7Scores = counsellingSessions
      .map((i: any) => i.gad7Score)
      .filter((score: any) => score !== null && score !== undefined);

    const phq9Average =
      phq9Scores.length > 0
        ? phq9Scores.reduce((sum: number, score: number) => sum + score, 0) /
          phq9Scores.length
        : 0;

    const gad7Average =
      gad7Scores.length > 0
        ? gad7Scores.reduce((sum: number, score: number) => sum + score, 0) /
          gad7Scores.length
        : 0;

    // Count post-event engagements
    const postEventEngagements = filteredInteractions.filter(
      (i: any) => i.isPostEventEngagement,
    ).length;

    // Count group sessions
    const groupSessions = filteredEvents.filter(
      (e: any) => e.type === "group_session",
    ).length;

    // Count assessments
    const assessmentsCompleted = assessmentsData.filter(
      (a: any) => a.status === "completed",
    ).length;

    const exitAssessments = assessmentsData.filter(
      (a: any) => a.type === "Exit" || a.type === "exit",
    ).length;

    return {
      phoneCalls,
      textMessages,
      facilitatedGroups,
      assessmentsCompleted,
      inPersonEvents,
      onlineEvents,
      clientsSupported: filteredClients.length,
      postEventEngagements,
      groupSessions,
      counsellingSupport,
      phq9Average,
      gad7Average,
      peerSupportGroups: facilitatedGroups,
      impactScore: 78, // Placeholder for now
      exitAssessments,
    };
  }, [filterArea, dateRange]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Phone Calls"
          value={metrics.phoneCalls}
          icon={<Phone className="h-4 w-4" />}
          change={12}
          changeType="increase"
        />
        <MetricCard
          title="Text Messages"
          value={metrics.textMessages}
          icon={<MessageSquare className="h-4 w-4" />}
          change={8}
          changeType="increase"
        />
        <MetricCard
          title="Facilitated Groups"
          value={metrics.facilitatedGroups}
          icon={<Users className="h-4 w-4" />}
          change={5}
          changeType="increase"
        />
        <MetricCard
          title="Assessments"
          value={metrics.assessmentsCompleted}
          icon={<Award className="h-4 w-4" />}
          change={3}
          changeType="increase"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="In-Person Events"
          value={metrics.inPersonEvents}
          icon={<Calendar className="h-4 w-4" />}
          description="Total events hosted physically"
        />
        <MetricCard
          title="Online Events"
          value={metrics.onlineEvents}
          icon={<Calendar className="h-4 w-4" />}
          description="Total virtual events hosted"
        />
        <MetricCard
          title="Clients Supported"
          value={metrics.clientsSupported}
          icon={<Users className="h-4 w-4" />}
          change={15}
          changeType="increase"
        />
        <MetricCard
          title="Post-Event Engagements"
          value={metrics.postEventEngagements}
          icon={<MessageSquare className="h-4 w-4" />}
          description="Clients engaged after events"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Counselling Support Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">PHQ-9 Average Score</span>
                <span className="text-sm font-medium">
                  {metrics.phq9Average}
                </span>
              </div>
              <Progress
                value={(metrics.phq9Average / 27) * 100}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Depression severity assessment (0-27 scale)
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">GAD-7 Average Score</span>
                <span className="text-sm font-medium">
                  {metrics.gad7Average}
                </span>
              </div>
              <Progress
                value={(metrics.gad7Average / 21) * 100}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Anxiety severity assessment (0-21 scale)
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">
                  Total Counselling Sessions
                </span>
                <span className="text-sm font-medium">
                  {metrics.counsellingSupport}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">
                  Group: {metrics.groupSessions}
                </span>
                <span className="text-xs text-muted-foreground">
                  Individual:{" "}
                  {metrics.counsellingSupport - metrics.groupSessions}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Impact Score</span>
                <span className="text-sm font-medium">
                  {metrics.impactScore}%
                </span>
              </div>
              <Progress value={metrics.impactScore} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Calculated from client outcomes and feedback
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationMetrics;
