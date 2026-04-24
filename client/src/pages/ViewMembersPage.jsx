import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TeamNavbar } from "../components/TeamNavbar";
import { teamPageStyles } from "./teamPageStyles";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER = API.replace(/\/api$/, "");

function getMemberImageUrl(member) {
  if (!member?.document?.filename || !member?.document?.mimetype?.startsWith("image/")) {
    return "";
  }

  return `${SERVER}/uploads/${member.document.filename}`;
}

export function ViewMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API}/members`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to fetch members");
        }

        setMembers(data.members || []);
      } catch (fetchError) {
        setError(fetchError.message || "Unable to fetch members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="team-page team-page-white">
      <style>{teamPageStyles}</style>
      <TeamNavbar />

      <main className="team-wrap">
        <section className="team-hero">
          <h1 className="team-title">Meet Our Amazing Team</h1>
          <p className="team-subtitle">Display a list of all team members stored in the database.</p>
        </section>

        <section className="team-card team-card-wide">
          <div className="team-page-heading-row">
            <div>
              <h2 className="team-card-title">All Team Members</h2>
              <p className="team-card-copy mb-0">Click view details to open the full member profile.</p>
            </div>
          </div>

          {loading ? <div className="team-alert">Loading members...</div> : null}
          {error ? <div className="team-alert team-alert-error">{error}</div> : null}
          {!loading && !error && members.length === 0 ? <div className="team-alert">No members added yet.</div> : null}

          <div className="member-grid">
            {members.map((member) => {
              const imageUrl = getMemberImageUrl(member);

              return (
                <article key={member._id} className="member-card">
                  {imageUrl ? (
                    <img src={imageUrl} alt={member.name} className="member-image" />
                  ) : (
                    <div className="member-image-placeholder">{(member.name?.[0] || "T").toUpperCase()}</div>
                  )}
                  <div className="member-card-body">
                    <h3 className="member-name">{member.name}</h3>
                    <p className="member-meta">Roll No: {member.rollNumber}</p>
                    <Link to={`/team/members/${member._id}`} className="team-submit-btn">
                      View Details
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
