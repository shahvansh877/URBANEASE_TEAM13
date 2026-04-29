import { createElement, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Check,
  ChevronRight,
  Clock,
  CreditCard,
  Edit2,
  LogOut,
  MapPin,
  Package,
  Phone,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL as API } from "../config/api";

const filters = ["all", "upcoming", "completed", "cancelled"];

const statusStyle = {
  pending: { bg: "#fef9c3", color: "#92400e", label: "Pending" },
  confirmed: { bg: "#dcfce7", color: "#15803d", label: "Upcoming" },
  completed: { bg: "#dbeafe", color: "#1d4ed8", label: "Completed" },
  cancelled: { bg: "#fee2e2", color: "#dc2626", label: "Cancelled" },
};

function AccountShell({ children }) {
  return (
    <div className="ue-account-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .ue-account-page { min-height: 100vh; background: #f8fafc; font-family: 'DM Sans', sans-serif; color: #0f172a; }
        .ue-account-nav { position: sticky; top: 0; z-index: 100; height: 60px; display: flex; align-items: center; padding: 0 18px; background: #071432; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .ue-account-brand { display: flex; align-items: center; gap: 10px; color: white; font-family: 'Fraunces', serif; font-weight: 700; font-size: 1.08rem; }
        .ue-account-logo { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center; background: #2563eb; color: white; font-weight: 800; }
        .ue-account-wrap { max-width: 780px; margin: 0 auto; padding: 30px 18px 110px; }
        .ue-account-card { background: white; border: 1px solid #e2e8f0; border-radius: 18px; box-shadow: 0 14px 34px rgba(15,23,42,0.06); overflow: hidden; }
        .ue-account-header { padding: 28px 26px; background: white; display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; border-bottom: 8px solid #f1f5f9; }
        .ue-account-name { margin: 0 0 8px; font-size: clamp(1.75rem, 5vw, 2.35rem); line-height: 1.08; font-weight: 800; letter-spacing: 0; }
        .ue-account-phone { color: #4b5563; font-size: 1rem; display: flex; align-items: center; gap: 8px; }
        .ue-icon-btn { border: none; background: transparent; color: #111827; padding: 8px; cursor: pointer; display: grid; place-items: center; }
        .ue-list-row { width: 100%; min-height: 70px; display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 0 24px; border: none; border-bottom: 1px solid #f1f5f9; background: white; color: #111827; cursor: pointer; text-align: left; }
        .ue-list-row:last-child { border-bottom: none; }
        .ue-list-label { display: flex; align-items: center; gap: 18px; font-size: 1.02rem; font-weight: 600; }
        .ue-section-title { margin: 0 0 18px; font-family: 'Fraunces', serif; font-size: 1.55rem; font-weight: 700; color: #0f172a; }
        .ue-panel { background: white; border: 1px solid #e2e8f0; border-radius: 18px; padding: 20px; box-shadow: 0 12px 30px rgba(15,23,42,0.06); }
        .ue-field { display: grid; gap: 7px; margin-bottom: 14px; }
        .ue-field label { font-size: 0.84rem; font-weight: 700; color: #475569; }
        .ue-input { width: 100%; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 12px 13px; outline: none; color: #0f172a; background: #fff; }
        .ue-input:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,0.08); }
        .ue-primary { border: none; border-radius: 12px; padding: 12px 15px; background: #2563eb; color: white; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }
        .ue-danger { border: none; border-radius: 12px; padding: 12px 15px; background: #ef4444; color: white; font-weight: 800; display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }
        .ue-filter-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
        .ue-filter { border: 1.5px solid #e2e8f0; background: white; color: #64748b; border-radius: 999px; padding: 8px 14px; text-transform: capitalize; font-weight: 700; cursor: pointer; }
        .ue-filter.active { background: #2563eb; border-color: #2563eb; color: white; }
        .ue-booking-card, .ue-address-card, .ue-payment-row { border: 1.5px solid #e2e8f0; border-radius: 15px; padding: 15px; background: white; margin-bottom: 12px; }
        .ue-page-back { border: none; background: transparent; color: #2563eb; font-weight: 800; padding: 0; margin-bottom: 16px; cursor: pointer; }
        @media (max-width: 560px) {
          .ue-account-wrap { padding: 22px 0 105px; }
          .ue-panel, .ue-account-card { border-left: none; border-right: none; border-radius: 0; }
          .ue-account-header { padding: 28px 26px; }
          .ue-list-row { padding: 0 26px; }
          .ue-section-title, .ue-page-back { margin-left: 18px; margin-right: 18px; }
          .ue-panel { padding: 18px; }
        }
      `}</style>
      <nav className="ue-account-nav">
        <div className="ue-account-brand">
          <span className="ue-account-logo">U</span>
          <span>UrbanEase</span>
        </div>
      </nav>
      <main className="ue-account-wrap">{children}</main>
    </div>
  );
}

export function UserAccountPages() {
  const { user, token, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const page = pathname.split("/").filter(Boolean)[1] || "account";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [addresses, setAddresses] = useState([]);
  const [addressDraft, setAddressDraft] = useState({ label: "", address: "" });
  const addressKey = `urbanease_addresses_${user?._id || user?.id || user?.email || "guest"}`;

  useEffect(() => {
    setForm({ name: user?.name || "", phone: user?.phone || "", email: user?.email || "" });
  }, [user]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(addressKey) || "[]");
      setAddresses(Array.isArray(saved) ? saved : []);
    } catch {
      setAddresses([]);
    }
  }, [addressKey]);

  useEffect(() => {
    localStorage.setItem(addressKey, JSON.stringify(addresses));
  }, [addresses, addressKey]);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/bookings/my-bookings`, { headers: { Authorization: `Bearer ${token}` } });
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

  const filteredBookings = useMemo(() => bookings.filter((booking) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return booking.status === "confirmed" || booking.status === "pending";
    return booking.status === filter;
  }), [bookings, filter]);

  const paidPayments = bookings.filter((booking) => booking.paymentStatus === "paid");
  const paymentHistory = bookings.filter((booking) => booking.paymentStatus === "paid" || booking.paymentMethod === "cash");
  const totalSpend = paidPayments.reduce((sum, booking) => sum + Number(booking.amount || 0), 0);

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
      navigate("/profile");
    } catch (error) {
      alert(error.message || "Unable to save profile");
    } finally {
      setSaving(false);
    }
  };

  const addAddress = () => {
    if (!addressDraft.label.trim() || !addressDraft.address.trim()) return;
    setAddresses((prev) => [...prev, { id: Date.now().toString(), ...addressDraft, editing: false }]);
    setAddressDraft({ label: "", address: "" });
  };

  const updateAddress = (id, next) => {
    setAddresses((prev) => prev.map((address) => address.id === id ? { ...address, ...next } : address));
  };

  const setActiveAddress = (address) => {
    localStorage.setItem("urbanease_selected_address", JSON.stringify(address));
    navigate("/services");
  };

  const menu = [
    { label: "Edit profile", icon: Edit2, path: "/profile/edit" },
    { label: "My bookings", icon: Package, path: "/profile/bookings" },
    { label: "Manage addresses", icon: MapPin, path: "/profile/addresses" },
    { label: "My payments", icon: CreditCard, path: "/profile/payments" },
  ];

  if (page === "edit") {
    return (
      <AccountShell>
        <button className="ue-page-back" onClick={() => navigate("/profile")}>Back to account</button>
        <h1 className="ue-section-title">Edit profile</h1>
        <section className="ue-panel">
          <div className="ue-field"><label>Name</label><input className="ue-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="ue-field"><label>Mobile number</label><input className="ue-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="ue-field"><label>Email address</label><input className="ue-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <button className="ue-primary" onClick={saveProfile} disabled={saving}><Save size={17} />{saving ? "Saving..." : "Save profile"}</button>
        </section>
      </AccountShell>
    );
  }

  if (page === "bookings") {
    return (
      <AccountShell>
        <button className="ue-page-back" onClick={() => navigate("/profile")}>Back to account</button>
        <h1 className="ue-section-title">My bookings</h1>
        <div className="ue-filter-row">{filters.map((item) => <button key={item} className={`ue-filter ${filter === item ? "active" : ""}`} onClick={() => setFilter(item)}>{item}</button>)}</div>
        {loading ? <section className="ue-panel">Loading your bookings...</section> : filteredBookings.length === 0 ? <section className="ue-panel">No bookings found.</section> : filteredBookings.map((booking) => {
          const status = statusStyle[booking.status] || statusStyle.pending;
          return (
            <article key={booking._id} className="ue-booking-card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                <div><strong>{booking.serviceCategory}</strong><div style={{ color: "#64748b", fontSize: "0.86rem", marginTop: 3 }}>{booking.provider?.name || "Provider"}</div></div>
                <span style={{ background: status.bg, color: status.color, borderRadius: 999, padding: "4px 10px", fontSize: "0.76rem", fontWeight: 800 }}>{status.label}</span>
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", color: "#64748b", fontSize: "0.84rem" }}>
                <span><Calendar size={14} /> {booking.date}</span>
                <span><Clock size={14} /> {booking.timeSlot}</span>
                {booking.address && <span><MapPin size={14} /> {booking.address}</span>}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                <strong>₹{booking.amount}</strong>
                <span style={{ color: booking.paymentStatus === "paid" ? "#15803d" : "#92400e", fontWeight: 800 }}>{booking.paymentStatus === "paid" ? "Paid" : "Payment pending"}</span>
              </div>
            </article>
          );
        })}
      </AccountShell>
    );
  }

  if (page === "addresses") {
    return (
      <AccountShell>
        <button className="ue-page-back" onClick={() => navigate("/profile")}>Back to account</button>
        <h1 className="ue-section-title">Manage addresses</h1>
        <section className="ue-panel" style={{ marginBottom: 14 }}>
          <div className="ue-field"><label>Address name</label><input className="ue-input" placeholder="Home / Work" value={addressDraft.label} onChange={(e) => setAddressDraft({ ...addressDraft, label: e.target.value })} /></div>
          <div className="ue-field"><label>Full address</label><input className="ue-input" placeholder="House, street, area, city" value={addressDraft.address} onChange={(e) => setAddressDraft({ ...addressDraft, address: e.target.value })} /></div>
          <button className="ue-primary" onClick={addAddress}><Plus size={17} />Add address</button>
        </section>
        {addresses.length === 0 ? <section className="ue-panel">No saved addresses yet.</section> : addresses.map((item) => (
          <article key={item.id} className="ue-address-card">
            {item.editing ? (
              <>
                <div className="ue-field"><label>Address name</label><input className="ue-input" value={item.label} onChange={(event) => updateAddress(item.id, { label: event.target.value })} /></div>
                <div className="ue-field"><label>Full address</label><input className="ue-input" value={item.address} onChange={(event) => updateAddress(item.id, { address: event.target.value })} /></div>
                <button className="ue-primary" onClick={() => updateAddress(item.id, { editing: false })}><Save size={16} />Save address</button>
              </>
            ) : (
              <>
                <strong>{item.label}</strong>
                <p style={{ margin: "6px 0 14px", color: "#64748b" }}>{item.address}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button className="ue-primary" onClick={() => setActiveAddress(item)}><Check size={16} />Use for services</button>
                  <button className="ue-primary" onClick={() => updateAddress(item.id, { editing: true })}><Edit2 size={16} />Edit</button>
                  <button className="ue-danger" onClick={() => setAddresses((prev) => prev.filter((address) => address.id !== item.id))}><Trash2 size={16} />Delete</button>
                </div>
              </>
            )}
          </article>
        ))}
      </AccountShell>
    );
  }

  if (page === "payments") {
    return (
      <AccountShell>
        <button className="ue-page-back" onClick={() => navigate("/profile")}>Back to account</button>
        <h1 className="ue-section-title">My payments</h1>
        <section className="ue-panel" style={{ marginBottom: 14 }}>
          <div style={{ color: "#64748b", fontWeight: 700 }}>Total spend</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: "2rem", color: "#2563eb", fontWeight: 800 }}>₹{totalSpend}</div>
        </section>
        {paymentHistory.length === 0 ? <section className="ue-panel">No payments found.</section> : paymentHistory.map((payment) => (
          <article key={payment._id} className="ue-payment-row" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div><strong>{payment.serviceCategory}</strong><div style={{ color: "#64748b", fontSize: "0.84rem", marginTop: 3 }}>To {payment.provider?.name || "Provider"} · {(payment.paymentMethod || "payment").toUpperCase()}</div></div>
            <strong>₹{payment.amount}</strong>
          </article>
        ))}
      </AccountShell>
    );
  }

  return (
    <AccountShell>
      <section className="ue-account-card">
        <div className="ue-account-header">
          <div>
            <h1 className="ue-account-name">{user?.name || "Verified Customer"}</h1>
            <div className="ue-account-phone"><Phone size={17} />{user?.phone || "Mobile number not added"}</div>
          </div>
          <button className="ue-icon-btn" onClick={() => navigate("/profile/edit")} aria-label="Edit profile"><Edit2 size={24} /></button>
        </div>
        {menu.map(({ label, icon, path }) => (
          <button key={label} className="ue-list-row" onClick={() => navigate(path)}>
            <span className="ue-list-label">{createElement(icon, { size: 22 })}{label}</span>
            <ChevronRight size={22} color="#71717a" />
          </button>
        ))}
      </section>
      <button className="ue-danger" onClick={logout} style={{ width: "calc(100% - 36px)", margin: "18px 18px 0" }}><LogOut size={17} />Logout</button>
    </AccountShell>
  );
}
