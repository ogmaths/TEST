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
import { BarChart2, Plus, Edit, Trash2, Users } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/admin";

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
  hidePerformanceMetrics?: boolean;
}

const AreaBreakdown: React.FC<AreaBreakdownProps> = ({
  isManagementView = false,
  hidePerformanceMetrics = false,
}) => {
  const { addNotification } = useNotifications();
  // Area management state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStaffAssignDialog, setShowStaffAssignDialog] = useState(false);
  const [areaName, setAreaName] = useState("");
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  // Staff management state
  const [staffMembers, setStaffMembers] = useState<User[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);

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

  // Load staff members
  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    // For now, we'll use mock data
    const mockStaffData: User[] = [
      {
        id: "1",
        name: "Stacy Williams",
        email: "stacy.williams@example.com",
        role: "admin",
        lastLogin: "2023-06-10T14:30:00Z",
        status: "active",
        organizationId: "1",
        area: "North District",
      },
      {
        id: "2",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "support_worker",
        lastLogin: "2023-06-09T10:15:00Z",
        status: "active",
        organizationId: "1",
        area: "South District",
      },
      {
        id: "3",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "support_worker",
        lastLogin: "2023-06-08T09:45:00Z",
        status: "active",
        organizationId: "1",
        area: "East District",
      },
      {
        id: "4",
        name: "Michael Johnson",
        email: "michael.j@example.com",
        role: "support_worker",
        lastLogin: "2023-06-07T11:20:00Z",
        status: "active",
        organizationId: "1",
      },
      {
        id: "5",
        name: "Emily Davis",
        email: "emily.d@example.com",
        role: "support_worker",
        lastLogin: "2023-06-06T09:15:00Z",
        status: "active",
        organizationId: "1",
      },
    ];

    setStaffMembers(mockStaffData);
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

  const handleAssignStaff = (area: Area) => {
    setSelectedArea(area);
    // Find staff members already assigned to this area
    const assignedStaff = staffMembers
      .filter((staff) => staff.area === area.name)
      .map((staff) => staff.id);
    setSelectedStaffIds(assignedStaff);
    setShowStaffAssignDialog(true);
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

    // Also update staff members who were assigned to this area
    const updatedStaff = staffMembers.map((staff) =>
      staff.area === selectedArea.name ? { ...staff, area: undefined } : staff,
    );
    setStaffMembers(updatedStaff);

    addNotification({
      type: "success",
      title: "Area Deleted",
      message: `${selectedArea.name} has been deleted successfully`,
      priority: "high",
    });
  };

  const saveStaffAssignments = () => {
    if (!selectedArea) return;

    // Update staff members with new area assignments
    const updatedStaff = staffMembers.map((staff) => {
      if (selectedStaffIds.includes(staff.id)) {
        return { ...staff, area: selectedArea.name };
      } else if (staff.area === selectedArea.name) {
        // Remove area from staff members who were previously assigned but now unselected
        return { ...staff, area: undefined };
      }
      return staff;
    });

    setStaffMembers(updatedStaff);
    setShowStaffAssignDialog(false);

    addNotification({
      type: "success",
      title: "Staff Assigned",
      message: `Staff members have been assigned to ${selectedArea.name}`,
      priority: "high",
    });
  };

  const toggleStaffSelection = (staffId: string) => {
    if (selectedStaffIds.includes(staffId)) {
      setSelectedStaffIds(selectedStaffIds.filter((id) => id !== staffId));
    } else {
      setSelectedStaffIds([...selectedStaffIds, staffId]);
    }
  };

  // Get staff count for a specific area
  const getStaffCountForArea = (areaName: string): number => {
    return staffMembers.filter((staff) => staff.area === areaName).length;
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
                  <th className="p-2">Staff Assigned</th>
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
                    <td className="p-2">
                      <div className="flex items-center">
                        <span className="text-sm">
                          {getStaffCountForArea(area.name)}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAssignStaff(area)}
                          className="flex items-center gap-1"
                        >
                          <Users className="h-4 w-4" /> Assign Staff
                        </Button>
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
                      colSpan={2}
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

              {/* Staff assignment summary */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Staff Assignment</h4>
                {areas.map((area) => {
                  const areaStaff = staffMembers.filter(
                    (staff) => staff.area === area.name,
                  );
                  return (
                    <div key={`staff-${area.id}`} className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: area.color }}
                          ></div>
                          <span className="text-sm font-medium">
                            {area.name}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {areaStaff.length} staff
                        </span>
                      </div>
                      {areaStaff.length > 0 && (
                        <div className="pl-5 text-xs text-muted-foreground">
                          {areaStaff.map((staff, idx) => (
                            <span key={staff.id}>
                              {staff.name}
                              {idx < areaStaff.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
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

        {/* Assign Staff Dialog */}
        <Dialog
          open={showStaffAssignDialog}
          onOpenChange={setShowStaffAssignDialog}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Assign Staff to {selectedArea?.name}</DialogTitle>
              <DialogDescription>
                Select support workers to assign to this area. This will update
                their profile and affect CRM metrics.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="rounded-md border max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b bg-muted/50 text-left">
                      <th className="p-2 pl-4">Name</th>
                      <th className="p-2 text-right pr-4">Assign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffMembers
                      .filter((staff) => staff.role === "support_worker")
                      .map((staff) => (
                        <tr key={staff.id} className="border-b">
                          <td className="p-2 pl-4 font-medium">{staff.name}</td>
                          <td className="p-2 text-right">
                            <input
                              type="checkbox"
                              checked={selectedStaffIds.includes(staff.id)}
                              onChange={() => toggleStaffSelection(staff.id)}
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                          </td>
                        </tr>
                      ))}
                    {staffMembers.filter(
                      (staff) => staff.role === "support_worker",
                    ).length === 0 && (
                      <tr>
                        <td
                          colSpan={2}
                          className="p-4 text-center text-muted-foreground"
                        >
                          No support workers found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowStaffAssignDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={saveStaffAssignments}>Save Assignments</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AreaBreakdown;
