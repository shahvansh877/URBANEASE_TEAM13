import { createElement, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Banknote,
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Edit2,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Star,
  User,
  Wrench,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL as API } from "../config/api";

const filters = ["all", "pending", "confirmed", "completed", "cancelled"];

const statusStyle = {
  pending: { bg: "#fef9c3", color: "#92400e", label: "Pending" },
  confirmed: { bg: "#dcfce7", color: "#15803d", label: "Confirmed" },
  completed: { bg: "#dbeafe", color: "#1d4ed8", label: "Completed" },
  cancelled: { bg: "#fee2e2", color: "#dc2626", label: "Cancelled" },
};

function ProviderShell({ children }) {
  return (
    <div className="ue-provider-account-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .ue-provider-account-page { min-height: 100vh; background: #f8fafc; font-family: 'DM Sans', sans-serif; color: #0f172a; }
        .ue-provider-nav { position: sticky; top: 0; z-index: 100; height: 60px; display: flex; align-items: center; padding: 0 18px; background: #071432; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .ue-provider-brand { display: flex; align-items: center; gap: 10px; color: white; font-family: 'Fraunces', serif; font-weight: 700; font-size: 1.08rem; }
        .ue-provider-logo { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: #2563eb; color: white; font-weight: 800; }
        .ue-provider-wrap { max-width: 820px; margin: 0 auto; padding: 30px 18px 110px; }
        .ue-provider-card { background: white; border: 1px solid #e2e8f0; border-radius: 18px; box-shadow: 0 14px 34px rgba(15,23,42,0.06); overflow: hidden; }
        .ue-provider-header { padding: 28px 26px; background: white; border-bottom: 8px solid #f1f5f9; }
        .ue-provider-name { margin: 0 0 8px; font-size: clamp(1.75rem, 5vw, 2.35rem); line-height: 1.08; font-weight: 800; letter-spacing: 0; }
        .ue-provider-meta { color: #4b5563; font-size: 0.95rem; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .ue-provider-badge { display: inline-flex; align-items: center; gap: 7px; margin-top: 12px; padding: 6px 11px; border-radius: 999px; background: #dcfce7; color: #15803d; font-size: 0.78rem; font-weight: 800; }
        .ue-provider-row { width: 100%; min-height: 70px; display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 0 24px; border: none; border-bottom: 1px solid #f1f5f9; background: white; color: #111827; cursor: pointer; text-align: left; }
        .ue-provider-row:last-child { border-bottom: none; }
        .ue-provider-row-label { display: flex; align-items: center; gap: 18px; font-size: 1.02rem; font-weight: 600; }
        .ue-provider-panel { background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 20px; box-shadow: 0 12px 30px rgba(15,23,42,0.06); }
        .ue-provider-title { margin: 0 0 18px; font-family: 'Fraunces', serif; font-size: 1.55rem; font-weight: 700; color: #0f172a; }
        .ue-provider-back { border: none; background: transparent; color: #2563eb; font-weight: 800; padding: 0; margin-bottom: 16px; cursor: pointer; }
        .ue-provider-field { display: grid; gap: 7px; margin-bottom: 14px; }
        .ue-provider-field label { font-size: 0.84rem; font-weight: 700; color: #475569; }
        .ue-provider-input, .ue-provider-textarea { width: 100%; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 12px 13px; outline: none; color: #0f172a; background: #fff; }
        .ue-provider-textarea { min-height: 96px; resize: vertical; }
        .ue-provider-input:focus, .ue-provider-textarea:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.08); }
        .ue-provider-primary { border: none; border-radius: 12px; padding: 12px 15px; background: #2563eb; color: white; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }
        .ue-provider-danger { border: none; border-radius: 12px; padding: 12px 15px; background: #ef4444; color: white; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }
        .ue-provider-filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
        .ue-provider-filter { border: 1.5px solid #e2e8f0; background: white; color: #64748b; border-radius: 999px; padding: 8px 14px; text-transform: capitalize; font-weight: 700; cursor: pointer; }
        .ue-provider-filter.active { background: #2563eb; border-color: #2563eb; color: white; }
        .ue-provider-booking, .ue-provider-payment { border: 1.5px solid #e2e8f0; border-radius: 15px; padding: 15px; background: white; margin-bottom: 12px; }
        .ue-provider-stat { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px; margin-bottom: 14px; }
        @media (max-width: 560px) {
          .ue-provider-wrap { padding: 22px 0 105px; }
          .ue-provider-panel, .ue-provider-card { border-left: none; border-right: none; border-radius: 0; }
          .ue-provider-header { padding: 28px 26px; }
          .ue-provider-row { padding: 0 26px; }
          .ue-provider-title, .ue-provider-back { margin-left: 18px; margin-right: 18px; }
          .ue-provider-panel { padding: 18px; }
        }
      `}</style>
      <nav className="ue-provider-nav">
        <div className="ue-provider-brand">
          <span className="ue-provider-logo">U</span>
          <span>UrbanEase</span>
        </div>
      </nav>
      <main className="ue-provider-wrap">{children}</main>
    </div>
  );
}

export function ProviderAccountPages() {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const page = pathname.split("/").filter(Boolean)[1] || "account";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    experience: "",
    serviceDescription: "",
  });

  useEffect(() => {
    setForm({
      name: user?.name || "",
      phone: user?.phone || "",
      city: user?.city || "",
      address: user?.address || "",
      experience: user?.experience ?? "",
      serviceDescription: user?.serviceDescription || "",
    });
  }, [user]);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/bookings/provider-bookings/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBookings(res.ok && data.success ? data.bookings || [] : []);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  const filteredBookings = useMemo(() => bookings.filter((booking) => (
    filter === "all" ? true : booking.status === filter
  )), [bookings, filter]);

  const completedBookings = bookings.filter((booking) => booking.status === "completed");
  const totalEarnings = completedBookings.reduce((sum, booking) => sum + Number(booking.amount || 0), 0);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/auth/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          experience: Number(form.experience) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Unable to save profile");
      if (data.user) updateUser(data.user);
      navigate("/provider-profile");
    } catch (error) {
      alert(error.message || "Unable to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (page === "edit") {
    return (
      <ProviderShell>
        <button className="ue-provider-back" onClick={() => navigate("/provider-profile")}>Back to account</button>
        <h1 className="ue-provider-title">Edit profile</h1>
        <section className="ue-provider-panel">
          <div className="ue-provider-field"><label>Name</label><input className="ue-provider-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
          <div className="ue-provider-field"><label>Phone</label><input className="ue-provider-input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></div>
          <div className="ue-provider-field"><label>City</label><input className="ue-provider-input" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} /></div>
          <div className="ue-provider-field"><label>Address</label><input className="ue-provider-input" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></div>
          <div className="ue-provider-field"><label>Experience in years</label><input className="ue-provider-input" type="number" min="0" value={form.experience} onChange={(event) => setForm({ ...form, experience: event.target.value })} /></div>
          <div className="ue-provider-field"><label>Service description</label><textarea className="ue-provider-textarea" value={form.serviceDescription} onChange={(event) => setForm({ ...form, serviceDescription: event.target.value })} /></div>
          <button className="ue-provider-primary" onClick={saveProfile} disabled={saving}><Save size={17} />{saving ? "Saving..." : "Save profile"}</button>
        </section>
      </ProviderShell>
    );
  }

  if (page === "bookings") {
    return (
      <ProviderShell>
        <button className="ue-provider-back" onClick={() => navigate("/provider-profile")}>Back to account</button>
        <h1 className="ue-provider-title">Booking history</h1>
        <div className="ue-provider-filter-row">
          {filters.map((item) => <button key={item} className={`ue-provider-filter ${filter === item ? "active" : ""}`} onClick={() => setFilter(item)}>{item}</button>)}
        </div>
        {loading ? <section className="ue-provider-panel">Loading bookings...</section> : filteredBookings.length === 0 ? <section className="ue-provider-panel">No bookings found.</section> : filteredBookings.map((booking) => {
          const status = statusStyle[booking.status] || statusStyle.pending;
          return (
            <article key={booking._id} className="ue-provider-booking">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                <div>
                  <strong>{booking.user?.name || "Customer"}</strong>
                  <div style={{ color: "#64748b", fontSize: "0.84rem", marginTop: 3 }}>{booking.user?.phone || "No phone"} · {booking.serviceCategory}{booking.subcategory ? ` · ${booking.subcategory}` : ""}</div>
                </div>
                <span style={{ background: status.bg, color: status.color, borderRadius: 999, padding: "4px 10px", fontSize: "0.76rem", fontWeight: 800 }}>{status.label}</span>
              </div>
              <div style={{ display: "grid", gap: 7, color: "#64748b", fontSize: "0.84rem" }}>
                <span><Calendar size={14} /> {booking.date}</span>
                <span><Clock size={14} /> {booking.timeSlot} · {booking.hours || 1} hour(s)</span>
                <span><MapPin size={14} /> {booking.address || "Address not added"}</span>
                {booking.instructions && <span><Briefcase size={14} /> {booking.instructions}</span>}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                <strong>₹{booking.amount}</strong>
                <span style={{ color: booking.paymentStatus === "paid" ? "#15803d" : "#92400e", fontWeight: 800 }}>{booking.paymentStatus === "paid" ? `Paid via ${(booking.paymentMethod || "payment").toUpperCase()}` : "Payment pending"}</span>
              </div>
            </article>
          );
        })}
      </ProviderShell>
    );
  }

  if (page === "earnings") {
    return (
      <ProviderShell>
        <button className="ue-provider-back" onClick={() => navigate("/provider-profile")}>Back to account</button>
        <h1 className="ue-provider-title">My earnings</h1>
        <section className="ue-provider-stat">
          <div style={{ color: "#64748b", fontWeight: 700 }}>Total earnings</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", color: "#2563eb", fontWeight: 800 }}>₹{totalEarnings}</div>
          <div style={{ color: "#64748b", fontSize: "0.84rem" }}>{completedBookings.length} completed booking{completedBookings.length === 1 ? "" : "s"}</div>
        </section>
        {completedBookings.length === 0 ? <section className="ue-provider-panel">No completed earnings yet.</section> : completedBookings.map((booking) => (
          <article key={booking._id} className="ue-provider-payment" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div>
              <strong>{booking.serviceCategory}</strong>
              <div style={{ color: "#64748b", fontSize: "0.84rem", marginTop: 3 }}>
                By {booking.user?.name || "Customer"} · {(booking.paymentMethod || "payment").toUpperCase()} · {booking.date}
              </div>
            </div>
            <strong>₹{booking.amount}</strong>
          </article>
        ))}
      </ProviderShell>
    );
  }

  const menu = [
    { label: "Booking history", icon: Calendar, path: "/provider-profile/bookings" },
    { label: "My earnings", icon: Banknote, path: "/provider-profile/earnings" },
    { label: "Edit profile", icon: Edit2, path: "/provider-profile/edit" },
  ];

  return (
    <ProviderShell>
      <section className="ue-provider-card">
        <div className="ue-provider-header">
          <h1 className="ue-provider-name">{user?.name || "Service Provider"}</h1>
          <div className="ue-provider-meta"><Wrench size={17} />{user?.serviceCategory || "Service"} · {user?.city || "City not added"}</div>
          <div className="ue-provider-meta" style={{ marginTop: 8 }}><Phone size={17} />{user?.phone || "Phone not added"}</div>
          <div className="ue-provider-meta" style={{ marginTop: 8 }}><Mail size={17} />{user?.email || "Email not added"}</div>
          <div className="ue-provider-badge"><CheckCircle size={15} />{user?.isVerified ? "Verified provider" : "Verification pending"}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", marginTop: 10 }}>
            <Star size={16} color="#facc15" fill="#facc15" />
            {user?.rating > 0 ? user.rating.toFixed(1) : "New"} rating
          </div>
        </div>
        {menu.map(({ label, icon, path }) => (
          <button key={label} className="ue-provider-row" onClick={() => navigate(path)}>
            <span className="ue-provider-row-label">{createElement(icon, { size: 22 })}{label}</span>
            <ChevronRight size={22} color="#71717a" />
          </button>
        ))}
      </section>
      <button className="ue-provider-danger" onClick={logout} style={{ width: "calc(100% - 36px)", margin: "18px 18px 0" }}>
        <LogOut size={17} />
        Logout
      </button>
    </ProviderShell>
  );
}
