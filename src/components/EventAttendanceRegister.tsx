import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotifications } from "@/context/NotificationContext";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Save,
  Check,
  X,
  RefreshCw,
  Calendar,
  MapPin,
  Clock,
  Users,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { supabase, setTenantAndOrgId } from "@/lib/supabase";

interface Client {
  id: string;
  name: string;
  profileImage: string;
  caseWorker: string;
  status?: string;
  organizationId?: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  type: string;
  description?: string;
  capacity?: number;
}

interface EventAttendanceRegisterProps {
  eventId: string;
  onSave: (attendees: string[]) => void;
}

const EventAttendanceRegister: React.FC<EventAttendanceRegisterProps> = ({
  eventId,
  onSave,
}) => {
  const navigate = useNavigate();
  const params = useParams();
  const effectiveEventId = eventId || params.eventId;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceCount, setAttendanceCount] = useState<{
    total: number;
    present: number;
  }>({ total: 0, present: 0 });
  const { user } = useUser();
  const { addNotification } = useNotifications();

  // Fetch event data from localStorage
  const [event, setEvent] = useState<Event>({
    id: effectiveEventId || "",
    name: "",
    date: "",
    time: "",
    location: "",
    type: "",
  });

  // Load event data
  useEffect(() => {
    const loadEventData = () => {
      try {
        const allEvents = JSON.parse(localStorage.getItem("events") || "[]");
        const foundEvent = allEvents.find(
          (e: any) => e.id === effectiveEventId,
        );

        if (foundEvent) {
          console.log("Found event:", foundEvent);
          setEvent({
            id: effectiveEventId || "",
            name: foundEvent.name || "",
            date: foundEvent.date || "",
            time: foundEvent.time || "",
            location: foundEvent.location || "",
            type: foundEvent.type || "",
            description: foundEvent.description || "",
            capacity: foundEvent.capacity || 0,
          });

          // If the event has attendees, pre-select them
          if (foundEvent.attendees && Array.isArray(foundEvent.attendees)) {
            setSelectedClients(foundEvent.attendees);
            setAttendanceCount({
              total: clients.length,
              present: foundEvent.attendees.length,
            });
          }
        } else {
          console.error("Event not found with ID:", effectiveEventId);
          // If event not found, show notification
          addNotification({
            type: "warning",
            title: "Event Not Found",
            message: "The requested event could not be found.",
            priority: "medium",
          });
        }
      } catch (error) {
        console.error("Error loading event data:", error);
        addNotification({
          type: "error",
          title: "Error Loading Event",
          message: "There was a problem loading the event data.",
          priority: "high",
        });
      }
    };

    if (effectiveEventId) {
      loadEventData();
    }
  }, [effectiveEventId, addNotification]);

  // Fetch clients from the organization
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        // If we have a user with an organization
        if (user?.tenantId) {
          // Set the tenant ID for RLS
          await setTenantAndOrgId(user.tenantId, user.organizationId);

          // Fetch clients from Supabase - only from the same organization
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("tenant_id", user.tenantId)
            .eq("organization_id", user.organizationId)
            .eq("status", "active")
            .eq("role", "client");

          if (error) {
            throw error;
          }

          if (data) {
            console.log(
              `Fetched ${data.length} clients for tenant ${user.tenantId} and organization ${user.organizationId}`,
            );
            // Transform the data to match our Client interface
            const formattedClients: Client[] = data.map((client) => ({
              id: client.id,
              name: `${client.first_name || ""} ${client.last_name || ""}`.trim(),
              profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.id}`,
              caseWorker: client.case_worker_id
                ? "Assigned Case Worker"
                : "Unassigned",
              status: client.status,
              organizationId: client.tenant_id,
            }));
            setClients(formattedClients);
            setAttendanceCount({
              total: formattedClients.length,
              present: selectedClients.length,
            });
          }
        } else if (user?.tenantId === import.meta.env.VITE_DEMO_TENANT_ID) {
          // For demo tenant, only show Moyo Oshoko
          console.log("Using demo tenant data");
          const demoClients = [
            {
              id: "demo-1",
              name: "Moyo Oshoko",
              profileImage:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=moyo",
              caseWorker: "Demo Case Worker",
              status: "active",
              organizationId: user.tenantId,
            },
            {
              id: "demo-2",
              name: "Sarah Johnson",
              profileImage:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
              caseWorker: "Demo Case Worker",
              status: "active",
              organizationId: user.tenantId,
            },
            {
              id: "demo-3",
              name: "James Wilson",
              profileImage:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
              caseWorker: "Demo Case Worker",
              status: "active",
              organizationId: user.tenantId,
            },
          ];
          setClients(demoClients);
          setAttendanceCount({
            total: demoClients.length,
            present: selectedClients.length,
          });
        } else {
          console.log("No tenant ID found, using mock data");
          // Fallback to mock data if no organization
          const mockClients = [
            {
              id: "1",
              name: "Jane Smith",
              profileImage:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
              caseWorker: "Michael Johnson",
              status: "active",
            },
            {
              id: "2",
              name: "Robert Chen",
              profileImage:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
              caseWorker: "Sarah Williams",
              status: "active",
            },
            {
              id: "3",
              name: "Maria Garcia",
              profileImage:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
              caseWorker: "Michael Johnson",
              status: "active",
            },
            {
              id: "4",
              name: "David Wilson",
              profileImage:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
              caseWorker: "Lisa Chen",
              status: "active",
            },
            {
              id: "5",
              name: "Aisha Patel",
              profileImage:
                "https://api.dicebear.com/7.x/avataaars/svg?seed=aisha",
              caseWorker: "Sarah Williams",
              status: "active",
            },
          ];
          setClients(mockClients);
          setAttendanceCount({
            total: mockClients.length,
            present: selectedClients.length,
          });
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        addNotification({
          type: "error",
          title: "Error",
          message: "Failed to load clients. Please try again.",
          priority: "high",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [user, addNotification]);

  // Update attendance count when clients or selected clients change
  useEffect(() => {
    setAttendanceCount({
      total: clients.length,
      present: selectedClients.length,
    });
  }, [clients.length, selectedClients.length]);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.caseWorker.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggleClient = (clientId: string) => {
    setIsSaved(false);
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId],
    );
  };

  const handleSelectAll = () => {
    setIsSaved(false);
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map((client) => client.id));
    }
  };

  const handleSaveAttendance = () => {
    setIsSaving(true);

    try {
      // Get the event and update attendees
      const allEvents = JSON.parse(localStorage.getItem("events") || "[]");
      const eventIndex = allEvents.findIndex(
        (e: any) => e.id === effectiveEventId,
      );

      if (eventIndex !== -1) {
        // Update the event with selected attendees
        allEvents[eventIndex].attendees = selectedClients;
        localStorage.setItem("events", JSON.stringify(allEvents));
        console.log(
          `Updated event ${effectiveEventId} with ${selectedClients.length} attendees`,
        );
      } else {
        console.error(
          `Could not find event with ID ${effectiveEventId} to save attendees`,
        );
        addNotification({
          type: "warning",
          title: "Event Not Found",
          message: "Could not find the event to save attendance.",
          priority: "medium",
        });
      }

      // Simulate API call
      setTimeout(() => {
        onSave(selectedClients);
        setIsSaving(false);
        setIsSaved(true);

        // Show notification
        addNotification({
          type: "success",
          title: "Attendance Saved",
          message: `Attendance recorded for ${selectedClients.length} clients`,
          priority: "medium",
        });
      }, 1000);
    } catch (error) {
      console.error("Error saving attendance:", error);
      addNotification({
        type: "error",
        title: "Error Saving Attendance",
        message: "There was a problem saving the attendance data.",
        priority: "high",
      });
      setIsSaving(false);
    }
  };

  const handleRefreshClients = async () => {
    setIsLoading(true);
    try {
      // Re-fetch clients
      if (user?.tenantId) {
        await setTenantAndOrgId(user.tenantId, user.organizationId);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("tenant_id", user.tenantId)
          .eq("organization_id", user.organizationId)
          .eq("status", "active")
          .eq("role", "client");

        if (error) throw error;

        if (data) {
          const formattedClients: Client[] = data.map((client) => ({
            id: client.id,
            name: `${client.first_name || ""} ${client.last_name || ""}`.trim(),
            profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${client.id}`,
            caseWorker: client.case_worker_id
              ? "Assigned Case Worker"
              : "Unassigned",
            status: client.status,
            organizationId: client.tenant_id,
          }));
          setClients(formattedClients);
          addNotification({
            type: "success",
            title: "Client List Refreshed",
            message: `Successfully loaded ${formattedClients.length} clients`,
            priority: "low",
          });
        }
      }
    } catch (error) {
      console.error("Error refreshing clients:", error);
      addNotification({
        type: "error",
        title: "Refresh Failed",
        message: "Could not refresh client list. Please try again.",
        priority: "medium",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getEventTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "workshop":
        return <Badge className="bg-blue-100 text-blue-800">Workshop</Badge>;
      case "seminar":
        return <Badge className="bg-purple-100 text-purple-800">Seminar</Badge>;
      case "training":
        return <Badge className="bg-green-100 text-green-800">Training</Badge>;
      case "community":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Community</Badge>
        );
      case "support":
        return <Badge className="bg-red-100 text-red-800">Support</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="p-6 bg-background">
      <div className="flex items-center justify-between mb-4">
        <BackButton />
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/events`)}
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Back to Events
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Event Attendance Register</CardTitle>
              <CardDescription>
                Record attendance for this event
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {event.type && getEventTypeBadge(event.type)}
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {attendanceCount.present}/{attendanceCount.total} Attending
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Event Details */}
            <div className="p-4 bg-muted/50 rounded-md">
              <h3 className="text-lg font-medium">{event.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              </div>
              {event.description && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {event.description}
                </div>
              )}
              {event.capacity && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">Capacity:</span>{" "}
                  {event.capacity} attendees
                </div>
              )}
            </div>

            {/* Search and Select */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search clients..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefreshClients}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </Button>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="select-all"
                      checked={
                        selectedClients.length === filteredClients.length &&
                        filteredClients.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                    <Label htmlFor="select-all">Select All</Label>
                  </div>
                </div>
              </div>

              <div className="border rounded-md overflow-hidden">
                <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 border-b font-medium bg-muted/30">
                  <div>Attended</div>
                  <div>Client</div>
                  <div>Case Worker</div>
                </div>

                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent text-primary"></div>
                    <div className="mt-4 text-muted-foreground">
                      Loading clients...
                    </div>
                  </div>
                ) : filteredClients.length > 0 ? (
                  <div className="max-h-[400px] overflow-y-auto">
                    {filteredClients.map((client) => (
                      <div
                        key={client.id}
                        className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 border-b items-center hover:bg-muted/20 transition-colors"
                      >
                        <Checkbox
                          checked={selectedClients.includes(client.id)}
                          onCheckedChange={() => handleToggleClient(client.id)}
                          id={`client-${client.id}`}
                        />
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={client.profileImage}
                              alt={client.name}
                            />
                            <AvatarFallback>
                              {client.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <Label
                            htmlFor={`client-${client.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {client.name}
                          </Label>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {client.caseWorker}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="text-muted-foreground mb-2">
                      No clients found matching your search.
                    </div>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Clear Search
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <Badge variant="outline" className="mr-2">
                  {selectedClients.length} selected
                </Badge>
                {selectedClients.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedClients([])}
                  >
                    Clear Selection
                  </Button>
                )}
              </div>
              {isSaved ? (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
                  onClick={() => setIsSaved(false)}
                >
                  <Check className="h-4 w-4" />
                  Saved Successfully
                </Button>
              ) : (
                <Button
                  onClick={handleSaveAttendance}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Attendance ({selectedClients.length})
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventAttendanceRegister;
