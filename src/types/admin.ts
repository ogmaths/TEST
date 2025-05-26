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
}
