import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function TeamNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleProfileClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin-profile");
      return;
    }

    if (user.role === "serviceProvider") {
      navigate("/provider-profile");
      return;
    }

    navigate("/profile");
  };

  return (
    <nav className="nav-glass fixed top-0 left-0 right-0 z-50">
      <style>{`
        .team-nav-inner {
          height: 4rem;
        }
        .team-nav-links {
          display: flex !important;
          align-items: center;
          gap: 2rem;
        }
        @media (max-width: 768px) {
          .team-nav-inner {
            height: auto;
            min-height: 4rem;
            flex-wrap: wrap;
            gap: 10px;
            padding-top: 10px;
            padding-bottom: 10px;
          }
          .team-nav-links {
            order: 3;
            width: 100%;
            gap: 18px;
            overflow-x: auto;
            padding-bottom: 2px;
            scrollbar-width: none;
          }
          .team-nav-links::-webkit-scrollbar { display: none; }
          .team-nav-links a {
            white-space: nowrap;
            flex-shrink: 0;
          }
        }
      `}</style>
      <div className="team-nav-inner max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="ue-brand-icon w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600">
            <span className="font-display text-white font-bold">U</span>
          </div>
          <span className="font-display text-white font-semibold text-lg">UrbanEase</span>
        </Link>

        <div className="team-nav-links hidden md:flex items-center gap-8">
          <Link to="/" className="text-blue-200 hover:text-white text-sm no-underline">Home</Link>
          <Link to="/#how-it-works" className="text-blue-200 hover:text-white text-sm no-underline">How It Works</Link>
          <Link to="/services" className="text-blue-200 hover:text-white text-sm no-underline">Services</Link>
          <Link to="/contact" className="text-blue-200 hover:text-white text-sm no-underline">Contact</Link>
          <Link to="/team" className="text-blue-200 hover:text-white text-sm no-underline">Team Detail</Link>
        </div>

        <div className="ue-top-account-action flex items-center gap-3">
          {user ? (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 cursor-pointer text-white"
              >
                <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
                  {(user?.name?.[0] || "U").toUpperCase()}
                </div>
                <span className="text-sm font-medium">{user?.name?.split(" ")[0]}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[100]">
                  <div className="p-4 border-bottom border-gray-50 bg-gray-50">
                    <div className="text-sm font-bold text-gray-800">{user?.name}</div>
                    <div className="text-xs text-gray-400">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleProfileClick();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 bg-white border-none cursor-pointer"
                  >
                    <UserCircle className="w-4 h-4 text-blue-600" /> My Profile
                  </button>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 bg-white border-none cursor-pointer border-t border-gray-50"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 rounded-lg text-white text-sm font-medium border border-white/30 hover:bg-white/10 no-underline">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
