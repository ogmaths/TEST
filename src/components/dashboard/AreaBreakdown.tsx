import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2 } from "lucide-react";

interface Area {
  id: string;
  name: string;
  clientCount: number;
  eventCount: number;
  assessmentCount: number;
  impactScore: number;
  color: string;
}

interface AreaBreakdownProps {
  isManagementView?: boolean;
}

const AreaBreakdown: React.FC<AreaBreakdownProps> = ({
  isManagementView = false,
}) => {
  // Remove duplicate areas by using a Set-like approach with a Map
  const initialAreas = [
    {
      id: "1",
      name: "North District",
      clientCount: 87,
      eventCount: 12,
      assessmentCount: 54,
      impactScore: 76,
      color: "#4f46e5",
    },
    {
      id: "2",
      name: "South District",
      clientCount: 65,
      eventCount: 8,
      assessmentCount: 42,
      impactScore: 68,
      color: "#06b6d4",
    },
    {
      id: "3",
      name: "East District",
      clientCount: 43,
      eventCount: 6,
      assessmentCount: 31,
      impactScore: 72,
      color: "#10b981",
    },
    {
      id: "4",
      name: "West District",
      clientCount: 48,
      eventCount: 7,
      assessmentCount: 29,
      impactScore: 65,
      color: "#f59e0b",
    },
  ];

  // Remove any duplicates from the initial data
  const uniqueAreas = Array.from(
    new Map(
      initialAreas.map((area) => [area.name.toLowerCase(), area]),
    ).values(),
  );

  const [areas, setAreas] = useState<Area[]>(uniqueAreas);

  const [activeTab, setActiveTab] = useState("clients");

  const getTotalForMetric = (metric: keyof Area) => {
    return areas.reduce((sum, area) => sum + (area[metric] as number), 0);
  };

  const getMaxForMetric = (metric: keyof Area) => {
    return Math.max(...areas.map((area) => area[metric] as number));
  };

  const renderBarChart = (metric: keyof Area) => {
    const maxValue = getMaxForMetric(metric);

    return (
      <div className="space-y-4">
        {areas.map((area) => {
          const value = area[metric] as number;
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

          return (
            <div key={area.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: area.color }}
                  ></div>
                  <span className="text-sm font-medium">{area.name}</span>
                </div>
                <span className="text-sm font-medium">{value}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: area.color,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{isManagementView ? "Area" : "Area Breakdown"}</CardTitle>
          <CardDescription>
            {isManagementView
              ? "Manage geographical areas for your organization"
              : "Performance metrics by geographical area"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {!isManagementView && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="assessments">Assessments</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="clients" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Clients by Area</h4>
                <span className="text-sm text-muted-foreground">
                  Total: {getTotalForMetric("clientCount")}
                </span>
              </div>
              {renderBarChart("clientCount")}
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Events by Area</h4>
                <span className="text-sm text-muted-foreground">
                  Total: {getTotalForMetric("eventCount")}
                </span>
              </div>
              {renderBarChart("eventCount")}
            </TabsContent>

            <TabsContent value="assessments" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Assessments by Area</h4>
                <span className="text-sm text-muted-foreground">
                  Total: {getTotalForMetric("assessmentCount")}
                </span>
              </div>
              {renderBarChart("assessmentCount")}
            </TabsContent>

            <TabsContent value="impact" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Impact Score by Area</h4>
                <span className="text-sm text-muted-foreground">
                  Average:{" "}
                  {Math.round(getTotalForMetric("impactScore") / areas.length)}
                </span>
              </div>
              {renderBarChart("impactScore")}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default AreaBreakdown;
