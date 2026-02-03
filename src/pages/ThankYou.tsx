import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useApplicationsStore } from "../store/applicationsStore";
import { JOBS } from "../data/jobs";

export default function ThankYou() {
  const { applicationId } = useParams();
  const app = useApplicationsStore((s) =>
    applicationId ? s.getById(applicationId) : undefined
  );

  const job = app ? JOBS.find((j) => j.id === app.jobId) : undefined;

  return (
    <Layout
      title="Submission Complete"
      subtitle="Your application was saved successfully."
      right={<span className="badge">Application ID: {applicationId}</span>}
    >
      <div className="card">
        <div className="cardBody">
          <div className="toast">
            <strong>Success!</strong> Keep your Application ID for reference.
          </div>

          <hr className="hr" />

          <div className="vStack">
            <div className="hStack" style={{ justifyContent: "space-between" }}>
              <div>
                <div className="label">Applied Role</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  {job?.title ?? "Unknown role"}
                </div>
                <div className="help">{job?.location ?? ""}</div>
              </div>
              <span className="badge">{app?.status ?? "APPLIED"}</span>
            </div>

            <div>
              <div className="label">What happens next?</div>
              <div className="help">
                Your application will be reviewed. If shortlisted, you’ll be contacted
                to schedule an interview.
              </div>
            </div>

            <div className="hStack">
              <Link className="button" to="/">
                Back to roles
              </Link>
              <Link className="button primary" to="/admin">
                View in Admin →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
