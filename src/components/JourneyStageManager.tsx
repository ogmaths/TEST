import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GripVertical, Plus, Trash2, Save } from "lucide-react";

export interface JourneyStage {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
  requiresAssessment: boolean;
  order: number;
  type:
    | "assessment"
    | "milestone"
    | "event"
    | "visit"
    | "interaction"
    | "review";
  organizationId?: string;
  dueInDays?: number;
  assessmentTemplateId?: string;
}

interface JourneyStageManagerProps {
  initialStages?: JourneyStage[];
  onSave?: (stages: JourneyStage[]) => void;
  organizationId?: string;
  availableAssessmentTemplates?: { id: string; name: string }[];
}

const JourneyStageManager: React.FC<JourneyStageManagerProps> = ({
  initialStages = [],
  onSave = () => {},
  organizationId,
  availableAssessmentTemplates = [],
}) => {
  const [stages, setStages] = useState<JourneyStage[]>(initialStages);
  const [newStage, setNewStage] = useState<Partial<JourneyStage>>({
    name: "",
    description: "",
    isRequired: false,
    requiresAssessment: false,
    type: "milestone",
    dueInDays: 30,
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(stages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setStages(updatedItems);
  };

  const handleAddStage = () => {
    if (!newStage.name) return;

    const newStageComplete: JourneyStage = {
      id: Date.now().toString(),
      name: newStage.name,
      description: newStage.description || "",
      isRequired: newStage.isRequired || false,
      requiresAssessment: newStage.requiresAssessment || false,
      order: stages.length,
      type: newStage.type as
        | "assessment"
        | "milestone"
        | "event"
        | "visit"
        | "interaction"
        | "review",
      organizationId,
      dueInDays: newStage.dueInDays || 30,
      assessmentTemplateId: newStage.assessmentTemplateId,
    };

    setStages([...stages, newStageComplete]);
    setNewStage({
      name: "",
      description: "",
      isRequired: false,
      requiresAssessment: false,
      type: "milestone",
      dueInDays: 30,
    });
  };

  const handleRemoveStage = (id: string) => {
    const updatedStages = stages.filter((stage) => stage.id !== id);
    // Update order property
    const reorderedStages = updatedStages.map((stage, index) => ({
      ...stage,
      order: index,
    }));
    setStages(reorderedStages);
  };

  const handleSaveStages = () => {
    onSave(stages);
  };

  const handleStageChange = (
    id: string,
    field: keyof JourneyStage,
    value: any,
  ) => {
    setStages(
      stages.map((stage) =>
        stage.id === id ? { ...stage, [field]: value } : stage,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Journey Stage Manager</h2>
        <Button onClick={handleSaveStages} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Stages
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="stage-name">Stage Name</Label>
              <Input
                id="stage-name"
                value={newStage.name}
                onChange={(e) =>
                  setNewStage({ ...newStage, name: e.target.value })
                }
                placeholder="Enter stage name"
              />
            </div>
            <div>
              <Label htmlFor="stage-type">Stage Type</Label>
              <select
                id="stage-type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={newStage.type}
                onChange={(e) =>
                  setNewStage({ ...newStage, type: e.target.value as any })
                }
              >
                <option value="assessment">Assessment</option>
                <option value="milestone">Milestone</option>
                <option value="event">Event</option>
                <option value="visit">Visit</option>
                <option value="interaction">Interaction</option>
                <option value="review">Review</option>
              </select>
            </div>
            <div>
              <Label htmlFor="stage-due-days">Due in Days</Label>
              <Input
                id="stage-due-days"
                type="number"
                min="1"
                value={newStage.dueInDays || 30}
                onChange={(e) =>
                  setNewStage({
                    ...newStage,
                    dueInDays: parseInt(e.target.value) || 30,
                  })
                }
                placeholder="30"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stage-required"
                  checked={newStage.isRequired}
                  onCheckedChange={(checked) =>
                    setNewStage({ ...newStage, isRequired: !!checked })
                  }
                />
                <Label htmlFor="stage-required">Required Stage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stage-requires-assessment"
                  checked={newStage.requiresAssessment}
                  onCheckedChange={(checked) =>
                    setNewStage({ ...newStage, requiresAssessment: !!checked })
                  }
                />
                <Label htmlFor="stage-requires-assessment">
                  Requires Assessment
                </Label>
              </div>
            </div>
            {newStage.requiresAssessment &&
              availableAssessmentTemplates.length > 0 && (
                <div>
                  <Label htmlFor="assessment-template">
                    Assessment Template
                  </Label>
                  <select
                    id="assessment-template"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newStage.assessmentTemplateId || ""}
                    onChange={(e) =>
                      setNewStage({
                        ...newStage,
                        assessmentTemplateId: e.target.value || undefined,
                      })
                    }
                  >
                    <option value="">
                      Select Assessment Template (Optional)
                    </option>
                    {availableAssessmentTemplates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            <Button onClick={handleAddStage} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Stage
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Journey Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="stages">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {stages.map((stage, index) => (
                    <Draggable
                      key={stage.id}
                      draggableId={stage.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="border rounded-md p-4 bg-background"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab"
                              >
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{stage.name}</h3>
                                  <span className="text-xs bg-muted px-2 py-0.5 rounded">
                                    {stage.type}
                                  </span>
                                  {stage.isRequired && (
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                      Required
                                    </span>
                                  )}
                                  {stage.requiresAssessment && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                      Assessment
                                    </span>
                                  )}
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                    {stage.dueInDays} days
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {stage.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveStage(stage.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor={`stage-name-${stage.id}`}>
                                  Stage Name
                                </Label>
                                <Input
                                  id={`stage-name-${stage.id}`}
                                  value={stage.name}
                                  onChange={(e) =>
                                    handleStageChange(
                                      stage.id,
                                      "name",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor={`stage-type-${stage.id}`}>
                                  Stage Type
                                </Label>
                                <select
                                  id={`stage-type-${stage.id}`}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                  value={stage.type}
                                  onChange={(e) =>
                                    handleStageChange(
                                      stage.id,
                                      "type",
                                      e.target.value,
                                    )
                                  }
                                >
                                  <option value="assessment">Assessment</option>
                                  <option value="milestone">Milestone</option>
                                  <option value="event">Event</option>
                                  <option value="visit">Visit</option>
                                  <option value="interaction">
                                    Interaction
                                  </option>
                                  <option value="review">Review</option>
                                </select>
                              </div>
                              <div>
                                <Label htmlFor={`stage-due-days-${stage.id}`}>
                                  Due in Days
                                </Label>
                                <Input
                                  id={`stage-due-days-${stage.id}`}
                                  type="number"
                                  min="1"
                                  value={stage.dueInDays || 30}
                                  onChange={(e) =>
                                    handleStageChange(
                                      stage.id,
                                      "dueInDays",
                                      parseInt(e.target.value) || 30,
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor={`stage-description-${stage.id}`}>
                                Description
                              </Label>
                              <Input
                                id={`stage-description-${stage.id}`}
                                value={stage.description}
                                onChange={(e) =>
                                  handleStageChange(
                                    stage.id,
                                    "description",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`stage-required-${stage.id}`}
                                  checked={stage.isRequired}
                                  onCheckedChange={(checked) =>
                                    handleStageChange(
                                      stage.id,
                                      "isRequired",
                                      !!checked,
                                    )
                                  }
                                />
                                <Label htmlFor={`stage-required-${stage.id}`}>
                                  Required Stage
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`stage-requires-assessment-${stage.id}`}
                                  checked={stage.requiresAssessment || false}
                                  onCheckedChange={(checked) =>
                                    handleStageChange(
                                      stage.id,
                                      "requiresAssessment",
                                      !!checked,
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`stage-requires-assessment-${stage.id}`}
                                >
                                  Requires Assessment
                                </Label>
                              </div>
                            </div>
                            {stage.requiresAssessment &&
                              availableAssessmentTemplates.length > 0 && (
                                <div>
                                  <Label
                                    htmlFor={`assessment-template-${stage.id}`}
                                  >
                                    Assessment Template
                                  </Label>
                                  <select
                                    id={`assessment-template-${stage.id}`}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={stage.assessmentTemplateId || ""}
                                    onChange={(e) =>
                                      handleStageChange(
                                        stage.id,
                                        "assessmentTemplateId",
                                        e.target.value || undefined,
                                      )
                                    }
                                  >
                                    <option value="">
                                      Select Assessment Template (Optional)
                                    </option>
                                    {availableAssessmentTemplates.map(
                                      (template) => (
                                        <option
                                          key={template.id}
                                          value={template.id}
                                        >
                                          {template.name}
                                        </option>
                                      ),
                                    )}
                                  </select>
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>
    </div>
  );
};

export default JourneyStageManager;
