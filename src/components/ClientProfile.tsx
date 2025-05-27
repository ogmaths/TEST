import React, { useState } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import BackButton from "@/components/BackButton";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  Edit2Icon,
  FileTextIcon,
  MessageSquareIcon,
  UserIcon,
  SaveIcon,
  XIcon,
  KeyRound,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import JourneyTimeline from "./JourneyTimeline";
import AssessmentForm from "./AssessmentForm";
import ImpactReport from "./ImpactReport";
import AddInteractionForm from "./AddInteractionForm";
import AdminPasswordReset from "./AdminPasswordReset";

import { Link, useLocation } from "react-router-dom";

interface ClientProfileProps {
  clientId?: string;
}

const ClientProfile = ({ clientId }: ClientProfileProps) => {
  const location = useLocation();
  // Extract clientId from URL if not provided as prop
  const urlClientId = location.pathname.split("/").pop();
  const effectiveClientId = clientId || urlClientId || "1";
  const [showAssessment, setShowAssessment] = useState(false);
  const [showAddInteraction, setShowAddInteraction] = useState(() => {
    // Check if URL has showAddInteraction parameter
    const params = new URLSearchParams(location.search);
    return params.has("showAddInteraction");
  });
  const [assessmentType, setAssessmentType] = useState<
    "introduction" | "exit" | "progress"
  >("introduction");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editedClient, setEditedClient] = useState<any>(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  // Load client data from localStorage or use mock data as fallback
  const [client, setClient] = useState(() => {
    // Try to find the client in localStorage
    const savedClients = JSON.parse(localStorage.getItem("clients") || "[]");
    const foundClient = savedClients.find(
      (c: any) => c.id === effectiveClientId,
    );

    if (foundClient) {
      return {
        ...foundClient,
        dateOfBirth: foundClient.dateOfBirth || "1985-06-15", // Default if not provided
      };
    }

    // Fallback to mock data if client not found
    return {
      id: effectiveClientId,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+44 7700 900000",
      address: "123 High Street, London, SW1A 1AA",
      dateOfBirth: "1985-06-15",
      joinDate: "2023-03-10",
      status: "Active",
      caseWorker: "Michael Johnson",
      profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=JS",
      notes: "Initial consultation needed",
      assessmentDates: {
        introduction: "2023-03-10",
        progress: "2023-06-10",
        exit: "2023-09-10",
      },
    };
  });

  // Mock visit history
  const visitHistory = [
    {
      id: "1",
      date: "2023-03-10",
      type: "Initial Meeting",
      notes: "Introduction assessment completed",
    },
    {
      id: "2",
      date: "2023-03-24",
      type: "Follow-up",
      notes: "Discussed housing options",
    },
    {
      id: "3",
      date: "2023-04-15",
      type: "Workshop",
      notes: "Attended CV writing workshop",
    },
    {
      id: "4",
      date: "2023-05-02",
      type: "Counseling",
      notes: "Mental health support session",
    },
    {
      id: "5",
      date: "2023-06-10",
      type: "Progress Review",
      notes: "Progress assessment completed",
    },
  ];

  // Mock conversation history
  const conversationHistory = [
    {
      id: "1",
      date: "2023-03-10",
      staff: "Michael Johnson",
      summary: "Initial intake conversation",
    },
    {
      id: "2",
      date: "2023-03-24",
      staff: "Sarah Williams",
      summary: "Housing support discussion",
    },
    {
      id: "3",
      date: "2023-04-20",
      staff: "Michael Johnson",
      summary: "Employment opportunities",
    },
    {
      id: "4",
      date: "2023-05-15",
      staff: "Lisa Chen",
      summary: "Mental health check-in",
    },
  ];

  // Mock event attendance
  const eventAttendance = [
    {
      id: "1",
      date: "2023-03-15",
      name: "Community Resource Fair",
      location: "Community Center",
    },
    {
      id: "2",
      date: "2023-04-05",
      name: "CV Writing Workshop",
      location: "Main Office",
    },
    {
      id: "3",
      date: "2023-05-20",
      name: "Job Interview Skills",
      location: "Training Room B",
    },
  ];

  // Load assessments from localStorage or use mock data
  const [assessments, setAssessments] = useState(() => {
    // Try to find assessments in localStorage
    const savedAssessments = JSON.parse(
      localStorage.getItem("assessments") || "[]",
    );
    const clientAssessments = savedAssessments.filter(
      (a: any) => a.clientId === effectiveClientId,
    );

    if (clientAssessments.length > 0) {
      return clientAssessments;
    }

    // Fallback to mock data if no assessments found
    return [
      {
        id: "1",
        clientId: effectiveClientId,
        date: client.assessmentDates?.introduction || "2023-03-10",
        type: "Introduction",
        completedBy: client.caseWorker || "Michael Johnson",
        status: "completed",
      },
      {
        id: "2",
        clientId: clientId,
        date: client.assessmentDates?.progress || "2023-06-10",
        type: "Progress",
        completedBy: "",
        status: "scheduled",
      },
      {
        id: "3",
        clientId: clientId,
        date: client.assessmentDates?.exit || "2023-09-10",
        type: "Exit",
        completedBy: "",
        status: "scheduled",
      },
    ];
  });

  const handleStartAssessment = (
    type: "introduction" | "exit" | "progress",
  ) => {
    setAssessmentType(type);
    setShowAssessment(true);
  };

  const handleEditProfile = () => {
    setEditedClient({ ...client });
    setShowEditProfile(true);
  };

  const { addNotification } = useNotifications();

  const handleSaveProfile = () => {
    if (editedClient) {
      setClient(editedClient);

      // Save to localStorage
      const savedClients = JSON.parse(localStorage.getItem("clients") || "[]");
      const clientIndex = savedClients.findIndex(
        (c: any) => c.id === effectiveClientId,
      );

      if (clientIndex !== -1) {
        savedClients[clientIndex] = {
          ...savedClients[clientIndex],
          ...editedClient,
        };
      } else {
        savedClients.push(editedClient);
      }

      localStorage.setItem("clients", JSON.stringify(savedClients));
      setShowEditProfile(false);

      // Show notification
      addNotification({
        type: "success",
        title: "Profile Updated",
        message: "Client profile has been updated successfully",
        priority: "medium",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditedClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Load interactions from localStorage
  const [interactions, setInteractions] = useState(() => {
    return JSON.parse(
      localStorage.getItem(`interactions_${effectiveClientId}`) || "[]",
    );
  });

  // Handle adding a new interaction
  const handleAddInteraction = (interaction: any) => {
    // Update the UI with the new interaction
    setInteractions([interaction, ...interactions]);
    setShowAddInteraction(false);

    // Save interaction to localStorage
    const savedInteractions = JSON.parse(
      localStorage.getItem(`interactions_${effectiveClientId}`) || "[]",
    );
    savedInteractions.push(interaction);
    localStorage.setItem(
      `interactions_${effectiveClientId}`,
      JSON.stringify(savedInteractions),
    );

    // Show notification
    addNotification({
      type: "success",
      title: "Interaction Added",
      message: "New interaction has been added successfully",
      priority: "medium",
    });
  };

  if (showAddInteraction) {
    return (
      <div className="bg-background p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Interaction</h2>
          <Button
            variant="outline"
            onClick={() => setShowAddInteraction(false)}
          >
            Back to Profile
          </Button>
        </div>
        <AddInteractionForm
          clientId={effectiveClientId}
          onSubmit={handleAddInteraction}
          onCancel={() => setShowAddInteraction(false)}
        />
      </div>
    );
  }

  if (showAssessment) {
    return (
      <div className="bg-background p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1)}{" "}
            Assessment
          </h2>
          <Button variant="outline" onClick={() => setShowAssessment(false)}>
            Back to Profile
          </Button>
        </div>
        <AssessmentForm
          type={assessmentType}
          clientId={effectiveClientId}
          onComplete={() => setShowAssessment(false)}
          onBack={() => setShowAssessment(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-background p-6 rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Client Profile</h1>
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Client Profile</DialogTitle>
          </DialogHeader>
          {editedClient && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={editedClient.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={editedClient.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={editedClient.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={editedClient.address}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dateOfBirth" className="text-right">
                  Date of Birth
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={editedClient.dateOfBirth}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right font-medium">
                  Assessment Dates
                </Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="introDate" className="w-24">
                      Introduction:
                    </Label>
                    <Input
                      id="introDate"
                      name="assessmentDates.introduction"
                      type="date"
                      value={editedClient.assessmentDates?.introduction || ""}
                      onChange={(e) => {
                        setEditedClient({
                          ...editedClient,
                          assessmentDates: {
                            ...editedClient.assessmentDates,
                            introduction: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="progressDate" className="w-24">
                      Progress:
                    </Label>
                    <Input
                      id="progressDate"
                      name="assessmentDates.progress"
                      type="date"
                      value={editedClient.assessmentDates?.progress || ""}
                      onChange={(e) => {
                        setEditedClient({
                          ...editedClient,
                          assessmentDates: {
                            ...editedClient.assessmentDates,
                            progress: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="exitDate" className="w-24">
                      Exit:
                    </Label>
                    <Input
                      id="exitDate"
                      name="assessmentDates.exit"
                      type="date"
                      value={editedClient.assessmentDates?.exit || ""}
                      onChange={(e) => {
                        setEditedClient({
                          ...editedClient,
                          assessmentDates: {
                            ...editedClient.assessmentDates,
                            exit: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Input
                  id="status"
                  name="status"
                  value={editedClient.status}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="caseWorker" className="text-right">
                  Case Worker
                </Label>
                <Input
                  id="caseWorker"
                  name="caseWorker"
                  value={editedClient.caseWorker}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={editedClient.notes}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditProfile(false)}>
              <XIcon className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              <SaveIcon className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex justify-between items-center mb-4">
        <BackButton />
        <Link to="/assessments">
          <Button variant="outline" className="flex items-center gap-2">
            <FileTextIcon className="h-4 w-4" /> View Assessments
          </Button>
        </Link>
      </div>
      {/* Client Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src={client.profileImage} alt={client.name} />
            <AvatarFallback>
              {client.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={client.status === "Active" ? "default" : "outline"}
              >
                {client.status}
              </Badge>
              <span className="text-muted-foreground">
                Client since {new Date(client.joinDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleEditProfile}
          >
            <Edit2Icon className="h-4 w-4" /> Edit Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setShowPasswordReset(true)}
          >
            <KeyRound className="h-4 w-4" /> Reset Password
          </Button>
        </div>
      </div>

      {/* Client Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="journey">Journey</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="impact">Impact Report</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="col-span-2">{client.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="col-span-2">{client.phone}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Address:</span>
                  <span className="col-span-2">{client.address}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span className="col-span-2">
                    {new Date(client.dateOfBirth).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Case Worker:</span>
                  <span className="col-span-2">{client.caseWorker}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {interactions.length > 0
                  ? interactions
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime(),
                      )
                      .slice(0, 3)
                      .map((interaction) => (
                        <div
                          key={interaction.id}
                          className="border-l-2 border-primary pl-4 py-1"
                        >
                          <p className="text-sm font-medium">
                            {interaction.title ||
                              (interaction.type
                                ? interaction.type === "phone-call"
                                  ? "Phone Call"
                                  : interaction.type.charAt(0).toUpperCase() +
                                    interaction.type.slice(1)
                                : "Interaction")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(interaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                  : visitHistory.slice(0, 3).map((visit) => (
                      <div
                        key={visit.id}
                        className="border-l-2 border-primary pl-4 py-1"
                      >
                        <p className="text-sm font-medium">{visit.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(visit.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquareIcon className="h-5 w-5" /> Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{client.notes}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Journey Tab */}
        <TabsContent value="journey">
          <Card>
            <CardHeader>
              <CardTitle>Client Journey Timeline</CardTitle>
              <CardDescription>
                Visual representation of client's progress through the program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JourneyTimeline clientId={effectiveClientId} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assessments Tab */}
        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle>Assessment History</CardTitle>
              <CardDescription>
                Record of all assessments conducted with this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium w-1/4">Date</th>
                      <th className="p-2 text-left font-medium w-1/4">Type</th>
                      <th className="p-2 text-left font-medium w-1/4">
                        Completed By
                      </th>
                      <th className="p-2 text-left font-medium w-1/4">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map((assessment) => (
                      <tr key={assessment.id} className="border-b">
                        <td className="p-2">
                          {new Date(assessment.date).toLocaleDateString()}
                        </td>
                        <td className="p-2">
                          <Badge
                            variant={
                              assessment.type === "Introduction"
                                ? "default"
                                : assessment.type === "Progress"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {assessment.type}
                          </Badge>
                        </td>
                        <td className="p-2">
                          {assessment.status === "completed" ? (
                            assessment.completedBy
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              {assessment.status === "scheduled"
                                ? "Scheduled"
                                : "Not assigned"}
                            </span>
                          )}
                        </td>
                        <td className="p-2">
                          <div className="flex gap-2">
                            {assessment.status === "completed" ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleStartAssessment(
                                    assessment.type.toLowerCase() as any,
                                  )
                                }
                              >
                                View
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleStartAssessment(
                                    assessment.type.toLowerCase() as any,
                                  )
                                }
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Impact Report Tab */}
        <TabsContent value="impact">
          <Card>
            <CardHeader>
              <CardTitle>Client Impact Report</CardTitle>
              <CardDescription>
                Visualization of client progress based on assessment data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImpactReport clientId={effectiveClientId} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Password Reset Dialog */}
      <AdminPasswordReset
        open={showPasswordReset}
        onOpenChange={setShowPasswordReset}
        userId={client.id}
        userEmail={client.email}
        userName={client.name}
        userType="client"
      />
    </div>
  );
};

export default ClientProfile;
