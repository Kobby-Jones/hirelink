import Layout from "../../components/Layout";
import { useApplicationsStore } from "../../store/applicationsStore";
import type { ApplicationStatus } from "../../types/domain";
import { STATUS_ORDER, STATUS_LABEL } from "../../utils/status";
import ApplicationCard from "../../components/admin/ApplicationCard";

export default function AdminBoard() {
  const applications = useApplicationsStore((s) => s.applications);

  const grouped: Record<ApplicationStatus, typeof applications> = {
    APPLIED: [],
    REVIEWED: [],
    INTERVIEW_SCHEDULED: [],
    OFFER_SENT: [],
  };

  for (const a of applications) grouped[a.status].push(a);

  // Optional: newest first per column
  for (const key of STATUS_ORDER) {
    grouped[key].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  return (
    <Layout
      title="Recruiter Admin"
      subtitle="Manage candidates through the hiring pipeline."
      right={<span className="badge">Persisted in localStorage</span>}
    >
      <div className="card">
        <div className="cardHeader">
          <div className="hStack" style={{ justifyContent: "space-between" }}>
            <div className="hStack">
              <span className="badge">Pipeline</span>
              <span className="small">
                Tip: Use ← / → on cards to move candidates between stages.
              </span>
            </div>
            <span className="countPill">
              Total: {applications.length}
            </span>
          </div>
        </div>

        <div className="cardBody">
          <div className="pipeline">
            {STATUS_ORDER.map((status) => (
              <PipelineColumn
                key={status}
                title={STATUS_LABEL[status]}
                items={grouped[status]}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function PipelineColumn({
  title,
  items,
}: {
  title: string;
  items: any[];
}) {
  return (
    <section className="column">
      <div className="columnHeader">
        <div className="columnTitle">{title}</div>
        <div className="countPill">{items.length}</div>
      </div>

      <div className="vStack">
        {items.length === 0 ? (
          <div className="emptyState">
            <div style={{ fontWeight: 750, marginBottom: 6 }}>No candidates</div>
            <div className="small">
              New applications will appear here automatically after submission.
            </div>
          </div>
        ) : (
          items.map((app) => <ApplicationCard key={app.applicationId} app={app} />)
        )}
      </div>
    </section>
  );
}
