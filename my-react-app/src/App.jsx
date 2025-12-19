import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage"; // <-- Add this
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import AttendancePage from "./pages/AttendancePage";
import Activities from "./pages/Activities";
import Ministry from "./pages/Ministry";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";

function AppInner() {
  const { token, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = !!token;

  return (
    <Routes>
      {/* Public Routes - No Sidebar/Header */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

      {/* Protected Routes - With Sidebar/Header */}
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <div className="flex min-h-screen bg-gray-100">
              <Sidebar
                status={true}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                onLogout={logout}
                isOpen={isSidebarOpen}
              />

              <div
                className={`flex flex-col flex-1 transition-all duration-300 ${
                  isSidebarOpen ? "ml-64" : "ml-0"
                }`}
              >
                <Header
                  onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                  onLogout={logout}
                />

                <main className="flex-1 p-6">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/members" element={<Members />} />
                    <Route path="/attendance" element={<AttendancePage />} />
                    <Route path="/activities" element={<Activities />} />
                    <Route path="/ministries" element={<Ministry />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          ) : (
            <Navigate to="/landing" />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}