import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  Trash2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import NotificationCenter from "@/components/NotificationCenter";

import { Input } from "@/components/ui/input";
import UserHeader from "@/components/UserHeader";
import { useUser } from "@/context/UserContext";
import { Label } from "@/components/ui/label";
import Logo from "./Logo";

const Home = () => {
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showAssignTaskDialog, setShowAssignTaskDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedRole, setSelectedRole] = useState("staff");
  const { user } = useUser();
  const { t } = useTranslation();
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

  // Recent data fetching code removed as requested

  const metrics = React.useMemo(() => {
    // Get raw data from localStorage
    const clientsData = JSON.parse(localStorage.getItem("clients") || "[]");
    const assessmentsData = JSON.parse(
      localStorage.getItem("assessments") || "[]",
    );
    const eventsData = JSON.parse(localStorage.getItem("events") || "[]");

    // Get all interactions across all clients
    let allInteractions = [];
    clientsData.forEach((client) => {
      const clientInteractions = JSON.parse(
        localStorage.getItem(`interactions_${client.id}`) || "[]",
      );
      allInteractions = [...allInteractions, ...clientInteractions];
    });

    // Count totals
    const clients = clientsData.length;
    const assessments = assessmentsData.length;
    const events = eventsData.length;
    const interactions = allInteractions.length;

    // Filter by current user's organization
    const userTenantId = user?.tenantId;
    const orgClients = userTenantId
      ? clientsData.filter((c) => c.organizationId === userTenantId)
      : clientsData;
    const orgEvents = userTenantId
      ? eventsData.filter((e) => e.organizationId === userTenantId)
      : eventsData;
    const orgInteractions = userTenantId
      ? allInteractions.filter((i) => i.organizationId === userTenantId)
      : allInteractions;

    // Count completed assessments
    const completedAssessments = assessmentsData.filter(
      (a) => a.status === "completed",
    ).length;

    // Count exit assessments
    const exitAssessments = assessmentsData.filter(
      (a) => a.type === "Exit" || a.type === "exit",
    ).length;

    return {
      // For charts and additional displays
      totalClients: orgClients.length,
      activeAssessments: completedAssessments,
      upcomingEvents: orgEvents.length,
      exitAssessments: exitAssessments,
      communityImpactScore: 4.6, // Placeholder
    };
  }, [user?.tenantId]);

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
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

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "introduction":
        return "default";
      case "progress":
        return "secondary";
      case "exit":
        return "outline";
      default:
        return "default";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "introduction":
        return "Introduction";
      case "progress":
        return "Progress";
      case "exit":
        return "Exit";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto p-4 md:p-6">
        {/* Removed empty div container */}
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Page Title and Search */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                {t("common.welcome", { name: user?.name || "Guest" })}
              </h2>
              <p className="text-muted-foreground">
                {t("common.lastLogin", { date: new Date().toLocaleString() })}
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
                  <p className="text-sm text-muted-foreground">
                    {t("dashboard.totalClients")}
                  </p>
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
                    {t("dashboard.averageImpactScore")}
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
                    {t("dashboard.exitAssessments")}
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
                {t("dashboard.tasksAssignments")}
              </CardTitle>
              <CardDescription>{t("dashboard.pendingTasks")}</CardDescription>
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
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    {t("dashboard.noTasks")}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setShowAddTaskDialog(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t("dashboard.addNewTask")}
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddTaskDialog(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                {t("dashboard.addTask")}
              </Button>
            </CardFooter>
          </Card>

          {/* Recent activity tabs removed as requested */}
        </div>
      </main>

      {/* Add Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dashboard.addNewTask")}</DialogTitle>
            <DialogDescription>
              {t("common.create")} {t("dashboard.addNewTask").toLowerCase()}{" "}
              {t("common.for")} {t("common.yourself")} {t("common.or")}{" "}
              {t("common.your")} {t("common.team")}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                placeholder="Enter task title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input
                id="due-date"
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, priority: value })
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddTaskDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
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
