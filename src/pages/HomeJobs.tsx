import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { JOBS } from "../data/jobs";

export default function HomeJobs() {
  return (
    <Layout
      title="HireLink"
      subtitle="Browse roles and submit a structured application."
      right={<span className="badge">Client-side • Persisted • Routed</span>}
    >
      <div className="grid jobs">
        {JOBS.map((job) => (
          <div key={job.id} className="card jobCard">
            <div className="hStack" style={{ justifyContent: "space-between" }}>
              <div>
                <div className="badge">{job.location}</div>
                <h3 style={{ margin: "10px 0 6px" }}>{job.title}</h3>
                <p style={{ margin: 0, color: "var(--muted)" }}>
                  {job.shortDescription}
                </p>
              </div>
            </div>

            <hr className="hr" />

            <div className="hStack" style={{ justifyContent: "space-between" }}>
              <Link className="button primary" to={`/jobs/${job.id}/apply`}>
                Apply →
              </Link>
              <span className="help">Takes ~2 minutes</span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
