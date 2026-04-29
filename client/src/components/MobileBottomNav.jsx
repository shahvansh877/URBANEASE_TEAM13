import { Headphones, Home, Search, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { label: "Home", icon: Home, path: "/", match: ["/"] },
  { label: "Services", icon: Search, path: "/services", match: ["/services", "/providers"] },
  { label: "Help", icon: Headphones, path: "/contact", match: ["/contact"] },
  { label: "Account", icon: UserRound, path: "/account", match: ["/account", "/profile", "/login", "/signup"] },
];

export function MobileBottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const goTo = (item) => {
    navigate(item.label === "Account" && user ? "/profile" : item.path);
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Primary mobile navigation">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = item.label === "Account"
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
