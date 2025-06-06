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
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import SuccessToast from "./SuccessToast";
import { useUser } from "@/context/UserContext";
import { Organization } from "@/types/admin";
import BackButton from "./BackButton";
import { Link } from "react-router-dom";
import { supabaseClient } from "@/lib/supabaseClient";
import { useTenant } from "@/context/TenantContext";
import Logo from "./Logo";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { tenantId } = useTenant();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("tenants");
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
  });
  // Logo functionality removed
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check if user is super admin
  useEffect(() => {
    if (tenantId === "0") {
      setIsAuthenticated(true);
    }
  }, [tenantId]);

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
        },
        {
          id: "demo-tenant",
          name: "Demo",
          status: "trial" as "trial",
          plan: "trial" as "trial",
          createdAt: new Date().toISOString(),
          email: "demo@ogstat.app",
          subdomain: "demo",
          tenant_id: "3",
          primary_color: "#f59e0b",
          secondary_color: "#fbbf24",
        },
      ];

      // Set the predefined tenants
      setTenants(predefinedTenants);
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 border-b bg-background">
          <div className="flex h-16 items-center px-4 md:px-6">
            <BackButton />
            <Link to="/admin" className="ml-4">
              <Logo size="md" />
            </Link>
            <h1 className="ml-4 text-3xl font-bold">OG Control Panel</h1>
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
          <div className="ml-auto">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Dashboard
              </Button>
            </Link>
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
              onClick={() => {
                setShowNewTenantDialog(true);
              }}
            >
              <Plus className="h-4 w-4" /> Add Tenant
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={fetchTenants}
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
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="tenants">Active Tenants</TabsTrigger>
            <TabsTrigger value="archived">Archived Tenants</TabsTrigger>
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
                          <th className="p-2">Subdomain</th>
                          <th className="p-2">Tenant ID</th>
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
                                {tenant.subdomain ? (
                                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                    {tenant.subdomain}.ogstat.app
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground text-xs">
                                    Not set
                                  </span>
                                )}
                              </td>
                              <td className="p-2">
                                <span className="font-mono text-xs">
                                  {tenant.tenant_id || "Not set"}
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
                                    onClick={() => impersonateTenant(tenant)}
                                    className="flex items-center gap-1"
                                  >
                                    <LogIn className="h-3 w-3" />
                                    Login As
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditTenant(tenant)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteTenant(tenant)}
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
                          <th className="p-2">Subdomain</th>
                          <th className="p-2">Tenant ID</th>
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
                                {tenant.subdomain ? (
                                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                                    {tenant.subdomain}.ogstat.app
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground text-xs">
                                    Not set
                                  </span>
                                )}
                              </td>
                              <td className="p-2 text-muted-foreground">
                                <span className="font-mono text-xs">
                                  {tenant.tenant_id || "Not set"}
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
                                    onClick={() => {
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
                    .ogstat.app
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
                    .ogstat.app
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
    </div>
  );
};

export default SuperAdminDashboard;
