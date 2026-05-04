import { Banknote, BriefcaseBusiness, Headphones, Home, Inbox, LayoutDashboard, Search, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { label: "Home", icon: Home, path: "/", match: ["/"] },
  { label: "Services", icon: Search, path: "/services", match: ["/services", "/providers"] },
  { label: "Help", icon: Headphones, path: "/contact", match: ["/contact"] },
  { label: "Account", icon: UserRound, path: "/account", match: ["/account", "/profile", "/login", "/signup"] },
];

const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard", match: ["/admin-dashboard"] },
  { label: "Queries", icon: Inbox, path: "/admin-queries", match: ["/admin-queries"] },
  { label: "Account", icon: UserRound, path: "/admin-profile", match: ["/admin-profile"] },
];

const PROVIDER_NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/provider-dashboard", match: ["/provider-dashboard"] },
  { label: "Bookings", icon: BriefcaseBusiness, path: "/provider-profile/bookings", match: ["/provider-profile/bookings"] },
  { label: "Earnings", icon: Banknote, path: "/provider-profile/earnings", match: ["/provider-profile/earnings"] },
  { label: "Account", icon: UserRound, path: "/provider-profile", match: ["/provider-profile"] },
];

export function MobileBottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const items = user?.role === "admin"
    ? ADMIN_NAV_ITEMS
    : user?.role === "serviceProvider"
    ? PROVIDER_NAV_ITEMS
    : NAV_ITEMS;

  const goTo = (item) => {
    if (item.label === "Account" && user?.role === "user") {
      navigate("/profile");
      return;
    }
    navigate(item.path);
  };

  return (
    <nav
      className="mobile-bottom-nav"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      aria-label="Primary mobile navigation"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.label === "Account" && user?.role === "serviceProvider"
          ? pathname === "/provider-profile" || pathname === "/provider-profile/edit"
          : item.label === "Account"
          ? item.match.some((path) => pathname.startsWith(path))
          : item.match
          ? item.match.some((path) => (path === "/" ? pathname === "/" : pathname.startsWith(path)))
          : pathname === item.path;

        return (
          <button
            key={item.label}
            type="button"
            className={`mobile-bottom-nav__item${active ? " is-active" : ""}`}
            onClick={() => goTo(item)}
            aria-current={active ? "page" : undefined}
          >
            <span className="mobile-bottom-nav__icon-wrap">
              <Icon className="mobile-bottom-nav__icon" aria-hidden="true" />
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
