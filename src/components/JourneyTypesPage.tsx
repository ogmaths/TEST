import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/context/NotificationContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Edit, Trash2, ArrowLeft, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import BackButton from "./BackButton";
import { AssessmentTemplate } from "@/types/admin";
import { useTenant } from "@/context/TenantContext";

interface JourneyType {
  id: string;
  name: string;
  description: string;
  stages: string[];
  linkedAssessments: string[];
  assignedTenants: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Organization {
  id: string;
  name: string;
  tenant_id: string;
  status: string;
}

const JourneyTypesPage = () => {
  const navigate = useNavigate();
  const { tenantId } = useTenant();
  const { addNotification } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Journey Types states
  const [journeyTypes, setJourneyTypes] = useState<JourneyType[]>([]);
  const [showJourneyDialog, setShowJourneyDialog] = useState(false);
  const [editingJourney, setEditingJourney] = useState<JourneyType | null>(
    null,
  );
  const [journeyForm, setJourneyForm] = useState({
    name: "",
    description: "",
    stages: [""],
    linkedAssessments: [] as string[],
    assignedTenants: [] as string[],
    isActive: true,
  });
  const [showDeleteJourneyDialog, setShowDeleteJourneyDialog] = useState(false);
  const [journeyToDelete, setJourneyToDelete] = useState<JourneyType | null>(
    null,
  );

  // Assessment templates and tenants for form options
  const [assessmentTemplates, setAssessmentTemplates] = useState<
    AssessmentTemplate[]
  >([]);
  const [tenants, setTenants] = useState<Organization[]>([]);

  // Check if user is super admin
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (tenantId === "0" || tenantId === null || tenantId === "null") {
      setIsAuthenticated(true);
    } else {
      navigate("/dashboard");
    }
  }, [tenantId, navigate]);

  // Initialize data
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = () => {
    setIsLoading(true);

    // Load assessment templates
    const savedTemplates = localStorage.getItem("assessmentTemplates");
    if (savedTemplates) {
      try {
        setAssessmentTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.error("Failed to parse saved assessment templates", error);
      }
    }

    // Load tenants
    const predefinedTenants: Organization[] = [
      {
        id: "b3-tenant",
        name: "B3",
        tenant_id: "1",
        status: "active",
      },
      {
        id: "parents1st-tenant",
        name: "Parents1st",
        tenant_id: "2",
        status: "active",
      },
      {
        id: "demo-tenant",
        name: "Demo",
        tenant_id: "3",
        status: "active",
      },
    ];
    setTenants(predefinedTenants);

    // Load journey types
    const savedJourneyTypes = localStorage.getItem("journeyTypes");
    if (savedJourneyTypes) {
      try {
        setJourneyTypes(JSON.parse(savedJourneyTypes));
      } catch (error) {
        console.error("Failed to parse saved journey types", error);
      }
    } else {
      // Initialize with default journey types
      const defaultJourneyTypes: JourneyType[] = [
        {
          id: "perinatal-support",
          name: "Perinatal Support Journey",
          description: "Comprehensive support journey for perinatal clients",
          stages: [
            "Initial Assessment",
            "Support Planning",
            "Regular Check-ins",
            "Exit Assessment",
          ],
          linkedAssessments: [
            "intro-assessment",
            "progress-assessment",
            "exit-assessment",
          ],
          assignedTenants: ["1", "2"],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "youth-development",
          name: "Youth Development Journey",
          description: "Structured journey for youth development programs",
          stages: [
            "Intake",
            "Goal Setting",
            "Skill Building",
            "Progress Review",
            "Completion",
          ],
          linkedAssessments: ["intro-assessment", "progress-assessment"],
          assignedTenants: ["3"],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setJourneyTypes(defaultJourneyTypes);
      localStorage.setItem("journeyTypes", JSON.stringify(defaultJourneyTypes));
    }

    setIsLoading(false);
  };

  // Journey Types functions
  const handleAddJourney = () => {
    setEditingJourney(null);
    setJourneyForm({
      name: "",
      description: "",
      stages: [""],
      linkedAssessments: [],
      assignedTenants: [],
      isActive: true,
    });
    setShowJourneyDialog(true);
  };

  const handleEditJourney = (journey: JourneyType) => {
    setEditingJourney(journey);
    setJourneyForm({
      name: journey.name,
      description: journey.description || "",
      stages: journey.stages || [""],
      linkedAssessments: journey.linkedAssessments || [],
      assignedTenants: journey.assignedTenants || [],
      isActive: journey.isActive,
    });
    setShowJourneyDialog(true);
  };

  const handleDeleteJourney = (journey: JourneyType) => {
    setJourneyToDelete(journey);
    setShowDeleteJourneyDialog(true);
  };

  const confirmDeleteJourney = () => {
    if (journeyToDelete) {
      const updatedJourneys = journeyTypes.filter(
        (j) => j.id !== journeyToDelete.id,
      );
      setJourneyTypes(updatedJourneys);
      localStorage.setItem("journeyTypes", JSON.stringify(updatedJourneys));
      setShowDeleteJourneyDialog(false);
      setJourneyToDelete(null);

      addNotification({
        type: "success",
        title: "Journey Type Deleted",
        message: `${journeyToDelete.name} has been deleted successfully`,
        priority: "high",
      });
    }
  };

  const handleSaveJourney = () => {
    const journey: JourneyType = {
      id: editingJourney ? editingJourney.id : `journey-${Date.now()}`,
      name: journeyForm.name,
      description: journeyForm.description,
      stages: journeyForm.stages.filter((stage) => stage.trim() !== ""),
      linkedAssessments: journeyForm.linkedAssessments,
      assignedTenants: journeyForm.assignedTenants,
      isActive: journeyForm.isActive,
      createdAt: editingJourney
        ? editingJourney.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedJourneys;
    if (editingJourney) {
      updatedJourneys = journeyTypes.map((j) =>
        j.id === editingJourney.id ? journey : j,
      );
      addNotification({
        type: "success",
        title: "Journey Type Updated",
        message: `${journey.name} has been updated successfully`,
        priority: "high",
      });
    } else {
      updatedJourneys = [...journeyTypes, journey];
      addNotification({
        type: "success",
        title: "Journey Type Created",
        message: `${journey.name} has been created successfully`,
        priority: "high",
      });
    }

    setJourneyTypes(updatedJourneys);
    localStorage.setItem("journeyTypes", JSON.stringify(updatedJourneys));

    setShowJourneyDialog(false);
    setEditingJourney(null);
    setJourneyForm({
      name: "",
      description: "",
      stages: [""],
      linkedAssessments: [],
      assignedTenants: [],
      isActive: true,
    });
  };

  const addStage = () => {
    setJourneyForm((prev) => ({
      ...prev,
      stages: [...prev.stages, ""],
    }));
  };

  const removeStage = (index: number) => {
    if (journeyForm.stages.length > 1) {
      setJourneyForm((prev) => ({
        ...prev,
        stages: prev.stages.filter((_, i) => i !== index),
      }));
    }
  };

  const updateStage = (index: number, value: string) => {
    setJourneyForm((prev) => ({
      ...prev,
      stages: prev.stages.map((stage, i) => (i === index ? value : stage)),
    }));
  };

  const filteredJourneyTypes = journeyTypes.filter(
    (journey) =>
      journey.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journey.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <BackButton />
          <h1 className="ml-4 text-2xl font-bold">Journey Types Management</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search journey types..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={handleAddJourney}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Create Journey
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Journey Types</CardTitle>
            <CardDescription>
              Create and manage client journey types with stages and assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-muted-foreground">
                  Loading journey types...
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 text-left">
                      <th className="p-2 pl-4">Journey Name</th>
                      <th className="p-2">Stages</th>
                      <th className="p-2">Linked Assessments</th>
                      <th className="p-2">Assigned Tenants</th>
                      <th className="p-2">Status</th>
                      <th className="p-2 text-right pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJourneyTypes.length > 0 ? (
                      filteredJourneyTypes.map((journey) => {
                        const linkedTemplates =
                          journey.linkedAssessments
                            ?.map(
                              (id: string) =>
                                assessmentTemplates.find((t) => t.id === id)
                                  ?.name,
                            )
                            .filter(Boolean) || [];
                        const assignedTenantNames =
                          journey.assignedTenants
                            ?.map(
                              (id: string) =>
                                tenants.find((t) => t.tenant_id === id)?.name,
                            )
                            .filter(Boolean) || [];

                        return (
                          <tr key={journey.id} className="border-b">
                            <td className="p-2 pl-4 font-medium">
                              {journey.name}
                              <div className="text-xs text-muted-foreground">
                                {journey.description}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex flex-wrap gap-1">
                                {journey.stages
                                  ?.slice(0, 3)
                                  .map((stage: string, index: number) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                      {stage}
                                    </span>
                                  ))}
                                {journey.stages?.length > 3 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{journey.stages.length - 3} more
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="text-xs">
                                {linkedTemplates.length > 0 ? (
                                  linkedTemplates
                                    .slice(0, 2)
                                    .map((name, index) => (
                                      <div
                                        key={index}
                                        className="text-muted-foreground"
                                      >
                                        {name}
                                      </div>
                                    ))
                                ) : (
                                  <span className="text-muted-foreground">
                                    None
                                  </span>
                                )}
                                {linkedTemplates.length > 2 && (
                                  <div className="text-muted-foreground">
                                    +{linkedTemplates.length - 2} more
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex flex-wrap gap-1">
                                {assignedTenantNames
                                  .slice(0, 2)
                                  .map((name, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800"
                                    >
                                      {name}
                                    </span>
                                  ))}
                                {assignedTenantNames.length > 2 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{assignedTenantNames.length - 2} more
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-2">
                              {journey.isActive ? (
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                  Active
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td className="p-2 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditJourney(journey)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteJourney(journey)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-4 text-center text-muted-foreground"
                        >
                          No journey types found. Create your first journey type
                          by clicking the "Create Journey" button.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Journey Type Dialog */}
      <Dialog open={showJourneyDialog} onOpenChange={setShowJourneyDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {editingJourney ? "Edit Journey Type" : "Create Journey"}
            </DialogTitle>
            <DialogDescription>
              {editingJourney
                ? "Update the journey type details below"
                : "Define a client journey with stages and linked assessments"}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-180px)]">
            <div className="space-y-6 py-4">
              {/* Journey Name */}
              <div className="space-y-2">
                <Label htmlFor="journey-name">Journey Name *</Label>
                <Input
                  id="journey-name"
                  value={journeyForm.name}
                  onChange={(e) =>
                    setJourneyForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g. Antenatal Support"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="journey-description">Description</Label>
                <Textarea
                  id="journey-description"
                  value={journeyForm.description}
                  onChange={(e) =>
                    setJourneyForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Optional description of this journey"
                  rows={3}
                />
              </div>

              {/* Journey Stages */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Journey Stages</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addStage}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Stage
                  </Button>
                </div>
                <div className="space-y-3">
                  {journeyForm.stages.map((stage, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {index + 1}
                      </div>
                      <Input
                        value={stage}
                        onChange={(e) => updateStage(index, e.target.value)}
                        placeholder={`Stage ${index + 1} name`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeStage(index)}
                        disabled={journeyForm.stages.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Linked Assessments */}
              <div className="space-y-3">
                <Label>Linked Assessments</Label>
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                  <div className="space-y-3">
                    {assessmentTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="flex items-start space-x-3"
                      >
                        <input
                          type="checkbox"
                          id={`assessment-${template.id}`}
                          checked={journeyForm.linkedAssessments.includes(
                            template.id,
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setJourneyForm((prev) => ({
                                ...prev,
                                linkedAssessments: [
                                  ...prev.linkedAssessments,
                                  template.id,
                                ],
                              }));
                            } else {
                              setJourneyForm((prev) => ({
                                ...prev,
                                linkedAssessments:
                                  prev.linkedAssessments.filter(
                                    (id) => id !== template.id,
                                  ),
                              }));
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={`assessment-${template.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {template.name}
                          </Label>
                          <div className="text-xs text-muted-foreground mt-1">
                            {template.type.charAt(0).toUpperCase() +
                              template.type.slice(1)}{" "}
                            Assessment
                            {template.isRequired
                              ? " – Required"
                              : " – Optional"}
                          </div>
                        </div>
                      </div>
                    ))}
                    {assessmentTemplates.length === 0 && (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No assessment templates available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Assign to Tenants */}
              <div className="space-y-3">
                <Label>Assign to Tenants</Label>
                <div className="border rounded-md p-3 max-h-32 overflow-y-auto">
                  <div className="space-y-3">
                    {tenants
                      .filter((t) => t.status !== "archived")
                      .map((tenant) => (
                        <div
                          key={tenant.id}
                          className="flex items-center space-x-3"
                        >
                          <input
                            type="checkbox"
                            id={`tenant-${tenant.id}`}
                            checked={journeyForm.assignedTenants.includes(
                              tenant.tenant_id || "",
                            )}
                            onChange={(e) => {
                              const tenantId = tenant.tenant_id || "";
                              if (e.target.checked) {
                                setJourneyForm((prev) => ({
                                  ...prev,
                                  assignedTenants: [
                                    ...prev.assignedTenants,
                                    tenantId,
                                  ],
                                }));
                              } else {
                                setJourneyForm((prev) => ({
                                  ...prev,
                                  assignedTenants: prev.assignedTenants.filter(
                                    (id) => id !== tenantId,
                                  ),
                                }));
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label
                            htmlFor={`tenant-${tenant.id}`}
                            className="text-sm font-medium cursor-pointer"
                          >
                            {tenant.name}
                          </Label>
                        </div>
                      ))}
                    {tenants.filter((t) => t.status !== "archived").length ===
                      0 && (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No active tenants available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="journey-active"
                  checked={journeyForm.isActive}
                  onChange={(e) =>
                    setJourneyForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="journey-active" className="font-medium">
                  Journey Active
                </Label>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowJourneyDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveJourney}
              disabled={
                !journeyForm.name ||
                journeyForm.stages.every((s) => s.trim() === "")
              }
            >
              {editingJourney ? "Update Journey" : "Create Journey"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Journey Confirmation Dialog */}
      <AlertDialog
        open={showDeleteJourneyDialog}
        onOpenChange={setShowDeleteJourneyDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Journey Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{journeyToDelete?.name}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteJourney}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JourneyTypesPage;
