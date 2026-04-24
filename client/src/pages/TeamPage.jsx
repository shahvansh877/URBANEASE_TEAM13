import { Link } from "react-router-dom";
import { TeamNavbar } from "../components/TeamNavbar";
import { teamPageStyles } from "./teamPageStyles";

export function TeamPage() {
  return (
    <div className="team-page">
      <style>{teamPageStyles}</style>
      <TeamNavbar />

      <main className="team-wrap">
        <section className="team-hero">
          <h1 className="team-title">
            Team <span>13</span>
          </h1>
          <p className="team-subtitle">Welcome to the Team 13 Management</p>
        </section>

        <section className="team-card">
          <h2 className="team-card-title">Manage Team</h2>

          <div className="team-actions">
            <Link to="/team/add-member" className="team-action-btn">
              Add Member
            </Link>
            <Link to="/team/members" className="team-action-btn secondary">
              View Members
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
