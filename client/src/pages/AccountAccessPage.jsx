import { Link, Navigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function AccountAccessPage() {
  const { user } = useAuth();

  if (user) return <Navigate to="/profile" replace />;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif", padding: "96px 18px 120px" }}>
      <div style={{ maxWidth: 420, margin: "0 auto", background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 22, boxShadow: "0 16px 40px rgba(15,23,42,0.08)" }}>
        <div style={{ width: 54, height: 54, borderRadius: 16, background: "#dbeafe", color: "#2563eb", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "1.35rem", marginBottom: 16 }}>
          U
        </div>
        <h1 style={{ margin: 0, color: "#0f172a", fontSize: "1.35rem", fontWeight: 800 }}>Your UrbanEase account</h1>
        <p style={{ margin: "8px 0 18px", color: "#64748b", fontSize: "0.92rem", lineHeight: 1.6 }}>
          Sign in to view your profile, bookings, saved addresses, payments, and logout controls.
        </p>
        <div>
          <Link to="/login?redirect=/profile" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "12px 14px", borderRadius: 12, background: "#2563eb", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "0.9rem" }}>
            <LogIn style={{ width: 16, height: 16 }} />
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
