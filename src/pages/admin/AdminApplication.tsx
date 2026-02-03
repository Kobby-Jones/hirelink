import { Link, useParams } from "react-router-dom";

export default function AdminApplication() {
  const { applicationId } = useParams();

  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: 16 }}>
      <Link to="/admin">← Back to pipeline</Link>
      <h2 style={{ marginTop: 12 }}>Candidate Review</h2>
      <p>Application ID: {applicationId}</p>

      <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        Review panel (score/notes/scheduler/offer) will be implemented in Step 5.
      </div>
    </div>
  );
}
