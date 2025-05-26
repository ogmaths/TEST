import React, { useState } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Save, Check, X, RefreshCw } from "lucide-react";
import BackButton from "@/components/BackButton";

interface Client {
  id: string;
  name: string;
  profileImage: string;
  caseWorker: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  type: string;
}

interface EventAttendanceRegisterProps {
  eventId: string;
  onSave: (attendees: string[]) => void;
}

const EventAttendanceRegister: React.FC<EventAttendanceRegisterProps> = ({
  eventId,
  onSave,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Mock event data
  const event: Event = {
    id: eventId,
    name: "Financial Literacy Workshop",
    date: "2023-06-20",
    time: "10:00 AM - 12:00 PM",
    location: "Main Office - Room 101",
    type: "workshop",
  };

  // Mock clients data
  const clients: Client[] = [
    {
      id: "1",
      name: "Jane Smith",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      caseWorker: "Michael Johnson",
    },
    {
      id: "2",
      name: "Robert Chen",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=robert",
      caseWorker: "Sarah Williams",
    },
    {
      id: "3",
      name: "Maria Garcia",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
      caseWorker: "Michael Johnson",
    },
    {
      id: "4",
      name: "David Wilson",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
      caseWorker: "Lisa Chen",
    },
    {
      id: "5",
      name: "Aisha Patel",
      profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=aisha",
      caseWorker: "Sarah Williams",
    },
  ];

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.caseWorker.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggleClient = (clientId: string) => {
    setIsSaved(false);
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId],
    );
  };

  const handleSelectAll = () => {
    setIsSaved(false);
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map((client) => client.id));
    }
  };

  const { addNotification } = useNotifications();

  const handleSaveAttendance = () => {
    setIsSaving(true);

    // Get the event and update attendees
    const allEvents = JSON.parse(localStorage.getItem("events") || "[]");
    const eventIndex = allEvents.findIndex((e: any) => e.id === eventId);

    if (eventIndex !== -1) {
      // Update the event with selected attendees
      allEvents[eventIndex].attendees = selectedClients;
      localStorage.setItem("events", JSON.stringify(allEvents));
    }

    // Simulate API call
    setTimeout(() => {
      onSave(selectedClients);
      setIsSaving(false);
      setIsSaved(true);

      // Show notification
      addNotification({
        type: "success",
        title: "Attendance Saved",
        message: `Attendance recorded for ${selectedClients.length} clients`,
        priority: "medium",
      });
    }, 1000);
  };

  return (
    <div className="p-6 bg-background">
      <BackButton className="mb-4" />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Event Attendance Register</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Event Details */}
            <div className="p-4 bg-muted/50 rounded-md">
              <h3 className="text-lg font-medium">{event.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div>
                  <strong>Time:</strong> {event.time}
                </div>
                <div>
                  <strong>Location:</strong> {event.location}
                </div>
                <div>
                  <strong>Type:</strong> {event.type}
                </div>
              </div>
            </div>

            {/* Search and Select */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search clients..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <Checkbox
                    id="select-all"
                    checked={
                      selectedClients.length === filteredClients.length &&
                      filteredClients.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all">Select All</Label>
                </div>
              </div>

              <div className="border rounded-md">
                <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 border-b font-medium">
                  <div>Attended</div>
                  <div>Client</div>
                  <div>Case Worker</div>
                </div>

                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
                    <div
                      key={client.id}
                      className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 border-b items-center"
                    >
                      <Checkbox
                        checked={selectedClients.includes(client.id)}
                        onCheckedChange={() => handleToggleClient(client.id)}
                      />
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{client.name}</div>
                      </div>
                      <div className="text-sm">{client.caseWorker}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No clients found matching your search.
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedClients([])}>
                Clear Selection
              </Button>
              {isSaved ? (
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
                  onClick={() => setIsSaved(false)}
                >
                  <Check className="h-4 w-4" />
                  Saved Successfully
                </Button>
              ) : (
                <Button
                  onClick={handleSaveAttendance}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Attendance ({selectedClients.length})
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventAttendanceRegister;
