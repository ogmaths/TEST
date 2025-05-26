import React from "react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/context/NotificationContext";
import {
  AlertTriangle,
  Calendar,
  FileText,
  MessageSquare,
  User,
  Bell,
} from "lucide-react";

const NotificationDemo: React.FC = () => {
  const { addNotification } = useNotifications();

  const createUserActivityNotification = () => {
    addNotification({
      type: "user_activity",
      title: "New Client Added",
      message: "John Doe has been added to your client list.",
      priority: "medium",
      actionUrl: "/clients/john-doe",
      icon: <User size={16} />,
    });
  };

  const createTaskNotification = () => {
    addNotification({
      type: "task",
      title: "Approaching Deadline",
      message: "Task 'Complete Assessment for Sarah Johnson' is due tomorrow.",
      priority: "high",
      actionUrl: "/tasks/123",
      icon: <Calendar size={16} />,
    });
  };

  const createIncidentNotification = () => {
    addNotification({
      type: "incident",
      title: "Urgent Support Request",
      message: "Client Michael Chen has requested urgent housing support.",
      priority: "high",
      actionUrl: "/clients/michael-chen",
      icon: <AlertTriangle size={16} />,
    });
  };

  const createReportNotification = () => {
    addNotification({
      type: "report",
      title: "New Assessment Completed",
      message: "Progress assessment for Aisha Patel has been completed.",
      priority: "medium",
      actionUrl: "/assessments/aisha-patel",
      icon: <FileText size={16} />,
    });
  };

  const createCommunicationNotification = () => {
    addNotification({
      type: "communication",
      title: "New Message",
      message:
        "You have a new message from Sarah Williams regarding client David Wilson.",
      priority: "medium",
      actionUrl: "/messages/123",
      icon: <MessageSquare size={16} />,
    });
  };

  const createSystemNotification = () => {
    addNotification({
      type: "system",
      title: "New Feature Announcement",
      message:
        "Check out the new Impact Report feature now available in client profiles.",
      priority: "low",
      actionUrl: "/help/new-features",
      icon: <Bell size={16} />,
    });
  };

  return (
    <div className="p-4 border rounded-md bg-background">
      <h3 className="text-lg font-medium mb-4">Notification Demo</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Click the buttons below to generate sample notifications.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={createUserActivityNotification}
          className="justify-start"
        >
          <User className="mr-2 h-4 w-4" /> User Activity
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={createTaskNotification}
          className="justify-start"
        >
          <Calendar className="mr-2 h-4 w-4" /> Task
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={createIncidentNotification}
          className="justify-start"
        >
          <AlertTriangle className="mr-2 h-4 w-4" /> Incident
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={createReportNotification}
          className="justify-start"
        >
          <FileText className="mr-2 h-4 w-4" /> Report
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={createCommunicationNotification}
          className="justify-start"
        >
          <MessageSquare className="mr-2 h-4 w-4" /> Communication
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={createSystemNotification}
          className="justify-start"
        >
          <Bell className="mr-2 h-4 w-4" /> System
        </Button>
      </div>
    </div>
  );
};

export default NotificationDemo;
