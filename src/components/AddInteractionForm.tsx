import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, Save, Sparkles } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";
import { useNotifications } from "@/context/NotificationContext";
import AISentimentAnalysis from "./AISentimentAnalysis";

interface AddInteractionFormProps {
  clientId?: string;
  onSuccess?: () => void;
}

const AddInteractionForm: React.FC<AddInteractionFormProps> = ({
  clientId,
  onSuccess,
}) => {
  const { user } = useUser();
  const { addNotification } = useNotifications();
  const [date, setDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    topicsCovered: "",
    phq9Score: "",
    gad7Score: "",
    isCounsellingSession: false,
    isPostEventEngagement: false,
  });

  // Get client ID from URL if not provided as prop
  const urlParams = new URLSearchParams(window.location.search);
  const urlClientId = urlParams.get("clientId");
  const effectiveClientId = clientId || urlClientId || "1";

  // Load client data
  const [client, setClient] = useState<any>(null);
  React.useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll use localStorage
    const storedClients = JSON.parse(localStorage.getItem("clients") || "[]");
    const foundClient = storedClients.find(
      (c: any) => c.id === effectiveClientId,
    );
    setClient(foundClient);
  }, [effectiveClientId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create interaction object
    const interaction = {
      id: `int_${Date.now()}`,
      clientId: effectiveClientId,
      date: date.toISOString(),
      type: formData.type,
      description: formData.description,
      topicsCovered: formData.topicsCovered
        .split(",")
        .map((topic) => topic.trim())
        .filter((topic) => topic),
      createdBy: user?.name || "System User",
      isCounsellingSession: formData.isCounsellingSession,
      isPostEventEngagement: formData.isPostEventEngagement,
      phq9Score: formData.isCounsellingSession
        ? parseInt(formData.phq9Score) || 0
        : null,
      gad7Score: formData.isCounsellingSession
        ? parseInt(formData.gad7Score) || 0
        : null,
      organizationId: user?.tenantId || "",
    };

    // Save to localStorage
    const storedInteractions = JSON.parse(
      localStorage.getItem(`interactions_${effectiveClientId}`) || "[]",
    );
    localStorage.setItem(
      `interactions_${effectiveClientId}`,
      JSON.stringify([interaction, ...storedInteractions]),
    );

    // Show notification
    addNotification({
      type: "success",
      title: "Interaction Added",
      message: "The interaction has been successfully recorded.",
    });

    // Reset form
    setFormData({
      type: "",
      description: "",
      topicsCovered: "",
      phq9Score: "",
      gad7Score: "",
      isCounsellingSession: false,
      isPostEventEngagement: false,
    });
    setDate(new Date());

    // Call onSuccess callback if provided
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Interaction</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {client && (
              <div className="bg-muted/50 p-4 rounded-md">
                <p className="font-medium">
                  Client: {client.name}{" "}
                  <span className="text-muted-foreground font-normal">
                    ({client.email})
                  </span>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Interaction Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => {
                    const isCounselling = value === "counselling_session";
                    const isPostEvent = value === "post_event_engagement";
                    setFormData({
                      ...formData,
                      type: value,
                      isCounsellingSession: isCounselling,
                      isPostEventEngagement: isPostEvent,
                    });
                  }}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select interaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="phone_call">Phone Call</SelectItem>
                    <SelectItem value="text_message">Text Message</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="counselling_session">
                      Counselling Session
                    </SelectItem>
                    <SelectItem value="post_event_engagement">
                      Post-Event Engagement
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topics">Topics Covered</Label>
                <Input
                  id="topics"
                  value={formData.topicsCovered}
                  onChange={(e) =>
                    setFormData({ ...formData, topicsCovered: e.target.value })
                  }
                  placeholder="e.g., housing, employment, financial (comma separated)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the interaction"
                rows={4}
                required
              />
            </div>

            {formData.isCounsellingSession && (
              <div className="space-y-4 p-4 border rounded-md bg-muted/20">
                <h3 className="font-medium">Counselling Session Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phq9Score">
                      PHQ-9 Score (Depression Assessment)
                    </Label>
                    <Input
                      id="phq9Score"
                      type="number"
                      min="0"
                      max="27"
                      value={formData.phq9Score}
                      onChange={(e) =>
                        setFormData({ ...formData, phq9Score: e.target.value })
                      }
                      placeholder="Score (0-27)"
                    />
                    <p className="text-xs text-muted-foreground">
                      Depression severity assessment (0-27 scale)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gad7Score">
                      GAD-7 Score (Anxiety Assessment)
                    </Label>
                    <Input
                      id="gad7Score"
                      type="number"
                      min="0"
                      max="21"
                      value={formData.gad7Score}
                      onChange={(e) =>
                        setFormData({ ...formData, gad7Score: e.target.value })
                      }
                      placeholder="Score (0-21)"
                    />
                    <p className="text-xs text-muted-foreground">
                      Anxiety severity assessment (0-21 scale)
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: These scores are only visible to tenant administrators.
                </p>
              </div>
            )}

            {/* AI Sentiment Analysis */}
            <div className="pt-4">
              <AISentimentAnalysis
                defaultText={formData.description}
                onAnalysisComplete={(result) => {
                  // Optionally use the sentiment analysis results
                  console.log("Sentiment analysis results:", result);
                }}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <a href={`/client?id=${effectiveClientId}`}>Cancel</a>
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Interaction
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddInteractionForm;
