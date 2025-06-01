export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  status: string;
  organizationId: string;
  area?: string;
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
