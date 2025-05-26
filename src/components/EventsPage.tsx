import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar, Plus, Users, Check } from "lucide-react";
// QR code functionality will be implemented separately
import BackButton from "@/components/BackButton";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  type: "workshop" | "meeting" | "training" | "community" | "other";
  attendees: number;
  organizer: string;
}

const EventsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState({
    workshop: true,
    meeting: true,
    training: true,
    community: true,
    other: true,
  });

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
          name: "Financial Literacy Workshop",
          date: "2023-06-20",
          time: "10:00 AM - 12:00 PM",
          location: "Main Office - Room 101",
          type: "workshop",
          attendees: 15,
          organizer: "Sarah Williams",
        },
        {
          id: "2",
          name: "Job Interview Skills Training",
          date: "2023-06-22",
          time: "2:00 PM - 4:00 PM",
          location: "Training Center - Room B",
          type: "training",
          attendees: 12,
          organizer: "Michael Johnson",
        },
        {
          id: "3",
          name: "Community Resource Fair",
          date: "2023-06-25",
          time: "11:00 AM - 3:00 PM",
          location: "Community Center",
          type: "community",
          attendees: 50,
          organizer: "Lisa Chen",
        },
        {
          id: "4",
          name: "Case Worker Meeting",
          date: "2023-06-21",
          time: "9:00 AM - 10:30 AM",
          location: "Conference Room A",
          type: "meeting",
          attendees: 8,
          organizer: "David Wilson",
        },
        {
          id: "5",
          name: "Mental Health Support Group",
          date: "2023-06-23",
          time: "5:00 PM - 6:30 PM",
          location: "Wellness Center",
          type: "other",
          attendees: 10,
          organizer: "Maria Garcia",
        },
      ]);
    }
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "workshop":
        return <Badge variant="default">Workshop</Badge>;
      case "meeting":
        return <Badge variant="outline">Meeting</Badge>;
      case "training":
        return <Badge variant="secondary">Training</Badge>;
      case "community":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Community
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="p-6 bg-background">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <BackButton />
        </div>
        <Link to="/clients">
          <Button variant="outline" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> View Clients
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Events Management</h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Events List</h2>
        <Link to="/events/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Event
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search events by name, organizer, or location..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Event Types</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={filters.workshop}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, workshop: checked }))
              }
            >
              <div className="flex items-center gap-2">
                Workshop
                {filters.workshop && <Check className="ml-auto h-4 w-4" />}
              </div>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.meeting}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, meeting: checked }))
              }
            >
              <div className="flex items-center gap-2">
                Meeting
                {filters.meeting && <Check className="ml-auto h-4 w-4" />}
              </div>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.training}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, training: checked }))
              }
            >
              <div className="flex items-center gap-2">
                Training
                {filters.training && <Check className="ml-auto h-4 w-4" />}
              </div>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.community}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, community: checked }))
              }
            >
              <div className="flex items-center gap-2">
                Community
                {filters.community && <Check className="ml-auto h-4 w-4" />}
              </div>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.other}
              onCheckedChange={(checked) =>
                setFilters((prev) => ({ ...prev, other: checked }))
              }
            >
              <div className="flex items-center gap-2">
                Other
                {filters.other && <Check className="ml-auto h-4 w-4" />}
              </div>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{event.name}</CardTitle>
                {getEventTypeBadge(event.type)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {new Date(event.date).toLocaleDateString()} • {event.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{event.attendees} attendees</span>
                </div>
                <div className="text-sm">
                  <div>
                    <strong>Location:</strong> {event.location}
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Link to={`/events/attendance/${event.id}`}>
                    <Button size="sm">Manage Attendees</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
