import { CalendarCheck, Headphones, Home, Search, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { label: "Home", icon: Home, path: "/", match: ["/"] },
  { label: "Services", icon: Search, path: "/services", match: ["/services", "/providers"] },
  { label: "Bookings", icon: CalendarCheck, path: "/profile?section=bookings", protected: true, match: ["/book", "/payment", "/booking-confirmation"] },
  { label: "Help", icon: Headphones, path: "/contact", match: ["/contact"] },
  { label: "Account", icon: UserRound, path: "/profile", protected: true, match: ["/profile", "/login", "/signup"] },
];

export function MobileBottomNav() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const goTo = (item) => {
    if (item.protected && !user) {
      navigate("/login");
      return;
    }
    navigate(item.path);
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Primary mobile navigation">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = item.label === "Bookings"
          ? pathname.startsWith("/profile") && search.includes("section=bookings")
            || item.match.some((path) => pathname.startsWith(path))
          : item.label === "Account"
          ? (pathname.startsWith("/profile") && !search.includes("section=bookings"))
            || item.match.some((path) => pathname.startsWith(path))
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
              {item.label === "Bookings" && <span className="mobile-bottom-nav__dot" />}
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
