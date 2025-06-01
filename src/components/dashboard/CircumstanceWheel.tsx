import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CircumstanceWheelProps {
  clientId?: string;
  organizationId?: string;
}

const CircumstanceWheel: React.FC<CircumstanceWheelProps> = ({
  clientId,
  organizationId,
}) => {
  const [selectedView, setSelectedView] = useState<"organization" | "client">(
    "organization",
  );
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [selectedTimeframe, setSelectedTimeframe] =
    useState<string>("last-month");

  // Mock data for the wheel of circumstance
  const organizationData = {
    housing: 72,
    employment: 58,
    education: 65,
    health: 80,
    mentalHealth: 62,
    substanceUse: 45,
    family: 70,
    socialSupport: 68,
    finances: 52,
    legal: 88,
  };

  const clientData = {
    housing: 60,
    employment: 40,
    education: 75,
    health: 65,
    mentalHealth: 50,
    substanceUse: 80,
    family: 55,
    socialSupport: 70,
    finances: 30,
    legal: 90,
  };

  const wheelData =
    selectedView === "organization" ? organizationData : clientData;

  // Calculate the average score
  const calculateAverage = (data: Record<string, number>) => {
    const values = Object.values(data);
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  };

  const averageScore = calculateAverage(wheelData);

  // Mock clients for the dropdown
  const clients = [
    { id: "C001", name: "Client #001" },
    { id: "C002", name: "Client #002" },
    { id: "C003", name: "Client #003" },
    { id: "C004", name: "Client #004" },
    { id: "C005", name: "Client #005" },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Wheel of Circumstance</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="wheel" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wheel">Wheel View</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>
          <TabsContent value="wheel" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 pt-4">
              <div className="flex items-center space-x-2">
                <TabsList className="grid grid-cols-2 w-[200px]">
                  <TabsTrigger
                    value="organization"
                    onClick={() => setSelectedView("organization")}
                    className={
                      selectedView === "organization"
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }
                  >
                    Organization
                  </TabsTrigger>
                  <TabsTrigger
                    value="client"
                    onClick={() => setSelectedView("client")}
                    className={
                      selectedView === "client"
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }
                  >
                    Client
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                {selectedView === "client" && (
                  <Select
                    value={selectedClient}
                    onValueChange={setSelectedClient}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Select
                  value={selectedTimeframe}
                  onValueChange={setSelectedTimeframe}
                >
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                    <SelectItem value="all-time">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center py-8">
              <div className="relative w-64 h-64">
                {/* Wheel background circles */}
                <div className="absolute inset-0 rounded-full border-2 border-gray-100 opacity-20"></div>
                <div className="absolute inset-[10%] rounded-full border-2 border-gray-100 opacity-30"></div>
                <div className="absolute inset-[20%] rounded-full border-2 border-gray-100 opacity-40"></div>
                <div className="absolute inset-[30%] rounded-full border-2 border-gray-100 opacity-50"></div>
                <div className="absolute inset-[40%] rounded-full border-2 border-gray-100 opacity-60"></div>
                <div className="absolute inset-[50%] rounded-full border-2 border-gray-100 opacity-70"></div>
                <div className="absolute inset-[60%] rounded-full border-2 border-gray-100 opacity-80"></div>
                <div className="absolute inset-[70%] rounded-full border-2 border-gray-100 opacity-90"></div>
                <div className="absolute inset-[80%] rounded-full border-2 border-gray-100"></div>

                {/* Wheel segments */}
                {Object.entries(wheelData).map(([key, value], index) => {
                  const angle = index * 36 - 90; // 360 / 10 categories = 36 degrees per segment, starting at top (-90)
                  const length = (value / 100) * 32; // Scale to fit in the wheel (32 = radius)
                  const x1 = 32;
                  const y1 = 32;
                  const x2 = x1 + length * Math.cos((angle * Math.PI) / 180);
                  const y2 = y1 + length * Math.sin((angle * Math.PI) / 180);

                  return (
                    <React.Fragment key={key}>
                      {/* Segment line */}
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                        style={{ transform: "scale(2)" }} // Scale up to fit the container
                      />

                      {/* Segment label */}
                      <text
                        x={
                          x1 + (length + 4) * Math.cos((angle * Math.PI) / 180)
                        }
                        y={
                          y1 + (length + 4) * Math.sin((angle * Math.PI) / 180)
                        }
                        fontSize="10"
                        textAnchor="middle"
                        style={{
                          transform: "scale(2)", // Scale up to fit the container
                          transformOrigin: "center",
                        }}
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </text>
                    </React.Fragment>
                  );
                })}

                {/* Center text with average score */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {Math.round(averageScore)}
                    </div>
                    <div className="text-xs text-muted-foreground">Average</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4 pt-4">
            <div className="space-y-2">
              {Object.entries(wheelData).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <span className="text-sm font-medium">{value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Average Score</span>
                <span className="text-xl font-bold">
                  {Math.round(averageScore)}%
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CircumstanceWheel;
