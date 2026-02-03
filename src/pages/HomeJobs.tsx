import { Link } from "react-router-dom";
import { JOBS } from "../data/jobs";

export default function HomeJobs() {
  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0 }}>HireLink</h1>
          <p style={{ marginTop: 6 }}>
            Browse open roles and submit your application.
          </p>
        </div>
        <Link to="/admin">Recruiter Admin →</Link>
      </header>

      <hr style={{ margin: "16px 0" }} />

      <div style={{ display: "grid", gap: 12 }}>
        {JOBS.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <h3 style={{ margin: 0 }}>{job.title}</h3>
            <div style={{ opacity: 0.8, marginTop: 4 }}>{job.location}</div>
            <p style={{ marginTop: 10 }}>{job.shortDescription}</p>
            <Link to={`/jobs/${job.id}/apply`}>Apply →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
