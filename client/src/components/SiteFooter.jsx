import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

const SUPPORT_EMAIL = "urbanease76@gmail.com";
const SUPPORT_PHONE = "9974187653";

const serviceLinks = [
  { label: "Cleaning", to: "/providers/cleaning" },
  { label: "Plumbing", to: "/providers/plumbing" },
  { label: "Electrical", to: "/providers/electrical" },
  { label: "AC Repair", to: "/providers/ac_repair" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="ue-site-footer">
      <style>{`
        .ue-site-footer {
          background: #071432;
          color: white;
          padding: 56px 16px 28px;
          font-family: 'DM Sans', sans-serif;
        }
        .ue-site-footer a {
          color: inherit;
          text-decoration: none;
        }
        .ue-footer-inner {
          max-width: 1120px;
          margin: 0 auto;
        }
        .ue-footer-grid {
          display: grid;
          grid-template-columns: 1.3fr 1fr 1fr 1.15fr;
          gap: 32px;
          padding-bottom: 34px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .ue-footer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .ue-footer-logo {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-family: 'Sora', sans-serif;
        }
        .ue-footer-name {
          font-family: 'Sora', sans-serif;
          font-size: 1.12rem;
          font-weight: 700;
        }
        .ue-footer-copy {
          color: #cbd5e1;
          font-size: 0.92rem;
          line-height: 1.7;
          max-width: 300px;
          margin: 0 0 18px;
        }
        .ue-footer-trust {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #bfdbfe;
          background: rgba(37,99,235,0.16);
          border: 1px solid rgba(147,197,253,0.18);
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 0.78rem;
          font-weight: 700;
        }
        .ue-footer-heading {
          font-size: 0.84rem;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #f8fafc;
          margin: 0 0 14px;
        }
        .ue-footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 10px;
        }
        .ue-footer-link {
          color: #cbd5e1;
          font-size: 0.9rem;
          transition: color 0.2s ease, transform 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .ue-footer-link:hover,
        .ue-footer-link:focus-visible {
          color: #ffffff;
          transform: translateX(2px);
          outline: none;
        }
        .ue-footer-contact {
          display: grid;
          gap: 12px;
        }
        .ue-contact-link {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          color: #dbeafe;
          font-size: 0.9rem;
          line-height: 1.45;
          transition: color 0.2s ease;
        }
        .ue-contact-link:hover,
        .ue-contact-link:focus-visible {
          color: #ffffff;
          outline: none;
        }
        .ue-contact-icon {
          width: 18px;
          height: 18px;
          margin-top: 1px;
          color: #60a5fa;
          flex-shrink: 0;
        }
        .ue-footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding-top: 22px;
          color: #94a3b8;
          font-size: 0.82rem;
        }
        .ue-footer-bottom-links {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .ue-footer-bottom-links a {
          color: #94a3b8;
          transition: color 0.2s ease;
        }
        .ue-footer-bottom-links a:hover,
        .ue-footer-bottom-links a:focus-visible {
          color: white;
          outline: none;
        }
        @media (max-width: 860px) {
          .ue-footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 560px) {
          .ue-site-footer {
            padding: 42px 14px 24px;
          }
          .ue-footer-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .ue-footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="ue-footer-inner">
        <div className="ue-footer-grid">
          <div>
            <Link to="/" className="ue-footer-brand" aria-label="UrbanEase home">
              <span className="ue-footer-logo">U</span>
              <span className="ue-footer-name">UrbanEase</span>
            </Link>
            <p className="ue-footer-copy">
              Professional home services from verified local providers, with simple booking and responsive support.
            </p>
            <span className="ue-footer-trust">
              <ShieldCheck size={16} /> Verified service providers
            </span>
          </div>

          <div>
            <h2 className="ue-footer-heading">Company</h2>
            <ul className="ue-footer-list">
              <li><Link className="ue-footer-link" to="/">Home</Link></li>
              <li><Link className="ue-footer-link" to="/#how-it-works">How It Works</Link></li>
              <li><Link className="ue-footer-link" to="/team">Team</Link></li>
              <li><Link className="ue-footer-link" to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="ue-footer-heading">Services</h2>
            <ul className="ue-footer-list">
              <li><Link className="ue-footer-link" to="/services">All Services</Link></li>
              {serviceLinks.map((item) => (
                <li key={item.to}>
                  <Link className="ue-footer-link" to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="ue-footer-heading">Contact Support</h2>
            <div className="ue-footer-contact">
              <a className="ue-contact-link" href={`mailto:${SUPPORT_EMAIL}`}>
                <Mail className="ue-contact-icon" />
                <span>{SUPPORT_EMAIL}</span>
              </a>
              <a className="ue-contact-link" href={`tel:+91${SUPPORT_PHONE}`}>
                <Phone className="ue-contact-icon" />
                <span>+91 {SUPPORT_PHONE}</span>
              </a>
              <Link className="ue-contact-link" to="/contact">
                <MapPin className="ue-contact-icon" />
                <span>Send a service query from the contact page</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="ue-footer-bottom">
          <span>Copyright {year} UrbanEase. All rights reserved.</span>
          <div className="ue-footer-bottom-links">
            <a href={`tel:+91${SUPPORT_PHONE}`}>Call Helpline</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
