import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Search, LogOut, ChevronRight, Sparkles, ChevronDown, UserCircle,
  Wrench, Zap, Paintbrush, Home, Shield, Leaf,
  Wind, Bug, KeyRound, Sofa, Package, Hammer
} from "lucide-react";
import { SiteFooter } from "../components/SiteFooter";

const CATEGORIES = [
  { id: "cleaning",        name: "Cleaning",        icon: Sparkles,   color: "#0ea5e9", bg: "#e0f2fe", description: "Home & office cleaning",       subcategories: ["Regular Cleaning","Deep Cleaning","Sofa Cleaning","Carpet Cleaning"] },
  { id: "plumbing",        name: "Plumbing",         icon: Wrench,     color: "#2563eb", bg: "#dbeafe", description: "Pipes, leaks & fixtures",       subcategories: ["Leak Repair","Pipe Fitting","Tap Installation","Drain Cleaning"] },
  { id: "electrical",      name: "Electrical",       icon: Zap,        color: "#d97706", bg: "#fef3c7", description: "Wiring, switches & fittings",   subcategories: ["Fan Installation","Switch Repair","Wiring","MCB/Fuse"] },
  { id: "carpentry",       name: "Carpentry",        icon: Hammer,     color: "#92400e", bg: "#fef9c3", description: "Furniture & woodwork",          subcategories: ["Furniture Repair","Door Fixing","Cabinet Installation","Custom Furniture"] },
  { id: "painting",        name: "Painting",         icon: Paintbrush, color: "#7c3aed", bg: "#ede9fe", description: "Interior & exterior painting",  subcategories: ["Wall Painting","Waterproofing","Texture Painting","Wood Polish"] },
  { id: "appliance_repair",name: "Appliance Repair", icon: Package,    color: "#0f766e", bg: "#ccfbf1", description: "Fix home appliances",           subcategories: ["Washing Machine","Refrigerator","Microwave","TV Repair"] },
  { id: "ac_repair",       name: "AC Repair",        icon: Wind,       color: "#0284c7", bg: "#e0f2fe", description: "AC service & installation",     subcategories: ["AC Service","AC Installation","Gas Refill","AC Repair"] },
  { id: "pest_control",    name: "Pest Control",     icon: Bug,        color: "#15803d", bg: "#dcfce7", description: "Remove pests safely",           subcategories: ["Cockroach Control","Termite Control","Bed Bug Control","Rodent Control"] },
  { id: "gardening",       name: "Gardening",        icon: Leaf,       color: "#16a34a", bg: "#dcfce7", description: "Garden & lawn care",            subcategories: ["Lawn Mowing","Tree Trimming","Garden Setup","Plant Care"] },
  { id: "security",        name: "Security",         icon: Shield,     color: "#1e40af", bg: "#dbeafe", description: "CCTV & security systems",       subcategories: ["CCTV Installation","Lock Repair","Door Lock","Alarm System"] },
  { id: "interior_design", name: "Interior Design",  icon: Sofa,       color: "#be185d", bg: "#fce7f3", description: "Home design & decor",          subcategories: ["Room Design","Space Planning","Decor Consultation","Modular Kitchen"] },
  { id: "locksmith",       name: "Locksmith",        icon: KeyRound,   color: "#374151", bg: "#f3f4f6", description: "Lock & key services",           subcategories: ["Lock Change","Key Duplicate","Locker Repair","Car Key"] },
  { id: "other",           name: "Other Services",   icon: Home,       color: "#6366f1", bg: "#eef2ff", description: "Any other home service",        subcategories: ["Other Services"] },
];

export function ServicesPage() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const filtered = CATEGORIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .cat-card {
          background: white; border-radius: 16px; padding: 22px 18px;
          cursor: pointer; border: 1.5px solid #f1f5f9;
          transition: all 0.25s ease;
          display: flex; flex-direction: column; gap: 12px;
        }
        .cat-card:hover {
          border-color: #2563eb;
          box-shadow: 0 8px 24px rgba(37,99,235,0.1);
          transform: translateY(-3px);
        }
        .cat-icon-wrap { width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .sub-chip { padding:3px 10px; border-radius:20px; font-size:0.7rem; font-weight:500; background:#f1f5f9; color:#64748b; white-space:nowrap; }
        .search-input { width:100%; padding:12px 16px 12px 44px; border:1.5px solid #e2e8f0; border-radius:12px; font-size:0.9rem; outline:none; background:white; font-family:'DM Sans',sans-serif; color:#0f172a; transition:border-color 0.2s; box-sizing:border-box; }
        .search-input:focus { border-color:#2563eb; }
        .nav-glass { background:#071432; backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,0.08); }
        .ue-nav-links { display:flex !important; align-items:center; gap:2rem; }
        @media(max-width:640px){
          .cat-grid { grid-template-columns:1fr 1fr !important; gap:12px !important; }
          .cat-card { padding:14px 12px; }
          .ue-nav-inner { height:auto !important; min-height:4rem; flex-wrap:wrap; gap:10px; padding-top:10px; padding-bottom:10px; }
          .ue-nav-links { order:3; width:100%; gap:18px; overflow-x:auto; padding-bottom:2px; scrollbar-width:none; }
          .ue-nav-links::-webkit-scrollbar { display:none; }
          .ue-nav-links a { white-space:nowrap; flex-shrink:0; }
        }
      `}</style>

      {/* Same glass navbar as the homepage */}
      <nav className="nav-glass fixed top-0 left-0 right-0 z-50">
        <div className="ue-nav-inner max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600">
              <span className="font-display text-white font-bold">U</span>
            </div>
            <span className="font-display text-white font-semibold text-lg">UrbanEase</span>
          </Link>

        <div className="ue-nav-links hidden md:flex items-center gap-8">
          <Link to="/" className="text-blue-200 hover:text-white text-sm no-underline">Home</Link>
          <Link to="/#how-it-works" className="text-blue-200 hover:text-white text-sm no-underline">How It Works</Link>
          <Link to="/services" className="text-white text-sm font-semibold no-underline">Services</Link>
          <Link to="/contact" className="text-blue-200 hover:text-white text-sm no-underline">Contact</Link>
          <Link to="/team" className="text-blue-200 hover:text-white text-sm no-underline">Team Detail</Link>
        </div>

        {user ? (
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 cursor-pointer text-white"
          >
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
              {(user?.name?.[0] || "U").toUpperCase()}
            </div>
            <span className="text-sm font-medium">{user?.name?.split(" ")[0] || "Account"}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[100]">
              <div className="p-4 border-bottom border-gray-50 bg-gray-50">
                <div className="text-sm font-bold text-gray-800">{user?.name}</div>
                <div className="text-xs text-gray-400">{user?.email}</div>
              </div>

              <button
                onClick={() => { setDropdownOpen(false); navigate("/profile"); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 bg-white border-none cursor-pointer"
              >
                <UserCircle className="w-4 h-4 text-blue-600" />
                My Profile
              </button>

              <button
                onClick={() => { setDropdownOpen(false); logout(); }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 bg-white border-none cursor-pointer border-t border-gray-50"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
        ) : (
          <Link to="/login" className="px-4 py-2 rounded-lg text-white text-sm font-medium border border-white/30 hover:bg-white/10 no-underline">Sign In</Link>
        )}
        </div>
      </nav>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"96px 20px 56px" }}>

        {/* Header */}
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:"'Fraunces',serif", fontSize:"clamp(1.6rem,4vw,2.2rem)", fontWeight:700, color:"#0f172a", marginBottom:6 }}>
            What do you need help with?
          </h1>
          {user ? (
          <p style={{ color:"#64748b", fontSize:"0.95rem" }}>
            Hi {user?.name?.split(" ")[0]} 👋 — choose a service to find verified professionals near you.
          </p>
          ) : (
          <p style={{ color:"#64748b", fontSize:"0.95rem" }}>
            Browse service categories and discover verified professionals near you.
          </p>
          )}
        </div>

        {/* Search */}
        <div style={{ position:"relative", maxWidth:480, marginBottom:32 }}>
          <Search style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", width:18, height:18, color:"#94a3b8" }} />
          <input type="text" placeholder="Search services..." value={search} onChange={e=>setSearch(e.target.value)} className="search-input" />
        </div>

        {/* Grid */}
        <div className="cat-grid" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16 }}>
          {filtered.map(cat => {
            const Icon = cat.icon;
            return (
              <div key={cat.id} className="cat-card" onClick={()=>navigate(`/providers/${cat.id}`)}>
                <div className="cat-icon-wrap" style={{ background:cat.bg }}>
                  <Icon style={{ width:26, height:26, color:cat.color }} />
                </div>
                <div>
                  <div style={{ fontWeight:600, fontSize:"0.95rem", color:"#0f172a", marginBottom:4 }}>{cat.name}</div>
                  <div style={{ fontSize:"0.78rem", color:"#64748b", marginBottom:10, lineHeight:1.5 }}>{cat.description}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                    {cat.subcategories.slice(0,2).map(s=>(
                      <span key={s} className="sub-chip">{s}</span>
                    ))}
                    {cat.subcategories.length > 2 && <span className="sub-chip">+{cat.subcategories.length-2}</span>}
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:"auto" }}>
                  <span style={{ fontSize:"0.75rem", color:"#2563eb", fontWeight:500 }}>View providers</span>
                  <ChevronRight style={{ width:16, height:16, color:"#2563eb" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
