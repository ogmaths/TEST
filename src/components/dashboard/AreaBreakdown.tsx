import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, Plus, Edit, Trash2 } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const { addNotification } = useNotifications();
  // Area management state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [areaName, setAreaName] = useState("");
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

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

  const [areas, setAreas] = useState<Area[]>([]);

  // Load areas from localStorage or use initial data
  useEffect(() => {
    const savedAreas = localStorage.getItem("areas");
    if (savedAreas) {
      try {
        setAreas(JSON.parse(savedAreas));
      } catch (error) {
        console.error("Failed to parse saved areas", error);
        setAreas(uniqueAreas);
      }
    } else {
      setAreas(uniqueAreas);
      localStorage.setItem("areas", JSON.stringify(uniqueAreas));
    }
  }, []);

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

  // Area management functions
  const handleAddArea = () => {
    setAreaName("");
    setShowAddDialog(true);
  };

  const handleEditArea = (area: Area) => {
    setSelectedArea(area);
    setAreaName(area.name);
    setShowEditDialog(true);
  };

  const handleDeleteArea = (area: Area) => {
    setSelectedArea(area);
    setShowDeleteDialog(true);
  };

  const saveNewArea = () => {
    if (!areaName.trim()) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Area name cannot be empty",
        priority: "high",
      });
      return;
    }

    // Check for duplicate names
    if (
      areas.some(
        (area) => area.name.toLowerCase() === areaName.trim().toLowerCase(),
      )
    ) {
      addNotification({
        type: "error",
        title: "Error",
        message: "An area with this name already exists",
        priority: "high",
      });
      return;
    }

    // Generate random color
    const colors = [
      "#4f46e5",
      "#06b6d4",
      "#10b981",
      "#f59e0b",
      "#ef4444",
      "#8b5cf6",
      "#ec4899",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newArea: Area = {
      id: Date.now().toString(),
      name: areaName.trim(),
      clientCount: 0,
      eventCount: 0,
      assessmentCount: 0,
      impactScore: 0,
      color: randomColor,
    };

    const updatedAreas = [...areas, newArea];
    setAreas(updatedAreas);
    localStorage.setItem("areas", JSON.stringify(updatedAreas));
    setShowAddDialog(false);

    addNotification({
      type: "success",
      title: "Area Added",
      message: `${newArea.name} has been added successfully`,
      priority: "high",
    });
  };

  const saveEditedArea = () => {
    if (!selectedArea) return;

    if (!areaName.trim()) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Area name cannot be empty",
        priority: "high",
      });
      return;
    }

    // Check for duplicate names (excluding the current area)
    if (
      areas.some(
        (area) =>
          area.id !== selectedArea.id &&
          area.name.toLowerCase() === areaName.trim().toLowerCase(),
      )
    ) {
      addNotification({
        type: "error",
        title: "Error",
        message: "An area with this name already exists",
        priority: "high",
      });
      return;
    }

    const updatedAreas = areas.map((area) =>
      area.id === selectedArea.id ? { ...area, name: areaName.trim() } : area,
    );

    setAreas(updatedAreas);
    localStorage.setItem("areas", JSON.stringify(updatedAreas));
    setShowEditDialog(false);

    addNotification({
      type: "success",
      title: "Area Updated",
      message: `Area has been renamed to ${areaName.trim()}`,
      priority: "high",
    });
  };

  const confirmDeleteArea = () => {
    if (!selectedArea) return;

    const updatedAreas = areas.filter((area) => area.id !== selectedArea.id);
    setAreas(updatedAreas);
    localStorage.setItem("areas", JSON.stringify(updatedAreas));
    setShowDeleteDialog(false);

    addNotification({
      type: "success",
      title: "Area Deleted",
      message: `${selectedArea.name} has been deleted successfully`,
      priority: "high",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle></CardTitle>
          <CardDescription></CardDescription>
        </div>
        {isManagementView && (
          <Button onClick={handleAddArea} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Area
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isManagementView ? (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-2 pl-4">Area Name</th>
                  <th className="p-2">Clients</th>
                  <th className="p-2">Events</th>
                  <th className="p-2">Assessments</th>
                  <th className="p-2 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {areas.map((area) => (
                  <tr key={area.id} className="border-b">
                    <td className="p-2 pl-4">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: area.color }}
                        ></div>
                        <span className="font-medium">{area.name}</span>
                      </div>
                    </td>
                    <td className="p-2">{area.clientCount}</td>
                    <td className="p-2">{area.eventCount}</td>
                    <td className="p-2">{area.assessmentCount}</td>
                    <td className="p-2 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditArea(area)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-4 w-4" /> Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteArea(area)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {areas.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-4 text-center text-muted-foreground"
                    >
                      No areas found. Click "Add Area" to create your first
                      area.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
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

        {/* Add Area Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Area</DialogTitle>
              <DialogDescription>
                Enter the name for the new geographical area.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="areaName">Area Name</Label>
              <Input
                id="areaName"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                placeholder="e.g. North District"
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={saveNewArea}>Add Area</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Area Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Area</DialogTitle>
              <DialogDescription>
                Update the name for this geographical area.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="editAreaName">Area Name</Label>
              <Input
                id="editAreaName"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={saveEditedArea}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Area Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Area</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedArea?.name}? This
                action cannot be undone. All data associated with this area will
                be removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteArea}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default AreaBreakdown;
