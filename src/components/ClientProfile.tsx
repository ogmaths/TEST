import React, { useState, useEffect } from "react";
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
import JourneyTimeline from "./JourneyTimeline";

interface ClientProfileProps {
  clientId?: string;
}

const ClientProfile: React.FC<ClientProfileProps> = ({ clientId }) => {
  const { addNotification } = useNotifications();
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Check for tab parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get("tab");
    if (tabParam && ["overview", "journey", "documents"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<any>(null);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);

  // Sample visit history data
  const visitHistory = [
    {
      id: "v1",
      type: "Initial Assessment",
      date: "2023-01-15",
      notes: "First meeting with client to assess needs.",
    },
    {
      id: "v2",
      type: "Follow-up Meeting",
      date: "2023-02-01",
      notes: "Discussed progress and next steps.",
    },
    {
      id: "v3",
      type: "Workshop Attendance",
      date: "2023-02-15",
      notes: "Client attended the financial literacy workshop.",
    },
    {
      id: "v4",
      type: "Support Group",
      date: "2023-03-01",
      notes: "Client participated in the peer support group session.",
    },
    {
      id: "v5",
      type: "Progress Review",
      date: "2023-03-15",
      notes: "Reviewed progress on goals and adjusted plan.",
    },
  ];

  // Get client ID from URL if not provided as prop
  const urlParams = new URLSearchParams(window.location.search);
  const urlClientId = urlParams.get("id");
  const effectiveClientId = clientId || urlClientId || "1";

  // Load client data
  useEffect(() => {
    const loadClient = () => {
      setLoading(true);
      // In a real app, this would be an API call
      // For now, we'll use localStorage
      const storedClients = JSON.parse(localStorage.getItem("clients") || "[]");
      const foundClient = storedClients.find(
        (c: any) => c.id === effectiveClientId,
      );

      if (foundClient) {
        setClient(foundClient);
        setEditedClient(foundClient);
      } else {
        // If client not found, create a dummy one
        const dummyClient = {
          id: effectiveClientId,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "(555) 123-4567",
          address: "123 Main St, Anytown, USA",
          dateOfBirth: "1985-06-15",
          status: "active",
          caseWorker: "John Doe",
          joinDate: "2023-01-01",
          notes:
            "Jane has been making good progress with her financial goals. She recently completed the budgeting workshop and has started applying for jobs.",
          tags: ["housing", "employment", "financial-support"],
        };
        setClient(dummyClient);
        setEditedClient(dummyClient);

        // Save to localStorage for future use
        localStorage.setItem(
          "clients",
          JSON.stringify([...storedClients, dummyClient]),
        );
      }

      // Load interactions
      const storedInteractions = JSON.parse(
        localStorage.getItem(`interactions_${effectiveClientId}`) || "[]",
      );
      setInteractions(storedInteractions);

      // Load assessments
      const allAssessments = JSON.parse(
        localStorage.getItem("assessments") || "[]",
      );
      const clientAssessments = allAssessments.filter(
        (a: any) => a.clientId === effectiveClientId,
      );
      setAssessments(clientAssessments);

      setLoading(false);
    };

    loadClient();

    // Add event listener for storage changes to refresh data when interactions are added
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === `interactions_${effectiveClientId}` ||
        e.key === "clients" ||
        e.key === "assessments"
      ) {
        loadClient();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for focus events to refresh data when returning to the page
    const handleFocus = () => {
      loadClient();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [effectiveClientId, window.location.pathname]);

  const handleSaveChanges = () => {
    // Update client in localStorage
    const storedClients = JSON.parse(localStorage.getItem("clients") || "[]");
    const updatedClients = storedClients.map((c: any) =>
      c.id === effectiveClientId ? editedClient : c,
    );
    localStorage.setItem("clients", JSON.stringify(updatedClients));

    // Update state
    setClient(editedClient);
    setIsEditing(false);

    // Show notification
    addNotification({
      type: "success",
      title: "Profile Updated",
      message: "Client profile has been successfully updated.",
    });
  };

  const handleCancelEdit = () => {
    setEditedClient(client);
    setIsEditing(false);
  };

  const handleAddInteraction = () => {
    // Navigate to add interaction page with client ID in the URL
    window.location.href = `/interaction/add/${effectiveClientId}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading client profile...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Client Not Found</h2>
        <p className="text-gray-500 mt-2">
          The client you're looking for doesn't exist or has been removed.
        </p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => (window.location.href = "/clients")}
        >
          Back to Clients
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BackButton />
          <h1 className="text-2xl font-bold">Client Profile</h1>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2Icon className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancelEdit}>
              <XIcon className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button onClick={handleSaveChanges}>
              <SaveIcon className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="w-full">
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="journey">Journey</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              {isEditing ? (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>
                      Update client's personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </label>
                        <input
                          id="name"
                          className="w-full p-2 border rounded-md"
                          value={editedClient.name}
                          onChange={(e) =>
                            setEditedClient({
                              ...editedClient,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="w-full p-2 border rounded-md"
                          value={editedClient.email}
                          onChange={(e) =>
                            setEditedClient({
                              ...editedClient,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          Phone
                        </label>
                        <input
                          id="phone"
                          className="w-full p-2 border rounded-md"
                          value={editedClient.phone}
                          onChange={(e) =>
                            setEditedClient({
                              ...editedClient,
                              phone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="address"
                          className="text-sm font-medium"
                        >
                          Address
                        </label>
                        <input
                          id="address"
                          className="w-full p-2 border rounded-md"
                          value={editedClient.address}
                          onChange={(e) =>
                            setEditedClient({
                              ...editedClient,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="dob" className="text-sm font-medium">
                          Date of Birth
                        </label>
                        <input
                          id="dob"
                          type="date"
                          className="w-full p-2 border rounded-md"
                          value={editedClient.dateOfBirth}
                          onChange={(e) =>
                            setEditedClient({
                              ...editedClient,
                              dateOfBirth: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="status" className="text-sm font-medium">
                          Status
                        </label>
                        <select
                          id="status"
                          className="w-full p-2 border rounded-md"
                          value={editedClient.status}
                          onChange={(e) =>
                            setEditedClient({
                              ...editedClient,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="notes" className="text-sm font-medium">
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        className="w-full p-2 border rounded-md"
                        rows={4}
                        value={editedClient.notes}
                        onChange={(e) =>
                          setEditedClient({
                            ...editedClient,
                            notes: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="tags" className="text-sm font-medium">
                        Tags (comma separated)
                      </label>
                      <input
                        id="tags"
                        className="w-full p-2 border rounded-md"
                        value={editedClient.tags?.join(", ") || ""}
                        onChange={(e) =>
                          setEditedClient({
                            ...editedClient,
                            tags: e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter((tag) => tag),
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>

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
                      <span className="text-muted-foreground">
                        Date of Birth:
                      </span>
                      <span className="col-span-2">
                        {new Date(client.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span className="text-muted-foreground">
                        Case Worker:
                      </span>
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
                                {interaction.type
                                  ? interaction.type === "phone_call"
                                    ? "Phone Call"
                                    : interaction.type.charAt(0).toUpperCase() +
                                      interaction.type
                                        .slice(1)
                                        .replace("_", " ")
                                  : "Interaction"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(
                                  interaction.date,
                                ).toLocaleDateString()}
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

            <TabsContent value="journey">
              <Card>
                <CardHeader>
                  <CardTitle>Client Journey Timeline</CardTitle>
                  <CardDescription>
                    Track the client's progress and interactions over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <JourneyTimeline
                    clientId={effectiveClientId}
                    showDetails={true}
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() =>
                      window.open(
                        `/journey?clientId=${effectiveClientId}`,
                        "_blank",
                      )
                    }
                    variant="outline"
                  >
                    Open in Full Page
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Manage client documents and files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Uploaded Documents</h3>
                      <Button size="sm">
                        <KeyRound className="h-4 w-4 mr-2" /> Upload Document
                      </Button>
                    </div>

                    <div className="border rounded-lg divide-y">
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Initial Assessment Form</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded on Jan 15, 2023
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Financial Support Plan</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded on Feb 3, 2023
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">Progress Report</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded on Mar 20, 2023
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
