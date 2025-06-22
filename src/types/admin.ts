export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: string;
  organizationId: string;
  area?: string;
  phone?: string;
}

export interface Organization {
  id: string;
  name: string;
  status: "active" | "inactive" | "trial" | "archived";
  plan: "free" | "standard" | "premium" | "trial";
  createdAt: string;
  updatedAt?: string;
  email: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  subdomain?: string;
  tenant_id?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  settings?: OrganizationSettings;
  areas?: string[];
  sector?: string;
  assessmentPackId?: string;
}

export interface OrganizationSettings {
  id: string;
  organizationId: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  customDomain?: string;
  journeyStages?: string[];
  features?: Record<string, boolean>;
  areas?: string[];
  journeyTypes?: JourneyType[];
}

export interface JourneyType {
  id: string;
  name: string;
  description: string;
  stages: JourneyStage[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
}

export interface JourneyStage {
  id: string;
  name: string;
  description: string;
  order: number;
  dueInDays: number;
  isRequired: boolean;
  requiresAssessment: boolean;
  assessmentTemplateId?: string;
  type:
    | "assessment"
    | "milestone"
    | "event"
    | "visit"
    | "interaction"
    | "review";
}

export interface AssessmentTemplate {
  id: string;
  name: string;
  description: string;
  type: "introduction" | "progress" | "exit" | "custom";
  defaultDueInDays: number;
  isRequired: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sections: AssessmentSection[];
  sector?: string;
  packId?: string;
  tags?: string[];
  version?: string;
  author?: string;
  triggerRules?: AssessmentTriggerRule[];
}

export interface AssessmentTriggerRule {
  id: string;
  conditionType:
    | "score_gte"
    | "score_lte"
    | "question_value"
    | "question_contains";
  conditionValue: string;
  triggeredAssessmentId: string;
  isActive: boolean;
}

export interface AssessmentSection {
  title: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox" | "date";
  required: boolean;
  options: string[];
}

export interface AssessmentPack {
  id: string;
  name: string;
  description: string;
  sector: string;
  templateIds: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sector {
  id: string;
  name: string;
  description: string;
  defaultTemplates: string[];
  additionalTemplates: string[];
}

export interface JourneyProgress {
  id: string;
  clientId: string;
  currentStage: number;
  stages: string[];
  completedStages: number[];
  updatedAt: string;
  journeyTypeId?: string;
  journeyTypeName?: string;
  journeyStatus?: "active" | "completed" | "completed_early";
  completionReason?: string;
  completionDate?: string;
  completedBy?: string;
}
