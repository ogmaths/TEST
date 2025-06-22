import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/context/NotificationContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Building2,
  Trash2,
  Lock,
  Search,
  Edit,
  Plus,
  Upload,
  RefreshCw,
  LogIn,
  LogOut,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  FileText,
  Copy,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import SuccessToast from "./SuccessToast";
import { useUser } from "@/context/UserContext";
import {
  Organization,
  AssessmentPack,
  AssessmentTemplate,
  Sector,
  AssessmentSection,
} from "@/types/admin";
import BackButton from "./BackButton";
import { Link } from "react-router-dom";
import { supabaseClient } from "@/lib/supabaseClient";
import { useTenant } from "@/context/TenantContext";
import Logo from "./Logo";
import AssessmentTemplateForm from "./AssessmentTemplateForm";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { tenantId } = useTenant();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("tenants");

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [assessmentTemplates, setAssessmentTemplates] = useState<
    AssessmentTemplate[]
  >([]);
  const [showAssessmentBuilder, setShowAssessmentBuilder] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] =
    useState<AssessmentTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] =
    useState<AssessmentTemplate | null>(null);
  const [showDeleteTemplateDialog, setShowDeleteTemplateDialog] =
    useState(false);

  // Assessment Trigger Builder states
  const [assessmentTriggers, setAssessmentTriggers] = useState<any[]>([]);
  const [showTriggerDialog, setShowTriggerDialog] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<any>(null);
  const [triggerForm, setTriggerForm] = useState({
    sourceAssessmentId: "",
    conditionType: "score_gte" as
      | "score_gte"
      | "score_lte"
      | "question_value"
      | "question_contains",
    conditionValue: "",
    triggeredAssessmentId: "",
    notes: "",
    isActive: true,
  });
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [templateFormMode, setTemplateFormMode] = useState<"create" | "edit">(
    "create",
  );
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

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<Organization | null>(
    null,
  );
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Organization | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [tenants, setTenants] = useState<Organization[]>([]);
  const [showNewTenantDialog, setShowNewTenantDialog] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: "",
    subdomain: "",
    email: "",
    description: "",
    contact_email: "",
    contact_phone: "",
    primary_color: "#6366f1",
    secondary_color: "#4f46e5",
    plan: "trial",
    sector: "general",
  });
  // Logo functionality removed
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    role: "support_worker",
    tenantId: "",
    organizationName: "",
    status: "active",
  });
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  // Check if user is super admin
  useEffect(() => {
    console.log("🔍 SuperAdminDashboard - tenantId check:", tenantId);
    console.log("🔍 SuperAdminDashboard - user:", user);

    if (
      tenantId === "0" ||
      tenantId === null ||
      tenantId === "null" ||
      user?.role === "super_admin"
    ) {
      console.log("🔍 SuperAdminDashboard - Setting authenticated to true");
      setIsAuthenticated(true);
    } else {
      console.log(
        "🔍 SuperAdminDashboard - Not super admin, tenantId:",
        tenantId,
        "user role:",
        user?.role,
      );
      setIsAuthenticated(false);
    }
  }, [tenantId, user]);

  // Initialize sectors and assessment data
  useEffect(() => {
    if (isAuthenticated) {
      // Initialize sectors
      const defaultSectors: Sector[] = [
        {
          id: "general",
          name: "General",
          description: "Standard assessment pack for all sectors",
          defaultTemplates: ["introduction", "progress", "exit"],
          additionalTemplates: [],
        },
        {
          id: "perinatal",
          name: "Perinatal",
          description: "Specialized assessments for perinatal support",
          defaultTemplates: ["introduction", "progress", "exit"],
          additionalTemplates: ["epds", "bonding-scale", "whooley-questions"],
        },
        {
          id: "domestic-abuse",
          name: "Domestic Abuse",
          description: "Risk assessment tools for domestic abuse support",
          defaultTemplates: ["introduction", "progress", "exit"],
          additionalTemplates: ["dash-risk", "ric-caada", "marac-flags"],
        },
        {
          id: "mental-health",
          name: "Mental Health",
          description: "Mental health and wellbeing assessment tools",
          defaultTemplates: ["introduction", "progress", "exit"],
          additionalTemplates: ["wemwbs", "gad-7", "phq-9"],
        },
        {
          id: "youth-work",
          name: "Youth Work",
          description: "Youth development and outcome tracking",
          defaultTemplates: ["introduction", "progress", "exit"],
          additionalTemplates: [
            "outcome-star-young-people",
            "resilience-framework",
          ],
        },
        {
          id: "parenting-support",
          name: "Parenting Support",
          description: "Family support and parenting assessments",
          defaultTemplates: ["introduction", "progress", "exit"],
          additionalTemplates: ["family-star-plus", "strengthening-families"],
        },
      ];
      setSectors(defaultSectors);

      // Load assessment templates
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
        ];
        setAssessmentTemplates(defaultTemplates);
        localStorage.setItem(
          "assessmentTemplates",
          JSON.stringify(defaultTemplates),
        );
      }

      // Load assessment triggers
      const savedTriggers = localStorage.getItem("assessmentTriggers");
      if (savedTriggers) {
        try {
          setAssessmentTriggers(JSON.parse(savedTriggers));
        } catch (error) {
          console.error("Failed to parse saved assessment triggers", error);
        }
      }
    }
  }, [isAuthenticated]);

  // Fetch tenants
  useEffect(() => {
    if (isAuthenticated) {
      // Initialize with predefined tenants from environment variables
      const predefinedTenants: Organization[] = [
        {
          id: "b3-tenant",
          name: "B3",
          status: "active" as "active",
          plan: "premium" as "premium",
          createdAt: new Date().toISOString(),
          email: "contact@b3.org",
          subdomain: "b3",
          tenant_id: "1",
          primary_color: "#4f46e5",
          secondary_color: "#6366f1",
          sector: "general",
        },
        {
          id: "parents1st-tenant",
          name: "Parents1st",
          status: "active" as "active",
          plan: "standard" as "standard",
          createdAt: new Date().toISOString(),
          email: "contact@parents1st.org",
          subdomain: "parents1st",
          tenant_id: "2",
          primary_color: "#10b981",
          secondary_color: "#34d399",
          sector: "parenting-support",
        },
        {
          id: "demo-tenant",
          name: "Demo",
          status: "trial" as "trial",
          plan: "trial" as "trial",
          createdAt: new Date().toISOString(),
          email: "demo@thriveperinatal.com",
          subdomain: "demo",
          tenant_id: "3",
          primary_color: "#f59e0b",
          secondary_color: "#fbbf24",
          sector: "general",
        },
      ];

      // Set the predefined tenants
      setTenants(predefinedTenants);

      // Load all users across organizations for super admin
      loadAllUsers();
    }
  }, [isAuthenticated]);

  const fetchTenants = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from("organizations")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching tenants:", error);
        addNotification({
          title: "Error",
          message: "Failed to load tenants. Please try again.",
          type: "error",
          priority: "high",
        });
      } else if (data && data.length > 0) {
        // If we have data from the database, use it
        setTenants(data);
        setSuccessMessage("Tenant list refreshed successfully");
      } else {
        // If no data in database, keep the predefined tenants
        console.log("No tenants found in database, using predefined tenants");
        setSuccessMessage("Tenant list refreshed successfully");
      }
    } catch (error) {
      console.error("Failed to fetch tenants:", error);
      addNotification({
        title: "Error",
        message: "Failed to load tenants. Please try again.",
        type: "error",
        priority: "high",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "superadmin123") {
      setIsAuthenticated(true);
      setPasswordError("");
      setSuccessMessage("Authentication successful");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleDeleteTenant = (tenant: Organization) => {
    setTenantToDelete(tenant);
    setShowDeleteDialog(true);
  };

  const confirmDeleteTenant = async () => {
    if (tenantToDelete) {
      try {
        // Update status to archived instead of deleting
        const { error } = await supabaseClient
          .from("organizations")
          .update({ status: "archived" })
          .eq("id", tenantToDelete.id);

        if (error) {
          console.error("Error archiving tenant:", error);
          addNotification({
            title: "Error",
            message: "Failed to archive tenant. Please try again.",
            type: "error",
            priority: "high",
          });
        } else {
          addNotification({
            title: "Success",
            message: `Tenant ${tenantToDelete.name} has been archived.`,
            type: "success",
            priority: "medium",
          });
          setSuccessMessage(
            `Tenant ${tenantToDelete.name} has been archived successfully`,
          );
          fetchTenants();
        }
      } catch (error) {
        console.error("Failed to archive tenant:", error);
        addNotification({
          title: "Error",
          message: "Failed to archive tenant. Please try again.",
          type: "error",
          priority: "high",
        });
      } finally {
        setShowDeleteDialog(false);
        setTenantToDelete(null);
      }
    }
  };

  const handleEditTenant = (tenant: Organization) => {
    setSelectedTenant(tenant);
    setShowEditDialog(true);
  };

  // Logo handling functionality removed

  const saveEditedTenant = async () => {
    if (!selectedTenant) return;

    try {
      // Update the tenant in the local state first
      const updatedTenants = tenants.map((tenant) =>
        tenant.id === selectedTenant.id
          ? {
              ...tenant,
              name: selectedTenant.name,
              email: selectedTenant.email,
              description: selectedTenant.description,
              contact_email: selectedTenant.contact_email,
              contact_phone: selectedTenant.contact_phone,
              subdomain: selectedTenant.subdomain,
              primary_color: selectedTenant.primary_color,
              secondary_color: selectedTenant.secondary_color,
              status: selectedTenant.status,
            }
          : tenant,
      );

      setTenants(updatedTenants);

      // Then update in the database
      const { error } = await supabaseClient
        .from("organizations")
        .update({
          name: selectedTenant.name,
          email: selectedTenant.email,
          description: selectedTenant.description,
          contact_email: selectedTenant.contact_email,
          contact_phone: selectedTenant.contact_phone,
          subdomain: selectedTenant.subdomain,
          primary_color: selectedTenant.primary_color,
          secondary_color: selectedTenant.secondary_color,
          status: selectedTenant.status,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", selectedTenant.id);

      if (error) {
        console.error("Error updating tenant:", error);
        addNotification({
          title: "Error",
          message: "Failed to update tenant. Please try again.",
          type: "error",
          priority: "high",
        });
      } else {
        addNotification({
          title: "Success",
          message: `Tenant ${selectedTenant.name} has been updated.`,
          type: "success",
          priority: "medium",
        });
        setSuccessMessage(
          `Tenant ${selectedTenant.name} has been updated successfully`,
        );
        setShowEditDialog(false);
        setSelectedTenant(null);
      }
    } catch (error) {
      console.error("Failed to update tenant:", error);
      addNotification({
        title: "Error",
        message: "Failed to update tenant. Please try again.",
        type: "error",
        priority: "high",
      });
    }
  };

  const createNewTenant = async () => {
    try {
      // Generate a unique tenant ID
      const tenantId = `tenant_${Date.now()}`;

      // Create the tenant record
      const { data, error } = await supabaseClient
        .from("organizations")
        .insert({
          name: newTenant.name,
          email: newTenant.email,
          description: newTenant.description,
          contact_email: newTenant.contact_email,
          contact_phone: newTenant.contact_phone,
          subdomain: newTenant.subdomain,
          tenant_id: tenantId,
          primary_color: newTenant.primary_color,
          secondary_color: newTenant.secondary_color,
          status: "active",
          plan: newTenant.plan,
          createdAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating tenant:", error);
        addNotification({
          title: "Error",
          message: "Failed to create tenant. Please try again.",
          type: "error",
          priority: "high",
        });
        return;
      }

      addNotification({
        title: "Success",
        message: `Tenant ${newTenant.name} has been created.`,
        type: "success",
        priority: "medium",
      });

      setSuccessMessage(
        `Tenant ${newTenant.name} has been created successfully`,
      );

      // Reset form and close dialog
      setNewTenant({
        name: "",
        subdomain: "",
        email: "",
        description: "",
        contact_email: "",
        contact_phone: "",
        primary_color: "#6366f1",
        secondary_color: "#4f46e5",
        plan: "trial",
      });

      setShowNewTenantDialog(false);
      fetchTenants();
    } catch (error) {
      console.error("Failed to create tenant:", error);
      addNotification({
        title: "Error",
        message: "Failed to create tenant. Please try again.",
        type: "error",
        priority: "high",
      });
    }
  };

  const loadAllUsers = () => {
    // Mock users from all organizations for super admin view
    const mockUsers = [
      {
        id: "1",
        name: "Stacy Williams",
        email: "stacy.williams@b3.org",
        role: "admin",
        lastLogin: "2023-06-10T14:30:00Z",
        status: "active",
        tenantId: "1",
        organizationId: "b3-tenant",
      },
      {
        id: "2",
        name: "John Doe",
        email: "john.doe@b3.org",
        role: "support_worker",
        lastLogin: "2023-06-09T10:15:00Z",
        status: "active",
        tenantId: "1",
        organizationId: "b3-tenant",
      },
      {
        id: "3",
        name: "Jane Smith",
        email: "jane.smith@parents1st.org",
        role: "manager",
        lastLogin: "2023-06-08T09:45:00Z",
        status: "active",
        tenantId: "2",
        organizationId: "parents1st-tenant",
      },
      {
        id: "4",
        name: "Bob Wilson",
        email: "bob.wilson@parents1st.org",
        role: "support_worker",
        lastLogin: "2023-06-08T09:45:00Z",
        status: "active",
        tenantId: "2",
        organizationId: "parents1st-tenant",
      },
      {
        id: "5",
        name: "Demo User",
        email: "demo@thriveperinatal.com",
        role: "support_worker",
        lastLogin: "2023-06-07T08:30:00Z",
        status: "active",
        tenantId: "3",
        organizationId: "demo-tenant",
      },
    ];
    setAllUsers(mockUsers);
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    const userOrg = tenants.find((t) => t.tenant_id === user.tenantId);
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      organizationName: userOrg?.name || "",
      status: user.status,
    });
    setShowUserDialog(true);
  };

  const handleDeleteUser = (user: any) => {
    setUserToDelete(user);
    setShowDeleteUserDialog(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      const updatedUsers = allUsers.filter((u) => u.id !== userToDelete.id);
      setAllUsers(updatedUsers);
      setShowDeleteUserDialog(false);
      setUserToDelete(null);

      addNotification({
        type: "success",
        title: "User Deleted",
        message: `${userToDelete.name} has been deleted successfully`,
        priority: "high",
      });
    }
  };

  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      // Update existing user
      const updatedUsers = allUsers.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              name: userFormData.name,
              email: userFormData.email,
              role: userFormData.role,
              tenantId: userFormData.tenantId,
              status: userFormData.status,
            }
          : u,
      );
      setAllUsers(updatedUsers);

      addNotification({
        type: "success",
        title: "User Updated",
        message: `${userFormData.name} has been updated successfully`,
        priority: "high",
      });
    } else {
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: userFormData.name,
        email: userFormData.email,
        role: userFormData.role,
        tenantId: userFormData.tenantId,
        status: userFormData.status,
        lastLogin: null,
        organizationId:
          tenants.find((t) => t.tenant_id === userFormData.tenantId)?.id || "",
      };
      setAllUsers([...allUsers, newUser]);

      addNotification({
        type: "success",
        title: "User Created",
        message: `${userFormData.name} has been created successfully`,
        priority: "high",
      });
    }

    setShowUserDialog(false);
    setEditingUser(null);
    setUserFormData({
      name: "",
      email: "",
      role: "support_worker",
      tenantId: "",
      organizationName: "",
      status: "active",
    });
  };

  const handleLogout = () => {
    // Clear user data
    setUser(null);
    // Clear any stored data
    localStorage.removeItem("user");
    localStorage.removeItem("superAdminUser");
    // Navigate to login page
    navigate("/login");
    addNotification({
      title: "Logged Out",
      message: "You have been successfully logged out.",
      type: "success",
      priority: "medium",
    });
  };

  const impersonateTenant = async (tenant: Organization) => {
    if (!tenant.tenant_id) {
      addNotification({
        title: "Error",
        message: "This tenant does not have a valid tenant ID.",
        type: "error",
        priority: "high",
      });
      return;
    }

    try {
      // Store the super admin user info for returning later
      localStorage.setItem("superAdminUser", JSON.stringify(user));

      // Create an impersonation user with the tenant's context
      const impersonationUser = {
        ...user!,
        tenantId: tenant.tenant_id,
        organizationSlug: tenant.subdomain,
        organizationName: tenant.name,
        organizationColor: tenant.primary_color,
        isImpersonating: true,
        isOrgAdmin: true, // Set as organization admin when impersonating
      };

      // Set the user context to the impersonation user
      setUser(impersonationUser);

      addNotification({
        title: "Impersonation Active",
        message: `You are now viewing as ${tenant.name}. Click your profile to exit impersonation mode.`,
        type: "info",
        priority: "medium",
      });

      setSuccessMessage(`Successfully logged in as ${tenant.name}`);

      // Navigate to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to impersonate tenant:", error);
      addNotification({
        title: "Error",
        message: "Failed to impersonate tenant. Please try again.",
        type: "error",
        priority: "high",
      });
    }
  };

  const filteredTenants = tenants.filter(
    (tenant) =>
      tenant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.subdomain?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Assessment Builder functions
  const handleDeleteTemplate = (template: AssessmentTemplate) => {
    setTemplateToDelete(template);
    setShowDeleteTemplateDialog(true);
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
      setShowDeleteTemplateDialog(false);
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
    console.log("Editing template:", template);
    setEditingTemplate(template);
    setTemplateFormMode("edit");
    setShowTemplateForm(true);
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

  const handleTemplateFormChange = (
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

  const handleTemplateCheckboxChange = (id: string, checked: boolean) => {
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
  };

  const openNewTemplateForm = () => {
    console.log("Creating new template");
    setEditingTemplate(null);
    setTemplateFormMode("create");
    setShowTemplateForm(true);
  };

  const handleTemplateFormSave = (template: AssessmentTemplate) => {
    console.log("Template form saved:", template);

    let updatedTemplates;
    if (templateFormMode === "edit") {
      // Update existing template
      updatedTemplates = assessmentTemplates.map((t) =>
        t.id === template.id ? template : t,
      );
      addNotification({
        type: "success",
        title: "Assessment Template Updated",
        message: `${template.name} has been updated successfully`,
        priority: "high",
      });
    } else {
      // Create new template
      updatedTemplates = [...assessmentTemplates, template];
      addNotification({
        type: "success",
        title: "Assessment Template Created",
        message: `${template.name} has been created successfully`,
        priority: "high",
      });
    }

    setAssessmentTemplates(updatedTemplates);
    localStorage.setItem(
      "assessmentTemplates",
      JSON.stringify(updatedTemplates),
    );

    setShowTemplateForm(false);
    setEditingTemplate(null);
  };

  const handleTemplateFormCancel = () => {
    console.log("Template form cancelled");
    setShowTemplateForm(false);
    setEditingTemplate(null);
  };

  // Assessment Trigger functions
  const handleAddTrigger = () => {
    setEditingTrigger(null);
    setTriggerForm({
      sourceAssessmentId: "",
      conditionType: "score_gte",
      conditionValue: "",
      triggeredAssessmentId: "",
      notes: "",
      isActive: true,
    });
    setShowTriggerDialog(true);
  };

  const handleEditTrigger = (trigger: any) => {
    setEditingTrigger(trigger);
    setTriggerForm({
      sourceAssessmentId: trigger.sourceAssessmentId,
      conditionType: trigger.conditionType,
      conditionValue: trigger.conditionValue,
      triggeredAssessmentId: trigger.triggeredAssessmentId,
      notes: trigger.notes || "",
      isActive: trigger.isActive,
    });
    setShowTriggerDialog(true);
  };

  const handleSaveTrigger = () => {
    const trigger = {
      id: editingTrigger ? editingTrigger.id : `trigger-${Date.now()}`,
      sourceAssessmentId: triggerForm.sourceAssessmentId,
      conditionType: triggerForm.conditionType,
      conditionValue: triggerForm.conditionValue,
      triggeredAssessmentId: triggerForm.triggeredAssessmentId,
      notes: triggerForm.notes,
      isActive: triggerForm.isActive,
      createdAt: editingTrigger
        ? editingTrigger.createdAt
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedTriggers;
    if (editingTrigger) {
      updatedTriggers = assessmentTriggers.map((t) =>
        t.id === editingTrigger.id ? trigger : t,
      );
      addNotification({
        type: "success",
        title: "Assessment Trigger Updated",
        message: "The assessment trigger has been updated successfully",
        priority: "high",
      });
    } else {
      updatedTriggers = [...assessmentTriggers, trigger];
      addNotification({
        type: "success",
        title: "Assessment Trigger Created",
        message: "The assessment trigger has been created successfully",
        priority: "high",
      });
    }

    setAssessmentTriggers(updatedTriggers);
    localStorage.setItem("assessmentTriggers", JSON.stringify(updatedTriggers));

    setShowTriggerDialog(false);
    setEditingTrigger(null);
    setTriggerForm({
      sourceAssessmentId: "",
      conditionType: "score_gte",
      conditionValue: "",
      triggeredAssessmentId: "",
      notes: "",
      isActive: true,
    });
  };

  const handleDeleteTrigger = (triggerId: string) => {
    const updatedTriggers = assessmentTriggers.filter(
      (t) => t.id !== triggerId,
    );
    setAssessmentTriggers(updatedTriggers);
    localStorage.setItem("assessmentTriggers", JSON.stringify(updatedTriggers));

    addNotification({
      type: "success",
      title: "Assessment Trigger Deleted",
      message: "The assessment trigger has been deleted successfully",
      priority: "medium",
    });
  };

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

  const filteredTemplates = assessmentTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (template.sector &&
        template.sector.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  // Show loading while checking authentication
  if (tenantId === undefined || user === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium">Loading...</p>
            <p className="text-sm text-muted-foreground">
              Checking authentication
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 border-b bg-background">
          <div className="flex h-16 items-center px-4 md:px-6">
            <BackButton />
            <Link to="/admin" className="ml-4">
              <Logo size="md" />
            </Link>
            <h1 className="ml-4 text-3xl font-bold">
              Thrive Perinatal Control Panel
            </h1>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6">
          <Card className="max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" /> Super Admin Authentication
              </CardTitle>
              <CardDescription>
                Please enter the super admin password to continue
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent>
                {passwordError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Super Admin Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                  Authenticate
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {successMessage && (
        <SuccessToast
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
          duration={3000}
        />
      )}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <BackButton />
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" /> Log Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tenants..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              className="flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowNewTenantDialog(true);
              }}
            >
              <Plus className="h-4 w-4" /> Add Tenant
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                fetchTenants();
              }}
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-5xl grid-cols-5">
            <TabsTrigger value="tenants">Active Tenants</TabsTrigger>
            <TabsTrigger value="users">All Users</TabsTrigger>
            <TabsTrigger value="archived">Archived Tenants</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="journey-types">Journey Types</TabsTrigger>
          </TabsList>

          <TabsContent value="tenants" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Tenant Management</CardTitle>
                <CardDescription>
                  Manage your tenant organizations and their settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <p className="text-muted-foreground">Loading tenants...</p>
                  </div>
                ) : filteredTenants.filter((t) => t.status !== "archived")
                    .length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      No active tenants found. Create your first tenant to get
                      started.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50 text-left">
                          <th className="p-2 pl-4">Organization</th>
                          <th className="p-2">Tenant ID</th>
                          <th className="p-2">Sector</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Plan</th>
                          <th className="p-2 text-right pr-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTenants
                          .filter((tenant) => tenant.status !== "archived")
                          .map((tenant) => (
                            <tr key={tenant.id} className="border-b">
                              <td className="p-2 pl-4">
                                <div className="flex items-center gap-2">
                                  {tenant.logo_url ? (
                                    <img
                                      src={tenant.logo_url}
                                      alt={tenant.name}
                                      className="h-8 w-8 rounded object-contain bg-muted"
                                    />
                                  ) : (
                                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                      <Building2 className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium">{tenant.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {tenant.email}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="p-2">
                                <span className="font-mono text-xs">
                                  {tenant.tenant_id || "Not set"}
                                </span>
                              </td>
                              <td className="p-2">
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                                  {sectors.find((s) => s.id === tenant.sector)
                                    ?.name || "General"}
                                </span>
                              </td>
                              <td className="p-2">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    tenant.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : tenant.status === "trial"
                                        ? "bg-blue-100 text-blue-800"
                                        : tenant.status === "inactive"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {tenant.status === "active" && (
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                  )}
                                  {tenant.status === "inactive" && (
                                    <XCircle className="mr-1 h-3 w-3" />
                                  )}
                                  {tenant.status === "trial" && (
                                    <Clock className="mr-1 h-3 w-3" />
                                  )}
                                  {tenant.status}
                                </span>
                              </td>
                              <td className="p-2">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    tenant.plan === "premium"
                                      ? "bg-purple-100 text-purple-800"
                                      : tenant.plan === "standard"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {tenant.plan}
                                </span>
                              </td>
                              <td className="p-2 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      impersonateTenant(tenant);
                                    }}
                                    className="flex items-center gap-1"
                                  >
                                    <LogIn className="h-3 w-3" />
                                    Login As
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleEditTenant(tenant);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleDeleteTenant(tenant);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage users across all organizations
                  </CardDescription>
                </div>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setEditingUser(null);
                    setUserFormData({
                      name: "",
                      email: "",
                      role: "support_worker",
                      tenantId: "",
                      organizationName: "",
                      status: "active",
                    });
                    setShowUserDialog(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add User
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <p className="text-muted-foreground">Loading users...</p>
                  </div>
                ) : allUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      No users found. Create your first user to get started.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50 text-left">
                          <th className="p-2 pl-4">User</th>
                          <th className="p-2">Organization</th>
                          <th className="p-2">Role</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Last Login</th>
                          <th className="p-2 text-right pr-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers
                          .filter(
                            (user) =>
                              user.name
                                ?.toLowerCase()
                                .includes(searchQuery.toLowerCase()) ||
                              user.email
                                ?.toLowerCase()
                                .includes(searchQuery.toLowerCase()),
                          )
                          .map((user) => {
                            const userOrg = tenants.find(
                              (t) => t.tenant_id === user.tenantId,
                            );
                            return (
                              <tr key={user.id} className="border-b">
                                <td className="p-2 pl-4">
                                  <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {user.email}
                                    </p>
                                  </div>
                                </td>
                                <td className="p-2">
                                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                                    {userOrg?.name || "Unknown Org"}
                                  </span>
                                </td>
                                <td className="p-2">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                      user.role === "super_admin"
                                        ? "bg-red-100 text-red-800"
                                        : user.role === "admin"
                                          ? "bg-purple-100 text-purple-800"
                                          : user.role === "manager"
                                            ? "bg-orange-100 text-orange-800"
                                            : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {user.role}
                                  </span>
                                </td>
                                <td className="p-2">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                      user.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {user.status}
                                  </span>
                                </td>
                                <td className="p-2">
                                  {user.lastLogin
                                    ? new Date(
                                        user.lastLogin,
                                      ).toLocaleDateString()
                                    : "Never"}
                                </td>
                                <td className="p-2 text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleEditUser(user);
                                      }}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDeleteUser(user);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="archived" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Archived Tenants</CardTitle>
                <CardDescription>
                  View and manage archived tenant organizations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <p className="text-muted-foreground">
                      Loading archived tenants...
                    </p>
                  </div>
                ) : filteredTenants.filter((t) => t.status === "archived")
                    .length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      No archived tenants found.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50 text-left">
                          <th className="p-2 pl-4">Organization</th>
                          <th className="p-2">Tenant ID</th>
                          <th className="p-2">Sector</th>
                          <th className="p-2">Archived Date</th>
                          <th className="p-2 text-right pr-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTenants
                          .filter((tenant) => tenant.status === "archived")
                          .map((tenant) => (
                            <tr key={tenant.id} className="border-b">
                              <td className="p-2 pl-4">
                                <div className="flex items-center gap-2">
                                  {tenant.logo_url ? (
                                    <img
                                      src={tenant.logo_url}
                                      alt={tenant.name}
                                      className="h-8 w-8 rounded object-contain bg-muted opacity-50"
                                    />
                                  ) : (
                                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                                      <Building2 className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-medium text-muted-foreground">
                                      {tenant.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {tenant.email}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="p-2 text-muted-foreground">
                                <span className="font-mono text-xs">
                                  {tenant.tenant_id || "Not set"}
                                </span>
                              </td>
                              <td className="p-2 text-muted-foreground">
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600">
                                  {sectors.find((s) => s.id === tenant.sector)
                                    ?.name || "General"}
                                </span>
                              </td>
                              <td className="p-2 text-muted-foreground">
                                {new Date(
                                  tenant.updatedAt || tenant.createdAt,
                                ).toLocaleDateString()}
                              </td>
                              <td className="p-2 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const activeTenant = {
                                        ...tenant,
                                        status: "active",
                                      };
                                      setSelectedTenant(activeTenant);
                                      setTimeout(() => {
                                        saveEditedTenant();
                                      }, 0);
                                    }}
                                  >
                                    Restore
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Assessment Templates</CardTitle>
                  <CardDescription>
                    Create and manage assessment templates for all sectors
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
                            <td className="p-2">
                              {getTypeBadge(template.type)}
                            </td>
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
                            No assessment templates found. Create your first
                            template by clicking the "Create Template" button.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="triggers" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Assessment Trigger Builder</CardTitle>
                  <CardDescription>
                    Create automatic assessment triggers based on conditions and
                    responses
                  </CardDescription>
                </div>
                <Button
                  onClick={handleAddTrigger}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Create Trigger
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50 text-left">
                        <th className="p-2 pl-4">Source Assessment</th>
                        <th className="p-2">Condition</th>
                        <th className="p-2">Triggered Assessment</th>
                        <th className="p-2">Status</th>
                        <th className="p-2 text-right pr-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessmentTriggers.length > 0 ? (
                        assessmentTriggers.map((trigger) => {
                          const sourceTemplate = assessmentTemplates.find(
                            (t) => t.id === trigger.sourceAssessmentId,
                          );
                          const triggeredTemplate = assessmentTemplates.find(
                            (t) => t.id === trigger.triggeredAssessmentId,
                          );

                          return (
                            <tr key={trigger.id} className="border-b">
                              <td className="p-2 pl-4 font-medium">
                                {sourceTemplate?.name || "Unknown Assessment"}
                              </td>
                              <td className="p-2">
                                <div className="text-sm">
                                  <div className="font-medium">
                                    {trigger.conditionType === "score_gte" &&
                                      "Score ≥"}
                                    {trigger.conditionType === "score_lte" &&
                                      "Score ≤"}
                                    {trigger.conditionType ===
                                      "question_value" && "Question ="}
                                    {trigger.conditionType ===
                                      "question_contains" &&
                                      "Question contains"}{" "}
                                    {trigger.conditionValue}
                                  </div>
                                  {trigger.notes && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {trigger.notes}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-2">
                                {triggeredTemplate?.name ||
                                  "Unknown Assessment"}
                              </td>
                              <td className="p-2">
                                {trigger.isActive ? (
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
                                    onClick={() => handleEditTrigger(trigger)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() =>
                                      handleDeleteTrigger(trigger.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-4 text-center text-muted-foreground"
                          >
                            No assessment triggers found. Create your first
                            trigger by clicking the "Create Trigger" button.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journey-types" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Journey Types Management</CardTitle>
                  <CardDescription>
                    Journey Types functionality has been moved to a dedicated
                    page for better performance
                  </CardDescription>
                </div>
                <Button
                  onClick={() => navigate("/journey-types")}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Manage Journey Types
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Journey Types management has been moved to a dedicated page
                    for better performance and user experience.
                  </p>
                  <Button
                    onClick={() => navigate("/journey-types")}
                    variant="outline"
                  >
                    Go to Journey Types Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Tenant Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Tenant</DialogTitle>
            <DialogDescription>
              Update tenant information and branding
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  value={selectedTenant?.name || ""}
                  onChange={(e) =>
                    setSelectedTenant((prev) =>
                      prev ? { ...prev, name: e.target.value } : null,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Primary Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={selectedTenant?.email || ""}
                  onChange={(e) =>
                    setSelectedTenant((prev) =>
                      prev ? { ...prev, email: e.target.value } : null,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain</Label>
                <div className="flex items-center">
                  <Input
                    id="subdomain"
                    value={selectedTenant?.subdomain || ""}
                    onChange={(e) =>
                      setSelectedTenant((prev) =>
                        prev ? { ...prev, subdomain: e.target.value } : null,
                      )
                    }
                  />
                  <span className="ml-2 text-muted-foreground">
                    .thriveperinatal.com
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={selectedTenant?.description || ""}
                  onChange={(e) =>
                    setSelectedTenant((prev) =>
                      prev ? { ...prev, description: e.target.value } : null,
                    )
                  }
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={selectedTenant?.contact_email || ""}
                  onChange={(e) =>
                    setSelectedTenant((prev) =>
                      prev ? { ...prev, contact_email: e.target.value } : null,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  value={selectedTenant?.contact_phone || ""}
                  onChange={(e) =>
                    setSelectedTenant((prev) =>
                      prev ? { ...prev, contact_phone: e.target.value } : null,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Select
                  value={selectedTenant?.sector || "general"}
                  onValueChange={(value) =>
                    setSelectedTenant((prev) =>
                      prev ? { ...prev, sector: value } : null,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedTenant?.status || "active"}
                  onValueChange={(value) =>
                    setSelectedTenant((prev) =>
                      prev ? { ...prev, status: value } : null,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded-full border"
                      style={{
                        backgroundColor:
                          selectedTenant?.primary_color || "#6366f1",
                      }}
                    />
                    <Input
                      id="primary_color"
                      type="text"
                      value={selectedTenant?.primary_color || ""}
                      onChange={(e) =>
                        setSelectedTenant((prev) =>
                          prev
                            ? { ...prev, primary_color: e.target.value }
                            : null,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded-full border"
                      style={{
                        backgroundColor:
                          selectedTenant?.secondary_color || "#4f46e5",
                      }}
                    />
                    <Input
                      id="secondary_color"
                      type="text"
                      value={selectedTenant?.secondary_color || ""}
                      onChange={(e) =>
                        setSelectedTenant((prev) =>
                          prev
                            ? { ...prev, secondary_color: e.target.value }
                            : null,
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Logo upload section removed */}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedTenant}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Tenant Dialog */}
      <Dialog open={showNewTenantDialog} onOpenChange={setShowNewTenantDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Tenant</DialogTitle>
            <DialogDescription>
              Add a new tenant organization to the platform
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Organization Name *</Label>
                <Input
                  id="new-name"
                  value={newTenant.name}
                  onChange={(e) =>
                    setNewTenant({ ...newTenant, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-email">Primary Email *</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newTenant.email}
                  onChange={(e) =>
                    setNewTenant({ ...newTenant, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-subdomain">Subdomain *</Label>
                <div className="flex items-center">
                  <Input
                    id="new-subdomain"
                    value={newTenant.subdomain}
                    onChange={(e) =>
                      setNewTenant({ ...newTenant, subdomain: e.target.value })
                    }
                    required
                  />
                  <span className="ml-2 text-muted-foreground">
                    .thriveperinatal.com
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-description">Description</Label>
                <Textarea
                  id="new-description"
                  value={newTenant.description}
                  onChange={(e) =>
                    setNewTenant({ ...newTenant, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-contact-email">Contact Email</Label>
                <Input
                  id="new-contact-email"
                  type="email"
                  value={newTenant.contact_email}
                  onChange={(e) =>
                    setNewTenant({
                      ...newTenant,
                      contact_email: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-contact-phone">Contact Phone</Label>
                <Input
                  id="new-contact-phone"
                  value={newTenant.contact_phone}
                  onChange={(e) =>
                    setNewTenant({
                      ...newTenant,
                      contact_phone: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-sector">Sector</Label>
                <Select
                  value={newTenant.sector}
                  onValueChange={(value) =>
                    setNewTenant({ ...newTenant, sector: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector.id} value={sector.id}>
                        {sector.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-plan">Plan</Label>
                <Select
                  value={newTenant.plan}
                  onValueChange={(value) =>
                    setNewTenant({ ...newTenant, plan: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded-full border"
                      style={{ backgroundColor: newTenant.primary_color }}
                    />
                    <Input
                      id="new-primary-color"
                      type="text"
                      value={newTenant.primary_color}
                      onChange={(e) =>
                        setNewTenant({
                          ...newTenant,
                          primary_color: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-secondary-color">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded-full border"
                      style={{ backgroundColor: newTenant.secondary_color }}
                    />
                    <Input
                      id="new-secondary-color"
                      type="text"
                      value={newTenant.secondary_color}
                      onChange={(e) =>
                        setNewTenant({
                          ...newTenant,
                          secondary_color: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Logo upload section removed */}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewTenantDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={createNewTenant}
              disabled={
                !newTenant.name || !newTenant.email || !newTenant.subdomain
              }
            >
              Create Tenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Tenant Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Tenant</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive {tenantToDelete?.name}? This will
              make the tenant inaccessible to users, but all data will be
              preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteTenant}
              className="bg-red-500 hover:bg-red-600"
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                    onChange={handleTemplateFormChange}
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
                    onChange={handleTemplateFormChange}
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
                    onChange={handleTemplateFormChange}
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
                      handleTemplateCheckboxChange(
                        "isRequired",
                        e.target.checked,
                      )
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
                      handleTemplateCheckboxChange("isActive", e.target.checked)
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
      <AlertDialog
        open={showDeleteTemplateDialog}
        onOpenChange={setShowDeleteTemplateDialog}
      >
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

      {/* Template Form Modal */}
      <Dialog open={showTemplateForm} onOpenChange={setShowTemplateForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>
              {templateFormMode === "edit"
                ? "Edit Assessment Template"
                : "Create Assessment Template"}
            </DialogTitle>
            <DialogDescription>
              {templateFormMode === "edit"
                ? "Modify the assessment template details and questions"
                : "Create a new assessment template with custom questions and sections"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {showTemplateForm && (
              <AssessmentTemplateForm
                template={editingTemplate}
                onSave={handleTemplateFormSave}
                onCancel={handleTemplateFormCancel}
                isEdit={templateFormMode === "edit"}
                availableTemplates={assessmentTemplates}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Assessment Trigger Dialog */}
      <Dialog open={showTriggerDialog} onOpenChange={setShowTriggerDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingTrigger ? "Edit" : "Create"} Assessment Trigger
            </DialogTitle>
            <DialogDescription>
              Define conditions that will automatically trigger other
              assessments
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sourceAssessment">Source Assessment</Label>
              <Select
                value={triggerForm.sourceAssessmentId}
                onValueChange={(value) =>
                  setTriggerForm((prev) => ({
                    ...prev,
                    sourceAssessmentId: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source assessment" />
                </SelectTrigger>
                <SelectContent>
                  {assessmentTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="conditionType">Condition Type</Label>
                <Select
                  value={triggerForm.conditionType}
                  onValueChange={(
                    value:
                      | "score_gte"
                      | "score_lte"
                      | "question_value"
                      | "question_contains",
                  ) =>
                    setTriggerForm((prev) => ({
                      ...prev,
                      conditionType: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score_gte">
                      Score ≥ (Greater than or equal)
                    </SelectItem>
                    <SelectItem value="score_lte">
                      Score ≤ (Less than or equal)
                    </SelectItem>
                    <SelectItem value="question_value">
                      Question equals specific value
                    </SelectItem>
                    <SelectItem value="question_contains">
                      Question contains text
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditionValue">Value</Label>
                <Input
                  id="conditionValue"
                  value={triggerForm.conditionValue}
                  onChange={(e) =>
                    setTriggerForm((prev) => ({
                      ...prev,
                      conditionValue: e.target.value,
                    }))
                  }
                  placeholder={
                    triggerForm.conditionType.startsWith("score")
                      ? "e.g., 10"
                      : "e.g., Yes"
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="triggeredAssessment">Assessment to Trigger</Label>
              <Select
                value={triggerForm.triggeredAssessmentId}
                onValueChange={(value) =>
                  setTriggerForm((prev) => ({
                    ...prev,
                    triggeredAssessmentId: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select assessment to trigger" />
                </SelectTrigger>
                <SelectContent>
                  {assessmentTemplates
                    .filter((t) => t.id !== triggerForm.sourceAssessmentId)
                    .map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={triggerForm.notes}
                onChange={(e) =>
                  setTriggerForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Add notes or description for this trigger"
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={triggerForm.isActive}
                onChange={(e) =>
                  setTriggerForm((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isActive">Active Trigger</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTriggerDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTrigger}
              disabled={
                !triggerForm.sourceAssessmentId ||
                !triggerForm.conditionValue ||
                !triggerForm.triggeredAssessmentId
              }
            >
              {editingTrigger ? "Update" : "Create"} Trigger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Form Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Create New User"}
            </DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Update the user's details and organization assignment"
                : "Create a new user and assign them to an organization"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUserFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Name</Label>
                <Input
                  id="user-name"
                  value={userFormData.name}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, name: e.target.value })
                  }
                  placeholder="User's full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  value={userFormData.email}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, email: e.target.value })
                  }
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-organization">Organization</Label>
                <Select
                  value={userFormData.tenantId}
                  onValueChange={(value) => {
                    const selectedOrg = tenants.find(
                      (t) => t.tenant_id === value,
                    );
                    setUserFormData({
                      ...userFormData,
                      tenantId: value,
                      organizationName: selectedOrg?.name || "",
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants
                      .filter((t) => t.status !== "archived")
                      .map((tenant) => (
                        <SelectItem
                          key={tenant.id}
                          value={tenant.tenant_id || ""}
                        >
                          {tenant.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-role">Role</Label>
                <Select
                  value={userFormData.role}
                  onValueChange={(value) =>
                    setUserFormData({ ...userFormData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="org_admin">
                      Organization Admin
                    </SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="support_worker">
                      Support Worker
                    </SelectItem>
                    <SelectItem value="readonly">Read Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-status">Status</Label>
                <Select
                  value={userFormData.status}
                  onValueChange={(value) =>
                    setUserFormData({ ...userFormData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowUserDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !userFormData.name ||
                  !userFormData.email ||
                  !userFormData.tenantId
                }
              >
                {editingUser ? "Update User" : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog
        open={showDeleteUserDialog}
        onOpenChange={setShowDeleteUserDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This will
              permanently remove their account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
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

export default SuperAdminDashboard;
