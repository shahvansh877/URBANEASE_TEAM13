import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { TeamNavbar } from "../components/TeamNavbar";
import { teamPageStyles } from "./teamPageStyles";
import { API_BASE_URL as API } from "../config/api";

const SERVER = API.replace(/\/api$/, "");

function getMemberImageUrl(member) {
  if (!member?.document?.filename || !member?.document?.mimetype?.startsWith("image/")) {
    return "";
  }

  return `${SERVER}/uploads/${member.document.filename}`;
}

export function MemberDetailsPage() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await fetch(`${API}/members/${id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to fetch member details");
        }

        setMember(data.member);
      } catch (fetchError) {
        setError(fetchError.message || "Unable to fetch member details");
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  return (
    <div className="team-page team-page-white">
      <style>{teamPageStyles}</style>
      <TeamNavbar />

      <main className="team-wrap">
        <section className="team-hero">
          <h1 className="team-title">Member Details</h1>
        </section>

        <section className="team-card team-card-wide">
          <Link to="/team/members" className="team-back-link">
            <ArrowLeft className="w-4 h-4" />
            Back to Members
          </Link>

          {loading ? <div className="team-alert">Loading member details...</div> : null}
          {error ? <div className="team-alert team-alert-error">{error}</div> : null}

          {member ? (
            <div className="member-simple-card">
              {getMemberImageUrl(member) ? (
                <img src={getMemberImageUrl(member)} alt={member.name} className="member-simple-photo" />
              ) : (
                <div className="member-simple-placeholder">{(member.name?.[0] || "T").toUpperCase()}</div>
              )}

              <div className="member-simple-body">
                <h2 className="member-simple-name">{member.name}</h2>
                <p className="member-simple-degree">{member.degree} - {member.year}</p>

                <div className="member-simple-list">
                  <SimpleDetail label="Roll Number" value={member.rollNumber} />
                  <SimpleDetail label="Project" value={member.aboutProject} />
                  <SimpleDetail label="Certificate" value={member.certificate || "Not added"} />
                  <SimpleDetail label="Internship" value={member.internship || "Not added"} />
                  <SimpleDetail label="About Your Aim" value={member.aim} />
                </div>

                <div className="member-hobbies">
                  <h3>Hobbies:</h3>
                  <div className="member-hobby-tags">
                    {(member.hobbies || []).length ? (
                      member.hobbies.map((hobby) => (
                        <span key={hobby} className="member-hobby-tag">{hobby}</span>
                      ))
                    ) : (
                      <span className="member-hobby-tag">Not added</span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

function SimpleDetail({ label, value }) {
  return (
    <p className="member-simple-row">
      <strong>{label}:</strong> {value}
    </p>
  );
}
