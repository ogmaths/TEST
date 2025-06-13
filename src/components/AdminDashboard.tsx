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
  Filter,
  FileText,
  LogOut,
  RefreshCw,
  Download,
  TrendingUp,
  Save,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { User, Organization, JourneyType, JourneyStage } from "@/types/admin";
import BackButton from "./BackButton";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "react-router-dom";
import AdminPasswordReset from "./AdminPasswordReset";
import { Textarea } from "@/components/ui/textarea";
import Logo from "./Logo";
import OrganizationMetrics from "./dashboard/OrganizationMetrics";
import AreaBreakdown from "./dashboard/AreaBreakdown";
import StaffMetrics from "./dashboard/StaffMetrics";
import FeedbackMetrics from "./dashboard/FeedbackMetrics";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";

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

  // Debug logging for AdminDashboard
  console.log("🔍 AdminDashboard - Component rendering");
  console.log("🔍 AdminDashboard - User:", user);
  console.log("🔍 AdminDashboard - User role:", user?.role);

  // Early return with error boundary if no user
  if (!user) {
    console.log("🔍 AdminDashboard - No user found, showing error");
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h1>
          <p className="text-gray-600 mb-4">
            No user session found. Please log in again.
          </p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </div>
    );
  }

  // Check if user has admin role
  if (
    user.role !== "admin" &&
    user.role !== "super_admin" &&
    user.role !== "org_admin"
  ) {
    console.log(
      "🔍 AdminDashboard - User does not have admin role:",
      user.role,
    );
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You do not have permission to access this page.
          </p>
          <Button onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  console.log("🔍 AdminDashboard - User found, continuing with render");
  const [activeTab, setActiveTab] = useState("organization");
  const [manageSectionOpen, setManageSectionOpen] = useState(true);
  // Auto-authenticate admin users, require password for others
  const [isAuthenticated, setIsAuthenticated] = useState(
    user?.role === "admin" || user?.role === "super_admin",
  );
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

  // Organization dashboard states
  const [orgActiveTab, setOrgActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  const [filterArea, setFilterArea] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Journey type management states
  const [journeyTypes, setJourneyTypes] = useState<JourneyType[]>([]);
  const [showJourneyTypeDialog, setShowJourneyTypeDialog] = useState(false);
  const [showDeleteJourneyTypeDialog, setShowDeleteJourneyTypeDialog] =
    useState(false);
  const [journeyTypeToDelete, setJourneyTypeToDelete] =
    useState<JourneyType | null>(null);
  const [editingJourneyType, setEditingJourneyType] =
    useState<JourneyType | null>(null);
  const [journeyTypeFormData, setJourneyTypeFormData] = useState({
    name: "",
    description: "",
  });
  const [showJourneyStageManager, setShowJourneyStageManager] = useState(false);
  const [selectedJourneyType, setSelectedJourneyType] =
    useState<JourneyType | null>(null);

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
        tab === "impact" ||
        tab === "journey-types")
    ) {
      setActiveTab(tab);
    } else {
      // Default to organization tab if no valid tab is specified
      setActiveTab("organization");
    }
  }, []);

  // Load journey types from localStorage
  useEffect(() => {
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
          id: "prenatal",
          name: "Prenatal",
          description: "Journey for prenatal support",
          stages: [
            {
              id: "initial-contact",
              name: "Initial Contact",
              description: "First contact with client",
              order: 0,
              dueInDays: 0,
              isRequired: true,
              requiresAssessment: true,
              type: "assessment",
            },
            {
              id: "antenatal-support",
              name: "Antenatal Support",
              description: "Ongoing antenatal support",
              order: 1,
              dueInDays: 30,
              isRequired: true,
              requiresAssessment: false,
              type: "milestone",
            },
            {
              id: "birth-preparation",
              name: "Birth Preparation",
              description: "Preparation for birth",
              order: 2,
              dueInDays: 60,
              isRequired: true,
              requiresAssessment: false,
              type: "event",
            },
            {
              id: "exit",
              name: "Exit",
              description: "End of prenatal journey",
              order: 3,
              dueInDays: 270,
              isRequired: true,
              requiresAssessment: true,
              type: "assessment",
            },
          ],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          organizationId: user?.organizationId || "1",
        },
        {
          id: "postnatal",
          name: "Postnatal",
          description: "Journey for postnatal support",
          stages: [
            {
              id: "initial-contact",
              name: "Initial Contact",
              description: "First contact with client",
              order: 0,
              dueInDays: 0,
              isRequired: true,
              requiresAssessment: true,
              type: "assessment",
            },
            {
              id: "7-day-contact",
              name: "7 Day Contact",
              description: "Follow-up contact after 7 days",
              order: 1,
              dueInDays: 7,
              isRequired: true,
              requiresAssessment: false,
              type: "visit",
            },
            {
              id: "3-week-contact",
              name: "3 Week Contact",
              description: "Follow-up contact after 3 weeks",
              order: 2,
              dueInDays: 21,
              isRequired: true,
              requiresAssessment: true,
              type: "assessment",
            },
            {
              id: "3-month-contact",
              name: "3 Month Contact",
              description: "Follow-up contact after 3 months",
              order: 3,
              dueInDays: 90,
              isRequired: true,
              requiresAssessment: true,
              type: "assessment",
            },
            {
              id: "exit",
              name: "Exit",
              description: "End of postnatal journey",
              order: 4,
              dueInDays: 365,
              isRequired: true,
              requiresAssessment: true,
              type: "assessment",
            },
          ],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          organizationId: user?.organizationId || "1",
        },
        {
          id: "prenatal-postnatal",
          name: "Prenatal and Postnatal",
          description: "Combined journey for prenatal and postnatal support",
          stages: [
            {
              id: "initial-contact",
              name: "Initial Contact",
              description: "First contact with client",
              order: 0,
              dueInDays: 0,
              isRequired: true,
              requiresAssessment: true,
              type: "assessment",
            },
            {
              id: "antenatal-support",
              name: "Antenatal Support",
              description: "Ongoing antenatal support",
              order: 1,
              dueInDays: 30,
              isRequired: true,
              requiresAssessment: false,
              type: "milestone",
            },
            {
              id: "birth",
              name: "Birth",
              description: "Birth milestone",
              order: 2,
              dueInDays: 270,
              isRequired: true,
              requiresAssessment: false,
              type: "milestone",
            },
            {
              id: "7-day-contact",
              name: "7 Day Contact",
              description: "Follow-up contact after 7 days",
              order: 3,
              dueInDays: 277,
              isRequired: true,
              requiresAssessment: false,
              type: "visit",
            },
            {
              id: "3-week-contact",
              name: "3 Week Contact",
              description: "Follow-up contact after 3 weeks",
              order: 4,
              dueInDays: 291,
              isRequired: true,
              requiresAssessment: true,
              type: "assessment",
            },
            {
              id: "3-month-contact",
              name: "3 Month Contact",
              description: "Follow-up contact after 3 months",
              order: 5,
              dueInDays: 360,
              isRequired: true,
              requiresAssessment: true,
              type: "assessment",
            },
            {
              id: "exit",
              name: "Exit",
              description: "End of journey",
              order: 6,
              dueInDays: 635,
              isRequired: true,
              requiresAssessment: true,
              type: "assessment",
            },
          ],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          organizationId: user?.organizationId || "1",
        },
      ];
      setJourneyTypes(defaultJourneyTypes);
      localStorage.setItem("journeyTypes", JSON.stringify(defaultJourneyTypes));
    }
  }, [user?.organizationId]);

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

  const handleRefreshData = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const handleExportData = () => {
    // In a real implementation, this would trigger an API call to export data
    alert("Data export functionality would be implemented here.");
  };

  // Journey type management functions
  const handleEditJourneyType = (journeyType: JourneyType) => {
    setEditingJourneyType(journeyType);
    setJourneyTypeFormData({
      name: journeyType.name,
      description: journeyType.description,
    });
    setShowJourneyTypeDialog(true);
  };

  const handleDeleteJourneyType = (journeyType: JourneyType) => {
    setJourneyTypeToDelete(journeyType);
    setShowDeleteJourneyTypeDialog(true);
  };

  const confirmDeleteJourneyType = () => {
    if (journeyTypeToDelete) {
      const updatedJourneyTypes = journeyTypes.filter(
        (jt) => jt.id !== journeyTypeToDelete.id,
      );
      setJourneyTypes(updatedJourneyTypes);
      localStorage.setItem("journeyTypes", JSON.stringify(updatedJourneyTypes));
      setShowDeleteJourneyTypeDialog(false);
      setJourneyTypeToDelete(null);

      addNotification({
        type: "success",
        title: "Journey Type Deleted",
        message: `${journeyTypeToDelete.name} has been deleted successfully`,
        priority: "high",
      });
    }
  };

  const handleJourneyTypeFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setJourneyTypeFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleJourneyTypeFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingJourneyType) {
      // Update existing journey type
      const updatedJourneyType = {
        ...editingJourneyType,
        name: journeyTypeFormData.name,
        description: journeyTypeFormData.description,
        updatedAt: new Date().toISOString(),
      };

      const updatedJourneyTypes = journeyTypes.map((jt) =>
        jt.id === editingJourneyType.id ? updatedJourneyType : jt,
      );

      setJourneyTypes(updatedJourneyTypes);
      localStorage.setItem("journeyTypes", JSON.stringify(updatedJourneyTypes));

      addNotification({
        type: "success",
        title: "Journey Type Updated",
        message: `${updatedJourneyType.name} has been updated successfully`,
        priority: "high",
      });
    } else {
      // Create new journey type
      const newJourneyType: JourneyType = {
        id: Date.now().toString(),
        name: journeyTypeFormData.name,
        description: journeyTypeFormData.description,
        stages: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        organizationId: user?.organizationId || "1",
      };

      const updatedJourneyTypes = [...journeyTypes, newJourneyType];
      setJourneyTypes(updatedJourneyTypes);
      localStorage.setItem("journeyTypes", JSON.stringify(updatedJourneyTypes));

      addNotification({
        type: "success",
        title: "Journey Type Created",
        message: `${newJourneyType.name} has been created successfully`,
        priority: "high",
      });
    }

    // Reset form and close dialog
    setShowJourneyTypeDialog(false);
    setEditingJourneyType(null);
    setJourneyTypeFormData({
      name: "",
      description: "",
    });
  };

  const openNewJourneyTypeForm = () => {
    setEditingJourneyType(null);
    setJourneyTypeFormData({
      name: "",
      description: "",
    });
    setShowJourneyTypeDialog(true);
  };

  const handleManageJourneyStages = (journeyType: JourneyType) => {
    setSelectedJourneyType(journeyType);
    setShowJourneyStageManager(true);
  };

  const handleSaveJourneyStages = (stages: any[]) => {
    if (selectedJourneyType) {
      const updatedJourneyType = {
        ...selectedJourneyType,
        stages: stages.map((stage, index) => ({
          ...stage,
          order: index,
        })),
        updatedAt: new Date().toISOString(),
      };

      const updatedJourneyTypes = journeyTypes.map((jt) =>
        jt.id === selectedJourneyType.id ? updatedJourneyType : jt,
      );

      setJourneyTypes(updatedJourneyTypes);
      localStorage.setItem("journeyTypes", JSON.stringify(updatedJourneyTypes));

      addNotification({
        type: "success",
        title: "Journey Stages Updated",
        message: `Stages for ${selectedJourneyType.name} have been updated successfully`,
        priority: "high",
      });

      setShowJourneyStageManager(false);
      setSelectedJourneyType(null);
    }
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
                      className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer mb-1 ${activeTab === "journey-types" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                      onClick={() => setActiveTab("journey-types")}
                    >
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">Journey Types</span>
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
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">
                      Organization Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                      Comprehensive overview of your organization's activities
                      and impact
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex items-center gap-2">
                      <DatePickerWithRange className="w-auto" />
                    </div>

                    <Select value={filterArea} onValueChange={setFilterArea}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Areas</SelectItem>
                        <SelectItem value="north">North District</SelectItem>
                        <SelectItem value="south">South District</SelectItem>
                        <SelectItem value="east">East District</SelectItem>
                        <SelectItem value="west">West District</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRefreshData}
                        disabled={isRefreshing}
                      >
                        <RefreshCw
                          className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                        />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleExportData}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Tabs value={orgActiveTab} onValueChange={setOrgActiveTab}>
                  <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:w-auto">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="areas">Areas</TabsTrigger>
                    <TabsTrigger value="staff">Staff</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* Key Performance Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center justify-center text-center space-y-2">
                            <Users className="h-8 w-8 text-primary" />
                            <h3 className="text-2xl font-bold">
                              {
                                JSON.parse(
                                  localStorage.getItem("clients") || "[]",
                                ).filter((c: any) => c.status === "active")
                                  .length
                              }
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Total Active Clients
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <OrganizationMetrics
                      dateRange={dateRange}
                      filterArea={filterArea}
                    />

                    <div className="mt-6">
                      <FeedbackMetrics
                        dateRange={dateRange}
                        filterArea={filterArea}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="areas" className="space-y-6 mt-6">
                    <AreaBreakdown />
                  </TabsContent>

                  <TabsContent value="staff" className="space-y-6 mt-6">
                    <StaffMetrics
                      dateRange={dateRange}
                      filterArea={filterArea}
                    />
                  </TabsContent>
                </Tabs>
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
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleChangeRole(user);
                                  }}
                                >
                                  Change Role
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleResetPassword(
                                      user.id,
                                      user.email,
                                      user.name,
                                    );
                                  }}
                                >
                                  <KeyRound className="h-4 w-4 mr-1" /> Reset
                                  Password
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDeleteUser(user);
                                  }}
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

            {activeTab === "journey-types" && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Journey Progress Tracker Types</CardTitle>
                    <CardDescription>
                      Manage journey types and their stages for client progress
                      tracking
                    </CardDescription>
                  </div>
                  <Button
                    onClick={openNewJourneyTypeForm}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add Journey Type
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {journeyTypes.map((journeyType) => (
                      <div
                        key={journeyType.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {journeyType.name}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              {journeyType.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>{journeyType.stages.length} stages</span>
                              <span>
                                Status:{" "}
                                {journeyType.isActive ? "Active" : "Inactive"}
                              </span>
                              <span>
                                Updated:{" "}
                                {new Date(
                                  journeyType.updatedAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleManageJourneyStages(journeyType)
                              }
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Manage Stages
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditJourneyType(journeyType)}
                              className="flex items-center gap-2"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteJourneyType(journeyType)
                              }
                              className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {journeyTypes.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>
                          No journey types found. Create your first journey type
                          to get started.
                        </p>
                      </div>
                    )}
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openNewEventForm();
                    }}
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
                    <CardDescription>
                      Manage and edit client assessments
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4 py-8">
                    <Link to="/assessments">
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4" /> View All Assessments
                      </Button>
                    </Link>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      Access all client assessments with full editing
                      capabilities. You can view, edit, and manage assessment
                      records from the assessments page.
                    </p>
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

      {/* Journey Type Form Dialog */}
      <Dialog
        open={showJourneyTypeDialog}
        onOpenChange={setShowJourneyTypeDialog}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingJourneyType
                ? "Edit Journey Type"
                : "Create New Journey Type"}
            </DialogTitle>
            <DialogDescription>
              {editingJourneyType
                ? "Update the journey type details below"
                : "Fill in the details to create a new journey type"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleJourneyTypeFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Journey Type Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Prenatal, Postnatal"
                  value={journeyTypeFormData.name}
                  onChange={handleJourneyTypeFormChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this journey type and when it should be used"
                  rows={3}
                  value={journeyTypeFormData.description}
                  onChange={handleJourneyTypeFormChange}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowJourneyTypeDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {editingJourneyType
                  ? "Update Journey Type"
                  : "Create Journey Type"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Journey Type Confirmation Dialog */}
      <AlertDialog
        open={showDeleteJourneyTypeDialog}
        onOpenChange={setShowDeleteJourneyTypeDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Journey Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{journeyTypeToDelete?.name}"?
              This action cannot be undone and will affect all clients using
              this journey type.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteJourneyType}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Journey Stage Manager Dialog */}
      <Dialog
        open={showJourneyStageManager}
        onOpenChange={setShowJourneyStageManager}
      >
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Manage Stages for {selectedJourneyType?.name}
            </DialogTitle>
            <DialogDescription>
              Configure the stages and their order for this journey type
            </DialogDescription>
          </DialogHeader>
          {selectedJourneyType && (
            <JourneyStageManager
              initialStages={selectedJourneyType.stages.map((stage) => ({
                ...stage,
                organizationId: selectedJourneyType.organizationId,
              }))}
              onSave={handleSaveJourneyStages}
              organizationId={selectedJourneyType.organizationId}
            />
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowJourneyStageManager(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
