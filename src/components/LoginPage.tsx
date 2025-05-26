import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useUser();

  // For demo purposes, we'll use a simple mock login
  // In a real app, this would connect to an authentication service
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Mock credentials for demo
    // Only accept specific email/password combinations
    const validCredentials = [
      { email: "admin@example.com", password: "admin123" },
      { email: "b3@example.com", password: "b3password" },
      { email: "parents1st@example.com", password: "parents1st" },
      { email: "demo@example.com", password: "demo123" },
      { email: "super@admin.com", password: "superadmin123" },
      { email: "b3admin@example.com", password: "b3admin" },
      { email: "parents1stadmin@example.com", password: "parents1stadmin" },
      { email: "demoadmin@example.com", password: "demoadmin" },
      { email: "staff@example.com", password: "staff123" },
    ];

    const isValidCredential = validCredentials.some(
      (cred) => cred.email === email && cred.password === password,
    );

    if (email && password && isValidCredential) {
      // Set appropriate user based on login
      if (email === "admin@example.com") {
        setUser({
          id: "1",
          name: "Stacy Williams",
          email: "admin@example.com",
          role: "admin",
        });
      } else if (email === "b3@example.com") {
        setUser({
          id: "2",
          name: "B3 Manager",
          email: email,
          role: "staff",
          tenantId: "b3-tenant",
          organizationSlug: "b3",
          organizationName: "B3",
          organizationColor: "#3b82f6",
        });
      } else if (email === "parents1st@example.com") {
        setUser({
          id: "3",
          name: "Parents1st Manager",
          email: email,
          role: "staff",
          tenantId: "parents1st-tenant",
          organizationSlug: "parents1st",
          organizationName: "Parents1st",
          organizationColor: "#10b981",
        });
      } else if (email === "demo@example.com") {
        setUser({
          id: "4",
          name: "Demo User",
          email: email,
          role: "staff",
          tenantId: "demo-tenant",
          organizationSlug: "demo",
          organizationName: "Demo Organization",
          organizationColor: "#8b5cf6",
        });
      } else if (email === "super@admin.com" || password === "superadmin123") {
        setUser({
          id: "0",
          name: "Super Admin",
          email: email,
          role: "super_admin",
          tenantId: "0",
        });
        navigate("/super-admin");
        return;
      } else if (email === "b3admin@example.com") {
        setUser({
          id: "6",
          name: "B3 Admin",
          email: email,
          role: "admin",
          tenantId: "b3-tenant",
          organizationSlug: "b3",
          organizationName: "B3",
          organizationColor: "#3b82f6",
          isOrgAdmin: true,
        });
      } else if (email === "parents1stadmin@example.com") {
        setUser({
          id: "7",
          name: "Parents1st Admin",
          email: email,
          role: "admin",
          tenantId: "parents1st-tenant",
          organizationSlug: "parents1st",
          organizationName: "Parents1st",
          organizationColor: "#10b981",
          isOrgAdmin: true,
        });
      } else if (email === "demoadmin@example.com") {
        setUser({
          id: "8",
          name: "Demo Admin",
          email: email,
          role: "admin",
          tenantId: "demo-tenant",
          organizationSlug: "demo",
          organizationName: "Demo Organization",
          organizationColor: "#8b5cf6",
          isOrgAdmin: true,
        });
      } else {
        setUser({
          id: "5",
          name: "Michael Johnson",
          email: email,
          role: email === "staff@example.com" ? "support_worker" : "staff",
          tenantId: "2", // Staff tenant ID
        });
      }
      navigate("/dashboard");
    } else {
      setError(
        "Invalid email or password. Please use one of the demo accounts.",
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="staff@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Card>
      <CardFooter className="flex flex-col items-center space-y-2">
        <p className="text-sm text-gray-500 font-semibold">
          Use demo accounts like admin@example.com/admin123 or
          staff@example.com/staff123
        </p>
      </CardFooter>
    </div>
  );
}
