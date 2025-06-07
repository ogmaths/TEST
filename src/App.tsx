import { Suspense, useEffect, useState } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import Home from "./components/home";
import ClientsPage from "./components/ClientsPage";
import AssessmentsPage from "./components/AssessmentsPage";
import WorkerAssessments from "./components/WorkerAssessments";
import EventsPage from "./components/EventsPage";
import ClientProfile from "./components/ClientProfile";
import EventAttendanceRegister from "./components/EventAttendanceRegister";
import NewClientForm from "./components/NewClientForm";
import NewEventForm from "./components/NewEventForm";
import SelfRegistrationPage from "./components/SelfRegistrationPage";
import AdminDashboard from "./components/AdminDashboard";
import NewUserForm from "./components/NewUserForm";
import AddInteractionPage from "./components/AddInteractionPage";
import routes from "tempo-routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "./context/UserContext";

import { NotificationProvider } from "./context/NotificationContext";
import { TenantProvider } from "./context/TenantContext";
import UserHeader from "./components/UserHeader";
import NotificationCenter from "./components/NotificationCenter";
import OrganizationSwitcher from "./components/OrganizationSwitcher";
import SuperAdminDashboard from "./components/SuperAdminDashboard";
import ViewAssessment from "./components/ViewAssessment";
import AssessmentForm from "./components/AssessmentForm";
import AssessmentBuilderPage from "./components/AssessmentBuilderPage";
import ConfidentialityAgreement from "./components/ConfidentialityAgreement";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Home as HomeIcon,
  Users,
  FileText,
  Calendar,
  BarChart2,
  Settings,
} from "lucide-react";

function App() {
  const { user, isLoggedIn } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isDashboardRoute = location.pathname === "/dashboard";
  const isLandingPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isAdminDashboard = location.pathname === "/admin";
  const isSuperAdminDashboard = location.pathname === "/super-admin";
  const isDebugAdmin = location.pathname === "/debug-admin";

  // Debug logging for user state
  useEffect(() => {
    console.log("🔍 App Debug - Current user:", user);
    console.log("🔍 App Debug - Is logged in:", isLoggedIn);
    console.log("🔍 App Debug - Current location:", location.pathname);
    console.log("🔍 App Debug - User role:", user?.role);
  }, [user, isLoggedIn, location.pathname]);

  // Hide header on these specific pages
  const shouldHideHeader =
    isLandingPage ||
    isLoginPage ||
    isAdminDashboard ||
    isSuperAdminDashboard ||
    isDebugAdmin;

  // Show sidebar for all logged-in users except on specific pages
  const shouldShowSidebar = isLoggedIn && !shouldHideHeader;

  // Keep sidebar state persistent across navigation
  useEffect(() => {
    // Don't auto-close sidebar when navigating
  }, [location.pathname]);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    console.log("🔍 ProtectedRoute - isLoggedIn:", isLoggedIn);
    console.log("🔍 ProtectedRoute - user:", user);

    if (!isLoggedIn) {
      console.log("🔍 ProtectedRoute - Redirecting to login (not logged in)");
      return <Navigate to="/login" replace />;
    }

    // Check if user has accepted confidentiality agreement
    if (isLoggedIn && user && !user.hasAcceptedConfidentiality) {
      console.log(
        "🔍 ProtectedRoute - Redirecting to confidentiality agreement",
      );
      return <Navigate to="/confidentiality-agreement" replace />;
    }

    console.log("🔍 ProtectedRoute - Rendering protected content");
    return <>{children}</>;
  };

  // Admin route component with enhanced debugging
  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    console.log("🔍 AdminRoute - user:", user);
    console.log("🔍 AdminRoute - user role:", user?.role);
    console.log("🔍 AdminRoute - isLoggedIn:", isLoggedIn);

    if (!isLoggedIn) {
      console.log("🔍 AdminRoute - Redirecting to login (not logged in)");
      return <Navigate to="/login" replace />;
    }

    if (!user) {
      console.log("🔍 AdminRoute - No user object, showing loading...");
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading user data...</p>
          </div>
        </div>
      );
    }

    // Check if user has accepted confidentiality agreement
    if (!user.hasAcceptedConfidentiality) {
      console.log("🔍 AdminRoute - Redirecting to confidentiality agreement");
      return <Navigate to="/confidentiality-agreement" replace />;
    }

    const isAdmin = user.role === "admin" || user.role === "super_admin";
    console.log("🔍 AdminRoute - Is admin check:", isAdmin);

    if (!isAdmin) {
      console.log("🔍 AdminRoute - Access denied, redirecting to dashboard");
      return <Navigate to="/dashboard" replace />;
    }

    console.log("🔍 AdminRoute - Rendering admin content");
    return <>{children}</>;
  };

  return (
    <TenantProvider>
      <NotificationProvider>
        <Suspense fallback={<p>Loading...</p>}>
          <div className="flex flex-col min-h-screen">
            {/* Header with navigation menu - hidden on specific pages */}
            {!shouldHideHeader && (
              <header className="bg-background border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {shouldShowSidebar && (
                      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                          <div className="flex flex-col h-full">
                            <div className="p-4 border-b">
                              <div className="text-lg font-semibold">
                                CRM System
                              </div>
                            </div>
                            <div className="flex-1 py-4">
                              <nav className="space-y-1 px-2">
                                <Link
                                  to="/dashboard"
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                  >
                                    <HomeIcon className="mr-2 h-4 w-4" />
                                    Dashboard
                                  </Button>
                                </Link>
                                <Link
                                  to="/clients"
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                  >
                                    <Users className="mr-2 h-4 w-4" />
                                    Clients
                                  </Button>
                                </Link>
                                <Link
                                  to="/events"
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                  >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Events
                                  </Button>
                                </Link>
                                <Link
                                  to="/assessments"
                                  onClick={() => setSidebarOpen(false)}
                                >
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Assessments
                                  </Button>
                                </Link>
                              </nav>
                            </div>
                            <div className="p-4 border-t">
                              <UserHeader />
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    )}
                    {shouldShowSidebar && (
                      <div className="text-lg font-semibold ml-2">CRM</div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {isLoggedIn && <NotificationCenter />}
                      {isLoggedIn && !shouldShowSidebar && <UserHeader />}
                      {isLoggedIn && user?.role === "super_admin" && (
                        <OrganizationSwitcher />
                      )}
                    </div>
                  </div>
                </div>
              </header>
            )}

            {/* Main content */}
            <main className="flex-1">
              {/* For the tempo routes */}
              {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/confidentiality-agreement"
                  element={
                    isLoggedIn ? (
                      <ConfidentialityAgreement />
                    ) : (
                      <Navigate to="/login" replace />
                    )
                  }
                />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clients"
                  element={
                    <ProtectedRoute>
                      <ClientsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clients/new"
                  element={
                    <ProtectedRoute>
                      <NewClientForm />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/assessment/view/:id"
                  element={
                    <ProtectedRoute>
                      <ViewAssessment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assessment/edit/:id"
                  element={
                    <ProtectedRoute>
                      <AssessmentForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events"
                  element={
                    <ProtectedRoute>
                      <EventsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events/new"
                  element={
                    <ProtectedRoute>
                      <NewEventForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events/attendance/:eventId"
                  element={
                    <ProtectedRoute>
                      <EventAttendanceRegister
                        eventId="1"
                        onSave={(attendees) =>
                          console.log("Saved attendees:", attendees)
                        }
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/client/:id"
                  element={
                    <ProtectedRoute>
                      <ClientProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/events/register/:eventId"
                  element={
                    <ProtectedRoute>
                      <SelfRegistrationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <Suspense
                        fallback={
                          <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                              <p>Loading admin dashboard...</p>
                            </div>
                          </div>
                        }
                      >
                        <AdminDashboard />
                      </Suspense>
                    </AdminRoute>
                  }
                />

                {/* Debug route for admin dashboard */}
                <Route
                  path="/debug-admin"
                  element={
                    <ProtectedRoute>
                      <Suspense
                        fallback={
                          <div className="min-h-screen flex items-center justify-center">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                              <p>Loading debug admin dashboard...</p>
                            </div>
                          </div>
                        }
                      >
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                            🐛 Debug Admin Route
                          </h2>
                          <p className="text-yellow-700 mb-2">
                            This route bypasses role checks for debugging.
                          </p>
                          <div className="text-sm text-yellow-600">
                            <p>User: {user?.name || "No user"}</p>
                            <p>Role: {user?.role || "No role"}</p>
                            <p>Email: {user?.email || "No email"}</p>
                            <p>Logged in: {isLoggedIn ? "Yes" : "No"}</p>
                          </div>
                        </div>
                        <AdminDashboard />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assessment-builder"
                  element={
                    <ProtectedRoute>
                      <AssessmentBuilderPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/super-admin"
                  element={
                    <ProtectedRoute>
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/users/new"
                  element={
                    <ProtectedRoute>
                      <NewUserForm />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/interaction/add"
                  element={
                    <ProtectedRoute>
                      <AddInteractionPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/interaction/add/:clientId"
                  element={
                    <ProtectedRoute>
                      <AddInteractionPage />
                    </ProtectedRoute>
                  }
                />

                {/* Add this before the catchall route */}
                {import.meta.env.VITE_TEMPO === "true" && (
                  <Route path="/tempobook/*" />
                )}

                <Route
                  path="/assessments"
                  element={
                    <ProtectedRoute>
                      {user?.role === "admin" ? (
                        <AssessmentsPage />
                      ) : (
                        <WorkerAssessments />
                      )}
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Suspense>
      </NotificationProvider>
    </TenantProvider>
  );
}

export default App;
