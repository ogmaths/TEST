import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Notification,
  NotificationSettings,
  NotificationType,
  DeliveryMethod,
} from "@/components/NotificationCenter";

interface NotificationContextType {
  notifications: Notification[];
  settings: NotificationSettings;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read"> & {
      targetUserId?: string;
    },
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  updateSettings: (settings: NotificationSettings) => void;
  clearNotifications: () => void;
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

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] =
    useState<NotificationSettings>(defaultSettings);

  // Load notifications and settings from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    const savedSettings = localStorage.getItem("notificationSettings");

    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        // Convert string dates back to Date objects
        const processedNotifications = parsedNotifications.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        setNotifications(processedNotifications);
      } catch (error) {
        console.error("Failed to parse saved notifications", error);
      }
    }

    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to parse saved settings", error);
      }
    }
  }, []);

  // Save notifications and settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("notificationSettings", JSON.stringify(settings));
  }, [settings]);

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "read"> & {
      targetUserId?: string;
    },
  ) => {
    // Check if notifications are enabled for this category
    if (!settings.enabled || !settings.categories[notification.type]) {
      return;
    }

    // Extract targetUserId and remove it from the notification object
    const { targetUserId, ...notificationData } = notification;

    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    // If this is a mention notification for another user, store it separately
    if (targetUserId) {
      // In a real app, this would be stored in a database or sent to a notification service
      // For this demo, we'll store it in localStorage under the target user's ID
      try {
        const userNotificationsKey = `user_notifications_${targetUserId}`;
        const userNotifications = JSON.parse(
          localStorage.getItem(userNotificationsKey) || "[]",
        );
        userNotifications.push(newNotification);
        localStorage.setItem(
          userNotificationsKey,
          JSON.stringify(userNotifications),
        );

        console.log(
          `Notification sent to user ${targetUserId}:`,
          newNotification,
        );

        // For demo purposes, also add to current user's notifications to make mentions visible
        // This simulates the behavior of a real system where mentions would be visible to all parties
        if (
          notification.type === "communication" &&
          notification.message.includes("mentioned you")
        ) {
          const mentionNotification = {
            ...newNotification,
            id: Date.now().toString() + "-mention",
            title: "Mention sent",
            message: notification.message.replace(
              "mentioned you",
              "was mentioned by you",
            ),
          };
          setNotifications((prev) => [mentionNotification, ...prev]);
        }

        return; // Don't add original notification to current user's notifications
      } catch (error) {
        console.error("Failed to store user notification", error);
      }
    }

    // Add to current user's notifications
    setNotifications((prev) => [newNotification, ...prev]);

    // In a real app, you would handle email and SMS delivery here
    if (settings.deliveryMethods.email && settings.emailAddress) {
      console.log(
        `Sending email notification to ${settings.emailAddress}:`,
        newNotification,
      );
      // Call email service API
    }

    if (settings.deliveryMethods.sms && settings.phoneNumber) {
      console.log(
        `Sending SMS notification to ${settings.phoneNumber}:`,
        newNotification,
      );
      // Call SMS service API
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const updateSettings = (newSettings: NotificationSettings) => {
    setSettings(newSettings);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        settings,
        addNotification,
        markAsRead,
        markAllAsRead,
        updateSettings,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}
