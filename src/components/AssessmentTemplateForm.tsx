import React, { useState, useEffect } from "react";
import { useNotifications } from "@/context/NotificationContext";
import {
  Card,
  CardContent,
  CardDescription,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Save, X } from "lucide-react";
import {
  AssessmentTemplate,
  AssessmentSection,
  AssessmentQuestion,
} from "@/types/admin";

interface AssessmentTemplateFormProps {
  template?: AssessmentTemplate | null;
  onSave: (template: AssessmentTemplate) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const AssessmentTemplateForm: React.FC<AssessmentTemplateFormProps> = ({
  template,
  onSave,
  onCancel,
  isEdit = false,
}) => {
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "introduction" as "introduction" | "progress" | "exit" | "custom",
    sector: "",
    defaultDueInDays: 7,
    isRequired: true,
    isActive: true,
    sections: [
      {
        title: "General Information",
        questions: [
          {
            id: "q1",
            text: "Sample question",
            type: "text" as
              | "text"
              | "textarea"
              | "select"
              | "radio"
              | "checkbox"
              | "date",
            required: true,
            options: [],
          },
        ],
      },
    ] as AssessmentSection[],
  });

  // Load template data when editing
  useEffect(() => {
    if (isEdit && template) {
      setFormData({
        name: template.name || "",
        description: template.description || "",
        type: template.type || "introduction",
        sector: template.sector || "",
        defaultDueInDays: template.defaultDueInDays || 7,
        isRequired: template.isRequired ?? true,
        isActive: template.isActive ?? true,
        sections: template.sections || [
          {
            title: "General Information",
            questions: [
              {
                id: "q1",
                text: "Sample question",
                type: "text",
                required: true,
                options: [],
              },
            ],
          },
        ],
      });
    }
  }, [isEdit, template]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSectionChange = (
    sectionIndex: number,
    field: string,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, [field]: value } : section,
      ),
    }));
  };

  const handleQuestionChange = (
    sectionIndex: number,
    questionIndex: number,
    field: string,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              questions: section.questions.map((question, qIndex) =>
                qIndex === questionIndex
                  ? { ...question, [field]: value }
                  : question,
              ),
            }
          : section,
      ),
    }));
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: `Section ${prev.sections.length + 1}`,
          questions: [],
        },
      ],
    }));
  };

  const removeSection = (sectionIndex: number) => {
    if (formData.sections.length > 1) {
      setFormData((prev) => ({
        ...prev,
        sections: prev.sections.filter((_, index) => index !== sectionIndex),
      }));
    } else {
      addNotification({
        type: "error",
        title: "Cannot Remove Section",
        message: "Assessment must have at least one section",
        priority: "medium",
      });
    }
  };

  const addQuestion = (sectionIndex: number) => {
    const newQuestion: AssessmentQuestion = {
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: "",
      type: "text",
      required: true,
      options: [],
    };

    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section,
      ),
    }));
  };

  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              questions: section.questions.filter(
                (_, qIndex) => qIndex !== questionIndex,
              ),
            }
          : section,
      ),
    }));
  };

  const handleOptionChange = (
    sectionIndex: number,
    questionIndex: number,
    optionIndex: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              questions: section.questions.map((question, qIndex) =>
                qIndex === questionIndex
                  ? {
                      ...question,
                      options: question.options.map((option, oIndex) =>
                        oIndex === optionIndex ? value : option,
                      ),
                    }
                  : question,
              ),
            }
          : section,
      ),
    }));
  };

  const addOption = (sectionIndex: number, questionIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              questions: section.questions.map((question, qIndex) =>
                qIndex === questionIndex
                  ? {
                      ...question,
                      options: [
                        ...question.options,
                        `Option ${question.options.length + 1}`,
                      ],
                    }
                  : question,
              ),
            }
          : section,
      ),
    }));
  };

  const removeOption = (
    sectionIndex: number,
    questionIndex: number,
    optionIndex: number,
  ) => {
    const question = formData.sections[sectionIndex].questions[questionIndex];
    if (question.options.length > 1) {
      setFormData((prev) => ({
        ...prev,
        sections: prev.sections.map((section, sIndex) =>
          sIndex === sectionIndex
            ? {
                ...section,
                questions: section.questions.map((q, qIndex) =>
                  qIndex === questionIndex
                    ? {
                        ...q,
                        options: q.options.filter(
                          (_, oIndex) => oIndex !== optionIndex,
                        ),
                      }
                    : q,
                ),
              }
            : section,
        ),
      }));
    } else {
      addNotification({
        type: "error",
        title: "Cannot Remove Option",
        message: "Question must have at least one option",
        priority: "medium",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (!formData.name.trim()) {
      addNotification({
        type: "error",
        title: "Validation Error",
        message: "Template name is required",
        priority: "high",
      });
      setIsLoading(false);
      return;
    }

    // Create the template object
    const templateData: AssessmentTemplate = {
      id: isEdit && template ? template.id : `template-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      type: formData.type,
      sector: formData.sector || undefined,
      defaultDueInDays: formData.defaultDueInDays,
      isRequired: formData.isRequired,
      isActive: formData.isActive,
      createdAt:
        isEdit && template ? template.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: formData.sections,
    };

    // Simulate save delay
    setTimeout(() => {
      onSave(templateData);
      setIsLoading(false);
    }, 500);
  };

  if (isEdit && !template) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background w-full max-w-6xl mx-auto">
      <form onSubmit={handleSubmit}>
        <ScrollArea className="h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Configure the basic settings for this assessment template
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter template name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Assessment Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleInputChange("type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="introduction">
                          Introduction
                        </SelectItem>
                        <SelectItem value="progress">Progress</SelectItem>
                        <SelectItem value="exit">Exit</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Brief description of this assessment"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector</Label>
                    <Input
                      id="sector"
                      value={formData.sector}
                      onChange={(e) =>
                        handleInputChange("sector", e.target.value)
                      }
                      placeholder="e.g., healthcare, education"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultDueInDays">Default Due (Days)</Label>
                    <Input
                      id="defaultDueInDays"
                      type="number"
                      value={formData.defaultDueInDays}
                      onChange={(e) =>
                        handleInputChange(
                          "defaultDueInDays",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      min="0"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isRequired"
                        checked={formData.isRequired}
                        onChange={(e) =>
                          handleInputChange("isRequired", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="isRequired">Required</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) =>
                          handleInputChange("isActive", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sections and Questions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sections & Questions</CardTitle>
                  <CardDescription>
                    Configure the sections and questions for this assessment
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={addSection}>
                  <Plus className="h-4 w-4 mr-2" /> Add Section
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {formData.sections.map((section, sectionIndex) => (
                  <div
                    key={sectionIndex}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 mr-4">
                        <Label htmlFor={`section-${sectionIndex}-title`}>
                          Section Title
                        </Label>
                        <Input
                          id={`section-${sectionIndex}-title`}
                          value={section.title}
                          onChange={(e) =>
                            handleSectionChange(
                              sectionIndex,
                              "title",
                              e.target.value,
                            )
                          }
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addQuestion(sectionIndex)}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Question
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeSection(sectionIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {section.questions.length === 0 ? (
                      <div className="text-center p-4 border border-dashed rounded-md">
                        <p className="text-sm text-muted-foreground">
                          No questions added yet. Click "Add Question" to create
                          one.
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
                                    onChange={(e) =>
                                      handleQuestionChange(
                                        sectionIndex,
                                        questionIndex,
                                        "text",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Enter question text"
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
                                        handleQuestionChange(
                                          sectionIndex,
                                          questionIndex,
                                          "type",
                                          value,
                                        );
                                        // Reset options if changing from a type that uses options to one that doesn't
                                        if (
                                          value !== "select" &&
                                          value !== "radio" &&
                                          value !== "checkbox"
                                        ) {
                                          handleQuestionChange(
                                            sectionIndex,
                                            questionIndex,
                                            "options",
                                            [],
                                          );
                                        } else if (
                                          question.options.length === 0
                                        ) {
                                          handleQuestionChange(
                                            sectionIndex,
                                            questionIndex,
                                            "options",
                                            ["Option 1", "Option 2"],
                                          );
                                        }
                                      }}
                                    >
                                      <SelectTrigger className="mt-1">
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
                                      checked={question.required}
                                      onChange={(e) =>
                                        handleQuestionChange(
                                          sectionIndex,
                                          questionIndex,
                                          "required",
                                          e.target.checked,
                                        )
                                      }
                                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
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
                                            onChange={(e) =>
                                              handleOptionChange(
                                                sectionIndex,
                                                questionIndex,
                                                optionIndex,
                                                e.target.value,
                                              )
                                            }
                                            className="flex-1"
                                          />
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() =>
                                              removeOption(
                                                sectionIndex,
                                                questionIndex,
                                                optionIndex,
                                              )
                                            }
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
                                      onClick={() =>
                                        addOption(sectionIndex, questionIndex)
                                      }
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
                                onClick={() =>
                                  removeQuestion(sectionIndex, questionIndex)
                                }
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
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2 p-6 border-t bg-background">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEdit ? "Update Template" : "Create Template"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AssessmentTemplateForm;
