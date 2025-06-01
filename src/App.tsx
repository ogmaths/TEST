import { Suspense } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Home from "./components/home";
import ClientsPage from "./components/ClientsPage";
import AssessmentsPage from "./components/AssessmentsPage";
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
import Logo from "./components/Logo";
import { NotificationProvider } from "./context/NotificationContext";
import { TenantProvider } from "./context/TenantContext";
import UserHeader from "./components/UserHeader";
import NotificationCenter from "./components/NotificationCenter";
import { useState, useEffect } from "react";
import OrganizationSwitcher from "./components/OrganizationSwitcher";
import SuperAdminDashboard from "./components/SuperAdminDashboard";
import ViewAssessment from "./components/ViewAssessment";
import AssessmentForm from "./components/AssessmentForm";
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

  // Close sidebar when navigating away from dashboard
  useEffect(() => {
    if (!isDashboardRoute) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isDashboardRoute]);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  return (
    <TenantProvider>
      <NotificationProvider>
        <Suspense fallback={<p>Loading...</p>}>
          <div className="flex flex-col min-h-screen">
            {/* Header with navigation menu */}
            <header className="bg-background border-b sticky top-0 z-10">
              <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {isLoggedIn && !isDashboardRoute && (
                    <Logo size="sm" variant="default" />
                  )}
                  {isLoggedIn && isDashboardRoute && (
                    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Menu className="h-5 w-5" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-64 p-0">
                        <div className="flex flex-col h-full">
                          <div className="p-4 border-b">
                            <Logo size="md" variant="default" />
                          </div>
                          <div className="flex-1 py-4">
                            <nav className="space-y-1 px-2">
                              <Link to="/dashboard">
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start"
                                >
                                  <HomeIcon className="mr-2 h-4 w-4" />
                                  Dashboard
                                </Button>
                              </Link>
                              <Link to="/clients">
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start"
                                >
                                  <Users className="mr-2 h-4 w-4" />
                                  Clients
                                </Button>
                              </Link>
                              <Link to="/events">
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start"
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Events
                                </Button>
                              </Link>
                              <Link to="/assessments">
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
                  {isLoggedIn && isDashboardRoute && (
                    <Logo size="sm" variant="default" className="ml-2" />
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {isLoggedIn && <NotificationCenter />}
                    {isLoggedIn && !isDashboardRoute && <UserHeader />}
                    {isLoggedIn && user?.role === "super_admin" && (
                      <OrganizationSwitcher />
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* Main content */}
            <main className="flex-1">
              {/* For the tempo routes */}
              {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                  path="/"
                  element={
                    isLoggedIn ? (
                      <Navigate to="/dashboard" replace />
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
                    <ProtectedRoute>
                      <AdminDashboard />
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
                  path="*"
                  element={
                    <Navigate
                      to={isLoggedIn ? "/dashboard" : "/login"}
                      replace
                    />
                  }
                />
              </Routes>
            </main>
          </div>
        </Suspense>
      </NotificationProvider>
    </TenantProvider>
  );
}

export default App;
