import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Calendar,
  Plus,
  Users,
  Check,
  Download,
  FormInput,
  Trash2,
  Move,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import {
  fetchEventbriteEvents,
  importEventbriteEvents,
} from "@/utils/eventbriteService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sendFeedbackFormEmail } from "@/utils/emailService";
// QR code functionality will be implemented separately
import BackButton from "@/components/BackButton";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  type: "workshop" | "meeting" | "training" | "community" | "other";
  attendees: number;
  organizer: string;
  feedbackForm?: FeedbackForm;
}

interface Client {
  id: string;
  name: string;
  email: string;
  status: string;
  joinDate: string;
  caseWorker: string;
  profileImage: string;
  lastActivity: string;
}

interface FeedbackQuestion {
  id: string;
  type: "text" | "textarea" | "radio" | "checkbox" | "rating";
  question: string;
  required: boolean;
  options?: string[];
}

interface FeedbackForm {
  id: string;
  title: string;
  description: string;
  questions: FeedbackQuestion[];
}

const EventsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const { addNotification } = useNotifications();
  const [eventbriteDialogOpen, setEventbriteDialogOpen] = useState(false);
  const [eventbriteOrgId, setEventbriteOrgId] = useState("");
  const [eventbriteToken, setEventbriteToken] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [clientSelectionDialogOpen, setClientSelectionDialogOpen] =
    useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [selectAllClients, setSelectAllClients] = useState(false);
  const [filters, setFilters] = useState({
    workshop: true,
    meeting: true,
    training: true,
    community: true,
    other: true,
  });
  const [feedbackBuilderOpen, setFeedbackBuilderOpen] = useState(false);
  const [selectedEventForBuilder, setSelectedEventForBuilder] =
    useState<Event | null>(null);
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>({
    id: "",
    title: "",
    description: "",
    questions: [],
  });
  const [isCreatingForm, setIsCreatingForm] = useState(false);

  // Load events and clients from localStorage or use mock data if none exists
  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      // Mock events data as fallback
      setEvents([
        {
          id: "1",
          name: "Financial Literacy Workshop",
          date: "2023-06-20",
          time: "10:00 AM - 12:00 PM",
          location: "Main Office - Room 101",
          type: "workshop",
          attendees: 15,
          organizer: "Sarah Williams",
        },
        {
          id: "2",
          name: "Job Interview Skills Training",
          date: "2023-06-22",
          time: "2:00 PM - 4:00 PM",
          location: "Training Center - Room B",
          type: "training",
          attendees: 12,
          organizer: "Michael Johnson",
        },
        {
          id: "3",
          name: "Community Resource Fair",
          date: "2023-06-25",
          time: "11:00 AM - 3:00 PM",
          location: "Community Center",
          type: "community",
          attendees: 50,
          organizer: "Lisa Chen",
        },
        {
          id: "4",
          name: "Case Worker Meeting",
          date: "2023-06-21",
          time: "9:00 AM - 10:30 AM",
          location: "Conference Room A",
          type: "meeting",
          attendees: 8,
          organizer: "David Wilson",
        },
        {
          id: "5",
          name: "Mental Health Support Group",
          date: "2023-06-23",
          time: "5:00 PM - 6:30 PM",
          location: "Wellness Center",
          type: "other",
          attendees: 10,
          organizer: "Maria Garcia",
        },
      ]);
    }

    // Load clients from localStorage or use mock data
    const savedClients = localStorage.getItem("clients");
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    } else {
      // Mock clients data with email addresses
      setClients([
        {
          id: "1",
          name: "Jane Smith",
          email: "jane.smith@email.com",
          status: "Active",
          joinDate: "2023-03-10",
          caseWorker: "Michael Johnson",
          profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=JS",
          lastActivity: "2023-06-15",
        },
        {
          id: "2",
          name: "Robert Chen",
          email: "robert.chen@email.com",
          status: "Active",
          joinDate: "2023-04-05",
          caseWorker: "Sarah Williams",
          profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=RC",
          lastActivity: "2023-06-10",
        },
        {
          id: "3",
          name: "Maria Garcia",
          email: "maria.garcia@email.com",
          status: "Inactive",
          joinDate: "2023-01-20",
          caseWorker: "Michael Johnson",
          profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=MG",
          lastActivity: "2023-05-22",
        },
        {
          id: "4",
          name: "David Wilson",
          email: "david.wilson@email.com",
          status: "Active",
          joinDate: "2023-05-12",
          caseWorker: "Lisa Chen",
          profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=DW",
          lastActivity: "2023-06-14",
        },
        {
          id: "5",
          name: "Aisha Patel",
          email: "aisha.patel@email.com",
          status: "Active",
          joinDate: "2023-02-28",
          caseWorker: "Sarah Williams",
          profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=AP",
          lastActivity: "2023-06-01",
        },
      ]);
    }
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      (event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())) &&
      ((event.type === "workshop" && filters.workshop) ||
        (event.type === "meeting" && filters.meeting) ||
        (event.type === "training" && filters.training) ||
        (event.type === "community" && filters.community) ||
        (event.type === "other" && filters.other)),
  );

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "workshop":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 font-medium">
            Workshop
          </Badge>
        );
      case "meeting":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 font-medium">
            Meeting
          </Badge>
        );
      case "training":
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 font-medium">
            Training
          </Badge>
        );
      case "community":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 font-medium">
            Community
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium capitalize">
            {type}
          </Badge>
        );
    }
  };

  const handleImportEventbrite = async () => {
    if (!eventbriteOrgId || !eventbriteToken) {
      addNotification({
        type: "error",
        title: "Missing Information",
        message: "Please enter both Organization ID and API Token",
        priority: "high",
      });
      return;
    }

    setIsImporting(true);

    try {
      // Fetch events from Eventbrite
      const fetchResult = await fetchEventbriteEvents(
        eventbriteOrgId,
        eventbriteToken,
      );

      if (!fetchResult.success || !fetchResult.events) {
        addNotification({
          type: "error",
          title: "Import Failed",
          message:
            fetchResult.message || "Failed to fetch events from Eventbrite",
          priority: "high",
        });
        return;
      }

      // Import events into the application
      const importResult = await importEventbriteEvents(fetchResult.events);

      if (importResult.success) {
        addNotification({
          type: "success",
          title: "Events Imported",
          message: importResult.message,
          priority: "high",
        });

        // Refresh events list
        const savedEvents = localStorage.getItem("events");
        if (savedEvents) {
          setEvents(JSON.parse(savedEvents));
        }

        setEventbriteDialogOpen(false);
      } else {
        addNotification({
          type: "error",
          title: "Import Failed",
          message: importResult.message,
          priority: "high",
        });
      }
    } catch (error) {
      console.error("Error importing events:", error);
      addNotification({
        type: "error",
        title: "Import Failed",
        message: "An unexpected error occurred",
        priority: "high",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleSendFeedbackForm = async () => {
    if (!clientEmail || !clientName) {
      addNotification({
        type: "error",
        title: "Missing Information",
        message: "Please enter both client name and email",
        priority: "high",
      });
      return;
    }

    setIsSendingFeedback(true);

    try {
      const result = await sendFeedbackFormEmail(
        clientEmail,
        clientName,
        selectedEvent?.id,
        selectedEvent?.feedbackForm,
      );

      if (result.success) {
        addNotification({
          type: "success",
          title: "Feedback Form Sent",
          message: result.message,
          priority: "high",
        });
        setFeedbackDialogOpen(false);
        setClientEmail("");
        setClientName("");
      } else {
        addNotification({
          type: "error",
          title: "Failed to Send",
          message: result.message,
          priority: "high",
        });
      }
    } catch (error) {
      console.error("Error sending feedback form:", error);
      addNotification({
        type: "error",
        title: "Failed to Send",
        message: "An unexpected error occurred",
        priority: "high",
      });
    } finally {
      setIsSendingFeedback(false);
    }
  };

  const handleSendToSelectedClients = async () => {
    if (selectedClients.length === 0) {
      addNotification({
        type: "error",
        title: "No Attendees Selected",
        message:
          "Please select at least one event attendee to send the feedback form to",
        priority: "high",
      });
      return;
    }

    if (attendingClients.length === 0) {
      addNotification({
        type: "error",
        title: "No Attendees Available",
        message:
          "No attendees have been recorded for this event. Please record attendance first.",
        priority: "high",
      });
      return;
    }

    setIsSendingFeedback(true);

    try {
      // Only send to attendees who are selected
      const clientsToSend = attendingClients.filter((client) =>
        selectedClients.includes(client.id),
      );

      if (clientsToSend.length === 0) {
        addNotification({
          type: "error",
          title: "No Valid Attendees",
          message: "Selected clients are not valid event attendees.",
          priority: "high",
        });
        return;
      }

      const results = await Promise.all(
        clientsToSend.map((client) =>
          sendFeedbackFormEmail(
            client.email,
            client.name,
            selectedEvent?.id,
            selectedEvent?.feedbackForm,
          ),
        ),
      );

      const successCount = results.filter((result) => result.success).length;
      const failureCount = results.length - successCount;

      if (successCount > 0) {
        addNotification({
          type: "success",
          title: "Feedback Forms Sent",
          message: `Successfully sent feedback forms to ${successCount} attendee${successCount > 1 ? "s" : ""}${failureCount > 0 ? `. ${failureCount} failed to send.` : "."}`,
          priority: "high",
        });
      }

      if (failureCount > 0 && successCount === 0) {
        addNotification({
          type: "error",
          title: "Failed to Send",
          message: `Failed to send feedback forms to all ${failureCount} selected attendees`,
          priority: "high",
        });
      }

      setClientSelectionDialogOpen(false);
      setSelectedClients([]);
      setSelectAllClients(false);
    } catch (error) {
      console.error("Error sending feedback forms:", error);
      addNotification({
        type: "error",
        title: "Failed to Send",
        message: "An unexpected error occurred while sending feedback forms",
        priority: "high",
      });
    } finally {
      setIsSendingFeedback(false);
    }
  };

  const handleSelectAllClients = (checked: boolean) => {
    setSelectAllClients(checked);
    if (checked) {
      setSelectedClients(attendingClients.map((client) => client.id));
    } else {
      setSelectedClients([]);
    }
  };

  const handleClientSelection = (clientId: string, checked: boolean) => {
    if (checked) {
      setSelectedClients((prev) => [...prev, clientId]);
    } else {
      setSelectedClients((prev) => prev.filter((id) => id !== clientId));
      setSelectAllClients(false);
    }
  };

  const openClientSelectionDialog = (event: Event) => {
    setSelectedEvent(event);
    setClientSelectionDialogOpen(true);
  };

  // Get attendees for the selected event
  const getEventAttendees = (event: Event | null): Client[] => {
    if (!event) return [];

    // Get the event data from localStorage to check for attendees
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      const allEvents = JSON.parse(savedEvents);
      const foundEvent = allEvents.find((e: any) => e.id === event.id);

      if (
        foundEvent &&
        foundEvent.attendees &&
        Array.isArray(foundEvent.attendees)
      ) {
        // Filter clients to only include those who attended the event
        return clients.filter(
          (client) =>
            foundEvent.attendees.includes(client.id) &&
            client.status === "Active",
        );
      }
    }

    // If no attendees recorded, return empty array
    return [];
  };

  const attendingClients = selectedEvent
    ? getEventAttendees(selectedEvent)
    : [];

  const handleCreateFeedbackForm = (event: Event) => {
    setSelectedEventForBuilder(event);
    setFeedbackForm({
      id: `feedback-${event.id}-${Date.now()}`,
      title: `Feedback for ${event.name}`,
      description: "Please share your feedback about this event.",
      questions: [
        {
          id: "q1",
          type: "rating",
          question: "How would you rate this event overall?",
          required: true,
          options: ["1", "2", "3", "4", "5"],
        },
        {
          id: "q2",
          type: "textarea",
          question: "What did you like most about this event?",
          required: false,
        },
        {
          id: "q3",
          type: "textarea",
          question: "What could be improved?",
          required: false,
        },
      ],
    });
    setFeedbackBuilderOpen(true);
  };

  const addQuestion = () => {
    const newQuestion: FeedbackQuestion = {
      id: `q${feedbackForm.questions.length + 1}`,
      type: "text",
      question: "",
      required: false,
    };
    setFeedbackForm((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (
    questionId: string,
    updates: Partial<FeedbackQuestion>,
  ) => {
    setFeedbackForm((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q,
      ),
    }));
  };

  const removeQuestion = (questionId: string) => {
    setFeedbackForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));
  };

  const saveFeedbackForm = async () => {
    if (!selectedEventForBuilder) return;

    setIsCreatingForm(true);

    try {
      // Update the event with the feedback form
      const updatedEvents = events.map((event) =>
        event.id === selectedEventForBuilder.id
          ? { ...event, feedbackForm }
          : event,
      );

      setEvents(updatedEvents);
      localStorage.setItem("events", JSON.stringify(updatedEvents));

      addNotification({
        type: "success",
        title: "Feedback Form Created",
        message: `Feedback form for ${selectedEventForBuilder.name} has been created successfully.`,
        priority: "high",
      });

      setFeedbackBuilderOpen(false);
    } catch (error) {
      console.error("Error saving feedback form:", error);
      addNotification({
        type: "error",
        title: "Failed to Save",
        message: "Could not save the feedback form. Please try again.",
        priority: "high",
      });
    } finally {
      setIsCreatingForm(false);
    }
  };

  return (
    <div className="p-6 bg-background">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <BackButton />
        </div>
        <Link to="/clients">
          <Button variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> View Clients
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Events Management</h1>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Events List</h2>
          <p className="text-muted-foreground mt-1">
            {filteredEvents.length} event
            {filteredEvents.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={eventbriteDialogOpen}
            onOpenChange={setEventbriteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" /> Import from Eventbrite
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Eventbrite Events</DialogTitle>
                <DialogDescription>
                  Enter your Eventbrite credentials to import events.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="org-id">Organization ID</Label>
                  <Input
                    id="org-id"
                    placeholder="123456789"
                    value={eventbriteOrgId}
                    onChange={(e) => setEventbriteOrgId(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="api-token">API Token</Label>
                  <Input
                    id="api-token"
                    type="password"
                    placeholder="XXXXXXXXXXXXXXXX"
                    value={eventbriteToken}
                    onChange={(e) => setEventbriteToken(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setEventbriteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleImportEventbrite} disabled={isImporting}>
                  {isImporting ? "Importing..." : "Import Events"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Link to="/events/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create Event
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8 p-4 bg-muted/30 rounded-lg border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search events by name, organizer, or location..."
            className="pl-10 h-10 border-2 focus:border-primary transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 h-10 border-2 hover:border-primary transition-colors"
            >
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Event Types</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.workshop}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, workshop: checked }))
              }
            >
              <div className="flex items-center gap-2">
                Workshop
                {filters.workshop && <Check className="ml-auto h-4 w-4" />}
              </div>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.meeting}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, meeting: checked }))
              }
            >
              <div className="flex items-center gap-2">
                Meeting
                {filters.meeting && <Check className="ml-auto h-4 w-4" />}
              </div>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.training}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, training: checked }))
              }
            >
              <div className="flex items-center gap-2">
                Training
                {filters.training && <Check className="ml-auto h-4 w-4" />}
              </div>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.community}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, community: checked }))
              }
            >
              <div className="flex items-center gap-2">
                Community
                {filters.community && <Check className="ml-auto h-4 w-4" />}
              </div>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.other}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, other: checked }))
              }
            >
              <div className="flex items-center gap-2">
                Other
                {filters.other && <Check className="ml-auto h-4 w-4" />}
              </div>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card
            key={event.id}
            className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary"
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                    {event.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">
                    Organized by {event.organizer}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {getEventTypeBadge(event.type)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {event.time}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {event.attendees} attendees
                    </div>
                    <div className="text-xs text-muted-foreground">
                      registered
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-muted/30">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                    Location
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {event.location}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={event.feedbackForm ? "default" : "outline"}
                      onClick={() => handleCreateFeedbackForm(event)}
                      className="flex items-center gap-2 flex-1 min-w-0"
                    >
                      <FormInput className="h-3 w-3" />
                      <span className="truncate">
                        {event.feedbackForm ? "Edit Form" : "Create Form"}
                      </span>
                    </Button>

                    {event.feedbackForm && (
                      <div className="flex gap-2 flex-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openClientSelectionDialog(event)}
                          className="flex items-center gap-1 flex-1"
                        >
                          <Users className="h-3 w-3" />
                          <span className="hidden sm:inline">
                            Send to Clients
                          </span>
                          <span className="sm:hidden">Clients</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedEvent(event);
                            setFeedbackDialogOpen(true);
                          }}
                          className="flex items-center gap-1"
                          title="Send Manual"
                        >
                          <FormInput className="h-3 w-3" />
                          <span className="hidden sm:inline">Manual</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  <Link
                    to={`/events/attendance/${event.id}`}
                    className="w-full"
                  >
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full flex items-center gap-2"
                    >
                      <Users className="h-3 w-3" />
                      Manage Attendees
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Client Selection Dialog */}
      <Dialog
        open={clientSelectionDialogOpen}
        onOpenChange={setClientSelectionDialogOpen}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Feedback Form to Event Attendees</DialogTitle>
            <DialogDescription>
              Select attendees to send the feedback form for{" "}
              {selectedEvent?.name}.
              {attendingClients.length === 0 && (
                <span className="block mt-2 text-amber-600 font-medium">
                  ⚠️ No attendees recorded for this event. Please record
                  attendance first.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectAllClients}
                onCheckedChange={handleSelectAllClients}
              />
              <Label htmlFor="select-all" className="font-medium">
                Select All Event Attendees ({attendingClients.length})
              </Label>
            </div>
            <div className="border rounded-lg">
              <div className="max-h-60 overflow-y-auto">
                {attendingClients.length > 0 ? (
                  attendingClients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center space-x-3 p-3 border-b last:border-b-0"
                    >
                      <Checkbox
                        id={`client-${client.id}`}
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={(checked) =>
                          handleClientSelection(client.id, !!checked)
                        }
                      />
                      <div className="flex-1">
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {client.email}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Case Worker: {client.caseWorker}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="font-medium mb-1">No Attendees Recorded</p>
                    <p className="text-sm">
                      Please record attendance for this event first before
                      sending feedback forms.
                    </p>
                  </div>
                )}
              </div>
            </div>
            {selectedClients.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {selectedClients.length} attendee
                {selectedClients.length > 1 ? "s" : ""} selected
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setClientSelectionDialogOpen(false);
                setSelectedClients([]);
                setSelectAllClients(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendToSelectedClients}
              disabled={
                isSendingFeedback ||
                selectedClients.length === 0 ||
                attendingClients.length === 0
              }
            >
              {isSendingFeedback
                ? "Sending..."
                : `Send to ${selectedClients.length} Attendee${selectedClients.length > 1 ? "s" : ""}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Feedback Form Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Feedback Form Manually</DialogTitle>
            <DialogDescription>
              Send a feedback form manually to a specific email for{" "}
              {selectedEvent?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                placeholder="John Doe"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-email">Client Email</Label>
              <Input
                id="client-email"
                type="email"
                placeholder="client@example.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFeedbackDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendFeedbackForm}
              disabled={isSendingFeedback}
            >
              {isSendingFeedback ? "Sending..." : "Send Feedback Form"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Form Builder Dialog */}
      <Dialog open={feedbackBuilderOpen} onOpenChange={setFeedbackBuilderOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Feedback Form Builder</DialogTitle>
            <DialogDescription>
              Create a custom feedback form for {selectedEventForBuilder?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Form Details */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="form-title">Form Title</Label>
                <Input
                  id="form-title"
                  value={feedbackForm.title}
                  onChange={(e) =>
                    setFeedbackForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter form title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="form-description">Form Description</Label>
                <Textarea
                  id="form-description"
                  value={feedbackForm.description}
                  onChange={(e) =>
                    setFeedbackForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter form description"
                  rows={3}
                />
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Questions</h3>
                <Button
                  onClick={addQuestion}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </div>

              {feedbackForm.questions.map((question, index) => (
                <Card key={question.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Question {index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(question.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Question Type</Label>
                        <Select
                          value={question.type}
                          onValueChange={(value: FeedbackQuestion["type"]) =>
                            updateQuestion(question.id, { type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Short Text</SelectItem>
                            <SelectItem value="textarea">Long Text</SelectItem>
                            <SelectItem value="radio">
                              Multiple Choice
                            </SelectItem>
                            <SelectItem value="checkbox">Checkboxes</SelectItem>
                            <SelectItem value="rating">Rating Scale</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Question Text</Label>
                        <Input
                          value={question.question}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              question: e.target.value,
                            })
                          }
                          placeholder="Enter your question"
                        />
                      </div>
                    </div>

                    {(question.type === "radio" ||
                      question.type === "checkbox" ||
                      question.type === "rating") && (
                      <div className="space-y-2">
                        <Label>Options (one per line)</Label>
                        <Textarea
                          value={question.options?.join("\n") || ""}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              options: e.target.value
                                .split("\n")
                                .filter((opt) => opt.trim()),
                            })
                          }
                          placeholder={
                            question.type === "rating"
                              ? "1\n2\n3\n4\n5"
                              : "Option 1\nOption 2\nOption 3"
                          }
                          rows={4}
                        />
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`required-${question.id}`}
                        checked={question.required}
                        onCheckedChange={(checked) =>
                          updateQuestion(question.id, { required: !!checked })
                        }
                      />
                      <Label htmlFor={`required-${question.id}`}>
                        Required question
                      </Label>
                    </div>
                  </div>
                </Card>
              ))}

              {feedbackForm.questions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FormInput className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    No questions added yet. Click "Add Question" to get started.
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFeedbackBuilderOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveFeedbackForm}
              disabled={isCreatingForm || !feedbackForm.title.trim()}
            >
              {isCreatingForm ? "Saving..." : "Save Feedback Form"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventsPage;
