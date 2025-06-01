import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";
import {
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Users,
  FileText,
  BarChart2,
} from "lucide-react";

import OrganizationMetrics from "./OrganizationMetrics";
import AreaBreakdown from "./AreaBreakdown";
import AIImpactReport from "./AIImpactReport";
import StaffMetrics from "./StaffMetrics";

const OrganizationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  const [filterArea, setFilterArea] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const handleExportData = () => {
    // In a real implementation, this would trigger an API call to export data
    alert("Data export functionality would be implemented here.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Organization Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of your organization's activities and impact
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex items-center gap-2">
            <DatePickerWithRange className="w-auto" />
          </div>

          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="north">North District</SelectItem>
              <SelectItem value="south">South District</SelectItem>
              <SelectItem value="east">East District</SelectItem>
              <SelectItem value="west">West District</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefreshData}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
            <Button variant="outline" size="icon" onClick={handleExportData}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="areas">Areas</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <Users className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold">
                    {
                      JSON.parse(
                        localStorage.getItem("clients") || "[]",
                      ).filter((c: any) => c.status === "active").length
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Total Active Clients
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <OrganizationMetrics dateRange={dateRange} filterArea={filterArea} />
        </TabsContent>

        <TabsContent value="areas" className="space-y-6 mt-6">
          <AreaBreakdown />
        </TabsContent>

        <TabsContent value="staff" className="space-y-6 mt-6">
          <StaffMetrics dateRange={dateRange} filterArea={filterArea} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationDashboard;
