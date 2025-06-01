import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/context/NotificationContext";
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

interface AssessmentAssignment {
  type: "introduction" | "progress" | "exit" | "custom";
  dueDate: Date;
  customName?: string;
}

const NewClientForm = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showSuccess, setShowSuccess] = useState(false);
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
  });

  const [assignedAssessments, setAssignedAssessments] = useState<
    AssessmentAssignment[]
  >([
    {
      type: "introduction",
      dueDate: new Date(),
    },
  ]);

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
    let defaultType = "introduction";
    let defaultDueDate = new Date();

    // If templates exist, use the first active template as default
    if (savedTemplates) {
      try {
        const templates = JSON.parse(savedTemplates);
        const activeTemplate = templates.find((t: any) => t.isActive);
        if (activeTemplate) {
          defaultType = activeTemplate.type;
          // Set due date based on template's defaultDueInDays
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + activeTemplate.defaultDueInDays);
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
      caseWorker: formData.caseWorker || "Unassigned",
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
      area: formData.area || "Unspecified",
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

    // Show notification instead of alert
    const { addNotification } = useNotifications();
    addNotification({
      type: "success",
      title: "Client Created",
      message: "New client has been added successfully",
      priority: "high",
    });

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
    });
    setAssignedAssessments([
      {
        type: "introduction",
        dueDate: new Date(),
      },
    ]);

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

    setShowSuccess(true);

    // Navigate after showing success message
    setTimeout(() => {
      navigate("/clients");
    }, 2000);
  };

  return (
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
                    <SelectItem value="north">North District</SelectItem>
                    <SelectItem value="south">South District</SelectItem>
                    <SelectItem value="east">East District</SelectItem>
                    <SelectItem value="west">West District</SelectItem>
                    <SelectItem value="central">Central District</SelectItem>
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
                    <SelectValue placeholder="Select case worker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="michael-johnson">
                      Michael Johnson
                    </SelectItem>
                    <SelectItem value="sarah-williams">
                      Sarah Williams
                    </SelectItem>
                    <SelectItem value="lisa-chen">Lisa Chen</SelectItem>
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
                        <h4 className="font-medium">Assessment #{index + 1}</h4>
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
                              {(() => {
                                // Get assessment templates from localStorage
                                const savedTemplates = localStorage.getItem(
                                  "assessmentTemplates",
                                );
                                let templates = [];

                                if (savedTemplates) {
                                  try {
                                    templates = JSON.parse(savedTemplates)
                                      .filter((t: any) => t.isActive)
                                      .map((t: any) => ({
                                        type: t.type,
                                        name: t.name,
                                      }));
                                  } catch (error) {
                                    console.error(
                                      "Failed to parse saved assessment templates",
                                      error,
                                    );
                                  }
                                }

                                // If no templates found, use default options
                                if (templates.length === 0) {
                                  return (
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
                                  );
                                }

                                // Otherwise, use templates from localStorage
                                return templates.map(
                                  (template: any, i: number) => (
                                    <SelectItem key={i} value={template.type}>
                                      {template.name}
                                    </SelectItem>
                                  ),
                                );
                              })()}
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
                          <Label htmlFor={`due-date-${index}`}>Due Date</Label>
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
                                  date && updateAssessmentDueDate(index, date)
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
              <Button type="submit">Save Client</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default NewClientForm;
