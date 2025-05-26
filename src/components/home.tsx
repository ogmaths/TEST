import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Users,
  BarChart2,
  Settings,
  Bell,
  Search,
  Plus,
  CheckCircle,
  FileText,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import NotificationCenter from "@/components/NotificationCenter";
import UserSettings from "@/components/UserSettings";
import { Input } from "@/components/ui/input";
import UserHeader from "@/components/UserHeader";
import { useUser } from "@/context/UserContext";
import { Label } from "@/components/ui/label";
import Logo from "./Logo";

const Home = () => {
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showAssignTaskDialog, setShowAssignTaskDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedRole, setSelectedRole] = useState("staff");
  const { user } = useUser();
  const [newTask, setNewTask] = useState({
    title: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "medium",
    assignedTo: "",
  });

  const availableUsers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Robert Chen" },
    { id: 4, name: "Maria Garcia" },
  ];

  const [tasks, setTasks] = useState(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    return savedTasks.length > 0
      ? savedTasks
      : [
          {
            id: 1,
            title: "Review client assessment results",
            dueDate: "2023-06-15",
            priority: "high",
            completed: false,
          },
          {
            id: 2,
            title: "Prepare quarterly impact report",
            dueDate: "2023-06-20",
            priority: "medium",
            completed: true,
          },
          {
            id: 3,
            title: "Schedule team planning meeting",
            dueDate: "2023-06-12",
            priority: "medium",
            completed: false,
          },
          {
            id: 4,
            title: "Update program documentation",
            dueDate: "2023-06-25",
            priority: "low",
            completed: false,
          },
        ];
  });
  // Get data from localStorage or use empty arrays/objects
  const recentClients = React.useMemo(() => {
    const savedClients = JSON.parse(localStorage.getItem("clients") || "[]");
    return savedClients.slice(0, 4).map((client) => ({
      id: client.id,
      name: client.name,
      status: client.status,
      lastVisit: client.lastActivity
        ? new Date(client.lastActivity).toLocaleDateString()
        : "N/A",
      avatar: client.name
        .split(" ")
        .map((n) => n[0])
        .join(""),
    }));
  }, []);

  const upcomingEvents = React.useMemo(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events") || "[]");
    return savedEvents.slice(0, 3).map((event) => ({
      id: event.id,
      title: event.name,
      date: `${event.date}, ${event.time}`,
      attendees: event.attendees?.length || 0,
    }));
  }, []);

  const metrics = React.useMemo(() => {
    // Get raw data from localStorage
    const clientsData = JSON.parse(localStorage.getItem("clients") || "[]");
    const assessmentsData = JSON.parse(
      localStorage.getItem("assessments") || "[]",
    );
    const eventsData = JSON.parse(localStorage.getItem("events") || "[]");
    const interactionsData = JSON.parse(
      localStorage.getItem("interactions") || "[]",
    );

    // Count totals
    const clients = clientsData.length;
    const assessments = assessmentsData.length;
    const events = eventsData.length;
    const interactions = interactionsData.length;

    // Calculate financial metrics
    const totalBudget =
      JSON.parse(localStorage.getItem("budget") || '{"total": 100000}').total ||
      100000;
    const totalExpenses =
      JSON.parse(localStorage.getItem("expenses") || '{"total": 75000}')
        .total || 75000;
    const totalRevenue =
      JSON.parse(localStorage.getItem("revenue") || '{"total": 120000}')
        .total || 120000;

    // Calculate ROI: (Revenue - Expenses) / Expenses * 100
    const roi =
      clients > 0
        ? Math.round(((totalRevenue - totalExpenses) / totalExpenses) * 100)
        : 327;

    // Calculate funding utilization: Expenses / Budget * 100
    const fundingUtil = Math.round((totalExpenses / totalBudget) * 100);

    // Calculate cost per client: Expenses / Number of clients
    const costPerClient =
      clients > 0 ? Math.round(totalExpenses / clients) : 1250;

    // Calculate operational metrics
    const staffData = JSON.parse(localStorage.getItem("staff") || "[]");
    const staffCapacity =
      staffData.length > 0
        ? staffData.reduce((sum, staff) => sum + (staff.capacity || 40), 0)
        : 200;
    const staffHoursUsed =
      interactions > 0 ? Math.min(staffCapacity, interactions * 2) : 174; // Assume each interaction takes 2 hours

    // Staff utilization: Hours used / Total capacity * 100
    const staffUtil = Math.round((staffHoursUsed / staffCapacity) * 100);

    // Program efficiency: Completed assessments / Total assessments * 100
    const completedAssessments = assessmentsData.filter(
      (a) => a.status === "completed",
    ).length;
    const progEfficiency =
      assessments > 0
        ? Math.round((completedAssessments / assessments) * 100)
        : 94;

    // Client retention: Active clients / Total clients * 100
    const activeClients = clientsData.filter(
      (c) => c.status !== "inactive" && c.status !== "exited",
    ).length;
    const retention =
      clients > 0 ? Math.round((activeClients / clients) * 100) : 92;

    // Impact metrics
    const targetOutcomes =
      JSON.parse(localStorage.getItem("targets") || '{"outcomes": 100}')
        .outcomes || 100;
    const achievedOutcomes =
      completedAssessments > 0
        ? Math.round((completedAssessments / targetOutcomes) * 100)
        : 78;

    // Community impact score: Average of all feedback scores (out of 5)
    const feedbackData = JSON.parse(localStorage.getItem("feedback") || "[]");
    const avgFeedback =
      feedbackData.length > 0
        ? parseFloat(
            (
              feedbackData.reduce((sum, item) => sum + (item.score || 0), 0) /
              feedbackData.length
            ).toFixed(1),
          )
        : 4.6;

    // Sustainability index: Complex calculation based on multiple factors
    const sustainIndex = Math.round(
      roi * 0.3 + fundingUtil * 0.2 + retention * 0.3 + avgFeedback * 4,
    );

    return {
      // Financial metrics
      programROI: roi,
      fundingUtilization: fundingUtil,
      costPerClient: costPerClient,

      // Operational metrics
      staffUtilization: staffUtil,
      programEfficiency: progEfficiency,
      clientRetentionRate: retention,

      // Impact metrics
      outcomesAchieved: achievedOutcomes,
      communityImpactScore: avgFeedback,
      sustainabilityIndex: sustainIndex,

      // For charts and additional displays
      totalClients: clients,
      activeAssessments: assessments,
      upcomingEvents: events,
    };
  }, []);

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleAddTask = () => {
    if (!newTask.title) return;

    const newTaskObj = {
      id: Date.now(),
      title: newTask.title,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      completed: false,
      assignedTo: newTask.assignedTo,
    };

    const updatedTasks = [...tasks, newTaskObj];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    // Reset form and close dialog
    setNewTask({
      title: "",
      dueDate: new Date().toISOString().split("T")[0],
      priority: "medium",
      assignedTo: user?.name || "",
    });
    setShowAddTaskDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Logo size="md" />
          <div className="ml-auto flex items-center gap-4">
            <UserHeader onSettingsClick={() => setShowUserSettings(true)} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-4"></div>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Page Title and Search */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Welcome back, {user?.name || "Guest"}!
              </h2>
              <p className="text-muted-foreground">
                Last login: {new Date().toLocaleString()}
              </p>
            </div>
            {(user?.role === "admin" || user?.isOrgAdmin) && (
              <Link to="/admin">
                <Button variant="outline" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />{" "}
                  {user?.isOrgAdmin ? "Organization Admin" : "Admin Dashboard"}
                </Button>
              </Link>
            )}
          </div>

          {/* Key Metrics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <Users className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold">{metrics.totalClients}</h3>
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <BarChart2 className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold">
                    {metrics.communityImpactScore.toFixed(1)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Average Impact Score
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <FileText className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold">
                    {
                      JSON.parse(
                        localStorage.getItem("assessments") || "[]",
                      ).filter((a) => a.type === "exit").length
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Exit Assessments
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metrics Cards removed */}

          {/* Today's Events Section removed */}

          {/* Tasks & Assignments Section */}
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">
                Tasks & Assignments
              </CardTitle>
              <CardDescription>
                Your pending tasks and assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length > 0 ? (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                        />
                        <div>
                          <label
                            htmlFor={`task-${task.id}`}
                            className={`font-medium cursor-pointer ${task.completed ? "line-through text-muted-foreground" : ""}`}
                          >
                            {task.title}
                          </label>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Due: {task.dueDate}</span>
                            <span>•</span>
                            <span
                              className={`capitalize ${task.priority === "high" ? "text-red-500" : task.priority === "medium" ? "text-amber-500" : "text-blue-500"}`}
                            >
                              {task.priority} priority
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {task.completed && (
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3" /> Completed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No tasks assigned.</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Task
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowAddTaskDialog(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
              <Button variant="outline">
                <BarChart2 className="mr-2 h-4 w-4" />
                View All Tasks
              </Button>
            </CardFooter>
          </Card>

          {/* Tabs for Recent Activity */}
          <Tabs defaultValue="clients" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="clients">Recent Clients</TabsTrigger>
              <TabsTrigger value="events">Upcoming Events</TabsTrigger>
              <TabsTrigger value="assessments">Recent Assessments</TabsTrigger>
            </TabsList>

            <TabsContent value="clients" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Client Activity</CardTitle>
                  <CardDescription>
                    View and manage your recent client interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentClients.map((client) => (
                      <div
                        key={client.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.avatar}`}
                              alt={client.name}
                            />
                            <AvatarFallback>{client.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Last visit: {client.lastVisit}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${client.status === "New" ? "bg-blue-100 text-blue-800" : client.status === "In Progress" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                          >
                            {client.status}
                          </span>
                          <Link to={`/client/${client.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/clients" className="w-full">
                    <Button variant="outline" className="w-full">
                      <Users className="mr-2 h-4 w-4" />
                      View All Clients
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    Schedule and manage your organization's events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.date}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                            {event.attendees} attendees
                          </span>
                          <Link to="/events">
                            <Button variant="ghost" size="sm">
                              Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/events" className="w-full">
                    <Button variant="outline" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      View All Events
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="assessments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Assessments</CardTitle>
                  <CardDescription>
                    Track progress on client assessments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">
                          Jane Smith - Introduction Assessment
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Completed on June 10, 2023
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                          Introduction
                        </span>
                        <Link to="/client/1">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">
                          Robert Chen - Progress Assessment
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Completed on June 5, 2023
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                          Progress
                        </span>
                        <Link to="/client/2">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pb-4">
                      <div>
                        <p className="font-medium">
                          Maria Garcia - Exit Assessment
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Completed on May 20, 2023
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          Exit
                        </span>
                        <Link to="/client/3">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/assessments" className="w-full">
                    <Button variant="outline" className="w-full">
                      <BarChart2 className="mr-2 h-4 w-4" />
                      View All Assessments
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* User Settings Dialog */}
      <Dialog open={showUserSettings} onOpenChange={setShowUserSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Settings</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <UserSettings onClose={() => setShowUserSettings(false)} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Task Dialog */}
      <Dialog
        open={showAssignTaskDialog}
        onOpenChange={setShowAssignTaskDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign New Task</DialogTitle>
            <DialogDescription>
              Create a new task and assign it to a team member.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-task-title">Task Title</Label>
              <Input
                id="admin-task-title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                placeholder="Enter task title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="admin-due-date">Due Date</Label>
              <Input
                id="admin-due-date"
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="admin-priority">Priority</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, priority: value })
                }
              >
                <SelectTrigger id="admin-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="admin-assigned-to">Assign To</Label>
              <Select
                value={newTask.assignedTo}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, assignedTo: value })
                }
              >
                <SelectTrigger id="admin-assigned-to">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user.id} value={user.name}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAssignTaskDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleAddTask();
                setShowAssignTaskDialog(false);
              }}
            >
              Assign Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="support_worker">Support Worker</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
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
                {selectedRole === "staff" && (
                  <>
                    <li>Access to client management</li>
                    <li>Can create and manage events</li>
                    <li>Limited access to reports</li>
                  </>
                )}
                {selectedRole === "support_worker" && (
                  <>
                    <li>Access to assigned clients only</li>
                    <li>Can record client interactions</li>
                    <li>Limited system access</li>
                  </>
                )}
                {selectedRole === "volunteer" && (
                  <>
                    <li>Very limited system access</li>
                    <li>Can view and participate in events</li>
                    <li>No access to sensitive client data</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                // In a real app, this would update the user's role in the database
                if (selectedUser) {
                  const updatedUsers = availableUsers.map((u) =>
                    u.id === selectedUser.id ? { ...u, role: selectedRole } : u,
                  );
                  // This is just for demo purposes - in a real app you'd update the state properly
                  console.log("Updated users:", updatedUsers);
                }
                setShowRoleDialog(false);
              }}
            >
              Save Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Client Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedClient?.name}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                // In a real app, this would delete the client from the database
                if (selectedClient) {
                  const updatedClients = recentClients.filter(
                    (c) => c.id !== selectedClient.id,
                  );
                  // This is just for demo purposes - in a real app you'd update the state properly
                  console.log("Updated clients:", updatedClients);
                }
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Home;
