import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNotifications } from "@/context/NotificationContext";
import { Plus, Edit, Trash2, FileText, Copy } from "lucide-react";
import { AssessmentTemplate, AssessmentSection } from "@/types/admin";

const AssessmentBuilder = () => {
  const { addNotification } = useNotifications();
  const [assessmentTemplates, setAssessmentTemplates] = useState<
    AssessmentTemplate[]
  >([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [templateToDelete, setTemplateToDelete] =
    useState<AssessmentTemplate | null>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<AssessmentTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [templateFormData, setTemplateFormData] = useState({
    name: "",
    description: "",
    type: "introduction",
    sector: "",
    defaultDueInDays: "7",
    isRequired: true,
    isActive: true,
    sections: [
      {
        title: "General Information",
        questions: [
          {
            id: "1",
            text: "Sample question",
            type: "text",
            required: true,
            options: [],
          },
        ],
      },
    ],
  });

  // Load assessment templates from localStorage
  useEffect(() => {
    const savedTemplates = localStorage.getItem("assessmentTemplates");
    if (savedTemplates) {
      try {
        setAssessmentTemplates(JSON.parse(savedTemplates));
      } catch (error) {
        console.error("Failed to parse saved assessment templates", error);
      }
    } else {
      // Initialize with default templates if none exist
      const defaultTemplates: AssessmentTemplate[] = [
        {
          id: "intro-assessment",
          name: "Introduction Assessment",
          description: "Initial assessment for new clients",
          type: "introduction",
          defaultDueInDays: 7,
          isRequired: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sections: [
            {
              title: "Personal Information",
              questions: [
                {
                  id: "q1",
                  text: "How would you describe your current situation?",
                  type: "textarea",
                  required: true,
                  options: [],
                },
                {
                  id: "q2",
                  text: "What are your main goals for seeking support?",
                  type: "textarea",
                  required: true,
                  options: [],
                },
              ],
            },
          ],
        },
        {
          id: "progress-assessment",
          name: "Progress Assessment",
          description: "Regular check-in assessment",
          type: "progress",
          defaultDueInDays: 30,
          isRequired: false,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sections: [
            {
              title: "Progress Review",
              questions: [
                {
                  id: "q1",
                  text: "How would you rate your progress since the last assessment?",
                  type: "select",
                  required: true,
                  options: ["Excellent", "Good", "Fair", "Poor"],
                },
                {
                  id: "q2",
                  text: "What challenges have you faced since the last assessment?",
                  type: "textarea",
                  required: true,
                  options: [],
                },
              ],
            },
          ],
        },
        {
          id: "exit-assessment",
          name: "Exit Assessment",
          description: "Final assessment when client completes program",
          type: "exit",
          defaultDueInDays: 0,
          isRequired: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sections: [
            {
              title: "Program Completion",
              questions: [
                {
                  id: "q1",
                  text: "How satisfied are you with the support you received?",
                  type: "select",
                  required: true,
                  options: [
                    "Very Satisfied",
                    "Satisfied",
                    "Neutral",
                    "Dissatisfied",
                    "Very Dissatisfied",
                  ],
                },
                {
                  id: "q2",
                  text: "What aspects of the program were most helpful to you?",
                  type: "textarea",
                  required: true,
                  options: [],
                },
              ],
            },
          ],
        },
        {
          id: "perinatal-bonding-assessment",
          name: 'Perinatal Wellbeing – "New Baby" Bonding Scale',
          description: "Evaluate early bonding between parent and baby.",
          type: "perinatal",
          defaultDueInDays: 10,
          isRequired: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sections: [
            {
              title: "Bonding Feelings",
              questions: [
                {
                  id: "q1",
                  text: "I feel close to my baby.",
                  type: "select",
                  required: true,
                  options: ["1", "2", "3", "4", "5"],
                },
                {
                  id: "q2",
                  text: "I enjoy spending time with my baby.",
                  type: "select",
                  required: true,
                  options: ["1", "2", "3", "4", "5"],
                },
                {
                  id: "q3",
                  text: "I feel confident in caring for my baby.",
                  type: "select",
                  required: true,
                  options: ["1", "2", "3", "4", "5"],
                },
                {
                  id: "q4",
                  text: "I feel irritated with my baby.",
                  type: "select",
                  required: true,
                  options: ["1", "2", "3", "4", "5"],
                },
                {
                  id: "q5",
                  text: "I feel affectionate toward my baby.",
                  type: "select",
                  required: true,
                  options: ["1", "2", "3", "4", "5"],
                },
              ],
            },
          ],
        },
        {
          id: "dash-risk-checklist",
          name: "Domestic Abuse – DASH Risk Checklist",
          description:
            "Domestic Abuse Stalking and Honour-Based Violence risk assessment.",
          type: "risk",
          defaultDueInDays: 5,
          isRequired: true,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sections: [
            {
              title: "Risk Indicators",
              questions: [
                {
                  id: "q1",
                  text: "Has the current incident resulted in injury?",
                  type: "radio",
                  required: true,
                  options: ["Yes", "No"],
                },
                {
                  id: "q2",
                  text: "Is the victim frightened?",
                  type: "radio",
                  required: true,
                  options: ["Yes", "No"],
                },
                {
                  id: "q3",
                  text: "Are you feeling isolated from family/friends?",
                  type: "radio",
                  required: true,
                  options: ["Yes", "No"],
                },
                {
                  id: "q4",
                  text: "Are there any children or dependants?",
                  type: "radio",
                  required: true,
                  options: ["Yes", "No"],
                },
                {
                  id: "q5",
                  text: "Has the abuser threatened to harm you or someone else?",
                  type: "radio",
                  required: true,
                  options: ["Yes", "No"],
                },
                {
                  id: "q6",
                  text: "Is there any history of stalking or harassment?",
                  type: "radio",
                  required: true,
                  options: ["Yes", "No"],
                },
                {
                  id: "q7",
                  text: "Is the victim experiencing financial control?",
                  type: "radio",
                  required: true,
                  options: ["Yes", "No"],
                },
                {
                  id: "q8",
                  text: "Has the victim ever been forced into sexual activity?",
                  type: "radio",
                  required: true,
                  options: ["Yes", "No"],
                },
                {
                  id: "q9",
                  text: "Has the victim tried to leave the relationship recently?",
                  type: "radio",
                  required: true,
                  options: ["Yes", "No"],
                },
                {
                  id: "q10",
                  text: "Does the victim believe the abuse is escalating?",
                  type: "radio",
                  required: true,
                  options: ["Yes", "No"],
                },
              ],
            },
          ],
        },
      ];

      setAssessmentTemplates(defaultTemplates);
      localStorage.setItem(
        "assessmentTemplates",
        JSON.stringify(defaultTemplates),
      );
    }
  }, []);

  const handleDeleteTemplate = (template: AssessmentTemplate) => {
    setTemplateToDelete(template);
    setShowDeleteDialog(true);
  };

  const confirmDeleteTemplate = () => {
    if (templateToDelete) {
      const updatedTemplates = assessmentTemplates.filter(
        (t) => t.id !== templateToDelete.id,
      );
      setAssessmentTemplates(updatedTemplates);
      localStorage.setItem(
        "assessmentTemplates",
        JSON.stringify(updatedTemplates),
      );
      setShowDeleteDialog(false);
      setTemplateToDelete(null);

      addNotification({
        type: "success",
        title: "Assessment Template Deleted",
        message: `${templateToDelete.name} has been deleted successfully`,
        priority: "high",
      });
    }
  };

  const handleEditTemplate = (template: AssessmentTemplate) => {
    setEditingTemplate(template);
    setTemplateFormData({
      name: template.name,
      description: template.description,
      type: template.type,
      sector: template.sector || "",
      defaultDueInDays: template.defaultDueInDays.toString(),
      isRequired: template.isRequired,
      isActive: template.isActive,
      sections: template.sections,
    });
    setShowTemplateDialog(true);
  };

  const handleDuplicateTemplate = (template: AssessmentTemplate) => {
    const newTemplate = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTemplates = [...assessmentTemplates, newTemplate];
    setAssessmentTemplates(updatedTemplates);
    localStorage.setItem(
      "assessmentTemplates",
      JSON.stringify(updatedTemplates),
    );

    addNotification({
      type: "success",
      title: "Assessment Template Duplicated",
      message: `${template.name} has been duplicated successfully`,
      priority: "medium",
    });
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setTemplateFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setTemplateFormData((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleTemplateFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedTemplate: AssessmentTemplate = {
      id: editingTemplate ? editingTemplate.id : `template-${Date.now()}`,
      name: templateFormData.name,
      description: templateFormData.description,
      type: templateFormData.type as
        | "introduction"
        | "progress"
        | "exit"
        | "custom"
        | "risk",
      sector: templateFormData.sector || undefined,
      defaultDueInDays: parseInt(templateFormData.defaultDueInDays) || 0,
      isRequired: templateFormData.isRequired,
      isActive: templateFormData.isActive,
      createdAt: editingTemplate
        ? editingTemplate.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: templateFormData.sections as AssessmentSection[],
    };

    let updatedTemplates;
    if (editingTemplate) {
      // Update existing template
      updatedTemplates = assessmentTemplates.map((t) =>
        t.id === editingTemplate.id ? formattedTemplate : t,
      );

      addNotification({
        type: "success",
        title: "Assessment Template Updated",
        message: `${formattedTemplate.name} has been updated successfully`,
        priority: "high",
      });
    } else {
      // Create new template
      updatedTemplates = [...assessmentTemplates, formattedTemplate];

      addNotification({
        type: "success",
        title: "Assessment Template Created",
        message: `${formattedTemplate.name} has been created successfully`,
        priority: "high",
      });
    }

    setAssessmentTemplates(updatedTemplates);
    localStorage.setItem(
      "assessmentTemplates",
      JSON.stringify(updatedTemplates),
    );

    // Reset form and close dialog
    setShowTemplateDialog(false);
    setEditingTemplate(null);
    setTemplateFormData({
      name: "",
      description: "",
      type: "introduction",
      defaultDueInDays: "7",
      isRequired: true,
      isActive: true,
      sections: [
        {
          title: "General Information",
          questions: [
            {
              id: "1",
              text: "Sample question",
              type: "text",
              required: true,
              options: [],
            },
          ],
        },
      ],
    });
  };

  const openNewTemplateForm = () => {
    setEditingTemplate(null);
    setTemplateFormData({
      name: "",
      description: "",
      type: "introduction",
      defaultDueInDays: "7",
      isRequired: true,
      isActive: true,
      sections: [
        {
          title: "General Information",
          questions: [
            {
              id: "1",
              text: "Sample question",
              type: "text",
              required: true,
              options: [],
            },
          ],
        },
      ],
    });
    setShowTemplateDialog(true);
  };

  const filteredTemplates = assessmentTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (template.sector &&
        template.sector.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "introduction":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
            Introduction
          </span>
        );
      case "progress":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
            Progress
          </span>
        );
      case "exit":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800">
            Exit
          </span>
        );
      case "custom":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
            Custom
          </span>
        );
      case "perinatal":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-pink-100 text-pink-800">
            Perinatal
          </span>
        );
      case "risk":
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
            Risk
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 bg-white">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Assessment Templates</CardTitle>
            <CardDescription>
              Manage assessment templates that can be assigned to clients
            </CardDescription>
          </div>
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openNewTemplateForm();
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Create Template
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              type="search"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-2 pl-4">Name</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Sector</th>
                  <th className="p-2">Default Due (Days)</th>
                  <th className="p-2">Required</th>
                  <th className="p-2">Status</th>
                  <th className="p-2 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <tr key={template.id} className="border-b">
                      <td className="p-2 pl-4 font-medium">
                        {template.name}
                        <div className="text-xs text-muted-foreground">
                          {template.description}
                        </div>
                      </td>
                      <td className="p-2">{getTypeBadge(template.type)}</td>
                      <td className="p-2">
                        {template.sector ? (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {template.sector.replace("-", " ")}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            -
                          </span>
                        )}
                      </td>
                      <td className="p-2">{template.defaultDueInDays}</td>
                      <td className="p-2">
                        {template.isRequired ? (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            Required
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800">
                            Optional
                          </span>
                        )}
                      </td>
                      <td className="p-2">
                        {template.isActive ? (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEditTemplate(template);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDuplicateTemplate(template);
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteTemplate(template);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-4 text-center text-muted-foreground"
                    >
                      No assessment templates found. Create your first template
                      by clicking the "Create Template" button.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Template Form Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate
                ? "Edit Assessment Template"
                : "Create Assessment Template"}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? "Update the assessment template details below"
                : "Fill in the details to create a new assessment template"}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[calc(90vh-180px)]">
            <form onSubmit={handleTemplateFormSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    placeholder="Assessment name"
                    value={templateFormData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of this assessment"
                    rows={2}
                    value={templateFormData.description}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Assessment Type</Label>
                  <Select
                    value={templateFormData.type}
                    onValueChange={(value) =>
                      setTemplateFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select assessment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="introduction">Introduction</SelectItem>
                      <SelectItem value="progress">Progress</SelectItem>
                      <SelectItem value="exit">Exit</SelectItem>
                      <SelectItem value="perinatal">Perinatal</SelectItem>
                      <SelectItem value="risk">Risk</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector">Sector</Label>
                  <Select
                    value={templateFormData.sector}
                    onValueChange={(value) =>
                      setTemplateFormData((prev) => ({
                        ...prev,
                        sector: value,
                      }))
                    }
                  >
                    <SelectTrigger id="sector">
                      <SelectValue placeholder="Select sector (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Sector</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="social-services">
                        Social Services
                      </SelectItem>
                      <SelectItem value="mental-health">
                        Mental Health
                      </SelectItem>
                      <SelectItem value="perinatal">Perinatal</SelectItem>
                      <SelectItem value="youth-services">
                        Youth Services
                      </SelectItem>
                      <SelectItem value="elderly-care">Elderly Care</SelectItem>
                      <SelectItem value="disability-services">
                        Disability Services
                      </SelectItem>
                      <SelectItem value="housing">Housing</SelectItem>
                      <SelectItem value="employment">Employment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultDueInDays">Default Due (Days)</Label>
                  <Input
                    id="defaultDueInDays"
                    type="number"
                    placeholder="Number of days until due"
                    value={templateFormData.defaultDueInDays}
                    onChange={handleFormChange}
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of days from assignment until the assessment is due
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isRequired"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={templateFormData.isRequired}
                    onChange={(e) =>
                      handleCheckboxChange("isRequired", e.target.checked)
                    }
                  />
                  <Label htmlFor="isRequired">Required Assessment</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={templateFormData.isActive}
                    onChange={(e) =>
                      handleCheckboxChange("isActive", e.target.checked)
                    }
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>

                <div className="space-y-4 border-t pt-4 mt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">
                      Assessment Sections & Questions
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTemplateFormData((prev) => ({
                          ...prev,
                          sections: [
                            ...prev.sections,
                            {
                              title: `Section ${prev.sections.length + 1}`,
                              questions: [],
                            },
                          ],
                        }));
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Section
                    </Button>
                  </div>

                  {templateFormData.sections.map((section, sectionIndex) => (
                    <div
                      key={sectionIndex}
                      className="border rounded-md p-4 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1 mr-4">
                          <Label htmlFor={`section-${sectionIndex}-title`}>
                            Section Title
                          </Label>
                          <Input
                            id={`section-${sectionIndex}-title`}
                            value={section.title}
                            onChange={(e) => {
                              const newSections = [
                                ...templateFormData.sections,
                              ];
                              newSections[sectionIndex].title = e.target.value;
                              setTemplateFormData((prev) => ({
                                ...prev,
                                sections: newSections,
                              }));
                            }}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newSections = [
                                ...templateFormData.sections,
                              ];
                              newSections[sectionIndex].questions.push({
                                id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                                text: "",
                                type: "text",
                                required: true,
                                options: [],
                              });
                              setTemplateFormData((prev) => ({
                                ...prev,
                                sections: newSections,
                              }));
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add Question
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              if (templateFormData.sections.length > 1) {
                                const newSections =
                                  templateFormData.sections.filter(
                                    (_, i) => i !== sectionIndex,
                                  );
                                setTemplateFormData((prev) => ({
                                  ...prev,
                                  sections: newSections,
                                }));
                              } else {
                                addNotification({
                                  type: "system",
                                  title: "Cannot Remove Section",
                                  message:
                                    "Assessment must have at least one section",
                                  priority: "medium",
                                });
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {section.questions.length === 0 ? (
                        <div className="text-center p-4 border border-dashed rounded-md">
                          <p className="text-sm text-muted-foreground">
                            No questions added yet. Click "Add Question" to
                            create one.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {section.questions.map((question, questionIndex) => (
                            <div
                              key={question.id}
                              className="border-l-4 border-l-primary/20 pl-4 py-2 space-y-4"
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-4 flex-1 mr-4">
                                  <div>
                                    <Label
                                      htmlFor={`question-${sectionIndex}-${questionIndex}-text`}
                                    >
                                      Question Text
                                    </Label>
                                    <Textarea
                                      id={`question-${sectionIndex}-${questionIndex}-text`}
                                      value={question.text}
                                      placeholder="Enter question text"
                                      onChange={(e) => {
                                        const newSections = [
                                          ...templateFormData.sections,
                                        ];
                                        newSections[sectionIndex].questions[
                                          questionIndex
                                        ].text = e.target.value;
                                        setTemplateFormData((prev) => ({
                                          ...prev,
                                          sections: newSections,
                                        }));
                                      }}
                                      className="mt-1"
                                    />
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label
                                        htmlFor={`question-${sectionIndex}-${questionIndex}-type`}
                                      >
                                        Question Type
                                      </Label>
                                      <Select
                                        value={question.type}
                                        onValueChange={(value) => {
                                          const newSections = [
                                            ...templateFormData.sections,
                                          ];
                                          newSections[sectionIndex].questions[
                                            questionIndex
                                          ].type = value as any;
                                          // Reset options if changing from a type that uses options to one that doesn't
                                          if (
                                            value !== "select" &&
                                            value !== "radio" &&
                                            value !== "checkbox"
                                          ) {
                                            newSections[sectionIndex].questions[
                                              questionIndex
                                            ].options = [];
                                          } else if (
                                            newSections[sectionIndex].questions[
                                              questionIndex
                                            ].options.length === 0
                                          ) {
                                            // Add default options if switching to a type that uses options
                                            newSections[sectionIndex].questions[
                                              questionIndex
                                            ].options = [
                                              "Option 1",
                                              "Option 2",
                                            ];
                                          }
                                          setTemplateFormData((prev) => ({
                                            ...prev,
                                            sections: newSections,
                                          }));
                                        }}
                                      >
                                        <SelectTrigger
                                          id={`question-${sectionIndex}-${questionIndex}-type`}
                                          className="mt-1"
                                        >
                                          <SelectValue placeholder="Select question type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="text">
                                            Short Text
                                          </SelectItem>
                                          <SelectItem value="textarea">
                                            Long Text
                                          </SelectItem>
                                          <SelectItem value="select">
                                            Dropdown
                                          </SelectItem>
                                          <SelectItem value="radio">
                                            Single Choice
                                          </SelectItem>
                                          <SelectItem value="checkbox">
                                            Multiple Choice
                                          </SelectItem>
                                          <SelectItem value="date">
                                            Date
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="flex items-center space-x-2 mt-6">
                                      <input
                                        type="checkbox"
                                        id={`question-${sectionIndex}-${questionIndex}-required`}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={question.required}
                                        onChange={(e) => {
                                          const newSections = [
                                            ...templateFormData.sections,
                                          ];
                                          newSections[sectionIndex].questions[
                                            questionIndex
                                          ].required = e.target.checked;
                                          setTemplateFormData((prev) => ({
                                            ...prev,
                                            sections: newSections,
                                          }));
                                        }}
                                      />
                                      <Label
                                        htmlFor={`question-${sectionIndex}-${questionIndex}-required`}
                                      >
                                        Required
                                      </Label>
                                    </div>
                                  </div>

                                  {(question.type === "select" ||
                                    question.type === "radio" ||
                                    question.type === "checkbox") && (
                                    <div className="space-y-2">
                                      <Label>Options</Label>
                                      {question.options.map(
                                        (option, optionIndex) => (
                                          <div
                                            key={optionIndex}
                                            className="flex items-center space-x-2"
                                          >
                                            <Input
                                              value={option}
                                              onChange={(e) => {
                                                const newSections = [
                                                  ...templateFormData.sections,
                                                ];
                                                newSections[
                                                  sectionIndex
                                                ].questions[
                                                  questionIndex
                                                ].options[optionIndex] =
                                                  e.target.value;
                                                setTemplateFormData((prev) => ({
                                                  ...prev,
                                                  sections: newSections,
                                                }));
                                              }}
                                              className="flex-1"
                                            />
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                              onClick={() => {
                                                if (
                                                  question.options.length > 1
                                                ) {
                                                  const newSections = [
                                                    ...templateFormData.sections,
                                                  ];
                                                  newSections[
                                                    sectionIndex
                                                  ].questions[
                                                    questionIndex
                                                  ].options = newSections[
                                                    sectionIndex
                                                  ].questions[
                                                    questionIndex
                                                  ].options.filter(
                                                    (_, i) => i !== optionIndex,
                                                  );
                                                  setTemplateFormData(
                                                    (prev) => ({
                                                      ...prev,
                                                      sections: newSections,
                                                    }),
                                                  );
                                                } else {
                                                  addNotification({
                                                    type: "system",
                                                    title:
                                                      "Cannot Remove Option",
                                                    message:
                                                      "Question must have at least one option",
                                                    priority: "medium",
                                                  });
                                                }
                                              }}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        ),
                                      )}
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                        onClick={() => {
                                          const newSections = [
                                            ...templateFormData.sections,
                                          ];
                                          newSections[sectionIndex].questions[
                                            questionIndex
                                          ].options.push(
                                            `Option ${question.options.length + 1}`,
                                          );
                                          setTemplateFormData((prev) => ({
                                            ...prev,
                                            sections: newSections,
                                          }));
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-1" /> Add
                                        Option
                                      </Button>
                                    </div>
                                  )}
                                </div>

                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => {
                                    const newSections = [
                                      ...templateFormData.sections,
                                    ];
                                    newSections[sectionIndex].questions =
                                      newSections[
                                        sectionIndex
                                      ].questions.filter(
                                        (_, i) => i !== questionIndex,
                                      );
                                    setTemplateFormData((prev) => ({
                                      ...prev,
                                      sections: newSections,
                                    }));
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowTemplateDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTemplate ? "Update Template" : "Create Template"}
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Template Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assessment Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{templateToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTemplate}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssessmentBuilder;
