import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FeedbackMetricsProps {
  dateRange?: { from: Date; to: Date };
  filterArea?: string;
}

interface FeedbackData {
  id: string;
  clientId: string;
  clientName: string;
  eventId?: string;
  eventName?: string;
  date: string;
  overallSatisfaction: number;
  staffHelpfulness: number;
  serviceQuality: number;
  comments: string;
}

const FeedbackMetrics: React.FC<FeedbackMetricsProps> = ({
  dateRange,
  filterArea,
}) => {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
  const [activeTab, setActiveTab] = useState("overall");

  // Load feedback data from localStorage
  useEffect(() => {
    const savedFeedback = localStorage.getItem("feedback");
    if (savedFeedback) {
      setFeedbackData(JSON.parse(savedFeedback));
    } else {
      // Mock feedback data
      const mockFeedback: FeedbackData[] = [
        {
          id: "1",
          clientId: "c1",
          clientName: "John Doe",
          date: "2023-06-15",
          overallSatisfaction: 4,
          staffHelpfulness: 5,
          serviceQuality: 4,
          comments: "Very helpful service, would recommend.",
        },
        {
          id: "2",
          clientId: "c2",
          clientName: "Jane Smith",
          eventId: "e1",
          eventName: "Financial Workshop",
          date: "2023-06-10",
          overallSatisfaction: 5,
          staffHelpfulness: 5,
          serviceQuality: 5,
          comments: "Excellent workshop, learned a lot.",
        },
        {
          id: "3",
          clientId: "c3",
          clientName: "Robert Johnson",
          date: "2023-06-05",
          overallSatisfaction: 3,
          staffHelpfulness: 4,
          serviceQuality: 3,
          comments: "Service was okay, could be improved.",
        },
        {
          id: "4",
          clientId: "c4",
          clientName: "Sarah Williams",
          eventId: "e2",
          eventName: "Community Support Group",
          date: "2023-06-01",
          overallSatisfaction: 4,
          staffHelpfulness: 4,
          serviceQuality: 4,
          comments: "Good support group, felt welcomed.",
        },
      ];
      setFeedbackData(mockFeedback);
      localStorage.setItem("feedback", JSON.stringify(mockFeedback));
    }
  }, []);

  // Calculate average metrics
  const calculateAverage = (metric: keyof FeedbackData): number => {
    if (feedbackData.length === 0) return 0;
    const sum = feedbackData.reduce(
      (acc, feedback) => acc + (feedback[metric] as number),
      0,
    );
    return parseFloat((sum / feedbackData.length).toFixed(1));
  };

  const averageOverallSatisfaction = calculateAverage("overallSatisfaction");
  const averageStaffHelpfulness = calculateAverage("staffHelpfulness");
  const averageServiceQuality = calculateAverage("serviceQuality");

  // Calculate satisfaction distribution
  const satisfactionDistribution = {
    excellent: feedbackData.filter((f) => f.overallSatisfaction === 5).length,
    good: feedbackData.filter((f) => f.overallSatisfaction === 4).length,
    average: feedbackData.filter((f) => f.overallSatisfaction === 3).length,
    poor: feedbackData.filter((f) => f.overallSatisfaction === 2).length,
    veryPoor: feedbackData.filter((f) => f.overallSatisfaction === 1).length,
  };

  // Calculate percentages
  const totalFeedback = feedbackData.length;
  const excellentPercentage =
    (satisfactionDistribution.excellent / totalFeedback) * 100;
  const goodPercentage = (satisfactionDistribution.good / totalFeedback) * 100;
  const averagePercentage =
    (satisfactionDistribution.average / totalFeedback) * 100;
  const poorPercentage = (satisfactionDistribution.poor / totalFeedback) * 100;
  const veryPoorPercentage =
    (satisfactionDistribution.veryPoor / totalFeedback) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Satisfaction Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="comments">Recent Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="overall" className="space-y-4 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">
                  Overall Satisfaction
                </span>
                <span className="text-sm font-medium">
                  {averageOverallSatisfaction}/5
                </span>
              </div>
              <Progress
                value={averageOverallSatisfaction * 20}
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Staff Helpfulness</span>
                <span className="text-sm font-medium">
                  {averageStaffHelpfulness}/5
                </span>
              </div>
              <Progress value={averageStaffHelpfulness * 20} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Service Quality</span>
                <span className="text-sm font-medium">
                  {averageServiceQuality}/5
                </span>
              </div>
              <Progress value={averageServiceQuality * 20} className="h-2" />
            </div>

            <div className="pt-4 text-sm text-muted-foreground">
              Based on {totalFeedback} client feedback submissions
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="pt-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Excellent (5)</span>
                  <span className="text-sm font-medium">
                    {satisfactionDistribution.excellent} (
                    {excellentPercentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${excellentPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Good (4)</span>
                  <span className="text-sm font-medium">
                    {satisfactionDistribution.good} ({goodPercentage.toFixed(0)}
                    %)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${goodPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Average (3)</span>
                  <span className="text-sm font-medium">
                    {satisfactionDistribution.average} (
                    {averagePercentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${averagePercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Poor (2)</span>
                  <span className="text-sm font-medium">
                    {satisfactionDistribution.poor} ({poorPercentage.toFixed(0)}
                    %)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${poorPercentage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Very Poor (1)</span>
                  <span className="text-sm font-medium">
                    {satisfactionDistribution.veryPoor} (
                    {veryPoorPercentage.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${veryPoorPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="pt-4">
            <div className="space-y-4">
              {feedbackData
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime(),
                )
                .slice(0, 5)
                .map((feedback) => (
                  <div
                    key={feedback.id}
                    className="border-l-2 border-muted pl-4 py-2"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{feedback.clientName}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(feedback.date).toLocaleDateString()}
                      </span>
                    </div>
                    {feedback.eventName && (
                      <div className="text-sm text-muted-foreground">
                        Event: {feedback.eventName}
                      </div>
                    )}
                    <div className="text-sm mt-1">{feedback.comments}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        Rating: {feedback.overallSatisfaction}/5
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FeedbackMetrics;
