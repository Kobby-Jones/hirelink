export type SortKey = "NEWEST" | "OLDEST" | "SCORE_DESC" | "SCORE_ASC";

export default function PipelineToolbar(props: {
  query: string;
  onQuery: (v: string) => void;

  jobId: string;
  onJobId: (v: string) => void;

  minScore: string;
  onMinScore: (v: string) => void;

  sort: SortKey;
  onSort: (v: SortKey) => void;

  onClear: () => void;

  jobOptions: { id: string; title: string }[];
}) {
  const { query, onQuery, jobId, onJobId, minScore, onMinScore, sort, onSort, onClear, jobOptions } = props;

  return (
    <div className="card" style={{ marginBottom: 14 }}>
      <div className="cardBody">
        <div className="formGrid">
          <div className="col6">
            <label className="label">Search</label>
            <input
              className="input"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Name, email, application ID, skill..."
            />
            <div className="help">Fast filtering across candidate details.</div>
          </div>

          <div className="col6">
            <label className="label">Role</label>
            <select className="select" value={jobId} onChange={(e) => onJobId(e.target.value)}>
              <option value="">All roles</option>
              {jobOptions.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
            <div className="help">Filter by job role.</div>
          </div>

          <div className="col6">
            <label className="label">Minimum score</label>
            <select className="select" value={minScore} onChange={(e) => onMinScore(e.target.value)}>
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5</option>
            </select>
            <div className="help">Useful for shortlisting.</div>
          </div>

          <div className="col6">
            <label className="label">Sort</label>
            <select className="select" value={sort} onChange={(e) => onSort(e.target.value as SortKey)}>
              <option value="NEWEST">Newest first</option>
              <option value="OLDEST">Oldest first</option>
              <option value="SCORE_DESC">Score high → low</option>
              <option value="SCORE_ASC">Score low → high</option>
            </select>
            <div className="help">Sorting applies within each stage.</div>
          </div>
        </div>

        <div className="hStack" style={{ justifyContent: "flex-end", marginTop: 10 }}>
          <button type="button" className="button" onClick={onClear}>
            Clear filters
          </button>
        </div>
      </div>
    </div>
  );
}
