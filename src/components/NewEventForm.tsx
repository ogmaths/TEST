import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/context/NotificationContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BackButton from "./BackButton";

const NewEventForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    type: "workshop",
    description: "",
    capacity: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const { addNotification } = useNotifications();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new event object
    const newEvent = {
      id: Date.now().toString(),
      name: formData.name,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      type: formData.type,
      description: formData.description,
      capacity: parseInt(formData.capacity) || 20,
      attendees: [],
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage to persist between page navigations
    const existingEvents = JSON.parse(localStorage.getItem("events") || "[]");
    localStorage.setItem(
      "events",
      JSON.stringify([...existingEvents, newEvent]),
    );

    // Show notification for successful event creation
    addNotification({
      type: "success",
      title: "Event Created",
      message: "New event has been added successfully",
      priority: "high",
    });

    // Prevent duplicate submissions by disabling the form
    setFormData({
      name: "",
      date: "",
      time: "",
      location: "",
      type: "workshop",
      description: "",
      capacity: "",
    });

    // Delay navigation slightly to show the notification
    setTimeout(() => {
      navigate("/events");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <BackButton />
          <h1 className="ml-4 text-3xl font-bold">Create New Event</h1>
          <div className="ml-auto">
            <Link to="/events">
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> All Events
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Event Information</CardTitle>
            <CardDescription>
              Enter the details for the new event.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  placeholder="Event name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Event location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select
                  id="type"
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="community">Community Event</SelectItem>
                    <SelectItem value="support">Support Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="Maximum number of attendees"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter event description and details"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <RouterLink to="/events">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </RouterLink>
              <Button type="submit">Create Event</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default NewEventForm;
