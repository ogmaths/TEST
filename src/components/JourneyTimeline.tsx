import React, { useState, useEffect } from "react";
import { useNotifications } from "@/context/NotificationContext";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusCircle,
  MessageSquare,
  Calendar,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  date: Date;
  description?: string;
  status?: "completed" | "pending" | "upcoming";
  comments?: Comment[];
  topics?: string[];
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
  authorAvatar?: string;
  mentions?: string[];
}

interface JourneyTimelineProps {
  clientId: string;
  events?: TimelineEvent[];
  showDetails?: boolean;
  compact?: boolean;
}

const AddCommentForm = ({
  eventId,
  onCommentAdded,
}: {
  eventId: string;
  onCommentAdded: () => void;
}) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamMembers, setTeamMembers] = useState<
    { id: string; name: string }[]
  >([]);
  const { addNotification } = useNotifications();
  const { user } = useUser();

  // Load team members on component mount
  useEffect(() => {
    // In a real app, this would fetch from your database
    // For now, we'll use mock data stored in localStorage
    const loadTeamMembers = () => {
      try {
        const savedTeamMembers = localStorage.getItem("teamMembers");
        if (savedTeamMembers) {
          setTeamMembers(JSON.parse(savedTeamMembers));
        } else {
          // Create some mock team members if none exist
          const mockTeamMembers = [
            { id: "user1", name: "John Smith" },
            { id: "user2", name: "Sarah Johnson" },
            { id: "user3", name: "Michael Brown" },
          ];
          localStorage.setItem("teamMembers", JSON.stringify(mockTeamMembers));
          setTeamMembers(mockTeamMembers);
        }
      } catch (error) {
        console.error("Error loading team members:", error);
      }
    };

    loadTeamMembers();
  }, []);

  // Parse comment text for @mentions
  const parseMentions = (text: string): string[] => {
    const mentionRegex = /@([\w\s]+)/g;
    const mentions: string[] = [];

    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      const mentionName = match[1].trim();
      const teamMember = teamMembers.find(
        (member) => member.name.toLowerCase() === mentionName.toLowerCase(),
      );

      if (teamMember) {
        mentions.push(teamMember.id);
      }
    }

    return mentions;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);

    // Parse mentions from comment text
    const mentions = parseMentions(comment);

    // Create the new comment
    const newComment = {
      id: Date.now().toString(),
      author: user?.name || "Anonymous User",
      text: comment,
      timestamp: new Date(),
      mentions,
      authorAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${
        user?.name
          ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
          : "AU"
      }`,
    };

    // Save to localStorage
    const comments = JSON.parse(
      localStorage.getItem("comments_" + eventId) || "[]",
    );
    comments.push(newComment);
    localStorage.setItem("comments_" + eventId, JSON.stringify(comments));

    // Add notification for the comment author
    addNotification({
      title: "Comment Added",
      message: "Your comment has been added to the timeline.",
      type: "success",
      priority: "low",
    });

    // Send notifications to mentioned users
    if (mentions.length > 0) {
      mentions.forEach((userId) => {
        const mentionedUser = teamMembers.find(
          (member) => member.id === userId,
        );
        if (mentionedUser) {
          addNotification({
            title: "You were mentioned",
            message: `${user?.name || "Someone"} mentioned you in a comment: "${comment.substring(0, 50)}${comment.length > 50 ? "..." : ""}"`,
            type: "communication",
            priority: "medium",
            targetUserId: userId,
          });
        }
      });
    }

    // Reset form
    setComment("");
    setIsSubmitting(false);

    // Notify parent component
    onCommentAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="mb-1 text-xs text-muted-foreground">
        Mention team members with @ (e.g. @John Smith)
      </div>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add a comment... Use @ to mention team members"
        className="mb-2"
        rows={2}
      />
      <Button type="submit" size="sm" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Add Comment"}
      </Button>
    </form>
  );
};

const JourneyTimeline: React.FC<JourneyTimelineProps> = ({
  clientId = "123",
  events: initialEvents,
  showDetails = true,
  compact = false,
}) => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const { user } = useUser();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  // Function to handle adding a new interaction
  const handleAddInteraction = () => {
    // Navigate to the client profile with the interaction form open
    navigate("/client/" + clientId + "?showAddInteraction=true");
  };

  // Load comments for all events
  useEffect(() => {
    const loadComments = () => {
      const allComments: { [key: string]: Comment[] } = {};

      events.forEach((event) => {
        const eventComments = JSON.parse(
          localStorage.getItem("comments_" + event.id) || "[]",
        );
        // Sort comments by timestamp, newest first
        allComments[event.id] = eventComments.sort(
          (a: Comment, b: Comment) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
      });

      setComments(allComments);
    };

    if (events.length > 0) {
      loadComments();
    }
  }, [events, refreshKey]);

  useEffect(() => {
    // Load journey data from localStorage or use calculated data based on client
    const loadJourneyData = () => {
      try {
        // First check for interactions
        const savedInteractions = JSON.parse(
          localStorage.getItem("interactions_" + clientId) || "[]",
        );

        // Convert interactions to timeline events
        const interactionEvents = savedInteractions.map((interaction: any) => ({
          id: interaction.id,
          clientId,
          type: interaction.type || "check-in",
          title:
            interaction.title ||
            (interaction.type
              ? interaction.type === "phone-call"
                ? "Phone Call"
                : interaction.type.charAt(0).toUpperCase() +
                  interaction.type.slice(1)
              : "Interaction"),
          date: new Date(interaction.date),
          description: interaction.description || interaction.notes,
          status: "completed",
          topics: interaction.topicsCovered || [],
        }));

        // Try to find journey data in localStorage
        const savedJourneys = JSON.parse(
          localStorage.getItem("journeys") || "[]",
        );
        const clientJourney = savedJourneys.filter(
          (j: any) => j.clientId === clientId,
        );

        if (clientJourney.length > 0 || interactionEvents.length > 0) {
          const journeyEvents = clientJourney.map((j: any) => ({
            ...j,
            date: new Date(j.date),
          }));

          // Combine interactions and journey events
          setEvents(
            [...interactionEvents, ...journeyEvents].sort(
              (a, b) => b.date.getTime() - a.date.getTime(),
            ),
          );
          return;
        }

        // Get client data to base journey on
        const savedClients = JSON.parse(
          localStorage.getItem("clients") || "[]",
        );
        const client = savedClients.find((c: any) => c.id === clientId);

        if (client) {
          // Create journey based on client data
          const journeyEvents = [
            {
              id: "1",
              clientId,
              type: "assessment",
              title: "Initial Assessment",
              date: new Date(
                client.assessmentDates?.introduction || client.joinDate,
              ),
              description:
                "Completed introduction assessment and identified key needs.",
              status: "completed",
            },
            {
              id: "2",
              clientId,
              type: "assessment",
              title: "Progress Review",
              date: new Date(client.assessmentDates?.progress || new Date()),
              description:
                "Progress assessment to evaluate improvement in key areas.",
              status:
                new Date() >= new Date(client.assessmentDates?.progress)
                  ? "pending"
                  : "upcoming",
            },
            {
              id: "3",
              clientId,
              type: "assessment",
              title: "Final Assessment",
              date: new Date(client.assessmentDates?.exit || new Date()),
              description: "Exit assessment and transition planning.",
              status: "upcoming",
            },
          ];
          setEvents(journeyEvents);
          return;
        }

        // Fallback to empty array if no client found
        setEvents([]);
      } catch (error) {
        console.error("Error loading journey data:", error);
        addNotification({
          title: "Error",
          message: "Failed to load client journey data.",
          type: "system",
        });
      }
    };

    loadJourneyData();
  }, [clientId, addNotification]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (events.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Client Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground">
              No journey events found for this client.
            </p>
            {!compact && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleAddInteraction}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add First Interaction
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Client Journey</CardTitle>
        <Button variant="outline" size="sm" onClick={handleAddInteraction}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Interaction
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events.map((event, index) => (
            <div key={event.id} className="relative pl-6 pb-6">
              {/* Timeline connector */}
              {index < events.length - 1 && (
                <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-muted-foreground/20" />
              )}

              {/* Event marker */}
              <div className="absolute left-0 top-1.5 rounded-full bg-primary p-1">
                {event.type === "assessment" && (
                  <CheckCircle className="h-3 w-3 text-primary-foreground" />
                )}
                {event.type === "registration" && (
                  <PlusCircle className="h-3 w-3 text-primary-foreground" />
                )}
                {(event.type === "check-in" || event.type === "meeting") && (
                  <MessageSquare className="h-3 w-3 text-primary-foreground" />
                )}
                {event.type !== "assessment" &&
                  event.type !== "registration" &&
                  event.type !== "check-in" &&
                  event.type !== "meeting" && (
                    <Calendar className="h-3 w-3 text-primary-foreground" />
                  )}
              </div>

              {/* Event content */}
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    {event.topics && event.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {event.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(event.date)}
                  </span>
                </div>

                {showDetails && event.description && (
                  <p className="text-sm text-muted-foreground">
                    {event.description}
                  </p>
                )}

                {!compact && (
                  <div className="mt-2">
                    {/* Display existing comments */}
                    {comments[event.id] && comments[event.id].length > 0 && (
                      <div className="space-y-2 mb-3 bg-muted/20 p-2 rounded-md">
                        <h5 className="text-xs font-medium flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" /> Comments
                        </h5>
                        {comments[event.id].map((comment) => (
                          <div
                            key={comment.id}
                            className="flex items-start gap-2"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.author
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}`}
                              />
                              <AvatarFallback>
                                {comment.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex justify-between items-center">
                                <p className="text-xs font-medium">
                                  {comment.author}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    comment.timestamp,
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="text-xs">
                                {comment.mentions &&
                                comment.mentions.length > 0 ? (
                                  <>
                                    {comment.text
                                      .split(/(@[\w\s]+)/)
                                      .map((part, i) => {
                                        const mentionMatch =
                                          part.match(/@([\w\s]+)/);
                                        if (mentionMatch) {
                                          return (
                                            <span
                                              key={i}
                                              className="bg-primary/20 text-primary font-medium rounded px-1"
                                            >
                                              {part}
                                            </span>
                                          );
                                        }
                                        return part;
                                      })}
                                  </>
                                ) : (
                                  comment.text
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <AddCommentForm
                      eventId={event.id}
                      onCommentAdded={() => setRefreshKey((prev) => prev + 1)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyTimeline;
