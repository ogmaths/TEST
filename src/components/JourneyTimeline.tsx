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
  Sparkles,
} from "lucide-react";
import AIRecommendationEngine from "./AIRecommendationEngine";
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
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
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
          console.log(
            "Loaded team members from localStorage:",
            JSON.parse(savedTeamMembers),
          );
        } else {
          // Create some mock team members if none exist
          const mockTeamMembers = [
            { id: "user1", name: "John Smith" },
            { id: "user2", name: "Sarah Johnson" },
            { id: "user3", name: "Michael Brown" },
          ];
          localStorage.setItem("teamMembers", JSON.stringify(mockTeamMembers));
          setTeamMembers(mockTeamMembers);
          console.log("Created mock team members:", mockTeamMembers);
        }
      } catch (error) {
        console.error("Error loading team members:", error);
      }
    };

    loadTeamMembers();
  }, []);

  // Check for @ character and show dropdown
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    setComment(newComment);

    // Store cursor position
    setCursorPosition(e.target.selectionStart);

    // Check if we should show the mention dropdown
    const textBeforeCursor = newComment.substring(0, e.target.selectionStart);
    const atSignIndex = textBeforeCursor.lastIndexOf("@");

    if (atSignIndex !== -1 && atSignIndex < textBeforeCursor.length) {
      // Get the text between @ and cursor
      const filterText = textBeforeCursor.substring(atSignIndex + 1);
      // Only show dropdown if there's no space after @ or if there's text after @
      if (!filterText.includes(" ") || filterText.trim() !== "") {
        setMentionFilter(filterText.trim().toLowerCase());
        setShowMentionDropdown(true);
        return;
      }
    }

    setShowMentionDropdown(false);
  };

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMentionDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Insert the selected mention into the comment
  const insertMention = (memberName: string) => {
    const beforeCursor = comment.substring(0, cursorPosition);
    const atSignIndex = beforeCursor.lastIndexOf("@");

    if (atSignIndex !== -1) {
      const newComment =
        beforeCursor.substring(0, atSignIndex) +
        "@" +
        memberName +
        " " +
        comment.substring(cursorPosition);

      setComment(newComment);
      setShowMentionDropdown(false);

      // Focus back on textarea and set cursor position after the inserted mention
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPosition = atSignIndex + memberName.length + 2; // +2 for @ and space
          textareaRef.current.setSelectionRange(newPosition, newPosition);
          setCursorPosition(newPosition);
        }
      }, 0);
    }
  };

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
        console.log(
          `Found mention for ${mentionName} with ID ${teamMember.id}`,
        );
      } else {
        console.log(`No team member found for mention: ${mentionName}`);
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
          console.log(`Sending notification to user ${userId}`);
          addNotification({
            title: "You were mentioned",
            message: `${user?.name || "Someone"} mentioned you in a comment: "${comment.substring(0, 50)}${comment.length > 50 ? "..." : ""}"`,
            type: "communication",
            priority: "medium",
            targetUserId: userId,
          });

          // Also add a notification to the current user's feed for better visibility
          addNotification({
            title: "Mention sent",
            message: `You mentioned ${mentionedUser.name} in a comment.`,
            type: "communication",
            priority: "low",
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

  // Filter team members based on input after @
  const filteredTeamMembers = teamMembers.filter(
    (member) =>
      mentionFilter === "" || member.name.toLowerCase().includes(mentionFilter),
  );

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="mb-1 text-xs text-muted-foreground">
        Mention team members with @ (e.g. @John Smith, @Sarah Johnson, @Michael
        Brown)
      </div>
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={comment}
          onChange={handleCommentChange}
          onKeyDown={(e) => {
            if (e.key === "Escape" && showMentionDropdown) {
              e.preventDefault();
              setShowMentionDropdown(false);
            }
          }}
          placeholder="Add a comment... Use @ to mention team members"
          className="mb-2"
          rows={2}
        />
        {showMentionDropdown && filteredTeamMembers.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-48 overflow-y-auto w-64"
          >
            {filteredTeamMembers.map((member) => (
              <div
                key={member.id}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                onClick={() => insertMention(member.name)}
              >
                <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs mr-2">
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span>{member.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
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
  const [client, setClient] = useState<any>(null);
  const { user } = useUser();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  // Function to handle adding a new interaction
  const handleAddInteraction = () => {
    // Navigate to the interaction add page with the client ID
    navigate(`/interaction/add?clientId=${clientId}`);
    console.log("Navigating to add interaction form with clientId:", clientId);
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
        // Load client data first
        const savedClients = JSON.parse(
          localStorage.getItem("clients") || "[]",
        );
        const clientData = savedClients.find((c: any) => c.id === clientId);
        setClient(clientData);

        // First check for interactions
        const savedInteractions = JSON.parse(
          localStorage.getItem("interactions_" + clientId) || "[]",
        );

        // Convert interactions to timeline events
        const interactionEvents = savedInteractions.map((interaction: any) => ({
          id: interaction.id,
          clientId,
          type: interaction.type || "check-in",
          title: interaction.type
            ? interaction.type === "phone_call"
              ? "Phone Call"
              : interaction.type.charAt(0).toUpperCase() +
                interaction.type.slice(1).replace("_", " ")
            : "Interaction",
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

        if (clientData) {
          // Create journey based on client data
          const journeyEvents = [
            {
              id: "1",
              clientId,
              type: "assessment",
              title: "Initial Assessment",
              date: new Date(
                clientData.assessmentDates?.introduction || clientData.joinDate,
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
              date: new Date(
                clientData.assessmentDates?.progress || new Date(),
              ),
              description:
                "Progress assessment to evaluate improvement in key areas.",
              status:
                new Date() >= new Date(clientData.assessmentDates?.progress)
                  ? "pending"
                  : "upcoming",
            },
            {
              id: "3",
              clientId,
              type: "assessment",
              title: "Final Assessment",
              date: new Date(clientData.assessmentDates?.exit || new Date()),
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

    // Add event listener for storage changes to refresh data when interactions are added
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `interactions_${clientId}` || e.key === "journeys") {
        loadJourneyData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also listen for focus events to refresh data when returning to the page
    const handleFocus = () => {
      loadJourneyData();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [clientId, addNotification, user]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 604800)}w ago`;
    return formatDate(date);
  };

  // Get all comments for recent comments section
  const getAllRecentComments = () => {
    const allComments: (Comment & { eventTitle: string })[] = [];

    Object.entries(comments).forEach(([eventId, eventComments]) => {
      const event = events.find((e) => e.id === eventId);
      if (event && eventComments.length > 0) {
        eventComments.forEach((comment) => {
          allComments.push({
            ...comment,
            eventTitle: event.title,
          });
        });
      }
    });

    return allComments
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 5); // Show only 5 most recent comments
  };

  const getTagColor = (topic: string) => {
    const colors = {
      housing: "bg-blue-100 text-blue-800",
      employment: "bg-green-100 text-green-800",
      financial: "bg-yellow-100 text-yellow-800",
      health: "bg-red-100 text-red-800",
      education: "bg-purple-100 text-purple-800",
      support: "bg-indigo-100 text-indigo-800",
      default: "bg-gray-100 text-gray-800",
    };
    return colors[topic.toLowerCase() as keyof typeof colors] || colors.default;
  };

  if (events.length === 0) {
    return (
      <div className="w-full space-y-6">
        {/* Header Section */}
        {client && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.name}`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {client.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("") || "CL"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {client.name || "Client"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {client.supportProgram || "Housing Support Program"}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleAddInteraction}
                className="rounded-full px-6 py-2 bg-primary hover:bg-primary/90"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Interaction
              </Button>
            </div>
          </div>
        )}

        <Card className="w-full">
          <CardContent className="pt-6">
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
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      {client && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${client.name}`}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {client.name
                    ?.split(" ")
                    .map((n: string) => n[0])
                    .join("") || "CL"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {client.name || "Client"}
                </h2>
                <p className="text-sm text-gray-500">
                  {client.supportProgram || "Housing Support Program"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleAddInteraction}
              className="rounded-full px-6 py-2 bg-primary hover:bg-primary/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Interaction
            </Button>
          </div>
        </div>
      )}

      {/* AI Recommendation Engine */}
      <div>
        <AIRecommendationEngine
          clientId={clientId}
          interactionData={events.filter(
            (e) => e.type === "check-in" || e.type === "meeting",
          )}
          onRecommendationSelect={(recommendation) => {
            console.log("Selected recommendation:", recommendation);
            addNotification({
              type: "info",
              title: "AI Recommendation",
              message: recommendation,
              priority: "medium",
            });
          }}
        />
      </div>

      {/* Interaction List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Interactions
          </h3>
        </div>
        <div className="divide-y">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start space-x-4">
                {/* Green status dot */}
                <div className="flex-shrink-0 mt-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 mb-1">
                        {event.title}
                      </h4>
                      {showDetails && event.description && (
                        <p className="text-sm text-gray-600 mb-3">
                          {event.description}
                        </p>
                      )}
                      {event.topics && event.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {event.topics.map((topic, i) => (
                            <span
                              key={i}
                              className={`px-3 py-1 text-xs font-medium rounded-full ${getTagColor(topic)}`}
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <span className="text-sm text-gray-500">
                        {formatRelativeTime(event.date)}
                      </span>
                    </div>
                  </div>

                  {!compact && (
                    <div className="mt-4">
                      {/* Display existing comments */}
                      {comments[event.id] && comments[event.id].length > 0 && (
                        <div className="space-y-3 mb-4 bg-gray-50 p-4 rounded-lg">
                          <h5 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" /> Comments
                          </h5>
                          {comments[event.id].map((comment) => (
                            <div
                              key={comment.id}
                              className="flex items-start gap-3"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.author
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}`}
                                />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {comment.author.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {comment.author}
                                  </p>
                                  <span className="text-xs text-gray-500">
                                    {formatRelativeTime(
                                      new Date(comment.timestamp),
                                    )}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">
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
                                                className="bg-blue-100 text-blue-800 font-medium rounded px-1"
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
            </div>
          ))}
        </div>
      </div>

      {/* Recent Comments Section */}
      {!compact && getAllRecentComments().length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Comments
            </h3>
          </div>
          <div className="divide-y">
            {getAllRecentComments().map((comment) => (
              <div
                key={`${comment.id}-recent`}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}`}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {comment.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {comment.author}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(new Date(comment.timestamp))}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        on {comment.eventTitle}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {comment.mentions && comment.mentions.length > 0 ? (
                        <>
                          {comment.text.split(/(@[\w\s]+)/).map((part, i) => {
                            const mentionMatch = part.match(/@([\w\s]+)/);
                            if (mentionMatch) {
                              return (
                                <span
                                  key={i}
                                  className="bg-blue-100 text-blue-800 font-medium rounded px-1"
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyTimeline;
