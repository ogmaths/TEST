import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  UserPlus,
  Trash2,
  Lock,
  Search,
  KeyRound,
  Calendar,
  Edit,
  Plus,
  BarChart2,
  Settings,
  Award,
  ChevronDown,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { User, Organization } from "@/types/admin";
import BackButton from "./BackButton";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "react-router-dom";
import AdminPasswordReset from "./AdminPasswordReset";
import { Textarea } from "@/components/ui/textarea";
import Logo from "./Logo";
import OrganizationDashboard from "./dashboard/OrganizationDashboard";
import AreaBreakdown from "./dashboard/AreaBreakdown";
import StaffMetrics from "./dashboard/StaffMetrics";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  type: string;
  description: string;
  capacity: number;
  attendees: any[];
  createdAt: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("organization");
  const [manageSectionOpen, setManageSectionOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<any>(null);
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showStaffDialog, setShowStaffDialog] = useState(false);
  const [showAreaDialog, setShowAreaDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState("support_worker");
  const [selectedArea, setSelectedArea] = useState("");
  const [staffFormData, setStaffFormData] = useState({
    name: "",
    email: "",
    role: "support_worker",
    area: "",
  });
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [userToReset, setUserToReset] = useState<{
    id: string;
    email: string;
    name: string;
    type: "client" | "staff";
  } | null>(null);

  // Event management states
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showDeleteEventDialog, setShowDeleteEventDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventFormData, setEventFormData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    type: "workshop",
    description: "",
    capacity: "",
  });

  // Mock data for users and clients
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Stacy Williams",
      email: "stacy.williams@example.com",
      role: "admin",
      lastLogin: "2023-06-10T14:30:00Z",
      status: "active",
      organizationId: "1",
      area: "North Region",
    },
    {
      id: "2",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "support_worker",
      lastLogin: "2023-06-09T10:15:00Z",
      status: "active",
      organizationId: "1",
      area: "South Region",
    },
    {
      id: "3",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "support_worker",
      lastLogin: "2023-06-08T09:45:00Z",
      status: "active",
      organizationId: "1",
      area: "East Region",
    },
  ]);

  // Mock areas data
  const [areas] = useState([
    "North Region",
    "South Region",
    "East Region",
    "West Region",
    "Central Region",
  ]);

  const [clients, setClients] = useState(() => {
    const savedClients = JSON.parse(localStorage.getItem("clients") || "[]");
    return savedClients.length > 0
      ? savedClients
      : [
          {
            id: "1",
            name: "Michael Johnson",
            email: "michael.j@example.com",
            status: "Active",
            lastActivity: "2023-06-10T14:30:00Z",
          },
          {
            id: "2",
            name: "Sarah Brown",
            email: "sarah.b@example.com",
            status: "In Progress",
            lastActivity: "2023-06-09T10:15:00Z",
          },
          {
            id: "3",
            name: "David Wilson",
            email: "david.w@example.com",
            status: "New",
            lastActivity: "2023-06-08T09:45:00Z",
          },
        ];
  });

  // Check URL parameters for tab selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get("tab");
    if (
      tab &&
      (tab === "organization" ||
        tab === "users" ||
        tab === "clients" ||
        tab === "events" ||
        tab === "assessments" ||
        tab === "staff" ||
        tab === "impact")
    ) {
      setActiveTab(tab);
    } else {
      // Default to organization tab if no valid tab is specified
      setActiveTab("organization");
    }
  }, []);

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch (error) {
        console.error("Failed to parse saved events", error);
      }
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "manager123") {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  // Event management functions
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventFormData({
      name: event.name,
      date: event.date,
      time: event.time,
      location: event.location,
      type: event.type,
      description: event.description,
      capacity: event.capacity.toString(),
    });
    setShowEventDialog(true);
  };

  const handleDeleteEvent = (event: Event) => {
    setEventToDelete(event);
    setShowDeleteEventDialog(true);
  };

  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      const updatedEvents = events.filter((e) => e.id !== eventToDelete.id);
      setEvents(updatedEvents);
      localStorage.setItem("events", JSON.stringify(updatedEvents));
      setShowDeleteEventDialog(false);
      setEventToDelete(null);

      addNotification({
        type: "success",
        title: "Event Deleted",
        message: `${eventToDelete.name} has been deleted successfully`,
        priority: "high",
      });
    }
  };

  const handleEventFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value, name } = e.target;
    const fieldName = name || id;
    setEventFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleEventFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the selected date is in the future
    const selectedDate = new Date(eventFormData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison

    if (selectedDate < today) {
      addNotification({
        type: "error",
        title: "Invalid Date",
        message: "Please select a future date for the event",
        priority: "high",
      });
      return;
    }

    if (editingEvent) {
      // Update existing event
      const updatedEvent = {
        ...editingEvent,
        name: eventFormData.name,
        date: eventFormData.date,
        time: eventFormData.time,
        location: eventFormData.location,
        type: eventFormData.type,
        description: eventFormData.description,
        capacity: parseInt(eventFormData.capacity) || 20,
      };

      const updatedEvents = events.map((e) =>
        e.id === editingEvent.id ? updatedEvent : e,
      );

      setEvents(updatedEvents);
      localStorage.setItem("events", JSON.stringify(updatedEvents));

      addNotification({
        type: "success",
        title: "Event Updated",
        message: `${updatedEvent.name} has been updated successfully`,
        priority: "high",
      });
    } else {
      // Create new event
      const newEvent = {
        id: Date.now().toString(),
        name: eventFormData.name,
        date: eventFormData.date,
        time: eventFormData.time,
        location: eventFormData.location,
        type: eventFormData.type,
        description: eventFormData.description,
        capacity: parseInt(eventFormData.capacity) || 20,
        attendees: [],
        createdAt: new Date().toISOString(),
      };

      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      localStorage.setItem("events", JSON.stringify(updatedEvents));

      addNotification({
        type: "success",
        title: "Event Created",
        message: `${newEvent.name} has been created successfully`,
        priority: "high",
      });
    }

    // Reset form and close dialog
    setShowEventDialog(false);
    setEditingEvent(null);
    setEventFormData({
      name: "",
      date: "",
      time: "",
      location: "",
      type: "workshop",
      description: "",
      capacity: "",
    });
  };

  const openNewEventForm = () => {
    setEditingEvent(null);
    setEventFormData({
      name: "",
      date: "",
      time: "",
      location: "",
      type: "workshop",
      description: "",
      capacity: "",
    });
    setShowEventDialog(true);
  };

  const handleDeleteClient = (client: any) => {
    setClientToDelete(client);
    setShowDeleteDialog(true);
  };

  const confirmDeleteClient = () => {
    if (clientToDelete) {
      const updatedClients = clients.filter((c) => c.id !== clientToDelete.id);
      setClients(updatedClients);
      localStorage.setItem("clients", JSON.stringify(updatedClients));
      setShowDeleteDialog(false);
      setClientToDelete(null);

      addNotification({
        type: "success",
        title: "Client Deleted",
        message: `${clientToDelete.name} has been deleted successfully`,
        priority: "high",
      });
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteUserDialog(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      const updatedUsers = users.filter((u) => u.id !== userToDelete.id);
      setUsers(updatedUsers);
      setShowDeleteUserDialog(false);
      setUserToDelete(null);

      addNotification({
        type: "success",
        title: "User Deleted",
        message: `${userToDelete.name} has been deleted successfully`,
        priority: "high",
      });
    }
  };

  const handleChangeRole = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setShowRoleDialog(true);
  };

  const handleEditStaff = (user: User) => {
    setSelectedUser(user);
    setStaffFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      area: user.area || "",
    });
    setShowStaffDialog(true);
  };

  const handleAssignArea = (user: User) => {
    setSelectedUser(user);
    setSelectedArea(user.area || "");
    setShowAreaDialog(true);
  };

  const handleArchiveStaff = (user: User) => {
    const updatedUsers = users.map((u) =>
      u.id === user.id
        ? { ...u, status: u.status === "archived" ? "active" : "archived" }
        : u,
    );
    setUsers(updatedUsers);

    addNotification({
      type: "success",
      title: user.status === "archived" ? "Staff Unarchived" : "Staff Archived",
      message: `${user.name} has been ${user.status === "archived" ? "unarchived" : "archived"} successfully`,
      priority: "high",
    });
  };

  const handleStaffFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUser) {
      // Update existing staff
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id
          ? {
              ...u,
              name: staffFormData.name,
              email: staffFormData.email,
              role: staffFormData.role,
              area: staffFormData.area,
            }
          : u,
      );
      setUsers(updatedUsers);

      addNotification({
        type: "success",
        title: "Staff Updated",
        message: `${staffFormData.name} has been updated successfully`,
        priority: "high",
      });
    } else {
      // Add new staff
      const newStaff: User = {
        id: Date.now().toString(),
        name: staffFormData.name,
        email: staffFormData.email,
        role: staffFormData.role,
        lastLogin: new Date().toISOString(),
        status: "active",
        organizationId: "1",
        area: staffFormData.area,
      };

      setUsers([...users, newStaff]);

      addNotification({
        type: "success",
        title: "Staff Added",
        message: `${newStaff.name} has been added successfully`,
        priority: "high",
      });
    }

    setShowStaffDialog(false);
    setSelectedUser(null);
    setStaffFormData({
      name: "",
      email: "",
      role: "support_worker",
      area: "",
    });
  };

  const handleAreaAssignment = () => {
    if (selectedUser) {
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id ? { ...u, area: selectedArea } : u,
      );
      setUsers(updatedUsers);

      addNotification({
        type: "success",
        title: "Area Assigned",
        message: `${selectedUser.name} has been assigned to ${selectedArea || "No Area"}`,
        priority: "high",
      });

      setShowAreaDialog(false);
      setSelectedUser(null);
      setSelectedArea("");
    }
  };

  const handleResetPassword = (userId: string, email: string, name: string) => {
    setUserToReset({
      id: userId,
      email: email,
      name: name,
      type: "staff",
    });
    setShowPasswordReset(true);
  };

  const handleResetClientPassword = (client: any) => {
    setUserToReset({
      id: client.id,
      email: client.email,
      name: client.name,
      type: "client",
    });
    setShowPasswordReset(true);
  };

  const handleSignOut = () => {
    setUser(null);
    navigate("/login");
  };

  const confirmChangeRole = () => {
    if (selectedUser) {
      const updatedUsers = users.map((u) =>
        u.id === selectedUser.id ? { ...u, role: selectedRole } : u,
      );
      setUsers(updatedUsers);
      setShowRoleDialog(false);
      setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "workshop":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
            Workshop
          </span>
        );
      case "seminar":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800">
            Seminar
          </span>
        );
      case "training":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
            Training
          </span>
        );
      case "community":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
            Community
          </span>
        );
      case "support":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
            Support
          </span>
        );
      case "group_session":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-800">
            Group Session
          </span>
        );
      case "online":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-sky-100 text-sky-800">
            Online Event
          </span>
        );
      case "hybrid":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
            Hybrid Event
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
            {type}
          </span>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 border-b bg-background">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <BackButton />
            <Link to="/admin">
              <Logo size="md" />
            </Link>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" /> Admin Authentication
              </CardTitle>
              <CardDescription>
                Please enter the admin password to continue
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent>
                {passwordError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Admin Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Authenticate
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        <div className="flex gap-6">
          {/* Left sidebar with vertical tabs */}
          <div className="w-64 shrink-0">
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="p-2">
                {/* Settings/Manage Section */}
                <div className="mt-4 mb-2 px-3">
                  <button
                    onClick={() => setManageSectionOpen(!manageSectionOpen)}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Manage
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 ml-auto transition-transform ${manageSectionOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {manageSectionOpen && (
                  <div className="space-y-1 pl-2">
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer mb-1 ${activeTab === "organization" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      onClick={() => setActiveTab("organization")}
                    >
                      <Award className="h-4 w-4" />
                      <span className="font-medium">Organization</span>
                    </div>

                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer mb-1 ${activeTab === "areas" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      onClick={() => setActiveTab("areas")}
                    >
                      <BarChart2 className="h-4 w-4" />
                      <span className="font-medium">Area</span>
                    </div>

                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer mb-1 ${activeTab === "users" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      onClick={() => setActiveTab("users")}
                    >
                      <Users className="h-4 w-4" />
                      <span className="font-medium">Users</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer mb-1 ${activeTab === "clients" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      onClick={() => setActiveTab("clients")}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span className="font-medium">Clients</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer mb-1 ${activeTab === "events" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      onClick={() => setActiveTab("events")}
                    >
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Events</span>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer mb-1 ${activeTab === "assessments" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      onClick={() => setActiveTab("assessments")}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="font-medium">Assessments</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            {activeTab === "organization" && (
              <div>
                <OrganizationDashboard />
              </div>
            )}

            {activeTab === "areas" && (
              <Card>
                <CardHeader>
                  <CardTitle>Area</CardTitle>
                  <CardDescription>
                    Manage geographical areas for your organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AreaBreakdown
                    isManagementView={true}
                    hidePerformanceMetrics={true}
                  />
                </CardContent>
              </Card>
            )}

            {activeTab === "users" && (
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50 text-left">
                          <th className="p-2 pl-4">Name</th>
                          <th className="p-2">Email</th>
                          <th className="p-2">Role</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Last Login</th>
                          <th className="p-2 text-right pr-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="p-2 pl-4 font-medium">
                              {user.name}
                            </td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.role === "admin" ? "bg-purple-100 text-purple-800" : user.role === "support_worker" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="p-2">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                              >
                                {user.status}
                              </span>
                            </td>
                            <td className="p-2">
                              {new Date(user.lastLogin).toLocaleDateString()}
                            </td>
                            <td className="p-2 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleChangeRole(user)}
                                >
                                  Change Role
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleResetPassword(
                                      user.id,
                                      user.email,
                                      user.name,
                                    )
                                  }
                                >
                                  <KeyRound className="h-4 w-4 mr-1" /> Reset
                                  Password
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteUser(user)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "clients" && (
              <Card>
                <CardHeader>
                  <CardTitle>Client Management</CardTitle>
                  <CardDescription>
                    Manage client accounts and data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center py-8">
                    <Link to="/clients">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Users className="h-4 w-4" /> View All Clients
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "events" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Event Management</CardTitle>
                    <CardDescription>
                      Manage organization events and activities
                    </CardDescription>
                  </div>
                  <Button
                    onClick={openNewEventForm}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add Event
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center py-8">
                    <Link to="/events">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" /> View All Events
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "assessments" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Assessment Management</CardTitle>
                  </div>
                  <Button
                    className="flex items-center gap-2"
                    onClick={() => window.open("/assessment-builder", "_blank")}
                  >
                    <Plus className="h-4 w-4" /> Manage Assessment Templates
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center gap-4 py-8">
                    <Link to="/assessments">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        View All Assessments
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() =>
                        window.open("/assessment-builder", "_blank")
                      }
                    >
                      Manage Assessment Templates
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Change Role Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              {selectedUser
                ? `Update role for ${selectedUser.name}`
                : "Select a new role for this user"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="role">Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="org_admin">Organization Admin</SelectItem>
                <SelectItem value="support_worker">Support Worker</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="readonly">Read Only</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-4 p-3 bg-muted/50 rounded-md text-sm">
              <p className="font-medium mb-1">Role permissions:</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                {selectedRole === "admin" && (
                  <>
                    <li>Full access to all system features</li>
                    <li>Can manage users, clients, and settings</li>
                    <li>Can view and generate all reports</li>
                  </>
                )}
                {selectedRole === "org_admin" && (
                  <>
                    <li>Full access to organization's data and settings</li>
                    <li>
                      Can manage users and clients within the organization
                    </li>
                    <li>Can view and generate organization reports</li>
                    <li>Cannot access other organizations' data</li>
                  </>
                )}
                {selectedRole === "support_worker" && (
                  <>
                    <li>Access to assigned clients only</li>
                    <li>Can record client interactions</li>
                    <li>Limited system access</li>
                  </>
                )}
                {selectedRole === "manager" && (
                  <>
                    <li>Access to client management</li>
                    <li>Can create and manage events</li>
                    <li>Limited access to reports</li>
                  </>
                )}
                {selectedRole === "readonly" && (
                  <>
                    <li>View-only access to system</li>
                    <li>Cannot modify any data</li>
                    <li>Limited reporting capabilities</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmChangeRole}>Save Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Client Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {clientToDelete?.name}? This
              action cannot be undone and will permanently remove all client
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteClient}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog
        open={showDeleteUserDialog}
        onOpenChange={setShowDeleteUserDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action
              cannot be undone and will permanently remove the user's account
              and access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Reset Dialog */}
      {userToReset && (
        <AdminPasswordReset
          open={showPasswordReset}
          onOpenChange={setShowPasswordReset}
          userId={userToReset.id}
          userEmail={userToReset.email}
          userName={userToReset.name}
          userType={userToReset.type}
        />
      )}

      {/* Staff Form Dialog */}
      <Dialog open={showStaffDialog} onOpenChange={setShowStaffDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? "Edit Staff Member" : "Add New Staff Member"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser
                ? "Update the staff member's details below"
                : "Fill in the details to add a new staff member"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStaffFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Staff member name"
                  value={staffFormData.name}
                  onChange={(e) =>
                    setStaffFormData({ ...staffFormData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  value={staffFormData.email}
                  onChange={(e) =>
                    setStaffFormData({
                      ...staffFormData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={staffFormData.role}
                  onValueChange={(value) =>
                    setStaffFormData({ ...staffFormData, role: value })
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="org_admin">
                      Organization Admin
                    </SelectItem>
                    <SelectItem value="support_worker">
                      Support Worker
                    </SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="readonly">Read Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Select
                  value={staffFormData.area}
                  onValueChange={(value) =>
                    setStaffFormData({ ...staffFormData, area: value })
                  }
                >
                  <SelectTrigger id="area">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Not Assigned</SelectItem>
                    {areas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowStaffDialog(false);
                  setSelectedUser(null);
                  setStaffFormData({
                    name: "",
                    email: "",
                    role: "support_worker",
                    area: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {selectedUser ? "Update Staff" : "Add Staff"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Area Assignment Dialog */}
      <Dialog open={showAreaDialog} onOpenChange={setShowAreaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Area</DialogTitle>
            <DialogDescription>
              {selectedUser
                ? `Assign ${selectedUser.name} to an area`
                : "Select an area to assign"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="area-select">Area</Label>
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="mt-2" id="area-select">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Not Assigned</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAreaDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAreaAssignment}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Form Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Edit Event" : "Create New Event"}
            </DialogTitle>
            <DialogDescription>
              {editingEvent
                ? "Update the event details below"
                : "Fill in the details to create a new event"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEventFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  placeholder="Event name"
                  value={eventFormData.name}
                  onChange={handleEventFormChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={eventFormData.date}
                    onChange={handleEventFormChange}
                    required
                    name="date"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="text"
                    placeholder="e.g. 2:00 PM"
                    value={eventFormData.time}
                    onChange={handleEventFormChange}
                    required
                    name="time"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Event location"
                  value={eventFormData.location}
                  onChange={handleEventFormChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select
                  value={eventFormData.type}
                  onValueChange={(value) =>
                    setEventFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="community">Community Event</SelectItem>
                    <SelectItem value="support">Support Group</SelectItem>
                    <SelectItem value="group_session">Group Session</SelectItem>
                    <SelectItem value="online">Online Event</SelectItem>
                    <SelectItem value="hybrid">Hybrid Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="Maximum number of attendees"
                  value={eventFormData.capacity}
                  onChange={handleEventFormChange}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter event description and details"
                  rows={4}
                  value={eventFormData.description}
                  onChange={handleEventFormChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEventDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingEvent ? "Update Event" : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Event Confirmation Dialog */}
      <AlertDialog
        open={showDeleteEventDialog}
        onOpenChange={setShowDeleteEventDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{eventToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteEvent}
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

export default AdminDashboard;
