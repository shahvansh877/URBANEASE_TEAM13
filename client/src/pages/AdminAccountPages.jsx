import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Edit2, LogOut, Mail, Save, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL as API } from "../config/api";

function AdminShell({ children }) {
  return (
    <div className="ue-admin-account-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .ue-admin-account-page { min-height: 100vh; background: #f8fafc; font-family: 'DM Sans', sans-serif; color: #0f172a; }
        .ue-admin-account-nav { position: sticky; top: 0; z-index: 100; height: 60px; display: flex; align-items: center; padding: 0 18px; background: #071432; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .ue-admin-account-brand { display: flex; align-items: center; gap: 10px; color: white; font-family: 'Fraunces', serif; font-weight: 700; font-size: 1.08rem; }
        .ue-admin-account-logo { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: #2563eb; color: white; font-weight: 800; }
        .ue-admin-account-wrap { max-width: 780px; margin: 0 auto; padding: 30px 18px 110px; }
        .ue-admin-card { background: white; border: 1px solid #e2e8f0; border-radius: 18px; box-shadow: 0 14px 34px rgba(15,23,42,0.06); overflow: hidden; }
        .ue-admin-header { padding: 28px 26px; background: white; display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; border-bottom: 8px solid #f1f5f9; }
        .ue-admin-name { margin: 0 0 8px; font-size: clamp(1.75rem, 5vw, 2.35rem); line-height: 1.08; font-weight: 800; letter-spacing: 0; }
        .ue-admin-email { color: #4b5563; font-size: 1rem; display: flex; align-items: center; gap: 8px; overflow-wrap: anywhere; }
        .ue-admin-badge { display: inline-flex; align-items: center; gap: 7px; margin-top: 12px; padding: 6px 11px; border-radius: 999px; background: #eff6ff; color: #2563eb; font-size: 0.78rem; font-weight: 800; }
        .ue-admin-row { width: 100%; min-height: 70px; display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 0 24px; border: none; border-bottom: 1px solid #f1f5f9; background: white; color: #111827; cursor: pointer; text-align: left; }
        .ue-admin-row:last-child { border-bottom: none; }
        .ue-admin-row-label { display: flex; align-items: center; gap: 18px; font-size: 1.02rem; font-weight: 600; }
        .ue-admin-panel { background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 20px; box-shadow: 0 12px 30px rgba(15,23,42,0.06); }
        .ue-admin-title { margin: 0 0 18px; font-family: 'Fraunces', serif; font-size: 1.55rem; font-weight: 700; color: #0f172a; }
        .ue-admin-back { border: none; background: transparent; color: #2563eb; font-weight: 800; padding: 0; margin-bottom: 16px; cursor: pointer; }
        .ue-admin-field { display: grid; gap: 7px; margin-bottom: 14px; }
        .ue-admin-field label { font-size: 0.84rem; font-weight: 700; color: #475569; }
        .ue-admin-input { width: 100%; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 12px 13px; outline: none; color: #0f172a; background: #fff; }
        .ue-admin-input:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.08); }
        .ue-admin-primary { border: none; border-radius: 12px; padding: 12px 15px; background: #2563eb; color: white; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }
        .ue-admin-danger { border: none; border-radius: 12px; padding: 12px 15px; background: #ef4444; color: white; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }
        @media (max-width: 560px) {
          .ue-admin-account-wrap { padding: 22px 0 105px; }
          .ue-admin-panel, .ue-admin-card { border-left: none; border-right: none; border-radius: 0; }
          .ue-admin-header { padding: 28px 26px; }
          .ue-admin-row { padding: 0 26px; }
          .ue-admin-title, .ue-admin-back { margin-left: 18px; margin-right: 18px; }
          .ue-admin-panel { padding: 18px; }
        }
      `}</style>
      <nav className="ue-admin-account-nav">
        <div className="ue-admin-account-brand">
          <span className="ue-admin-account-logo">U</span>
          <span>UrbanEase</span>
        </div>
      </nav>
      <main className="ue-admin-account-wrap">{children}</main>
    </div>
  );
}

export function AdminAccountPages() {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const page = pathname.split("/").filter(Boolean)[1] || "account";
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({ name: user?.name || "", email: user?.email || "" });
  }, [user]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/auth/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Unable to save profile");
      if (data.user) updateUser(data.user);
      navigate("/admin-profile");
    } catch (error) {
      alert(error.message || "Unable to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (page === "edit") {
    return (
      <AdminShell>
        <button className="ue-admin-back" onClick={() => navigate("/admin-profile")}>Back to account</button>
        <h1 className="ue-admin-title">Edit profile</h1>
        <section className="ue-admin-panel">
          <div className="ue-admin-field">
            <label>Name</label>
            <input className="ue-admin-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </div>
          <div className="ue-admin-field">
            <label>Email address</label>
            <input className="ue-admin-input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>
          <button className="ue-admin-primary" onClick={saveProfile} disabled={saving}>
            <Save size={17} />
            {saving ? "Saving..." : "Save profile"}
          </button>
        </section>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <section className="ue-admin-card">
        <div className="ue-admin-header">
          <div>
            <h1 className="ue-admin-name">{user?.name || "Admin"}</h1>
            <div className="ue-admin-email"><Mail size={17} />{user?.email || "Email not added"}</div>
            <div className="ue-admin-badge"><Shield size={15} />Administrator</div>
          </div>
        </div>
        <button className="ue-admin-row" onClick={() => navigate("/admin-profile/edit")}>
          <span className="ue-admin-row-label"><Edit2 size={22} />Edit profile</span>
          <ChevronRight size={22} color="#71717a" />
        </button>
      </section>
      <button className="ue-admin-danger" onClick={logout} style={{ width: "calc(100% - 36px)", margin: "18px 18px 0" }}>
        <LogOut size={17} />
        Logout
      </button>
    </AdminShell>
  );
}
