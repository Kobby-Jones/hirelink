import { Link } from "react-router-dom";

export default function AdminBoard() {
  return (
    <div style={{ maxWidth: 1100, margin: "40px auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Recruiter Admin — Pipeline</h2>
        <Link to="/">Public site →</Link>
      </header>

      <div style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 12 }}>
        Pipeline board will be implemented in Step 4.
      </div>
    </div>
  );
}
