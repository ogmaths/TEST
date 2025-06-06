import React, { useState } from "react";
import {
  Bell,
  Settings,
  X,
  Check,
  Mail,
  MessageSquare,
  AlertTriangle,
  FileText,
  Calendar,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export type NotificationType =
  | "user_activity"
  | "task"
  | "incident"
  | "report"
  | "communication"
  | "system"
  | "success"
  | "error"
  | "info"
  | "warning";

export type DeliveryMethod = "in_app" | "email" | "sms";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: "low" | "medium" | "high";
  actionUrl?: string;
  icon?: React.ReactNode;
}

export interface NotificationSettings {
  enabled: boolean;
  deliveryMethods: Record<DeliveryMethod, boolean>;
  categories: Record<NotificationType, boolean>;
  emailAddress?: string;
  phoneNumber?: string;
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  deliveryMethods: {
    in_app: true,
    email: false,
    sms: false,
  },
  categories: {
    user_activity: true,
    task: true,
    incident: true,
    report: true,
    communication: true,
    system: true,
  },
  emailAddress: "",
  phoneNumber: "",
};

// Mock notifications for demonstration
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "user_activity",
    title: "New Client Added",
    message: "John Doe has been added to your client list.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    priority: "medium",
    actionUrl: "/clients/john-doe",
    icon: <User size={16} />,
  },
  {
    id: "2",
    type: "task",
    title: "Approaching Deadline",
    message: "Task 'Complete Assessment for Sarah Johnson' is due tomorrow.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    priority: "high",
    actionUrl: "/tasks/123",
    icon: <Calendar size={16} />,
  },
  {
    id: "3",
    type: "incident",
    title: "Urgent Support Request",
    message: "Client Michael Chen has requested urgent housing support.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: true,
    priority: "high",
    actionUrl: "/clients/michael-chen",
    icon: <AlertTriangle size={16} />,
  },
  {
    id: "4",
    type: "report",
    title: "New Assessment Completed",
    message: "Progress assessment for Aisha Patel has been completed.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: true,
    priority: "medium",
    actionUrl: "/assessments/aisha-patel",
    icon: <FileText size={16} />,
  },
  {
    id: "5",
    type: "communication",
    title: "New Message",
    message:
      "You have a new message from Sarah Williams regarding client David Wilson.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
    priority: "medium",
    actionUrl: "/messages/123",
    icon: <MessageSquare size={16} />,
  },
  {
    id: "6",
    type: "system",
    title: "New Feature Announcement",
    message:
      "Check out the new Impact Report feature now available in client profiles.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    priority: "low",
    actionUrl: "/help/new-features",
    icon: <Bell size={16} />,
  },
];

const getTypeLabel = (type: NotificationType): string => {
  switch (type) {
    case "user_activity":
      return "User Activity";
    case "task":
      return "Tasks & Appointments";
    case "incident":
      return "Critical Incidents";
    case "report":
      return "Reports & Documentation";
    case "communication":
      return "Communications";
    case "system":
      return "System Alerts";
    default:
      return "";
  }
};

const getTypeIcon = (type: NotificationType): React.ReactNode => {
  switch (type) {
    case "user_activity":
      return <User className="h-4 w-4" />;
    case "task":
      return <Calendar className="h-4 w-4" />;
    case "incident":
      return <AlertTriangle className="h-4 w-4" />;
    case "report":
      return <FileText className="h-4 w-4" />;
    case "communication":
      return <MessageSquare className="h-4 w-4" />;
    case "system":
      return <Bell className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: string): string => {
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

const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
};

const NotificationItem: React.FC<{
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}> = ({ notification, onMarkAsRead }) => {
  return (
    <div
      className={`p-4 border-b last:border-b-0 ${notification.read ? "bg-background" : "bg-primary/5"}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">
          {notification.icon || getTypeIcon(notification.type)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-sm font-medium">{notification.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {notification.message}
              </p>
            </div>
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onMarkAsRead(notification.id)}
              >
                <Check className="h-3 w-3" />
              </Button>
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(notification.timestamp)}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityColor(notification.priority)}`}
            >
              {notification.priority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationSettings: React.FC<{
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
}> = ({ settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] =
    useState<NotificationSettings>(settings);

  const handleToggleEnabled = () => {
    const updated = {
      ...localSettings,
      enabled: !localSettings.enabled,
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleToggleDeliveryMethod = (method: DeliveryMethod) => {
    const updated = {
      ...localSettings,
      deliveryMethods: {
        ...localSettings.deliveryMethods,
        [method]: !localSettings.deliveryMethods[method],
      },
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleToggleCategory = (category: NotificationType) => {
    const updated = {
      ...localSettings,
      categories: {
        ...localSettings.categories,
        [category]: !localSettings.categories[category],
      },
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleUpdateContactInfo = (
    field: "emailAddress" | "phoneNumber",
    value: string,
  ) => {
    const updated = {
      ...localSettings,
      [field]: value,
    };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h4 className="text-sm font-medium">Notification Status</h4>
          <p className="text-xs text-muted-foreground">
            Enable or disable all notifications
          </p>
        </div>
        <Switch
          checked={localSettings.enabled}
          onCheckedChange={handleToggleEnabled}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Delivery Methods</h4>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>In-App Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive notifications within the application
              </p>
            </div>
            <Switch
              checked={localSettings.deliveryMethods.in_app}
              onCheckedChange={() => handleToggleDeliveryMethod("in_app")}
              disabled={!localSettings.enabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive notifications via email
              </p>
            </div>
            <Switch
              checked={localSettings.deliveryMethods.email}
              onCheckedChange={() => handleToggleDeliveryMethod("email")}
              disabled={!localSettings.enabled}
            />
          </div>

          {localSettings.deliveryMethods.email && (
            <div className="pl-4 border-l-2 border-muted">
              <Label htmlFor="email" className="text-xs mb-1 block">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={localSettings.emailAddress}
                onChange={(e) =>
                  handleUpdateContactInfo("emailAddress", e.target.value)
                }
                className="h-8"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p className="text-xs text-muted-foreground">
                Receive notifications via SMS
              </p>
            </div>
            <Switch
              checked={localSettings.deliveryMethods.sms}
              onCheckedChange={() => handleToggleDeliveryMethod("sms")}
              disabled={!localSettings.enabled}
            />
          </div>

          {localSettings.deliveryMethods.sms && (
            <div className="pl-4 border-l-2 border-muted">
              <Label htmlFor="phone" className="text-xs mb-1 block">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={localSettings.phoneNumber}
                onChange={(e) =>
                  handleUpdateContactInfo("phoneNumber", e.target.value)
                }
                className="h-8"
              />
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Notification Categories</h4>
        <div className="grid gap-4">
          {Object.entries(localSettings.categories).map(
            ([category, enabled]) => (
              <div key={category} className="flex items-start space-x-2">
                <Checkbox
                  id={category}
                  checked={enabled}
                  onCheckedChange={() =>
                    handleToggleCategory(category as NotificationType)
                  }
                  disabled={!localSettings.enabled}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {getTypeLabel(category as NotificationType)}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {getCategoryDescription(category as NotificationType)}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

const getCategoryDescription = (type: NotificationType): string => {
  switch (type) {
    case "user_activity":
      return "New users, status changes, goal updates, and impact score changes";
    case "task":
      return "New tasks, approaching deadlines, and appointment reminders";
    case "incident":
      return "Urgent support requests, high-risk alerts, and critical incidents";
    case "report":
      return "New assessments, report submission reminders, and document uploads";
    case "communication":
      return "New messages, follow-up reminders, and collaboration requests";
    case "system":
      return "Account updates, password expirations, and new feature announcements";
    default:
      return "";
  }
};

import { useNotifications } from "@/context/NotificationContext";

const NotificationCenter: React.FC = () => {
  const { notifications, settings, markAsRead, markAllAsRead, updateSettings } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | NotificationType>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleUpdateSettings = (newSettings: NotificationSettings) => {
    updateSettings(newSettings);
  };

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsOpen(true)}
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Notifications</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Notifications</DialogTitle>
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Notification Settings</DialogTitle>
                    </DialogHeader>
                    <NotificationSettings
                      settings={settings}
                      onUpdateSettings={handleUpdateSettings}
                    />
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex justify-between items-center mb-4">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as any)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4 h-8">
                <TabsTrigger value="all" className="text-xs">
                  All
                </TabsTrigger>
                <TabsTrigger value="user_activity" className="text-xs">
                  Users
                </TabsTrigger>
                <TabsTrigger value="task" className="text-xs">
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="incident" className="text-xs">
                  Incidents
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all as read
            </Button>
          </div>

          <div className="max-h-[400px] overflow-y-auto border rounded-md">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            ) : (
              <div className="p-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No notifications to display
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationCenter;
