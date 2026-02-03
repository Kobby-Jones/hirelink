import { useMemo, useState } from "react";
import Layout from "../../components/Layout";
import { useApplicationsStore } from "../../store/applicationsStore";
import type { Application, ApplicationStatus } from "../../types/domain";
import { STATUS_ORDER, STATUS_LABEL } from "../../utils/status";
import ApplicationCard from "../../components/admin/ApplicationCard";
import PipelineToolbar, { type SortKey } from "../../components/admin/PipelineToolbar";
import { JOBS } from "../../data/jobs";

function includesCI(hay: string, needle: string) {
  return hay.toLowerCase().includes(needle.toLowerCase());
}

function sortApps(apps: Application[], sort: SortKey) {
  const copy = [...apps];
  switch (sort) {
    case "NEWEST":
      copy.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      return copy;
    case "OLDEST":
      copy.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
      return copy;
    case "SCORE_DESC":
      copy.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
      return copy;
    case "SCORE_ASC":
      copy.sort((a, b) => (a.score ?? 999) - (b.score ?? 999));
      return copy;
    default:
      return copy;
  }
}

export default function AdminBoard() {
  const applications = useApplicationsStore((s) => s.applications);

  const [query, setQuery] = useState("");
  const [jobId, setJobId] = useState("");
  const [minScore, setMinScore] = useState("");
  const [sort, setSort] = useState<SortKey>("NEWEST");

  const filtered = useMemo(() => {
    const q = query.trim();
    const min = minScore ? Number(minScore) : null;

    return applications.filter((a) => {
      // Role filter
      if (jobId && a.jobId !== jobId) return false;

      // Min score filter
      if (min !== null) {
        const s = a.score ?? 0;
        if (s < min) return false;
      }

      // Search query
      if (!q) return true;
      const job = JOBS.find((j) => j.id === a.jobId);
      const blob = [
        a.applicationId,
        a.fullName,
        a.email,
        a.phone,
        (job?.title ?? ""),
        a.skills.join(", "),
      ].join(" | ");

      return includesCI(blob, q);
    });
  }, [applications, query, jobId, minScore]);

  const grouped: Record<ApplicationStatus, Application[]> = useMemo(() => {
    const g: Record<ApplicationStatus, Application[]> = {
      APPLIED: [],
      REVIEWED: [],
      INTERVIEW_SCHEDULED: [],
      OFFER_SENT: [],
    };
    for (const a of filtered) g[a.status].push(a);
    for (const status of STATUS_ORDER) g[status] = sortApps(g[status], sort);
    return g;
  }, [filtered, sort]);

  function clearFilters() {
    setQuery("");
    setJobId("");
    setMinScore("");
    setSort("NEWEST");
  }

  return (
    <Layout
      title="Recruiter Admin"
      subtitle="Manage candidates through the hiring pipeline."
      right={<span className="badge">Search • Filters • Sorting</span>}
    >
      <PipelineToolbar
        query={query}
        onQuery={setQuery}
        jobId={jobId}
        onJobId={setJobId}
        minScore={minScore}
        onMinScore={setMinScore}
        sort={sort}
        onSort={setSort}
        onClear={clearFilters}
        jobOptions={JOBS.map((j) => ({ id: j.id, title: j.title }))}
      />

      <div className="card">
        <div className="cardHeader">
          <div className="hStack" style={{ justifyContent: "space-between" }}>
            <div className="hStack">
              <span className="badge">Pipeline</span>
              <span className="small">
                Showing <strong>{filtered.length}</strong> of <strong>{applications.length}</strong>
              </span>
            </div>
            <span className="countPill">Total: {applications.length}</span>
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

function PipelineColumn({ title, items }: { title: string; items: Application[] }) {
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
            <div className="small">Adjust filters or wait for new submissions.</div>
          </div>
        ) : (
          items.map((app) => <ApplicationCard key={app.applicationId} app={app} />)
        )}
      </div>
    </section>
  );
}
