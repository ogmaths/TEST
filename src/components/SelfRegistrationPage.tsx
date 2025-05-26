import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotifications } from "@/context/NotificationContext";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, UserPlus, UserCheck } from "lucide-react";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  type: string;
  attendees?: string[];
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const SelfRegistrationPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("existing");

  // Form states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [newClientForm, setNewClientForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    // Load event data
    const loadEvent = () => {
      setLoading(true);
      try {
        const allEvents = JSON.parse(localStorage.getItem("events") || "[]");
        const foundEvent = allEvents.find((e: Event) => e.id === eventId);

        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError("Event not found");
        }
      } catch (err) {
        setError("Failed to load event data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  useEffect(() => {
    // Filter clients based on search query
    if (searchQuery.trim() === "") {
      setFilteredClients([]);
      return;
    }

    try {
      const allClients = JSON.parse(localStorage.getItem("clients") || "[]");
      const filtered = allClients.filter(
        (client: Client) =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (client.email &&
            client.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (client.phone && client.phone.includes(searchQuery)),
      );

      setFilteredClients(filtered);
    } catch (err) {
      console.error("Error filtering clients:", err);
    }
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewClientForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectClient = (clientId: string) => {
    setSelectedClient(clientId);
  };

  const handleExistingClientSubmit = () => {
    if (!selectedClient) {
      addNotification({
        type: "error",
        title: "Selection Required",
        message: "Please select a client to register",
        priority: "medium",
      });
      return;
    }

    // Update event attendees
    try {
      const allEvents = JSON.parse(localStorage.getItem("events") || "[]");
      const eventIndex = allEvents.findIndex((e: Event) => e.id === eventId);

      if (eventIndex !== -1) {
        // Initialize attendees array if it doesn't exist
        if (!allEvents[eventIndex].attendees) {
          allEvents[eventIndex].attendees = [];
        }

        // Check if client is already registered
        if (allEvents[eventIndex].attendees.includes(selectedClient)) {
          addNotification({
            type: "info",
            title: "Already Registered",
            message: "You are already registered for this event",
            priority: "low",
          });
        } else {
          // Add client to attendees
          allEvents[eventIndex].attendees.push(selectedClient);
          localStorage.setItem("events", JSON.stringify(allEvents));

          setRegistered(true);
          addNotification({
            type: "success",
            title: "Registration Successful",
            message: "You have been registered for the event",
            priority: "high",
          });
        }
      }
    } catch (err) {
      console.error("Error updating attendees:", err);
      addNotification({
        type: "error",
        title: "Registration Failed",
        message: "Failed to register for the event",
        priority: "high",
      });
    }
  };

  const handleNewClientSubmit = () => {
    // Validate form
    if (!newClientForm.firstName || !newClientForm.lastName) {
      addNotification({
        type: "error",
        title: "Missing Information",
        message: "Please provide at least first and last name",
        priority: "medium",
      });
      return;
    }

    try {
      // Create new client
      const newClient = {
        id: Date.now().toString(),
        name: `${newClientForm.firstName} ${newClientForm.lastName}`,
        email: newClientForm.email,
        phone: newClientForm.phone,
        status: "Active",
        joinDate: new Date().toISOString().split("T")[0],
        profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${newClientForm.firstName.charAt(0)}${newClientForm.lastName.charAt(0)}`,
        lastActivity: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString().split("T")[0],
      };

      // Save client
      const existingClients = JSON.parse(
        localStorage.getItem("clients") || "[]",
      );
      localStorage.setItem(
        "clients",
        JSON.stringify([...existingClients, newClient]),
      );

      // Register for event
      const allEvents = JSON.parse(localStorage.getItem("events") || "[]");
      const eventIndex = allEvents.findIndex((e: Event) => e.id === eventId);

      if (eventIndex !== -1) {
        // Initialize attendees array if it doesn't exist
        if (!allEvents[eventIndex].attendees) {
          allEvents[eventIndex].attendees = [];
        }

        // Add client to attendees
        allEvents[eventIndex].attendees.push(newClient.id);
        localStorage.setItem("events", JSON.stringify(allEvents));

        setRegistered(true);
        addNotification({
          type: "success",
          title: "Registration Successful",
          message:
            "Your profile has been created and you've been registered for the event",
          priority: "high",
        });
      }
    } catch (err) {
      console.error("Error creating client and registering:", err);
      addNotification({
        type: "error",
        title: "Registration Failed",
        message: "Failed to create profile and register for the event",
        priority: "high",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "Event not found"}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/events")} className="w-full">
              Return to Events
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (registered) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Registration Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
            <p className="text-muted-foreground text-center mb-4">
              You have successfully registered for this event.
            </p>
            <div className="bg-muted/50 p-4 rounded-md w-full">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div>
                  <strong>Time:</strong> {event.time}
                </div>
                <div>
                  <strong>Location:</strong> {event.location}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/events")} className="w-full">
              Done
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Event Registration</CardTitle>
          <CardDescription>{event.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-md">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div>
                  <strong>Time:</strong> {event.time}
                </div>
                <div>
                  <strong>Location:</strong> {event.location}
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="existing"
                  className="flex items-center gap-2"
                >
                  <UserCheck className="h-4 w-4" /> Existing Client
                </TabsTrigger>
                <TabsTrigger value="new" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" /> New Client
                </TabsTrigger>
              </TabsList>

              <TabsContent value="existing" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search for your profile</Label>
                  <Input
                    id="search"
                    placeholder="Search by name, email, or phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {filteredClients.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        className={`p-3 rounded-md flex items-center gap-3 cursor-pointer ${selectedClient === client.id ? "bg-primary/10 border border-primary/30" : "bg-muted/50 hover:bg-muted"}`}
                        onClick={() => handleSelectClient(client.id)}
                      >
                        <Avatar>
                          <AvatarFallback>
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{client.name}</div>
                          {client.email && (
                            <div className="text-xs text-muted-foreground">
                              {client.email}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No clients found matching your search.
                  </div>
                ) : null}

                <Button
                  className="w-full"
                  disabled={!selectedClient}
                  onClick={handleExistingClientSubmit}
                >
                  Register for Event
                </Button>
              </TabsContent>

              <TabsContent value="new" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      value={newClientForm.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={newClientForm.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={newClientForm.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+44 7700 900000"
                    value={newClientForm.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <Button className="w-full" onClick={handleNewClientSubmit}>
                  Create Profile & Register
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelfRegistrationPage;
