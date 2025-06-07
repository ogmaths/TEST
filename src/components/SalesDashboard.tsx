import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

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

const SalesDashboard = () => {
  const { user } = useUser();
  const { t } = useTranslation();
  const [showAddLeadDialog, setShowAddLeadDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
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
    },
  ]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Only return early if dropped in the exact same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const leadId = parseInt(draggableId);
    const newStage = destination.droppableId;

    // Update the lead's stage
    setLeads((prevLeads) => {
      const updatedLeads = [...prevLeads];
      const leadIndex = updatedLeads.findIndex((lead) => lead.id === leadId);

      if (leadIndex !== -1) {
        // Update the stage
        updatedLeads[leadIndex] = {
          ...updatedLeads[leadIndex],
          stage: newStage,
        };
      }

      return updatedLeads;
    });

    // In a real application, you would also update the database here
    // Example: await updateLeadStage(leadId, newStage);
    console.log(`Lead ${leadId} moved to stage: ${newStage}`);
  };

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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const LeadCard = ({ lead, index }: { lead: Lead; index: number }) => (
    <Draggable draggableId={lead.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "mb-3 transition-all duration-200",
            snapshot.isDragging && "rotate-2 shadow-lg",
          )}
        >
          <Card className="hover:shadow-md transition-shadow cursor-move bg-white">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header with name and status */}
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-sm truncate pr-2">
                    {lead.lead_name}
                  </h4>
                  <Badge
                    className={cn(
                      "text-xs",
                      STAGES[lead.stage as keyof typeof STAGES]?.color,
                    )}
                  >
                    {STAGES[lead.stage as keyof typeof STAGES]?.label}
                  </Badge>
                </div>

                {/* Organization */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  <span className="truncate">{lead.organization_name}</span>
                </div>

                {/* Contact info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{lead.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span>{lead.phone}</span>
                  </div>
                </div>

                {/* Value */}
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3 w-3 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(lead.value)}
                  </span>
                </div>

                {/* Notes */}
                {lead.notes && (
                  <p className="text-xs text-muted-foreground bg-muted p-2 rounded text-wrap break-words">
                    {lead.notes}
                  </p>
                )}

                {/* Last contact */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Created: {formatDate(lead.created_at)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLead(lead);
                      setShowEditDialog(true);
                    }}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLead(lead.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-border flex flex-col">
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
              className="w-full justify-start text-left font-medium bg-primary/10 text-primary"
            >
              <Users className="mr-3 h-4 w-4" />
              My Leads
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left"
              onClick={() => setShowAddLeadDialog(true)}
            >
              <Plus className="mr-3 h-4 w-4" />
              Add Lead
            </Button>
            <Button variant="ghost" className="w-full justify-start text-left">
              <TrendingUp className="mr-3 h-4 w-4" />
              Performance
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
          {/* Header */}
          <div className="p-6 border-b border-border bg-white">
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

          {/* Kanban Board */}
          <div className="flex-1 overflow-x-auto p-6">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="flex gap-6 min-w-max">
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

                        {/* Droppable Area */}
                        <Droppable droppableId={stageKey}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={cn(
                                "min-h-[200px] transition-colors",
                                snapshot.isDraggingOver &&
                                  "bg-primary/5 rounded-lg",
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
            </DragDropContext>
          </div>
        </div>
      </div>

      {/* Add Lead Dialog */}
      <Dialog open={showAddLeadDialog} onOpenChange={setShowAddLeadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>
              Add a new lead to your sales pipeline
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lead-name">Lead Name *</Label>
                <Input
                  id="lead-name"
                  value={newLead.lead_name}
                  onChange={(e) =>
                    setNewLead({ ...newLead, lead_name: e.target.value })
                  }
                  placeholder="Enter lead name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-email">Email *</Label>
                <Input
                  id="lead-email"
                  type="email"
                  value={newLead.email}
                  onChange={(e) =>
                    setNewLead({ ...newLead, email: e.target.value })
                  }
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lead-phone">Phone</Label>
                <Input
                  id="lead-phone"
                  value={newLead.phone}
                  onChange={(e) =>
                    setNewLead({ ...newLead, phone: e.target.value })
                  }
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-organization">Organization</Label>
                <Input
                  id="lead-organization"
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lead-stage">Stage</Label>
                <Select
                  value={newLead.stage}
                  onValueChange={(value) =>
                    setNewLead({ ...newLead, stage: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STAGES).map(([key, stage]) => (
                      <SelectItem key={key} value={key}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-value">Value ($)</Label>
                <Input
                  id="lead-value"
                  type="number"
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
              <Label htmlFor="lead-notes">Notes</Label>
              <Textarea
                id="lead-notes"
                value={newLead.notes}
                onChange={(e) =>
                  setNewLead({ ...newLead, notes: e.target.value })
                }
                placeholder="Enter any notes about this lead"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddLeadDialog(false)}
            >
              Cancel
            </Button>
            <Button
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>Update lead information</DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-lead-name">Lead Name *</Label>
                  <Input
                    id="edit-lead-name"
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
                  <Label htmlFor="edit-lead-email">Email *</Label>
                  <Input
                    id="edit-lead-email"
                    type="email"
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-lead-phone">Phone</Label>
                  <Input
                    id="edit-lead-phone"
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
                  <Label htmlFor="edit-lead-organization">Organization</Label>
                  <Input
                    id="edit-lead-organization"
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-lead-stage">Stage</Label>
                  <Select
                    value={selectedLead.stage}
                    onValueChange={(value) =>
                      setSelectedLead({ ...selectedLead, stage: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STAGES).map(([key, stage]) => (
                        <SelectItem key={key} value={key}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lead-value">Value ($)</Label>
                  <Input
                    id="edit-lead-value"
                    type="number"
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
                <Label htmlFor="edit-lead-notes">Notes</Label>
                <Textarea
                  id="edit-lead-notes"
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
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
