import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, CheckCircle, Calendar } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import BackButton from "@/components/BackButton";
import { Link } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  assignedTo?: string;
}

const TasksPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage or use mock data if none exists
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Mock tasks data as fallback
      setTasks([
        {
          id: "1",
          title: "Review client assessment results",
          dueDate: "2023-06-15",
          priority: "high",
          completed: false,
          assignedTo: "Michael Johnson",
        },
        {
          id: "2",
          title: "Prepare quarterly impact report",
          dueDate: "2023-06-20",
          priority: "medium",
          completed: true,
          assignedTo: "Sarah Williams",
        },
        {
          id: "3",
          title: "Schedule team planning meeting",
          dueDate: "2023-06-12",
          priority: "medium",
          completed: false,
          assignedTo: "Michael Johnson",
        },
        {
          id: "4",
          title: "Update program documentation",
          dueDate: "2023-06-25",
          priority: "low",
          completed: false,
          assignedTo: "Lisa Chen",
        },
      ]);
    }
  }, []);

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.assignedTo &&
        task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-background">
      <div className="flex justify-between items-center mb-4">
        <BackButton />
        <Link to="/clients">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" /> View Clients
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Tasks Management</h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Tasks List</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Task
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tasks by title or assignee..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] md:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 p-4 border-b font-medium">
              <div>Status</div>
              <div>Task</div>
              <div className="hidden md:block">Assigned To</div>
              <div>Priority</div>
              <div>Due Date</div>
              <div>Actions</div>
            </div>
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] md:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 p-4 border-b items-center"
              >
                <div>
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                  />
                </div>
                <div>
                  <div
                    className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </div>
                </div>
                <div className="hidden md:block text-sm">
                  {task.assignedTo || "Unassigned"}
                </div>
                <div>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}
                  </Badge>
                </div>
                <div className="text-sm">
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
                <div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksPage;
