import { Suspense, useEffect, useState } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { supabase } from "@/lib/supabase";
import LoginPage from "./components/LoginPage";
import LandingPage from "./components/LandingPage";
import Home from "./components/home";
import ClientsPage from "./components/ClientsPage";
import AssessmentsPage from "./components/AssessmentsPage";
import WorkerAssessments from "./components/WorkerAssessments";
import EventsPage from "./components/EventsPage";
import ClientDashboard from "./components/ClientDashboard";
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
import SalesDashboard from "./components/SalesDashboard";
import ViewAssessment from "./components/ViewAssessment";
import AssessmentForm from "./components/AssessmentForm";

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
  const { user, isLoggedIn, isLoadingRole, fetchUserRole } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboardRoute = location.pathname === "/dashboard";
  const isLandingPage = location.pathname === "/";
  const isLoginPage = location.pathname === "/login";
  const isAdminDashboard = location.pathname === "/admin";
  const isSuperAdminDashboard = location.pathname === "/super-admin";
  const isDebugAdmin = location.pathname === "/debug-admin";

  // Initialize app and handle authentication state
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("🔍 App - Initializing app...");

        // Check if user is already authenticated
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("🔍 App - Session error:", error);
          setIsInitializing(false);
          return;
        }

        if (session?.user) {
          console.log("🔍 App - Found existing session, fetching user role...");
          await fetchUserRole();
        }

        setIsInitializing(false);
      } catch (error) {
        console.error("🔍 App - Initialization error:", error);
        setIsInitializing(false);
      }
    };

    initializeApp();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔍 App - Auth state changed:", event, session?.user?.id);

      if (event === "SIGNED_IN" && session?.user) {
        console.log("🔍 App - User signed in, fetching role...");
        await fetchUserRole();
      } else if (event === "SIGNED_OUT") {
        console.log("🔍 App - User signed out");
        // Clear user context is handled by UserContext
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserRole]);

  // Role-based redirection logic - simplified to avoid redirect loops
  useEffect(() => {
    if (!isInitializing && !isLoadingRole && isLoggedIn && user?.role) {
      const currentPath = location.pathname;

      console.log("🔍 App - Role-based redirect check:", {
        role: user.role,
        currentPath,
        tenantId: user.tenantId,
      });

      // Skip redirection if user is on login, landing, confidentiality agreement, or already on a valid page
      const skipRedirectPaths = [
        "/login",
        "/",
        "/confidentiality-agreement",
        "/clients",
        "/events",
        "/assessments",
        "/client/",
        "/assessment/",
        "/interaction/",
        "/admin",
        "/super-admin",
        "/super-admin-dashboard",
        "/sales-dashboard",
        "/support-dashboard",
      ];

      const shouldSkipRedirect = skipRedirectPaths.some(
        (path) => currentPath === path || currentPath.startsWith(path),
      );

      if (shouldSkipRedirect) {
        return;
      }

      // Only redirect from root dashboard path
      if (currentPath === "/dashboard") {
        let targetPath = "/support-dashboard"; // default for support workers

        if (user.role === "super_admin" || user.tenantId === "0") {
          targetPath = "/super-admin-dashboard";
        } else if (user.role === "admin" || user.role === "org_admin") {
          targetPath = "/admin";
        } else if (user.role === "sales") {
          targetPath = "/sales-dashboard";
        } else if (user.role === "support_worker") {
          targetPath = "/support-dashboard";
        }

        console.log(
          `🔍 App - Redirecting ${user.role} from ${currentPath} to ${targetPath}`,
        );
        navigate(targetPath, { replace: true });
      }
    }
  }, [
    isInitializing,
    isLoadingRole,
    isLoggedIn,
    user,
    location.pathname,
    navigate,
  ]);

  // Debug logging for user state
  useEffect(() => {
    console.log("🔍 App Debug - Current user:", user);
    console.log("🔍 App Debug - Is logged in:", isLoggedIn);
    console.log("🔍 App Debug - Current location:", location.pathname);
    console.log("🔍 App Debug - User role:", user?.role);
    console.log("🔍 App Debug - Is initializing:", isInitializing);
    console.log("🔍 App Debug - Is loading role:", isLoadingRole);
  }, [user, isLoggedIn, location.pathname, isInitializing, isLoadingRole]);

  // Hide header on these specific pages
  const shouldHideHeader =
    isLandingPage ||
    isLoginPage ||
    isAdminDashboard ||
    isSuperAdminDashboard ||
    isDebugAdmin ||
    location.pathname === "/confidentiality-agreement";

  // Show sidebar for all logged-in users except on specific pages
  const shouldShowSidebar = isLoggedIn && !shouldHideHeader;

  // Keep sidebar state persistent across navigation
  useEffect(() => {
    // Don't auto-close sidebar when navigating
  }, [location.pathname]);

  // Show loading screen only during initial app load
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div className="space-y-2">
            <p className="text-lg font-medium">Loading...</p>
            <p className="text-sm text-muted-foreground">
              Initializing application
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Protected route component - simplified to reduce redirect loops
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    console.log("🔍 ProtectedRoute - isLoggedIn:", isLoggedIn);
    console.log("🔍 ProtectedRoute - user:", user);
    console.log("🔍 ProtectedRoute - isLoadingRole:", isLoadingRole);

    // Show loading if we're still determining user role
    if (isLoggedIn && isLoadingRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">
              Loading user data...
            </p>
          </div>
        </div>
      );
    }

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
    console.log("🔍 AdminRoute - isLoadingRole:", isLoadingRole);

    if (!isLoggedIn) {
      console.log("🔍 AdminRoute - Redirecting to login (not logged in)");
      return <Navigate to="/login" replace />;
    }

    if (!user || isLoadingRole) {
      console.log(
        "🔍 AdminRoute - No user object or loading role, showing loading...",
      );
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

    const isAdmin =
      user.role === "admin" ||
      user.role === "super_admin" ||
      user.role === "org_admin";
    console.log("🔍 AdminRoute - Is admin check:", isAdmin);

    if (!isAdmin) {
      console.log(
        "🔍 AdminRoute - Access denied, redirecting to appropriate dashboard",
      );
      // Redirect to appropriate dashboard based on role
      if (user.role === "sales") {
        return <Navigate to="/sales-dashboard" replace />;
      } else if (user.role === "support_worker") {
        return <Navigate to="/support-dashboard" replace />;
      } else {
        return <Navigate to="/support-dashboard" replace />;
      }
    }

    console.log("🔍 AdminRoute - Rendering admin content");
    return <>{children}</>;
  };

  // Role-specific route protection components
  const SalesRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    if (!user || isLoadingRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading user data...</p>
          </div>
        </div>
      );
    }

    if (!user?.hasAcceptedConfidentiality) {
      return <Navigate to="/confidentiality-agreement" replace />;
    }

    if (user?.role !== "sales") {
      // Redirect to appropriate dashboard based on role
      if (user?.role === "super_admin" || user?.tenantId === "0") {
        return <Navigate to="/super-admin-dashboard" replace />;
      } else if (user?.role === "admin" || user?.role === "org_admin") {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/support-dashboard" replace />;
      }
    }

    return <>{children}</>;
  };

  const SupportWorkerRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    if (!user || isLoadingRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading user data...</p>
          </div>
        </div>
      );
    }

    if (!user?.hasAcceptedConfidentiality) {
      return <Navigate to="/confidentiality-agreement" replace />;
    }

    if (user?.role !== "support_worker") {
      // Redirect to appropriate dashboard based on role
      if (user?.role === "super_admin" || user?.tenantId === "0") {
        return <Navigate to="/super-admin-dashboard" replace />;
      } else if (user?.role === "admin" || user?.role === "org_admin") {
        return <Navigate to="/admin" replace />;
      } else if (user?.role === "sales") {
        return <Navigate to="/sales-dashboard" replace />;
      } else {
        return <Navigate to="/support-dashboard" replace />;
      }
    }

    return <>{children}</>;
  };

  const SuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }

    if (!user || isLoadingRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading user data...</p>
          </div>
        </div>
      );
    }

    if (!user?.hasAcceptedConfidentiality) {
      return <Navigate to="/confidentiality-agreement" replace />;
    }

    if (user?.role !== "super_admin" && user?.tenantId !== "0") {
      // Redirect to appropriate dashboard based on role
      if (user?.role === "admin" || user?.role === "org_admin") {
        return <Navigate to="/admin" replace />;
      } else if (user?.role === "sales") {
        return <Navigate to="/sales-dashboard" replace />;
      } else {
        return <Navigate to="/support-dashboard" replace />;
      }
    }

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
                                {/* Sales Dashboard - Only for sales role */}
                                {user?.role === "sales" && (
                                  <Link
                                    to="/sales-dashboard"
                                    onClick={() => setSidebarOpen(false)}
                                  >
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                    >
                                      <BarChart2 className="mr-2 h-4 w-4" />
                                      Sales Dashboard
                                    </Button>
                                  </Link>
                                )}

                                {/* Support Worker Dashboard - Only for support_worker role */}
                                {user?.role === "support_worker" && (
                                  <Link
                                    to="/support-dashboard"
                                    onClick={() => setSidebarOpen(false)}
                                  >
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                    >
                                      <HomeIcon className="mr-2 h-4 w-4" />
                                      Support Dashboard
                                    </Button>
                                  </Link>
                                )}

                                {/* Common navigation items for all authenticated users */}
                                {isLoggedIn && (
                                  <>
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
                                  </>
                                )}

                                {/* Super Admin Dashboard - Only for super_admin role */}
                                {(user?.role === "super_admin" ||
                                  user?.tenantId === "0") && (
                                  <Link
                                    to="/super-admin-dashboard"
                                    onClick={() => setSidebarOpen(false)}
                                  >
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                    >
                                      <Settings className="mr-2 h-4 w-4" />
                                      Super Admin
                                    </Button>
                                  </Link>
                                )}

                                {/* Admin Dashboard - Only for admin/org_admin roles */}
                                {(user?.role === "admin" ||
                                  user?.role === "org_admin") && (
                                  <Link
                                    to="/admin"
                                    onClick={() => setSidebarOpen(false)}
                                  >
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-start"
                                    >
                                      <Settings className="mr-2 h-4 w-4" />
                                      Admin Dashboard
                                    </Button>
                                  </Link>
                                )}
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

                {/* Sales Dashboard Route */}
                <Route
                  path="/sales-dashboard"
                  element={
                    <SalesRoute>
                      <SalesDashboard />
                    </SalesRoute>
                  }
                />

                {/* Support Worker Dashboard Route */}
                <Route
                  path="/support-dashboard"
                  element={
                    <SupportWorkerRoute>
                      <Home />
                    </SupportWorkerRoute>
                  }
                />

                {/* Legacy dashboard route - redirect based on role */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      {user?.role === "sales" ? (
                        <Navigate to="/sales-dashboard" replace />
                      ) : user?.role === "super_admin" ||
                        user?.tenantId === "0" ? (
                        <Navigate to="/super-admin-dashboard" replace />
                      ) : user?.role === "admin" ||
                        user?.role === "org_admin" ? (
                        <Navigate to="/admin" replace />
                      ) : (
                        <Navigate to="/support-dashboard" replace />
                      )}
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
                      <ClientDashboard />
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
                  path="/super-admin"
                  element={
                    <SuperAdminRoute>
                      <SuperAdminDashboard />
                    </SuperAdminRoute>
                  }
                />

                <Route
                  path="/super-admin-dashboard"
                  element={
                    <SuperAdminRoute>
                      <SuperAdminDashboard />
                    </SuperAdminRoute>
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
