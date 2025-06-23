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
  // Helper function to check if a date is within the selected range
  const isWithinDateRange = (dateStr: string) => {
    if (!dateRange || !dateStr) return true;
    const date = new Date(dateStr);
    return date >= dateRange.from && date <= dateRange.to;
  };

  // Fetch real data from localStorage with date filtering
  const metrics = React.useMemo(() => {
    // Get raw data from localStorage
    const clientsData = JSON.parse(localStorage.getItem("clients") || "[]");
    const assessmentsData = JSON.parse(
      localStorage.getItem("assessments") || "[]",
    );
    const eventsData = JSON.parse(localStorage.getItem("events") || "[]");

    // Filter data by date range
    const filteredClientsData = clientsData.filter((client: any) => {
      const matchesDate = client.joinDate
        ? isWithinDateRange(client.joinDate)
        : true;
      return matchesDate;
    });

    const filteredAssessmentsData = assessmentsData.filter(
      (assessment: any) => {
        const matchesDate = assessment.date
          ? isWithinDateRange(assessment.date)
          : true;
        return matchesDate;
      },
    );

    const filteredEventsData = eventsData.filter((event: any) => {
      const matchesDate = event.date ? isWithinDateRange(event.date) : true;
      return matchesDate;
    });

    // Get all interactions across all clients with date filtering
    let allInteractions: any[] = [];
    filteredClientsData.forEach((client: any) => {
      const clientInteractions = JSON.parse(
        localStorage.getItem(`interactions_${client.id}`) || "[]",
      );
      const filteredInteractions = clientInteractions.filter(
        (interaction: any) => {
          const matchesDate = interaction.date
            ? isWithinDateRange(interaction.date)
            : true;
          return matchesDate;
        },
      );
      allInteractions = [...allInteractions, ...filteredInteractions];
    });

    // Filter by area if filter is applied (after date filtering)
    const filteredClients =
      filterArea !== "all"
        ? filteredClientsData.filter((c: any) => c.area === filterArea)
        : filteredClientsData;

    const filteredEvents =
      filterArea !== "all"
        ? filteredEventsData.filter((e: any) => e.area === filterArea)
        : filteredEventsData;

    const filteredInteractions =
      filterArea !== "all"
        ? allInteractions.filter((i: any) => {
            const client = filteredClientsData.find(
              (c: any) => c.id === i.clientId,
            );
            return client && client.area === filterArea;
          })
        : allInteractions;

    // Also filter assessments by area through client association
    const filteredAssessments =
      filterArea !== "all"
        ? filteredAssessmentsData.filter((a: any) => {
            const client = filteredClientsData.find(
              (c: any) => c.id === a.clientId,
            );
            return client && client.area === filterArea;
          })
        : filteredAssessmentsData;

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

    // Count assessments (using filtered data)
    const assessmentsCompleted = filteredAssessments.filter(
      (a: any) => a.status === "completed",
    ).length;

    const exitAssessments = filteredAssessments.filter(
      (a: any) => a.type === "Exit" || a.type === "exit",
    ).length;

    // Count journey completions
    let naturalCompletions = 0;
    let earlyCompletions = 0;
    let totalJourneyDuration = 0;
    let completedJourneys = 0;

    filteredClients.forEach((client: any) => {
      const journeyProgress = JSON.parse(
        localStorage.getItem(`journey_progress_${client.id}`) || "null",
      );
      if (journeyProgress) {
        if (journeyProgress.journeyStatus === "completed_early") {
          earlyCompletions++;
          completedJourneys++;
          // Calculate duration from client join date to completion date
          if (journeyProgress.completionDate && client.joinDate) {
            const duration =
              new Date(journeyProgress.completionDate).getTime() -
              new Date(client.joinDate).getTime();
            totalJourneyDuration += duration / (1000 * 60 * 60 * 24); // Convert to days
          }
        } else if (journeyProgress.journeyStatus === "completed") {
          naturalCompletions++;
          completedJourneys++;
          // Calculate duration for natural completions
          if (journeyProgress.updatedAt && client.joinDate) {
            const duration =
              new Date(journeyProgress.updatedAt).getTime() -
              new Date(client.joinDate).getTime();
            totalJourneyDuration += duration / (1000 * 60 * 60 * 24); // Convert to days
          }
        }
      }
    });

    const averageJourneyDuration =
      completedJourneys > 0
        ? Math.round(totalJourneyDuration / completedJourneys)
        : 0;
    const completionRate =
      filteredClients.length > 0
        ? Math.round((completedJourneys / filteredClients.length) * 100)
        : 0;

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
      naturalCompletions,
      earlyCompletions,
      averageJourneyDuration,
      completionRate,
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
            <CardTitle>Journey Completion Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {metrics.naturalCompletions}
                </div>
                <div className="text-xs text-green-700">
                  Natural Completions
                </div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.earlyCompletions}
                </div>
                <div className="text-xs text-blue-700">Early Completions</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm font-medium">
                  {metrics.completionRate}%
                </span>
              </div>
              <Progress value={metrics.completionRate} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Percentage of clients who have completed their journey
              </p>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">
                Average Journey Duration
              </span>
              <span className="text-lg font-bold text-gray-700">
                {metrics.averageJourneyDuration} days
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationMetrics;
