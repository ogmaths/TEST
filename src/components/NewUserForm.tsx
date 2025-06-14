import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BackButton from "./BackButton";
import { Users } from "lucide-react";
import { useUser } from "@/context/UserContext";

const NewUserForm = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: user?.tenantId || "",
    role: "support_worker",
    status: "active",
  });

  // Initialize organization for managers
  useEffect(() => {
    if (user?.role === "manager" && user?.tenantId) {
      setFormData((prev) => ({
        ...prev,
        organization: user.tenantId,
      }));
    }
  }, [user]);

  // Check if user has permission to create users
  useEffect(() => {
    if (user?.role === "support_worker") {
      // Workers cannot create users - redirect them
      navigate("/clients");
      return;
    }

    // Managers can only create users within their organization
    if (
      user?.role === "manager" &&
      formData.organization &&
      formData.organization !== user?.tenantId
    ) {
      // Reset organization to manager's tenant if they try to select a different one
      setFormData((prev) => ({
        ...prev,
        organization: user?.tenantId || "",
      }));
    }
  }, [user, navigate, formData.organization]);

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Only admins, super admins, and managers can create users
    if (user?.role === "support_worker") {
      alert("You do not have permission to create users.");
      setIsLoading(false);
      return;
    }

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert("First name and last name are required.");
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      alert("Email is required.");
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    // Managers can only create users within their own organization
    if (user?.role === "manager" && formData.organization !== user?.tenantId) {
      alert("You can only create users within your own organization.");
      setIsLoading(false);
      return;
    }

    // Get existing users to check for duplicates
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const emailExists = existingUsers.some(
      (u: any) => u.email.toLowerCase() === formData.email.toLowerCase(),
    );

    if (emailExists) {
      alert("A user with this email already exists.");
      setIsLoading(false);
      return;
    }

    // Create user with proper data structure
    const newUser = {
      id: Date.now().toString(),
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
      status: formData.status,
      lastLogin: new Date().toISOString(),
      organizationId:
        user?.role === "super_admin"
          ? formData.organization
          : user?.organizationId,
      area: "", // Can be assigned later
      createdAt: new Date().toISOString(),
      createdBy: user?.id,
    };

    // Save to localStorage
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      alert("User created successfully!");
      navigate("/admin?tab=users");
    }, 1000);
  };

  // Mock data for organizations
  const organizations = [
    { id: "1", name: "Helping Hands Foundation" },
    { id: "2", name: "Community Care Network" },
    { id: "3", name: "Youth Support Initiative" },
    { id: "4", name: "Elder Care Services" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <BackButton />
          <h1 className="ml-4 text-3xl font-bold">Add New User</h1>
          <div className="ml-auto">
            <Link to="/admin?tab=users">
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Enter the details for the new user account.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                {user?.role === "manager" ? (
                  <Input
                    value={user?.organizationName || "Your Organization"}
                    disabled
                    className="bg-muted"
                  />
                ) : (
                  <Select
                    value={formData.organization}
                    onValueChange={(value) =>
                      handleSelectChange("organization", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent>
                      {user?.role === "super_admin" ? (
                        organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value={user?.tenantId || ""}>
                          {user?.organizationName || "Your Organization"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {user?.role === "super_admin" && (
                      <SelectItem value="admin">Admin</SelectItem>
                    )}
                    {(user?.role === "super_admin" ||
                      user?.role === "admin") && (
                      <SelectItem value="org_admin">
                        Organization Admin
                      </SelectItem>
                    )}
                    <SelectItem value="support_worker">
                      Support Worker
                    </SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="readonly">Read Only</SelectItem>
                  </SelectContent>
                </Select>
                {user?.role === "manager" && (
                  <p className="text-xs text-muted-foreground">
                    As a manager, you can create support workers, managers, and
                    read-only users within your organization.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin?tab=users")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create User"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default NewUserForm;
