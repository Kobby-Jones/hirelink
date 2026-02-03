import { Link } from "react-router-dom";
import type { Application } from "../../types/domain";
import { JOBS } from "../../data/jobs";
import { STATUS_LABEL, getNextStatus, getPrevStatus } from "../../utils/status";
import { formatDateTime } from "../../utils/format";
import { useApplicationsStore } from "../../store/applicationsStore";

export default function ApplicationCard({ app }: { app: Application }) {
  const moveStatus = useApplicationsStore((s) => s.moveStatus);

  const job = JOBS.find((j) => j.id === app.jobId);
  const next = getNextStatus(app.status);
  const prev = getPrevStatus(app.status);

  return (
    <div className="appCard">
      <div className="hStack" style={{ justifyContent: "space-between" }}>
        <div style={{ fontWeight: 750 }}>{app.fullName}</div>
        <span className="badge">{STATUS_LABEL[app.status]}</span>
      </div>

      <div className="small" style={{ marginTop: 6 }}>
        {job?.title ?? "Unknown role"} • {job?.location ?? ""}
      </div>

      <div className="kv" style={{ marginTop: 10 }}>
        <span>Applied</span>
        <span>{formatDateTime(app.createdAt)}</span>
      </div>

      <div className="kv" style={{ marginTop: 6 }}>
        <span>Score</span>
        <span>{app.score ? `${app.score}/5` : "—"}</span>
      </div>

      {app.interviewDateTime ? (
        <div className="kv" style={{ marginTop: 6 }}>
          <span>Interview</span>
          <span>{app.interviewDateTime}</span>
        </div>
      ) : null}

      <hr className="hr" />

      <div className="hStack" style={{ justifyContent: "space-between" }}>
        <Link className="button primary" to={`/admin/applications/${app.applicationId}`}>
          Open
        </Link>

        <div className="hStack">
          <button
            type="button"
            className="button"
            disabled={!prev}
            onClick={() => prev && moveStatus(app.applicationId, prev)}
            title="Move to previous stage"
          >
            ←
          </button>

          <button
            type="button"
            className="button"
            disabled={!next}
            onClick={() => next && moveStatus(app.applicationId, next)}
            title="Move to next stage"
          >
            →
          </button>
        </div>
      </div>

      <div className="small" style={{ marginTop: 10 }}>
        ID: <span style={{ color: "var(--text)" }}>{app.applicationId}</span>
      </div>
    </div>
  );
}
