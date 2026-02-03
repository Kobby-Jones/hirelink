import { useParams, Link } from "react-router-dom";

export default function ApplyWizard() {
  const { jobId } = useParams();

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <Link to="/">← Back to roles</Link>
      <h2 style={{ marginTop: 12 }}>Application Form (Wizard)</h2>
      <p>Job ID: {jobId}</p>

      <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        Wizard will be implemented in Step 2 (multi-step form + validation).
      </div>
    </div>
  );
}
