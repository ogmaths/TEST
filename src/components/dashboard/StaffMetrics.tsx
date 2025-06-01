import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Phone, MessageSquare, FileText, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/admin";

interface StaffMetricsProps {
  dateRange?: { from: Date; to: Date };
  filterArea?: string;
}

interface StaffMetric {
  id: string;
  name: string;
  email: string;
  role: string;
  clientsSupported: number;
  phoneCalls: number;
  textMessages: number;
  assessmentsCompleted: number;
  eventsHosted: number;
  impactScore: number;
  phq9Improvement: number;
  gad7Improvement: number;
  clientSatisfaction: number;
}

const StaffMetrics: React.FC<StaffMetricsProps> = ({
  dateRange,
  filterArea,
}) => {
  const [staffData, setStaffData] = useState<StaffMetric[]>([]);
  const [selectedMetric, setSelectedMetric] =
    useState<string>("clientsSupported");
  const [selectedStaff, setSelectedStaff] = useState<string>("all");

  // Fetch staff metrics data
  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    // For now, we'll use mock data
    const mockStaffData: StaffMetric[] = [
      {
        id: "1",
        name: "Stacy Williams",
        email: "stacy.williams@example.com",
        role: "admin",
        clientsSupported: 24,
        phoneCalls: 87,
        textMessages: 156,
        assessmentsCompleted: 18,
        eventsHosted: 5,
        impactScore: 82,
        phq9Improvement: 35,
        gad7Improvement: 42,
        clientSatisfaction: 92,
      },
      {
        id: "2",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "support_worker",
        clientsSupported: 18,
        phoneCalls: 124,
        textMessages: 89,
        assessmentsCompleted: 15,
        eventsHosted: 3,
        impactScore: 76,
        phq9Improvement: 28,
        gad7Improvement: 31,
        clientSatisfaction: 88,
      },
      {
        id: "3",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "support_worker",
        clientsSupported: 15,
        phoneCalls: 92,
        textMessages: 118,
        assessmentsCompleted: 12,
        eventsHosted: 4,
        impactScore: 79,
        phq9Improvement: 32,
        gad7Improvement: 29,
        clientSatisfaction: 90,
      },
      {
        id: "4",
        name: "Michael Johnson",
        email: "michael.j@example.com",
        role: "manager",
        clientsSupported: 8,
        phoneCalls: 45,
        textMessages: 67,
        assessmentsCompleted: 6,
        eventsHosted: 8,
        impactScore: 81,
        phq9Improvement: 30,
        gad7Improvement: 35,
        clientSatisfaction: 85,
      },
    ];

    setStaffData(mockStaffData);
  }, [dateRange, filterArea]);

  const getMetricName = (key: string): string => {
    const metricNames: Record<string, string> = {
      clientsSupported: "Clients Supported",
      phoneCalls: "Phone Calls",
      textMessages: "Text Messages",
      assessmentsCompleted: "Assessments Completed",
      eventsHosted: "Events Hosted",
      impactScore: "Impact Score",
      phq9Improvement: "PHQ-9 Improvement %",
      gad7Improvement: "GAD-7 Improvement %",
      clientSatisfaction: "Client Satisfaction %",
    };
    return metricNames[key] || key;
  };

  const getMetricIcon = (key: string) => {
    switch (key) {
      case "clientsSupported":
        return <Users className="h-4 w-4" />;
      case "phoneCalls":
        return <Phone className="h-4 w-4" />;
      case "textMessages":
        return <MessageSquare className="h-4 w-4" />;
      case "assessmentsCompleted":
        return <FileText className="h-4 w-4" />;
      case "impactScore":
      case "phq9Improvement":
      case "gad7Improvement":
      case "clientSatisfaction":
        return <Award className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getAverageMetric = (key: string): number => {
    if (staffData.length === 0) return 0;
    const sum = staffData.reduce(
      (acc, staff) => acc + (staff[key as keyof StaffMetric] as number),
      0,
    );
    return Math.round((sum / staffData.length) * 10) / 10; // Round to 1 decimal place
  };

  const getMaxMetric = (key: string): number => {
    if (staffData.length === 0) return 0;
    return Math.max(
      ...staffData.map((staff) => staff[key as keyof StaffMetric] as number),
    );
  };

  const getStaffToDisplay = () => {
    if (selectedStaff === "all") return staffData;
    return staffData.filter((staff) => staff.id === selectedStaff);
  };

  const getMetricColor = (value: number, key: string): string => {
    // Different metrics have different scales
    if (key === "impactScore" || key === "clientSatisfaction") {
      if (value >= 85) return "bg-green-500";
      if (value >= 70) return "bg-green-400";
      if (value >= 50) return "bg-yellow-400";
      return "bg-red-400";
    }

    if (key === "phq9Improvement" || key === "gad7Improvement") {
      if (value >= 30) return "bg-green-500";
      if (value >= 20) return "bg-green-400";
      if (value >= 10) return "bg-yellow-400";
      return "bg-red-400";
    }

    // For count-based metrics, compare to the max value
    const max = getMaxMetric(key);
    const ratio = value / max;

    if (ratio >= 0.8) return "bg-green-500";
    if (ratio >= 0.6) return "bg-green-400";
    if (ratio >= 0.4) return "bg-yellow-400";
    return "bg-red-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Staff Performance Metrics
          </h2>
          <p className="text-muted-foreground">
            Analyze individual staff performance and impact metrics
          </p>
        </div>

        <div className="flex gap-4">
          <div className="w-[180px]">
            <Select value={selectedStaff} onValueChange={setSelectedStaff}>
              <SelectTrigger>
                <SelectValue placeholder="Select staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Staff</SelectItem>
                {staffData.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-[180px]">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger>
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clientsSupported">
                  Clients Supported
                </SelectItem>
                <SelectItem value="phoneCalls">Phone Calls</SelectItem>
                <SelectItem value="textMessages">Text Messages</SelectItem>
                <SelectItem value="assessmentsCompleted">
                  Assessments
                </SelectItem>
                <SelectItem value="eventsHosted">Events Hosted</SelectItem>
                <SelectItem value="impactScore">Impact Score</SelectItem>
                <SelectItem value="phq9Improvement">
                  PHQ-9 Improvement
                </SelectItem>
                <SelectItem value="gad7Improvement">
                  GAD-7 Improvement
                </SelectItem>
                <SelectItem value="clientSatisfaction">
                  Client Satisfaction
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="details">Detailed Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getMetricIcon(selectedMetric)}
                {getMetricName(selectedMetric)} Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {getStaffToDisplay().map((staff) => (
                  <div key={staff.id} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{staff.name}</span>
                      <span className="text-sm font-medium">
                        {staff[selectedMetric as keyof StaffMetric]}
                        {selectedMetric.includes("Improvement") ||
                        selectedMetric === "clientSatisfaction" ||
                        selectedMetric === "impactScore"
                          ? "%"
                          : ""}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full ${getMetricColor(staff[selectedMetric as keyof StaffMetric] as number, selectedMetric)}`}
                        style={{
                          width: `${((staff[selectedMetric as keyof StaffMetric] as number) / getMaxMetric(selectedMetric)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}

                {selectedStaff === "all" && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Team Average</span>
                      <span className="text-sm font-medium">
                        {getAverageMetric(selectedMetric)}
                        {selectedMetric.includes("Improvement") ||
                        selectedMetric === "clientSatisfaction" ||
                        selectedMetric === "impactScore"
                          ? "%"
                          : ""}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted mt-1">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${(getAverageMetric(selectedMetric) / getMaxMetric(selectedMetric)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Detailed Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left">
                      <th className="p-2 pl-4">Staff Member</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Clients</th>
                      <th className="p-2">Calls</th>
                      <th className="p-2">Messages</th>
                      <th className="p-2">Assessments</th>
                      <th className="p-2">Events</th>
                      <th className="p-2">Impact Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getStaffToDisplay().map((staff) => (
                      <tr key={staff.id} className="border-b">
                        <td className="p-2 pl-4 font-medium">{staff.name}</td>
                        <td className="p-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${staff.role === "admin" ? "bg-purple-100 text-purple-800" : staff.role === "support_worker" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {staff.role}
                          </span>
                        </td>
                        <td className="p-2">{staff.clientsSupported}</td>
                        <td className="p-2">{staff.phoneCalls}</td>
                        <td className="p-2">{staff.textMessages}</td>
                        <td className="p-2">{staff.assessmentsCompleted}</td>
                        <td className="p-2">{staff.eventsHosted}</td>
                        <td className="p-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getMetricColor(staff.impactScore, "impactScore").replace("bg-", "text-").replace("500", "800").replace("400", "700")} ${getMetricColor(staff.impactScore, "impactScore").replace("bg-", "bg-").replace("500", "100").replace("400", "100")}`}
                          >
                            {staff.impactScore}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffMetrics;
