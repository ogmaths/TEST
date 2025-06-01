import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Calendar,
  Link2,
  Check,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  type: "email" | "calendar" | "other";
  status: "connected" | "disconnected" | "error";
  lastSync?: string;
  details?: Record<string, any>;
}

const IntegrationPanel: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "brevo",
      name: "Brevo",
      type: "email",
      status: "connected",
      lastSync: "2023-06-15T10:30:00Z",
      details: {
        apiKey: "****************************1234",
        emailsSent: 1245,
        emailLists: 5,
        automationWorkflows: 3,
      },
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      type: "calendar",
      status: "connected",
      lastSync: "2023-06-16T14:45:00Z",
      details: {
        account: "organization@example.com",
        calendars: 3,
        upcomingEvents: 12,
      },
    },
    {
      id: "eventbrite",
      name: "Eventbrite",
      type: "other",
      status: "disconnected",
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      type: "email",
      status: "error",
      lastSync: "2023-06-10T09:15:00Z",
      details: {
        error: "API key expired",
      },
    },
  ]);

  const [activeTab, setActiveTab] = useState("all");
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [currentIntegration, setCurrentIntegration] =
    useState<Integration | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState("daily");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleConfigureIntegration = (integration: Integration) => {
    setCurrentIntegration(integration);
    setApiKey(integration.details?.apiKey || "");
    setSyncEnabled(true);
    setSyncFrequency("daily");
    setShowConfigDialog(true);
  };

  const handleSaveConfig = () => {
    if (!currentIntegration) return;

    const updatedIntegrations = integrations.map((integration) => {
      if (integration.id === currentIntegration.id) {
        return {
          ...integration,
          status: "connected",
          lastSync: new Date().toISOString(),
          details: {
            ...integration.details,
            apiKey: apiKey || integration.details?.apiKey,
            syncEnabled,
            syncFrequency,
          },
        };
      }
      return integration;
    });

    setIntegrations(updatedIntegrations);
    setShowConfigDialog(false);
  };

  const handleDisconnect = (integrationId: string) => {
    const updatedIntegrations = integrations.map((integration) => {
      if (integration.id === integrationId) {
        return {
          ...integration,
          status: "disconnected",
        };
      }
      return integration;
    });

    setIntegrations(updatedIntegrations);
  };

  const handleConnect = (integrationId: string) => {
    const integration = integrations.find((i) => i.id === integrationId);
    if (integration) {
      handleConfigureIntegration(integration);
    }
  };

  const handleSyncNow = (integrationId: string) => {
    setIsSyncing(true);

    // Simulate sync process
    setTimeout(() => {
      const updatedIntegrations = integrations.map((integration) => {
        if (integration.id === integrationId) {
          return {
            ...integration,
            lastSync: new Date().toISOString(),
          };
        }
        return integration;
      });

      setIntegrations(updatedIntegrations);
      setIsSyncing(false);
    }, 2000);
  };

  const filteredIntegrations = integrations.filter((integration) => {
    if (activeTab === "all") return true;
    if (activeTab === "email" && integration.type === "email") return true;
    if (activeTab === "calendar" && integration.type === "calendar")
      return true;
    if (activeTab === "other" && integration.type === "other") return true;
    return false;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <Check className="h-3 w-3 mr-1" /> Connected
          </Badge>
        );
      case "disconnected":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Disconnected
          </Badge>
        );
      case "error":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <AlertCircle className="h-3 w-3 mr-1" /> Error
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-5 w-5" />;
      case "calendar":
        return <Calendar className="h-5 w-5" />;
      default:
        return <Link2 className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>
          Connect and manage external services and platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-4">
            {filteredIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {getIntegrationIcon(integration.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{integration.name}</h4>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(integration.status)}
                      {integration.lastSync &&
                        integration.status === "connected" && (
                          <span className="text-xs text-muted-foreground">
                            Last sync:{" "}
                            {new Date(integration.lastSync).toLocaleString()}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {integration.status === "connected" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSyncNow(integration.id)}
                        disabled={isSyncing}
                      >
                        {isSyncing ? (
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-1" />
                        )}
                        Sync Now
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfigureIntegration(integration)}
                      >
                        Configure
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(integration.id)}
                      >
                        Disconnect
                      </Button>
                    </>
                  )}
                  {(integration.status === "disconnected" ||
                    integration.status === "error") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConnect(integration.id)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {filteredIntegrations.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No integrations found for this category.
                </p>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>

      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Configure {currentIntegration?.name} Integration
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter API key"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="sync-enabled"
                checked={syncEnabled}
                onCheckedChange={setSyncEnabled}
              />
              <Label htmlFor="sync-enabled">
                Enable automatic synchronization
              </Label>
            </div>

            {syncEnabled && (
              <div className="space-y-2">
                <Label htmlFor="sync-frequency">Sync Frequency</Label>
                <select
                  id="sync-frequency"
                  className="w-full p-2 border rounded-md"
                  value={syncFrequency}
                  onChange={(e) => setSyncFrequency(e.target.value)}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            )}

            {currentIntegration?.type === "email" && (
              <div className="p-4 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Email Integration Features</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Automated event registration emails
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Client follow-up sequences
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Assessment completion notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Impact report distribution
                  </li>
                </ul>
              </div>
            )}

            {currentIntegration?.type === "calendar" && (
              <div className="p-4 bg-muted rounded-md">
                <h4 className="font-medium mb-2">
                  Calendar Integration Features
                </h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Automatic event scheduling
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Client appointment reminders
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Staff availability management
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Room and resource booking
                  </li>
                </ul>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfigDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveConfig}>Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default IntegrationPanel;
