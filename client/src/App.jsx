import { AdminProfilePage }    from "./pages/AdminProfilePage";
import { ProviderProfilePage } from "./pages/ProviderProfilePage";

import { BookingConfirmationPage } from "./pages/BookingConfirmationPage";
import { ProviderDashboard }       from "./pages/ProviderDashboard";
import { AdminDashboard }          from "./pages/AdminDashboard";

import { ServicesPage } from "./pages/ServicesPage";
import { ProvidersListPage } from "./pages/ProvidersListPage";
import { BookingPage } from "./pages/BookingPage";
import { PaymentPage } from "./pages/PaymentPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminQueriesPage } from "./pages/AdminQueriesPage";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { HomePage } from "./pages/HomePage";
import { ContactUsPage } from "./pages/ContactUsPage";
import { TeamPage } from "./pages/TeamPage";
import { AddMemberPage } from "./pages/AddMemberPage";
import { ViewMembersPage } from "./pages/ViewMembersPage";
import { MemberDetailsPage } from "./pages/MemberDetailsPage";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto"
          style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}
        >
          <span style={{ color: "white", fontWeight: 700, fontSize: "1.2rem" }}>
            U
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Loading...
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role))
    return <Navigate to="/" replace />;

  return children;
}

// ✅ UPDATED: Redirect instead of UI
function UserDashboard() {
  return <Navigate to="/services" replace />;
}

function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash) {
      window.setTimeout(() => {
        const target = document.getElementById(hash.slice(1));
        if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
        else window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }, 0);
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash, key]);

  return null;
}


export default function App() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <>
    <ScrollManager />
    <Routes>
      {/* Homepage */}
      <Route path="/" element={<HomePage />} />
      <Route path="/contact" element={<ContactUsPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/team/add-member" element={<AddMemberPage />} />
      <Route path="/team/members" element={<ViewMembersPage />} />
      <Route path="/team/members/:id" element={<MemberDetailsPage />} />

      {/* Auth routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                user?.role === "admin"
                  ? "/admin-dashboard"
                  : user?.role === "serviceProvider"
                  ? "/provider-dashboard"
                  : "/user-dashboard"
              }
              replace
            />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                user?.role === "admin"
                  ? "/admin-dashboard"
                  : user?.role === "serviceProvider"
                  ? "/provider-dashboard"
                  : "/user-dashboard"
              }
              replace
            />
          ) : (
            <SignupPage />
          )
        }
      />

      {/* Dashboards */}
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/provider-dashboard"
        element={
          <ProtectedRoute allowedRoles={["serviceProvider"]}>
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ NEW USER FLOW ROUTES */}
      <Route
        path="/services"
        element={<ServicesPage />}
      />

      <Route
        path="/providers/:category"
        element={<ProvidersListPage />}
      />

      <Route
        path="/book/:providerId"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <BookingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment/:bookingId"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <PaymentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/admin-profile" 
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-queries"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminQueriesPage />
          </ProtectedRoute>
        }
      />

      <Route path="/provider-profile" element={
        <ProtectedRoute allowedRoles={["serviceProvider"]}>
           <ProviderProfilePage />
        </ProtectedRoute>
      } />
      <Route
        path="/booking-confirmation/:bookingId"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <BookingConfirmationPage />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}
