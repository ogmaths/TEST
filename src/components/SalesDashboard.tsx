import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Phone,
  Mail,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Building2,
  User,
  BarChart3,
  Clock,
  Award,
  Menu,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface Lead {
  id: number;
  lead_name: string;
  email: string;
  phone: string;
  organization_name: string;
  stage: string;
  next_action: string;
  next_action_date: string;
  notes: string;
  value: number;
  assigned_to: string;
  created_at: string;
  source: string;
}

const STAGES = {
  uncontacted: { label: "Uncontacted", color: "bg-gray-100 text-gray-800" },
  contacted: { label: "Contacted", color: "bg-blue-100 text-blue-800" },
  demo_booked: { label: "Demo Booked", color: "bg-yellow-100 text-yellow-800" },
  proposal_sent: {
    label: "Proposal Sent",
    color: "bg-purple-100 text-purple-800",
  },
  closed_won: { label: "Closed-Won", color: "bg-green-100 text-green-800" },
  closed_lost: { label: "Closed-Lost", color: "bg-red-100 text-red-800" },
};

const SOURCES = {
  linkedin: { label: "LinkedIn" },
  companies_house: {
    label: "Companies House",
  },
  directory: { label: "Directory" },
  google: { label: "Google" },
  chatgpt: { label: "ChatGPT" },
  referral: { label: "Referral" },
  website_form: { label: "Website Form" },
};

const SalesDashboard = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const [showAddLeadDialog, setShowAddLeadDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedLeadCards, setExpandedLeadCards] = useState<Set<number>>(
    new Set(),
  );
  const [newLead, setNewLead] = useState({
    lead_name: "",
    email: "",
    phone: "",
    organization_name: "",
    stage: "uncontacted",
    next_action: "",
    next_action_date: "",
    notes: "",
    value: 0,
    source: "linkedin",
  });

  // Sample leads data - in a real app, this would come from Supabase
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      lead_name: "John Smith",
      email: "john@techcorp.com",
      phone: "+1 (555) 123-4567",
      organization_name: "Tech Corp",
      stage: "contacted",
      next_action: "Follow up call",
      next_action_date: "2024-01-20",
      notes: "Interested in premium package",
      value: 15000,
      assigned_to: user?.id || "current_user",
      created_at: "2024-01-15T10:00:00Z",
      source: "linkedin",
    },
    {
      id: 2,
      lead_name: "Sarah Johnson",
      email: "sarah@startup.io",
      phone: "+1 (555) 987-6543",
      organization_name: "Startup Inc",
      stage: "demo_booked",
      next_action: "Product demo",
      next_action_date: "2024-01-22",
      notes: "Scheduled demo for next week",
      value: 8500,
      assigned_to: user?.id || "current_user",
      created_at: "2024-01-14T14:30:00Z",
      source: "referral",
    },
    {
      id: 3,
      lead_name: "Mike Davis",
      email: "mike@enterprise.com",
      phone: "+1 (555) 456-7890",
      organization_name: "Enterprise Solutions",
      stage: "proposal_sent",
      next_action: "Follow up on proposal",
      next_action_date: "2024-01-25",
      notes: "Proposal sent, awaiting response",
      value: 25000,
      assigned_to: user?.id || "current_user",
      created_at: "2024-01-13T09:15:00Z",
      source: "google",
    },
    {
      id: 4,
      lead_name: "Lisa Chen",
      email: "lisa@innovate.com",
      phone: "+1 (555) 321-9876",
      organization_name: "Innovate Co",
      stage: "uncontacted",
      next_action: "Initial outreach",
      next_action_date: "2024-01-18",
      notes: "New lead from website form",
      value: 12000,
      assigned_to: user?.id || "current_user",
      created_at: "2024-01-16T16:45:00Z",
      source: "website_form",
    },
    {
      id: 5,
      lead_name: "Robert Wilson",
      email: "robert@growth.com",
      phone: "+1 (555) 654-3210",
      organization_name: "Growth Partners",
      stage: "closed_won",
      next_action: "Onboarding",
      next_action_date: "2024-01-30",
      notes: "Deal closed successfully",
      value: 18000,
      assigned_to: user?.id || "current_user",
      created_at: "2024-01-10T11:20:00Z",
      source: "directory",
    },
  ]);

  const handleAddLead = () => {
    if (!newLead.lead_name || !newLead.email) return;

    const leadObj: Lead = {
      id: Date.now(),
      ...newLead,
      assigned_to: user?.id || "current_user",
      created_at: new Date().toISOString(),
    };

    setLeads([...leads, leadObj]);
    setNewLead({
      lead_name: "",
      email: "",
      phone: "",
      organization_name: "",
      stage: "uncontacted",
      next_action: "",
      next_action_date: "",
      notes: "",
      value: 0,
      source: "linkedin",
    });
    setShowAddLeadDialog(false);
  };

  const handleEditLead = () => {
    if (!selectedLead) return;

    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === selectedLead.id ? { ...selectedLead } : lead,
      ),
    );
    setShowEditDialog(false);
    setSelectedLead(null);
  };

  const handleDeleteLead = (leadId: number) => {
    setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== leadId));
  };

  const getLeadsByStage = (stage: string) => {
    return leads.filter((lead) => lead.stage === stage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    const leadId = parseInt(draggableId);
    const newStage = destination.droppableId;

    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId ? { ...lead, stage: newStage } : lead,
      ),
    );
  };

  const getTopSource = () => {
    const closedWonLeads = leads.filter((lead) => lead.stage === "closed_won");
    if (closedWonLeads.length === 0) return { source: "N/A", count: 0 };

    const sourceCounts = closedWonLeads.reduce(
      (acc, lead) => {
        acc[lead.source] = (acc[lead.source] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topSource = Object.entries(sourceCounts).reduce((a, b) =>
      sourceCounts[a[0]] > sourceCounts[b[0]] ? a : b,
    );

    return {
      source:
        SOURCES[topSource[0] as keyof typeof SOURCES]?.label || topSource[0],
      count: topSource[1],
    };
  };

  const getAverageTimeToClose = () => {
    const closedWonLeads = leads.filter((lead) => lead.stage === "closed_won");
    if (closedWonLeads.length === 0) return 0;

    const totalDays = closedWonLeads.reduce((sum, lead) => {
      const createdDate = new Date(lead.created_at);
      const closedDate = new Date(); // In real app, this would be the actual close date
      const daysDiff = Math.floor(
        (closedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      return sum + daysDiff;
    }, 0);

    return Math.round(totalDays / closedWonLeads.length);
  };

  const toggleLeadExpansion = (leadId: number) => {
    const newExpanded = new Set(expandedLeadCards);
    if (newExpanded.has(leadId)) {
      newExpanded.delete(leadId);
    } else {
      newExpanded.add(leadId);
    }
    setExpandedLeadCards(newExpanded);
  };

  const LeadCard = ({ lead, index }: { lead: Lead; index: number }) => {
    const isExpanded = expandedLeadCards.has(lead.id);

    return (
      <Draggable draggableId={lead.id.toString()} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="mb-3"
          >
            <Card
              className={cn(
                "hover:shadow-md transition-shadow bg-white",
                snapshot.isDragging && "shadow-lg rotate-2",
              )}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                  {/* Header with name, status, and expand button */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm sm:text-base truncate pr-2">
                        {lead.lead_name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={cn(
                            "text-xs",
                            STAGES[lead.stage as keyof typeof STAGES]?.color,
                          )}
                        >
                          {STAGES[lead.stage as keyof typeof STAGES]?.label}
                        </Badge>
                        <Badge className="text-xs">
                          {SOURCES[lead.source as keyof typeof SOURCES]?.label}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 sm:hidden"
                      onClick={() => toggleLeadExpansion(lead.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Value - Always visible */}
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm sm:text-base font-medium text-green-600">
                      {formatCurrency(lead.value)}
                    </span>
                  </div>

                  {/* Collapsible content on mobile, always visible on desktop */}
                  <div
                    className={cn(
                      "space-y-2 sm:space-y-3",
                      "sm:block", // Always show on desktop
                      isExpanded ? "block" : "hidden sm:block", // Show/hide on mobile based on expansion
                    )}
                  >
                    {/* Organization */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span className="truncate">{lead.organization_name}</span>
                    </div>

                    {/* Contact info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>

                    {/* Notes */}
                    {lead.notes && (
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded text-wrap break-words">
                        {lead.notes}
                      </p>
                    )}

                    {/* Last contact */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Created: {formatDate(lead.created_at)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-11 px-3 text-sm min-w-[44px]" // Increased touch target
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                          setShowEditDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-11 px-3 text-sm text-red-500 hover:text-red-700 min-w-[44px]" // Increased touch target
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLead(lead.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-11 w-11 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <SheetTitle className="text-lg font-bold">
                        OGSTAT
                      </SheetTitle>
                      <SheetDescription className="text-xs">
                        CRM
                      </SheetDescription>
                    </div>
                  </div>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left h-12"
                    onClick={() => {
                      setShowAddLeadDialog(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Plus className="mr-3 h-5 w-5" />
                    Add Lead
                  </Button>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user?.name || "Sales Rep"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Sales Team
                      </p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg">OGSTAT</h1>
                <p className="text-xs text-muted-foreground">CRM</p>
              </div>
            </div>
          </div>

          <Button
            variant="default"
            size="sm"
            className="h-11 px-4"
            onClick={() => setShowAddLeadDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-64 bg-white border-r border-border flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg">OGSTAT</h1>
                <p className="text-xs text-muted-foreground">CRM</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-left h-12"
                onClick={() => setShowAddLeadDialog(true)}
              >
                <Plus className="mr-3 h-5 w-5" />
                Add Lead
              </Button>
            </div>
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.name || "Sales Rep"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Sales Team
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Desktop Header */}
            <div className="hidden lg:block p-6 border-b border-border bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Sales Pipeline</h2>
                  <p className="text-muted-foreground">
                    Manage your leads and opportunities
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold">{leads.length}</p>
                    <p className="text-sm text-muted-foreground">Total Leads</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {formatCurrency(
                        leads.reduce((sum, lead) => sum + lead.value, 0),
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Pipeline Value
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Stats */}
            <div className="lg:hidden p-4 bg-white border-b border-border">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-xl font-bold">{leads.length}</p>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                </div>
                <div className="text-center p-3 bg-muted/30 rounded-lg">
                  <p className="text-xl font-bold">
                    {formatCurrency(
                      leads.reduce((sum, lead) => sum + lead.value, 0),
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Pipeline Value
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content Tabs */}
            <div className="flex-1 overflow-hidden p-3 sm:p-6">
              <Tabs defaultValue="pipeline" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2 max-w-md h-12">
                  <TabsTrigger
                    value="pipeline"
                    className="flex items-center gap-2 h-11 text-sm"
                  >
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">My Leads</span>
                    <span className="sm:hidden">Leads</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="performance"
                    className="flex items-center gap-2 h-11 text-sm"
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Performance</span>
                    <span className="sm:hidden">Stats</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pipeline" className="flex-1 mt-6">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    {/* Desktop Kanban View */}
                    <div className="hidden lg:flex gap-6 overflow-x-auto">
                      {Object.entries(STAGES).map(([stageKey, stageInfo]) => {
                        const stageLeads = getLeadsByStage(stageKey);
                        return (
                          <div key={stageKey} className="w-80 flex-shrink-0">
                            <div className="bg-muted/30 rounded-lg p-4 h-full">
                              {/* Column Header */}
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-sm">
                                  {stageInfo.label}
                                </h3>
                                <Badge variant="secondary" className="text-xs">
                                  {stageLeads.length}
                                </Badge>
                              </div>

                              {/* Leads List */}
                              <Droppable droppableId={stageKey}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={cn(
                                      "min-h-[200px] transition-colors",
                                      snapshot.isDraggingOver &&
                                        "bg-muted/50 rounded-md",
                                    )}
                                  >
                                    {stageLeads.map((lead, index) => (
                                      <LeadCard
                                        key={lead.id}
                                        lead={lead}
                                        index={index}
                                      />
                                    ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Mobile Accordion View */}
                    <div className="lg:hidden space-y-4">
                      <Accordion type="multiple" className="w-full">
                        {Object.entries(STAGES).map(([stageKey, stageInfo]) => {
                          const stageLeads = getLeadsByStage(stageKey);
                          return (
                            <AccordionItem key={stageKey} value={stageKey}>
                              <AccordionTrigger className="text-base font-semibold">
                                <div className="flex items-center justify-between w-full pr-4">
                                  <span>{stageInfo.label}</span>
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {stageLeads.length}
                                  </Badge>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <Droppable droppableId={stageKey}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className={cn(
                                        "space-y-3 p-2",
                                        snapshot.isDraggingOver &&
                                          "bg-muted/50 rounded-md",
                                      )}
                                    >
                                      {stageLeads.map((lead, index) => (
                                        <LeadCard
                                          key={lead.id}
                                          lead={lead}
                                          index={index}
                                        />
                                      ))}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    </div>
                  </DragDropContext>
                </TabsContent>

                <TabsContent value="performance" className="flex-1 mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {/* Top Source */}
                    <Card className="bg-white">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                            <Award className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-muted-foreground">
                              Top Source
                            </p>
                            <p className="text-lg sm:text-2xl font-bold truncate">
                              {getTopSource().source}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getTopSource().count} closed deals
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Time to Close */}
                    <Card className="bg-white">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-muted-foreground">
                              Avg Time to Close
                            </p>
                            <p className="text-lg sm:text-2xl font-bold">
                              {getAverageTimeToClose()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              days
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Total Pipeline Value */}
                    <Card className="bg-white">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                            <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-muted-foreground">
                              Pipeline Value
                            </p>
                            <p className="text-lg sm:text-2xl font-bold truncate">
                              {formatCurrency(
                                leads.reduce(
                                  (sum, lead) => sum + lead.value,
                                  0,
                                ),
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              total value
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Conversion Rate */}
                    <Card className="bg-white">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
                            <Target className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-muted-foreground">
                              Conversion Rate
                            </p>
                            <p className="text-lg sm:text-2xl font-bold">
                              {leads.length > 0
                                ? Math.round(
                                    (leads.filter(
                                      (l) => l.stage === "closed_won",
                                    ).length /
                                      leads.length) *
                                      100,
                                  )
                                : 0}
                              %
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {
                                leads.filter((l) => l.stage === "closed_won")
                                  .length
                              }{" "}
                              of {leads.length} leads
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Performance Charts */}
                  <div className="space-y-6">
                    {/* Mobile: Stack cards vertically, Desktop: Side by side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <Card className="bg-white">
                        <CardHeader className="p-4 sm:p-6">
                          <CardTitle className="text-base sm:text-lg">
                            Lead Sources Performance
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Breakdown of leads by source and their success rates
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0">
                          <Accordion
                            type="single"
                            collapsible
                            className="lg:hidden"
                          >
                            <AccordionItem value="sources">
                              <AccordionTrigger className="text-sm font-medium">
                                View Source Details
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-3">
                                  {Object.entries(SOURCES).map(
                                    ([sourceKey, sourceInfo]) => {
                                      const sourceLeads = leads.filter(
                                        (l) => l.source === sourceKey,
                                      );
                                      const closedWon = sourceLeads.filter(
                                        (l) => l.stage === "closed_won",
                                      ).length;
                                      const conversionRate =
                                        sourceLeads.length > 0
                                          ? Math.round(
                                              (closedWon / sourceLeads.length) *
                                                100,
                                            )
                                          : 0;

                                      return (
                                        <div
                                          key={sourceKey}
                                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                        >
                                          <div className="min-w-0 flex-1">
                                            <p className="font-medium text-sm truncate">
                                              {sourceInfo.label}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              {sourceLeads.length} leads •{" "}
                                              {closedWon} closed
                                            </p>
                                          </div>
                                          <div className="text-right ml-2">
                                            <p className="font-bold text-sm">
                                              {conversionRate}%
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              conversion
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    },
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>

                          <div className="hidden lg:block space-y-4">
                            {Object.entries(SOURCES).map(
                              ([sourceKey, sourceInfo]) => {
                                const sourceLeads = leads.filter(
                                  (l) => l.source === sourceKey,
                                );
                                const closedWon = sourceLeads.filter(
                                  (l) => l.stage === "closed_won",
                                ).length;
                                const conversionRate =
                                  sourceLeads.length > 0
                                    ? Math.round(
                                        (closedWon / sourceLeads.length) * 100,
                                      )
                                    : 0;

                                return (
                                  <div
                                    key={sourceKey}
                                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                  >
                                    <div>
                                      <p className="font-medium text-sm">
                                        {sourceInfo.label}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {sourceLeads.length} leads • {closedWon}{" "}
                                        closed
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-sm">
                                        {conversionRate}%
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        conversion
                                      </p>
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-white">
                        <CardHeader className="p-4 sm:p-6">
                          <CardTitle className="text-base sm:text-lg">
                            Pipeline Health
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Overview of your sales pipeline stages
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0">
                          <Accordion
                            type="single"
                            collapsible
                            className="lg:hidden"
                          >
                            <AccordionItem value="pipeline">
                              <AccordionTrigger className="text-sm font-medium">
                                View Pipeline Details
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-3">
                                  {Object.entries(STAGES).map(
                                    ([stageKey, stageInfo]) => {
                                      const stageLeads =
                                        getLeadsByStage(stageKey);
                                      const stageValue = stageLeads.reduce(
                                        (sum, lead) => sum + lead.value,
                                        0,
                                      );

                                      return (
                                        <div
                                          key={stageKey}
                                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                        >
                                          <div className="min-w-0 flex-1">
                                            <p className="font-medium text-sm truncate">
                                              {stageInfo.label}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              {stageLeads.length} leads
                                            </p>
                                          </div>
                                          <div className="text-right ml-2">
                                            <p className="font-bold text-sm truncate">
                                              {formatCurrency(stageValue)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                              value
                                            </p>
                                          </div>
                                        </div>
                                      );
                                    },
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>

                          <div className="hidden lg:block space-y-4">
                            {Object.entries(STAGES).map(
                              ([stageKey, stageInfo]) => {
                                const stageLeads = getLeadsByStage(stageKey);
                                const stageValue = stageLeads.reduce(
                                  (sum, lead) => sum + lead.value,
                                  0,
                                );

                                return (
                                  <div
                                    key={stageKey}
                                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                  >
                                    <div>
                                      <p className="font-medium text-sm">
                                        {stageInfo.label}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {stageLeads.length} leads
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-sm">
                                        {formatCurrency(stageValue)}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        value
                                      </p>
                                    </div>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Add Lead Dialog */}
      <Dialog open={showAddLeadDialog} onOpenChange={setShowAddLeadDialog}>
        <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Add New Lead
            </DialogTitle>
            <DialogDescription className="text-sm">
              Add a new lead to your sales pipeline
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lead-name" className="text-sm font-medium">
                  Lead Name *
                </Label>
                <Input
                  id="lead-name"
                  className="h-11 text-base" // Increased touch target
                  value={newLead.lead_name}
                  onChange={(e) =>
                    setNewLead({ ...newLead, lead_name: e.target.value })
                  }
                  placeholder="Enter lead name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-email" className="text-sm font-medium">
                  Email *
                </Label>
                <Input
                  id="lead-email"
                  type="email"
                  className="h-11 text-base" // Increased touch target
                  value={newLead.email}
                  onChange={(e) =>
                    setNewLead({ ...newLead, email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lead-phone" className="text-sm font-medium">
                  Phone
                </Label>
                <Input
                  id="lead-phone"
                  className="h-11 text-base" // Increased touch target
                  value={newLead.phone}
                  onChange={(e) =>
                    setNewLead({ ...newLead, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lead-organization"
                  className="text-sm font-medium"
                >
                  Organization
                </Label>
                <Input
                  id="lead-organization"
                  className="h-11 text-base" // Increased touch target
                  value={newLead.organization_name}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      organization_name: e.target.value,
                    })
                  }
                  placeholder="Enter organization name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lead-stage" className="text-sm font-medium">
                  Stage
                </Label>
                <Select
                  value={newLead.stage}
                  onValueChange={(value) =>
                    setNewLead({ ...newLead, stage: value })
                  }
                >
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STAGES).map(([key, stage]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        className="text-base py-3"
                      >
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-value" className="text-sm font-medium">
                  Value (£)
                </Label>
                <Input
                  id="lead-value"
                  type="number"
                  className="h-11 text-base" // Increased touch target
                  value={newLead.value}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      value: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="Enter deal value"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-source" className="text-sm font-medium">
                Source
              </Label>
              <Select
                value={newLead.source}
                onValueChange={(value) =>
                  setNewLead({ ...newLead, source: value })
                }
              >
                <SelectTrigger className="h-11 text-base">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SOURCES).map(([key, source]) => (
                    <SelectItem
                      key={key}
                      value={key}
                      className="text-base py-3"
                    >
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-notes" className="text-sm font-medium">
                Notes
              </Label>
              <Textarea
                id="lead-notes"
                className="min-h-[80px] text-base" // Increased touch target
                value={newLead.notes}
                onChange={(e) =>
                  setNewLead({ ...newLead, notes: e.target.value })
                }
                placeholder="Enter any notes about this lead"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="h-11 text-base w-full sm:w-auto" // Increased touch target
              onClick={() => setShowAddLeadDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-11 text-base w-full sm:w-auto" // Increased touch target
              onClick={handleAddLead}
              disabled={!newLead.lead_name || !newLead.email}
            >
              Add Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Lead Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit Lead</DialogTitle>
            <DialogDescription className="text-sm">
              Update lead information
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-lead-name"
                    className="text-sm font-medium"
                  >
                    Lead Name *
                  </Label>
                  <Input
                    id="edit-lead-name"
                    className="h-11 text-base" // Increased touch target
                    value={selectedLead.lead_name}
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        lead_name: e.target.value,
                      })
                    }
                    placeholder="Enter lead name"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-lead-email"
                    className="text-sm font-medium"
                  >
                    Email *
                  </Label>
                  <Input
                    id="edit-lead-email"
                    type="email"
                    className="h-11 text-base" // Increased touch target
                    value={selectedLead.email}
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        email: e.target.value,
                      })
                    }
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-lead-phone"
                    className="text-sm font-medium"
                  >
                    Phone
                  </Label>
                  <Input
                    id="edit-lead-phone"
                    className="h-11 text-base" // Increased touch target
                    value={selectedLead.phone}
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        phone: e.target.value,
                      })
                    }
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-lead-organization"
                    className="text-sm font-medium"
                  >
                    Organization
                  </Label>
                  <Input
                    id="edit-lead-organization"
                    className="h-11 text-base" // Increased touch target
                    value={selectedLead.organization_name}
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        organization_name: e.target.value,
                      })
                    }
                    placeholder="Enter organization name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-lead-stage"
                    className="text-sm font-medium"
                  >
                    Stage
                  </Label>
                  <Select
                    value={selectedLead.stage}
                    onValueChange={(value) =>
                      setSelectedLead({ ...selectedLead, stage: value })
                    }
                  >
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STAGES).map(([key, stage]) => (
                        <SelectItem
                          key={key}
                          value={key}
                          className="text-base py-3"
                        >
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-lead-value"
                    className="text-sm font-medium"
                  >
                    Value (£)
                  </Label>
                  <Input
                    id="edit-lead-value"
                    type="number"
                    className="h-11 text-base" // Increased touch target
                    value={selectedLead.value}
                    onChange={(e) =>
                      setSelectedLead({
                        ...selectedLead,
                        value: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Enter deal value"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-lead-source"
                  className="text-sm font-medium"
                >
                  Source
                </Label>
                <Select
                  value={selectedLead.source}
                  onValueChange={(value) =>
                    setSelectedLead({ ...selectedLead, source: value })
                  }
                >
                  <SelectTrigger className="h-11 text-base">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SOURCES).map(([key, source]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        className="text-base py-3"
                      >
                        {source.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="edit-lead-notes"
                  className="text-sm font-medium"
                >
                  Notes
                </Label>
                <Textarea
                  id="edit-lead-notes"
                  className="min-h-[80px] text-base" // Increased touch target
                  value={selectedLead.notes}
                  onChange={(e) =>
                    setSelectedLead({ ...selectedLead, notes: e.target.value })
                  }
                  placeholder="Enter any notes about this lead"
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="h-11 text-base w-full sm:w-auto" // Increased touch target
              onClick={() => setShowEditDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="h-11 text-base w-full sm:w-auto" // Increased touch target
              onClick={handleEditLead}
              disabled={!selectedLead?.lead_name || !selectedLead?.email}
            >
              Update Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesDashboard;
