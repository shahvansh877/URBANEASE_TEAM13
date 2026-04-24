import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TeamNavbar } from "../components/TeamNavbar";
import { teamPageStyles } from "./teamPageStyles";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const initialForm = {
  name: "",
  rollNumber: "",
  year: "",
  degree: "",
  aboutProject: "",
  hobbies: "",
  certificate: "",
  internship: "",
  aim: "",
};

export function AddMemberPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value.trim());
      });

      if (documentFile) {
        formData.append("document", documentFile);
      }

      const response = await fetch(`${API}/members`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to add member");
      }

      setSuccess("Member added successfully.");
      setForm(initialForm);
      setDocumentFile(null);
      setTimeout(() => navigate("/team/members"), 700);
    } catch (submitError) {
      setError(submitError.message || "Unable to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="team-page team-page-white">
      <style>{teamPageStyles}</style>
      <TeamNavbar />

      <main className="team-wrap">
        <section className="team-panel">
          <h1 className="team-panel-title">Add Team Member</h1>

          {error ? <div className="team-alert team-alert-error">{error}</div> : null}
          {success ? <div className="team-alert team-alert-success">{success}</div> : null}

          <form onSubmit={handleSubmit} className="team-form">
            <div className="team-form-grid">
              <TextInput id="member-name" label="Name" name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
              <TextInput id="member-roll" label="Roll Number" name="rollNumber" value={form.rollNumber} onChange={handleChange} placeholder="Roll Number" required />
              <TextInput id="member-year" label="Year" name="year" value={form.year} onChange={handleChange} placeholder="Year" required />
              <TextInput id="member-degree" label="Degree" name="degree" value={form.degree} onChange={handleChange} placeholder="Degree" required />

              <div className="team-field team-field-full">
                <label htmlFor="member-project">About Project</label>
                <textarea id="member-project" name="aboutProject" value={form.aboutProject} onChange={handleChange} placeholder="About Project" className="team-textarea" required />
              </div>

              <TextInput id="member-hobbies" label="Hobbies" name="hobbies" value={form.hobbies} onChange={handleChange} placeholder="Hobbies (comma separated)" required />
              <TextInput id="member-certificate" label="Certificate" name="certificate" value={form.certificate} onChange={handleChange} placeholder="Certificate" />
              <TextInput id="member-internship" label="Internship" name="internship" value={form.internship} onChange={handleChange} placeholder="Internship" />

              <div className="team-field">
                <label htmlFor="member-document">Upload Image</label>
                <div className="team-file-picker">
                  <input
                    id="member-document"
                    name="document"
                    type="file"
                    accept="image/*"
                    onChange={(event) => setDocumentFile(event.target.files?.[0] || null)}
                    className="team-file-input"
                  />
                  <label htmlFor="member-document" className="team-file-button">Browse...</label>
                  <span className="team-file-name">{documentFile?.name || "No file selected"}</span>
                </div>
              </div>

              <div className="team-field team-field-full">
                <label htmlFor="member-aim">About Your Aim</label>
                <textarea id="member-aim" name="aim" value={form.aim} onChange={handleChange} placeholder="About Your Aim" className="team-textarea" required />
              </div>
            </div>

            <button type="submit" className="team-submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

function TextInput({ id, label, ...props }) {
  return (
    <div className="team-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" className="team-input" {...props} />
    </div>
  );
}
