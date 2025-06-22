import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useNotifications } from "@/context/NotificationContext";
import { useUser } from "@/context/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import BackButton from "./BackButton";
import SuccessMessage from "./SuccessMessage";
import { ScrollArea } from "@/components/ui/scroll-area";

// Add error boundary to catch any rendering errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error("NewClientForm Error Boundary:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("NewClientForm Error Details:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading the form.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Error: {this.state.error?.message || "Unknown error"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface AssessmentAssignment {
  type: "introduction" | "progress" | "exit" | "custom";
  dueDate: Date;
  customName?: string;
}

const NewClientForm = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableAreas, setAvailableAreas] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [availableJourneyTypes, setAvailableJourneyTypes] = useState<
    Array<{ id: string; name: string; stages: string[] }>
  >([]);
  const [assessmentTemplates, setAssessmentTemplates] = useState<
    Array<{ type: string; name: string }>
  >([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    area: "",
    caseWorker: "",
    status: "new",
    notes: "",
    journeyType: "",
  });

  const [assignedAssessments, setAssignedAssessments] = useState<
    AssessmentAssignment[]
  >([
    {
      type: "introduction",
      dueDate: new Date(),
    },
  ]);

  // Load areas, journey types, and assessment templates from localStorage
  useEffect(() => {
    try {
      // Load areas
      const savedAreas = localStorage.getItem("areas");
      if (savedAreas) {
        try {
          const areas = JSON.parse(savedAreas);
          setAvailableAreas(
            areas.map((area: any) => ({ id: area.id, name: area.name })),
          );
        } catch (error) {
          console.error("Failed to parse saved areas", error);
          // Fallback to default areas if parsing fails
          setAvailableAreas([
            { id: "north", name: "North District" },
            { id: "south", name: "South District" },
            { id: "east", name: "East District" },
            { id: "west", name: "West District" },
            { id: "central", name: "Central District" },
          ]);
        }
      } else {
        // Default areas if none are saved
        setAvailableAreas([
          { id: "north", name: "North District" },
          { id: "south", name: "South District" },
          { id: "east", name: "East District" },
          { id: "west", name: "West District" },
          { id: "central", name: "Central District" },
        ]);
      }

      // Load journey types from Super Admin area
      const savedJourneyTypes = localStorage.getItem("journeyTypes");
      if (savedJourneyTypes) {
        try {
          const journeyTypes = JSON.parse(savedJourneyTypes);
          // Filter journey types based on user's tenant and active status
          const filteredJourneyTypes = journeyTypes.filter((journey: any) => {
            return (
              journey.isActive &&
              journey.assignedTenants &&
              journey.assignedTenants.includes(user?.tenantId || "")
            );
          });

          setAvailableJourneyTypes(
            filteredJourneyTypes.map((journey: any) => ({
              id: journey.id,
              name: journey.name,
              stages: journey.stages || [],
            })),
          );
        } catch (error) {
          console.error("Failed to parse saved journey types", error);
          setAvailableJourneyTypes([]);
        }
      } else {
        setAvailableJourneyTypes([]);
      }

      // Load assessment templates
      const savedTemplates = localStorage.getItem("assessmentTemplates");
      if (savedTemplates) {
        try {
          const templates = JSON.parse(savedTemplates)
            .filter((t: any) => t.isActive)
            .map((t: any) => ({
              type: t.type,
              name: t.name,
            }));
          setAssessmentTemplates(templates);
        } catch (error) {
          console.error("Failed to parse saved assessment templates", error);
          setAssessmentTemplates([]);
        }
      } else {
        setAssessmentTemplates([]);
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
      // Set fallback values
      setAvailableAreas([
        { id: "north", name: "North District" },
        { id: "south", name: "South District" },
        { id: "east", name: "East District" },
        { id: "west", name: "West District" },
        { id: "central", name: "Central District" },
      ]);
      setAvailableJourneyTypes([]);
      setAssessmentTemplates([]);
    }
  }, [user?.tenantId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const addAssessment = () => {
    // Get assessment templates from localStorage
    const savedTemplates = localStorage.getItem("assessmentTemplates");
    let defaultType: "introduction" | "progress" | "exit" | "custom" =
      "introduction";
    let defaultDueDate = new Date();

    // If templates exist, use the first active template as default
    if (savedTemplates) {
      try {
        const templates = JSON.parse(savedTemplates);
        const activeTemplate = templates.find((t: any) => t.isActive);
        if (
          activeTemplate &&
          ["introduction", "progress", "exit", "custom"].includes(
            activeTemplate.type,
          )
        ) {
          defaultType = activeTemplate.type as
            | "introduction"
            | "progress"
            | "exit"
            | "custom";
          // Set due date based on template's defaultDueInDays
          const dueDate = new Date();
          dueDate.setDate(
            dueDate.getDate() + (activeTemplate.defaultDueInDays || 0),
          );
          defaultDueDate = dueDate;
        }
      } catch (error) {
        console.error("Failed to parse saved assessment templates", error);
      }
    }

    setAssignedAssessments([
      ...assignedAssessments,
      {
        type: defaultType,
        dueDate: defaultDueDate,
      },
    ]);
  };

  const removeAssessment = (index: number) => {
    const newAssessments = [...assignedAssessments];
    newAssessments.splice(index, 1);
    setAssignedAssessments(newAssessments);
  };

  const updateAssessmentType = (
    index: number,
    type: "introduction" | "progress" | "exit" | "custom",
  ) => {
    const newAssessments = [...assignedAssessments];
    newAssessments[index].type = type;
    setAssignedAssessments(newAssessments);
  };

  const updateAssessmentDueDate = (index: number, date: Date) => {
    const newAssessments = [...assignedAssessments];
    newAssessments[index].dueDate = date;
    setAssignedAssessments(newAssessments);
  };

  const updateCustomName = (index: number, name: string) => {
    const newAssessments = [...assignedAssessments];
    newAssessments[index].customName = name;
    setAssignedAssessments(newAssessments);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new client object
    const today = new Date();

    // Format dates as YYYY-MM-DD for display
    const formatDate = (date: Date) => {
      return date.toISOString().split("T")[0];
    };

    const newClient = {
      id: Date.now().toString(),
      name: `${formData.firstName} ${formData.lastName}`,
      status:
        formData.status === "new"
          ? "Active"
          : formData.status === "in-progress"
            ? "Active"
            : "Inactive",
      joinDate: today.toISOString().split("T")[0],
      caseWorker: user?.name || formData.caseWorker || "Unassigned",
      profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`,
      lastActivity: today.toISOString().split("T")[0],
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes,
      // Automatically assign the client to the logged-in user's organization
      organizationId: user?.tenantId || "",
      organizationName: user?.organizationName || "",
      organizationSlug: user?.organizationSlug || "",
      // Ensure tenant_id is set for proper data isolation
      tenantId: user?.tenantId || "",
      area: formData.area || "Unspecified",
      journeyTypeId: formData.journeyType,
      journeyTypeName:
        availableJourneyTypes.find((j) => j.id === formData.journeyType)
          ?.name || "",
      assessmentDates: {
        introduction: assignedAssessments.find((a) => a.type === "introduction")
          ? formatDate(
              assignedAssessments.find((a) => a.type === "introduction")!
                .dueDate,
            )
          : "",
        progress: assignedAssessments.find((a) => a.type === "progress")
          ? formatDate(
              assignedAssessments.find((a) => a.type === "progress")!.dueDate,
            )
          : "",
        exit: assignedAssessments.find((a) => a.type === "exit")
          ? formatDate(
              assignedAssessments.find((a) => a.type === "exit")!.dueDate,
            )
          : "",
      },
      createdAt: formatDate(today),
      assignedAssessments: assignedAssessments.map((assessment) => ({
        type: assessment.type,
        dueDate: formatDate(assessment.dueDate),
        customName: assessment.customName || "",
      })),
    };

    // In a real app, this would save the client data to the database
    // For now, we'll store it in localStorage to persist between page navigations
    const existingClients = JSON.parse(localStorage.getItem("clients") || "[]");
    localStorage.setItem(
      "clients",
      JSON.stringify([...existingClients, newClient]),
    );

    // Create assessment records for the client
    const assessments = assignedAssessments.map((assessment) => ({
      id:
        Date.now().toString() +
        "-" +
        assessment.type +
        (assessment.customName
          ? "-" + assessment.customName.toLowerCase().replace(/\s+/g, "-")
          : ""),
      clientId: newClient.id,
      date: formatDate(assessment.dueDate),
      type:
        assessment.type === "custom"
          ? assessment.customName || "Custom"
          : assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1),
      completedBy: "",
      status: "scheduled",
    }));

    // Save assessments to localStorage
    const existingAssessments = JSON.parse(
      localStorage.getItem("assessments") || "[]",
    );
    localStorage.setItem(
      "assessments",
      JSON.stringify([...existingAssessments, ...assessments]),
    );

    // Show success message
    setShowSuccess(true);

    // Clear form data to prevent duplicate submissions
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      area: "",
      caseWorker: "",
      status: "new",
      notes: "",
      journeyType: "",
    });
    setAssignedAssessments([
      {
        type: "introduction",
        dueDate: new Date(),
      },
    ]);

    // Navigate after showing success message
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/clients");
    }, 2000);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {showSuccess && (
          <SuccessMessage message="Client created successfully! Redirecting..." />
        )}
        <header className="sticky top-0 z-10 border-b bg-background">
          <div className="flex h-16 items-center px-4 md:px-6">
            <BackButton />
            <h1 className="ml-4 text-lg font-semibold">Add New Client</h1>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6">
          <ScrollArea className="h-[calc(100vh-4rem)]">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>
                  Enter the details for the new client record.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="client@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+44 7700 900000"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 High Street, London, SW1A 1AA"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Area</Label>
                    <Select
                      id="area"
                      value={formData.area}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, area: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAreas.map((area) => {
                          const value = area.name
                            .toLowerCase()
                            .replace(/\s+/g, "-");
                          return value ? (
                            <SelectItem key={area.id} value={value}>
                              {area.name}
                            </SelectItem>
                          ) : null;
                        })}
                        {availableAreas.length === 0 && (
                          <SelectItem value="no-areas" disabled>
                            No areas available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="caseWorker">Case Worker</Label>
                    <Select
                      id="caseWorker"
                      value={formData.caseWorker}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, caseWorker: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            user?.name
                              ? `Assign to ${user.name}`
                              : "Select case worker"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {user && (
                          <SelectItem value={user.name}>
                            {user.name} (You)
                          </SelectItem>
                        )}
                        <SelectItem value="Michael Johnson">
                          Michael Johnson
                        </SelectItem>
                        <SelectItem value="Sarah Williams">
                          Sarah Williams
                        </SelectItem>
                        <SelectItem value="Lisa Chen">Lisa Chen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      id="status"
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="journeyType">Journey Type *</Label>
                    <Select
                      value={formData.journeyType}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, journeyType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select journey type" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableJourneyTypes.length > 0 ? (
                          availableJourneyTypes.map((journey) =>
                            journey.id ? (
                              <SelectItem key={journey.id} value={journey.id}>
                                {journey.name}
                              </SelectItem>
                            ) : null,
                          )
                        ) : (
                          <SelectItem value="no-journeys" disabled>
                            No journeys available. Please contact your
                            administrator.
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Enter any additional information about the client"
                      rows={4}
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-medium">
                        Assigned Assessments
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addAssessment}
                        className="flex items-center gap-1"
                      >
                        <Plus className="h-4 w-4" /> Add Assessment
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {assignedAssessments.map((assessment, index) => (
                        <div
                          key={index}
                          className="flex flex-col space-y-3 p-4 border rounded-md bg-muted/20"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">
                              Assessment #{index + 1}
                            </h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAssessment(index)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`assessment-type-${index}`}>
                                Assessment Type
                              </Label>
                              <Select
                                value={assessment.type}
                                onValueChange={(value) =>
                                  updateAssessmentType(
                                    index,
                                    value as
                                      | "introduction"
                                      | "progress"
                                      | "exit"
                                      | "custom",
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select assessment type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {assessmentTemplates.length > 0 ? (
                                    assessmentTemplates.map((template, i) =>
                                      template.type ? (
                                        <SelectItem
                                          key={i}
                                          value={template.type}
                                        >
                                          {template.name}
                                        </SelectItem>
                                      ) : null,
                                    )
                                  ) : (
                                    <>
                                      <SelectItem value="introduction">
                                        Introduction
                                      </SelectItem>
                                      <SelectItem value="progress">
                                        Progress
                                      </SelectItem>
                                      <SelectItem value="exit">Exit</SelectItem>
                                      <SelectItem value="custom">
                                        Custom
                                      </SelectItem>
                                    </>
                                  )}
                                </SelectContent>
                              </Select>
                            </div>

                            {assessment.type === "custom" && (
                              <div className="space-y-2">
                                <Label htmlFor={`custom-name-${index}`}>
                                  Custom Assessment Name
                                </Label>
                                <Input
                                  id={`custom-name-${index}`}
                                  placeholder="Enter custom assessment name"
                                  value={assessment.customName || ""}
                                  onChange={(e) =>
                                    updateCustomName(index, e.target.value)
                                  }
                                />
                              </div>
                            )}

                            <div className="space-y-2">
                              <Label htmlFor={`due-date-${index}`}>
                                Due Date
                              </Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    id={`due-date-${index}`}
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {assessment.dueDate
                                      ? format(assessment.dueDate, "PPP")
                                      : "Select date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={assessment.dueDate}
                                    onSelect={(date) =>
                                      date &&
                                      updateAssessmentDueDate(index, date)
                                    }
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/clients")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      !formData.journeyType ||
                      availableJourneyTypes.length === 0
                    }
                  >
                    Save Client
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </ScrollArea>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default NewClientForm;
