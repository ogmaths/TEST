import { useState, useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useRoutes,
} from "react-router-dom";
import { useUser } from "./context/UserContext";
import LoginPage from "./components/LoginPage";
import UserDashboard from "./components/UserDashboard";
import ClientManagementDashboard from "./components/ClientManagementDashboard";
import AssessmentDashboard from "./components/AssessmentDashboard";
import EventsDashboard from "./components/EventsDashboard";
import ClientProfile from "./components/ClientProfile";
import LandingPage from "./components/LandingPage";
import NotificationDemo from "./components/NotificationDemo";
import JourneyStageManager from "./components/JourneyStageManager";
import QRCodeGenerator from "./components/QRCodeGenerator";
import AddInteractionForm from "./components/AddInteractionForm";
import JourneyTimeline from "./components/JourneyTimeline";
import AssessmentForm from "./components/AssessmentForm";
import ImpactReport from "./components/ImpactReport";
import EventAttendanceRegister from "./components/EventAttendanceRegister";
import NewClientForm from "./components/NewClientForm";
import SelfRegistrationPage from "./components/SelfRegistrationPage";
import AdminDashboard from "./components/AdminDashboard";
import NewUserForm from "./components/NewUserForm";
import SuperAdminDashboard from "./components/SuperAdminDashboard";
import NewEventForm from "./components/NewEventForm";
import NewOrganizationForm from "./components/NewOrganizationForm";
import UserSettings from "./components/UserSettings";
import { NotificationProvider } from "./context/NotificationContext";
import { TenantProvider } from "./context/TenantContext";
import { UserProvider } from "./context/UserContext";

function App() {
  const { user } = useUser();

  return (
    <Router>
      <NotificationProvider>
        <TenantProvider>
          <UserProvider>
            <Suspense fallback={<p>Loading...</p>}>
              <div className="flex flex-col min-h-screen">
                {/* For the tempo routes */}
                {import.meta.env.VITE_TEMPO && useRoutes([])}

                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/register" element={<SelfRegistrationPage />} />
                  <Route
                    path="/"
                    element={
                      user ? <UserDashboard /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      user ? <UserDashboard /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/clients"
                    element={
                      user ? (
                        <ClientManagementDashboard />
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  />
                  <Route
                    path="/assessments"
                    element={
                      user ? <AssessmentDashboard /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/assessment/:id"
                    element={
                      user ? <AssessmentForm /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/assessment/new"
                    element={
                      user ? <AssessmentForm /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/events"
                    element={
                      user ? <EventsDashboard /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/client/:id"
                    element={
                      user ? <ClientProfile /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      user ? <NotificationDemo /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/journey-stages"
                    element={
                      user ? <JourneyStageManager /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/qr-generator"
                    element={
                      user ? <QRCodeGenerator /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/client/:id/add-interaction"
                    element={
                      user ? <AddInteractionForm /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/client/:id/journey"
                    element={
                      user ? <JourneyTimeline /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/client/:id/assessment"
                    element={
                      user ? <AssessmentForm /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/client/:id/report"
                    element={user ? <ImpactReport /> : <Navigate to="/login" />}
                  />
                  <Route
                    path="/events/attendance/:id"
                    element={
                      user ? (
                        <EventAttendanceRegister />
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  />
                  <Route
                    path="/clients/new"
                    element={
                      user ? <NewClientForm /> : <Navigate to="/login" />
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      user &&
                      (user.role === "admin" ||
                        user.role === "super_admin" ||
                        user.isOrgAdmin) ? (
                        <AdminDashboard />
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  />
                  <Route
                    path="/admin/users/new"
                    element={
                      user &&
                      (user.role === "admin" ||
                        user.role === "super_admin" ||
                        user.isOrgAdmin) ? (
                        <NewUserForm />
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  />
                  <Route
                    path="/super-admin"
                    element={
                      user && user.role === "super_admin" ? (
                        <SuperAdminDashboard />
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  />
                  <Route
                    path="/events/new"
                    element={user ? <NewEventForm /> : <Navigate to="/login" />}
                  />
                  <Route
                    path="/super-admin/organizations/new"
                    element={
                      user && user.role === "super_admin" ? (
                        <NewOrganizationForm />
                      ) : (
                        <Navigate to="/login" />
                      )
                    }
                  />
                  <Route
                    path="/settings"
                    element={user ? <UserSettings /> : <Navigate to="/login" />}
                  />
                  {/* Add this route to allow Tempo to capture routes */}
                  {import.meta.env.VITE_TEMPO && (
                    <Route path="/tempobook/*" element={<></>} />
                  )}
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              </div>
            </Suspense>
          </UserProvider>
        </TenantProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;
