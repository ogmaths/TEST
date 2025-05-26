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
import { Calendar as CalendarIcon, Clock, Save } from "lucide-react";
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

export interface Interaction {
  id: string;
  topicsCovered: string[];
  date: Date;
  type: "check-in" | "incident" | "meeting" | "phone-call" | "email" | "other";
  description: string;
  staff: string;
  includeInReport: boolean;
}

interface AddInteractionFormProps {
  clientId: string;
  onSubmit: (interaction: Interaction) => void;
  onCancel: () => void;
}

const AddInteractionForm: React.FC<AddInteractionFormProps> = ({
  clientId,
  onSubmit,
  onCancel,
}) => {
  const { user } = useUser();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState<Interaction>({
    id: Date.now().toString(),
    topicsCovered: [],
    date: new Date(),
    type: "check-in",
    description: "",
    staff: user?.name || "",
    includeInReport: false,
  });

  const [topicsInput, setTopicsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicsInput || !formData.description || !formData.staff) return;

    setIsSubmitting(true);

    // Convert comma-separated topics to array
    const topics = topicsInput
      .split(",")
      .map((topic) => topic.trim())
      .filter((topic) => topic !== "");

    const newInteraction: Interaction = {
      id: Date.now().toString(),
      topicsCovered: topics,
      date: formData.date,
      type: formData.type,
      description: formData.description,
      staff: formData.staff,
      includeInReport: formData.includeInReport,
    };

    // Save interaction to localStorage
    const savedInteractions = JSON.parse(
      localStorage.getItem(`interactions_${clientId}`) || "[]",
    );
    savedInteractions.push(newInteraction);
    localStorage.setItem(
      `interactions_${clientId}`,
      JSON.stringify(savedInteractions),
    );

    // Simulate API call
    setTimeout(() => {
      onSubmit(newInteraction);
      setIsSubmitting(false);

      // Show success message
      addNotification({
        type: "success",
        title: "Interaction Added",
        message: "New interaction has been added successfully",
        priority: "medium",
      });
    }, 500);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Interaction</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="topicsCovered">Topics Covered</Label>
              <Input
                id="topicsCovered"
                value={topicsInput}
                onChange={(e) => setTopicsInput(e.target.value)}
                placeholder="Topic 1, Topic 2, Topic 3"
                required
              />
              <p className="text-xs text-muted-foreground">
                Separate topics with commas.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Interaction Type</Label>
              <select
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as Interaction["type"],
                  })
                }
                required
              >
                <option value="check-in">Check-in</option>
                <option value="incident">Incident</option>
                <option value="meeting">Meeting</option>
                <option value="phone-call">Phone Call</option>
                <option value="email">Email</option>
                <option value="other">Other</option>
              </select>
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
                      !formData.date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? (
                      format(formData.date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) =>
                      date && setFormData({ ...formData, date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff">Staff Member</Label>
              <Input
                id="staff"
                value={formData.staff}
                onChange={(e) =>
                  setFormData({ ...formData, staff: e.target.value })
                }
                placeholder="Your name"
                required
                disabled={!!user}
                className={user ? "bg-muted" : ""}
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

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeInReport"
              checked={formData.includeInReport}
              onChange={(e) =>
                setFormData({ ...formData, includeInReport: e.target.checked })
              }
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="includeInReport">Include in impact report</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Interaction
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddInteractionForm;
