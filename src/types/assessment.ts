export interface Assessment {
  id: string;
  clientId: string;
  clientName?: string;
  type: "introduction" | "progress" | "exit";
  date: string;
  completedBy: string;
  score?: number;
  status?: "pending" | "in_progress" | "completed";
  questions?: AssessmentQuestion[];
  answers?: Record<string, any>;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: "text" | "number" | "scale" | "multiple_choice" | "checkbox";
  required: boolean;
  options?: string[];
  minValue?: number;
  maxValue?: number;
  order?: number;
}

export interface AssessmentTemplate {
  id: string;
  name: string;
  description?: string;
  type: "introduction" | "progress" | "exit";
  questions: AssessmentQuestion[];
  createdAt?: string;
  updatedAt?: string;
  organizationId?: string;
  isActive: boolean;
}

export interface AssessmentSummary {
  totalAssessments: number;
  completedAssessments: number;
  pendingAssessments: number;
  averageScore?: number;
  byType: {
    introduction: number;
    progress: number;
    exit: number;
  };
}
