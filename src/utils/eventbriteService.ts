import { supabaseClient } from "@/lib/supabaseClient";

/**
 * Interface for Eventbrite event data
 */
export interface EventbriteEvent {
  id: string;
  name: string;
  description: string;
  start: {
    timezone: string;
    utc: string;
    local: string;
  };
  end: {
    timezone: string;
    utc: string;
    local: string;
  };
  url: string;
  venue?: {
    name: string;
    address: {
      address_1: string;
      address_2: string;
      city: string;
      region: string;
      postal_code: string;
      country: string;
    };
  };
  capacity: number;
  status: string;
}

/**
 * Fetches events from Eventbrite API
 * @param organizationId The Eventbrite organization ID
 * @param token The Eventbrite API token
 * @returns Promise that resolves to an array of Eventbrite events
 */
export const fetchEventbriteEvents = async (
  organizationId: string,
  token: string,
): Promise<{
  success: boolean;
  events?: EventbriteEvent[];
  message?: string;
}> => {
  try {
    // In a real implementation, this would call a Supabase Edge Function
    // that would make the API call to Eventbrite
    // For now, we'll simulate the API call

    console.log(
      `Fetching events for organization ${organizationId} with token ${token}`,
    );

    // Simulate API response
    const mockEvents: EventbriteEvent[] = [
      {
        id: "123456789",
        name: "Community Workshop",
        description: "A workshop for the community",
        start: {
          timezone: "America/Los_Angeles",
          utc: "2023-07-15T18:00:00Z",
          local: "2023-07-15T11:00:00",
        },
        end: {
          timezone: "America/Los_Angeles",
          utc: "2023-07-15T20:00:00Z",
          local: "2023-07-15T13:00:00",
        },
        url: "https://www.eventbrite.com/e/123456789",
        venue: {
          name: "Community Center",
          address: {
            address_1: "123 Main St",
            address_2: "",
            city: "San Francisco",
            region: "CA",
            postal_code: "94105",
            country: "US",
          },
        },
        capacity: 50,
        status: "live",
      },
      {
        id: "987654321",
        name: "Support Group Meeting",
        description: "Weekly support group meeting",
        start: {
          timezone: "America/Los_Angeles",
          utc: "2023-07-20T17:00:00Z",
          local: "2023-07-20T10:00:00",
        },
        end: {
          timezone: "America/Los_Angeles",
          utc: "2023-07-20T18:30:00Z",
          local: "2023-07-20T11:30:00",
        },
        url: "https://www.eventbrite.com/e/987654321",
        venue: {
          name: "Health Center",
          address: {
            address_1: "456 Oak St",
            address_2: "Suite 200",
            city: "San Francisco",
            region: "CA",
            postal_code: "94108",
            country: "US",
          },
        },
        capacity: 20,
        status: "live",
      },
    ];

    return {
      success: true,
      events: mockEvents,
    };
  } catch (error) {
    console.error("Error fetching Eventbrite events:", error);
    return {
      success: false,
      message: `Failed to fetch events: ${error.message}`,
    };
  }
};

/**
 * Imports Eventbrite events into the application
 * @param events Array of Eventbrite events to import
 * @returns Promise that resolves when events are imported
 */
export const importEventbriteEvents = async (
  events: EventbriteEvent[],
): Promise<{ success: boolean; message: string }> => {
  try {
    // Convert Eventbrite events to application event format
    const appEvents = events.map((event) => ({
      id: `eventbrite-${event.id}`,
      name: event.name,
      date: new Date(event.start.utc).toISOString().split("T")[0],
      time: `${new Date(event.start.local).toLocaleTimeString()} - ${new Date(event.end.local).toLocaleTimeString()}`,
      location: event.venue
        ? `${event.venue.name}, ${event.venue.address.address_1}`
        : "Online",
      type: "community",
      description: event.description,
      capacity: event.capacity,
      attendees: [],
      createdAt: new Date().toISOString(),
      eventbriteId: event.id,
      eventbriteUrl: event.url,
    }));

    // Get existing events from localStorage
    const existingEvents = JSON.parse(localStorage.getItem("events") || "[]");

    // Filter out events that already exist (by eventbriteId)
    const newEvents = appEvents.filter(
      (newEvent) =>
        !existingEvents.some(
          (existingEvent) =>
            existingEvent.eventbriteId === newEvent.eventbriteId,
        ),
    );

    // Merge new events with existing events
    const updatedEvents = [...existingEvents, ...newEvents];

    // Save to localStorage
    localStorage.setItem("events", JSON.stringify(updatedEvents));

    return {
      success: true,
      message: `Successfully imported ${newEvents.length} events from Eventbrite`,
    };
  } catch (error) {
    console.error("Error importing Eventbrite events:", error);
    return {
      success: false,
      message: `Failed to import events: ${error.message}`,
    };
  }
};
