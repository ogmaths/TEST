import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      { email: "sales@example.com", password: "sales123" },
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
      } else if (email === "sales@example.com") {
        setUser({
          id: "9",
          name: "Sales Manager",
          email: email,
          role: "sales",
          tenantId: "4", // Sales tenant ID
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white flex flex-col">
      {/* Header */}
      <header className="px-6 lg:px-8 h-16 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center">
          <Logo size="md" variant="default" />
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-600">
                Sign in to your account to continue
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 px-4 pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                >
                  Sign in
                </Button>
              </form>

              {/* Demo Accounts Info */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 text-center font-medium mb-2">
                  Demo Accounts
                </p>
                <div className="text-xs text-blue-700 space-y-1">
                  <div>Admin: admin@example.com / admin123</div>
                  <div>Staff: staff@example.com / staff123</div>
                  <div>Sales: sales@example.com / sales123</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6">
        <div className="text-center">
          <p className="text-sm text-gray-500">
            © 2024 Impact CRM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
