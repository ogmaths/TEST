import { Suspense } from "react";
import { useRoutes, Routes, Route, Link, Navigate } from "react-router-dom";
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
import routes from "tempo-routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "./context/UserContext";
import Logo from "./components/Logo";
import { NotificationProvider } from "./context/NotificationContext";
import { TenantProvider } from "./context/TenantContext";
import UserHeader from "./components/UserHeader";
import NotificationCenter from "./components/NotificationCenter";
import { useState } from "react";
import UserSettings from "./components/UserSettings";
import OrganizationSwitcher from "./components/OrganizationSwitcher";
import SuperAdminDashboard from "./components/SuperAdminDashboard";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

function App() {
  const [showUserSettings, setShowUserSettings] = useState(false);
  const { user, isLoggedIn } = useUser();

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
            {isLoggedIn && (
              <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center justify-between">
                  <div className="flex items-center gap-6">
                    <Logo size="md" variant="default" />
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <Link
                            to="/dashboard"
                            className={navigationMenuTriggerStyle()}
                          >
                            Dashboard
                          </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <Link
                            to="/clients"
                            className={navigationMenuTriggerStyle()}
                          >
                            Clients
                          </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <Link
                            to="/events"
                            className={navigationMenuTriggerStyle()}
                          >
                            Events
                          </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                          <Link
                            to="/assessments"
                            className={navigationMenuTriggerStyle()}
                          >
                            Assessments
                          </Link>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </div>
                  {/* Right side header */}
                  <div className="flex items-center gap-4">
                    <UserHeader
                      onSettingsClick={() => setShowUserSettings(true)}
                    />
                  </div>
                </div>
              </header>
            )}

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
                  path="/assessments"
                  element={
                    <ProtectedRoute>
                      <AssessmentsPage />
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

            {/* User Settings Dialog */}
            {isLoggedIn && (
              <UserSettings
                open={showUserSettings}
                onOpenChange={setShowUserSettings}
              />
            )}
          </div>
        </Suspense>
      </NotificationProvider>
    </TenantProvider>
  );
}

export default App;
