import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Settings, BarChart2, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import UserSettings from "@/components/UserSettings";
import AssessmentList from "@/components/AssessmentList";
import { Assessment, AssessmentSummary } from "@/types/assessment";

const AssessmentDashboard: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [summary, setSummary] = useState<AssessmentSummary>({
    totalAssessments: 0,
    completedAssessments: 0,
    pendingAssessments: 0,
    averageScore: 0,
    byType: {
      introduction: 0,
      progress: 0,
      exit: 0,
    },
  });

  // Load assessments and calculate summary
  useEffect(() => {
    // In a real app, this would fetch from an API
    const mockAssessments: Assessment[] = [
      {
        id: "1",
        clientName: "Jane Smith",
        clientId: "1",
        type: "introduction",
        date: "2023-03-10",
        completedBy: "Michael Johnson",
        score: 3.2,
        status: "completed",
      },
      {
        id: "2",
        clientName: "Robert Chen",
        clientId: "2",
        type: "introduction",
        date: "2023-04-05",
        completedBy: "Sarah Williams",
        score: 2.8,
        status: "completed",
      },
      {
        id: "3",
        clientName: "Maria Garcia",
        clientId: "3",
        type: "exit",
        date: "2023-05-20",
        completedBy: "Michael Johnson",
        score: 7.5,
        status: "completed",
      },
      {
        id: "4",
        clientName: "David Wilson",
        clientId: "4",
        type: "progress",
        date: "2023-05-12",
        completedBy: "Lisa Chen",
        score: 5.2,
        status: "completed",
      },
      {
        id: "5",
        clientName: "Jane Smith",
        clientId: "1",
        type: "progress",
        date: "2023-06-10",
        completedBy: "Sarah Williams",
        score: 6.1,
        status: "completed",
      },
      {
        id: "6",
        clientName: "Alex Johnson",
        clientId: "5",
        type: "introduction",
        date: "2023-06-15",
        completedBy: "Michael Johnson",
        status: "pending",
      },
      {
        id: "7",
        clientName: "Emma Brown",
        clientId: "6",
        type: "progress",
        date: "2023-06-18",
        completedBy: "Lisa Chen",
        status: "in_progress",
      },
    ];

    setAssessments(mockAssessments);

    // Calculate summary statistics
    const completed = mockAssessments.filter(
      (a) => a.status === "completed",
    ).length;
    const pending = mockAssessments.filter(
      (a) => a.status === "pending" || a.status === "in_progress",
    ).length;
    const total = mockAssessments.length;

    // Calculate average score from completed assessments with scores
    const scoresArray = mockAssessments
      .filter((a) => a.status === "completed" && a.score !== undefined)
      .map((a) => a.score as number);

    const avgScore =
      scoresArray.length > 0
        ? scoresArray.reduce((sum, score) => sum + score, 0) /
          scoresArray.length
        : 0;

    // Count by type
    const introCount = mockAssessments.filter(
      (a) => a.type === "introduction",
    ).length;
    const progressCount = mockAssessments.filter(
      (a) => a.type === "progress",
    ).length;
    const exitCount = mockAssessments.filter((a) => a.type === "exit").length;

    setSummary({
      totalAssessments: total,
      completedAssessments: completed,
      pendingAssessments: pending,
      averageScore: avgScore,
      byType: {
        introduction: introCount,
        progress: progressCount,
        exit: exitCount,
      },
    });
  }, []);

  const handleAddAssessment = () => {
    // Navigate to assessment creation page
    window.location.href = "/assessment/new";
  };

  return (
    <div className="p-6 bg-background">
      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <UserSettings onClose={() => setShowSettings(false)} />
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <BackButton />
        </div>
        <div className="flex items-center gap-2">
          <Link to="/events">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> View Events
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-6">Assessments Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <FileText className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold">{summary.totalAssessments}</h3>
              <p className="text-sm text-muted-foreground">Total Assessments</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <BarChart2 className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold">
                {summary.averageScore.toFixed(1)}
              </h3>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <FileText className="h-8 w-8 text-green-500" />
              <h3 className="text-2xl font-bold">
                {summary.completedAssessments}
              </h3>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <FileText className="h-8 w-8 text-amber-500" />
              <h3 className="text-2xl font-bold">
                {summary.pendingAssessments}
              </h3>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment List */}
      <AssessmentList
        assessments={assessments}
        showAddButton={true}
        showFilters={true}
        onAddAssessment={handleAddAssessment}
      />
    </div>
  );
};

export default AssessmentDashboard;
