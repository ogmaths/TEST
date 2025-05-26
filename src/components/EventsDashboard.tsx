import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Plus, Search, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import UserSettings from "@/components/UserSettings";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  type: string;
  attendees: any[];
  capacity: number;
}

const EventsDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  // Load events from localStorage or use mock data if none exists
  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      // Mock events data as fallback
      setEvents([
        {
          id: "1",
          name: "Community Workshop",
          date: "2023-07-15",
          time: "14:00",
          location: "Community Center",
          type: "workshop",
          attendees: [],
          capacity: 30,
        },
        {
          id: "2",
          name: "Support Group Meeting",
          date: "2023-07-20",
          time: "18:30",
          location: "Main Office",
          type: "support",
          attendees: [],
          capacity: 15,
        },
        {
          id: "3",
          name: "Career Development Seminar",
          date: "2023-07-25",
          time: "10:00",
          location: "Training Room B",
          type: "seminar",
          attendees: [],
          capacity: 25,
        },
        {
          id: "4",
          name: "Family Day",
          date: "2023-08-05",
          time: "12:00",
          location: "City Park",
          type: "community",
          attendees: [],
          capacity: 100,
        },
      ]);
    }
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "workshop":
        return <Badge variant="default">Workshop</Badge>;
      case "seminar":
        return <Badge variant="secondary">Seminar</Badge>;
      case "training":
        return <Badge variant="outline">Training</Badge>;
      case "community":
        return <Badge>Community</Badge>;
      case "support":
        return <Badge variant="destructive">Support</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="p-6 bg-background">
      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <UserSettings onClose={() => setShowSettings(false)} />
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <BackButton />
        </div>
        <div className="flex items-center gap-2">
          <Link to="/clients">
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> View Clients
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-6">Events Dashboard</h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Upcoming Events</h2>
        <Link to="/events/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Event
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search events by name, location, or type..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => {
            // This will trigger the search using the current searchQuery value
            document
              .querySelector('input[type="search"]')
              ?.setAttribute("tabindex", "-1");
            (
              document.querySelector('input[type="search"]') as HTMLElement
            )?.focus();
          }}
        >
          <Search className="h-4 w-4" /> Search
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Event List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 p-4 border-b font-medium">
              <div>Event</div>
              <div>Date & Time</div>
              <div>Location</div>
              <div>Type</div>
              <div>Actions</div>
            </div>
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 p-4 border-b items-center"
              >
                <div>
                  <div className="font-medium">{event.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Capacity: {event.capacity} attendees
                  </div>
                </div>
                <div className="text-sm">
                  <div>{new Date(event.date).toLocaleDateString()}</div>
                  <div className="text-muted-foreground">{event.time}</div>
                </div>
                <div className="text-sm">{event.location}</div>
                <div>{getEventTypeBadge(event.type)}</div>
                <div className="flex gap-2">
                  <Link to={`/events/attendance/${event.id}`}>
                    <Button variant="ghost" size="sm">
                      Attendance
                    </Button>
                  </Link>
                  <Link to={`/events/register/${event.id}`}>
                    <Button variant="ghost" size="sm">
                      Register
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventsDashboard;
