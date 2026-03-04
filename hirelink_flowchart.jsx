import { useState } from "react";

const nodes = {
  // ENTRY
  start: { id: "start", label: "User Visits HireLink", x: 460, y: 40, type: "entry", w: 180, h: 44 },

  // PUBLIC FLOW
  jobList: { id: "jobList", label: "Job Listings Page\n/ (HomeJobs)", x: 200, y: 140, type: "page", w: 190, h: 52 },
  applyWizard: { id: "applyWizard", label: "Apply Wizard\n/jobs/:jobId/apply", x: 200, y: 260, type: "page", w: 190, h: 52 },

  step1: { id: "step1", label: "Step 1: Personal Info\nName, Email, Phone", x: 30, y: 370, type: "step", w: 170, h: 52 },
  step2: { id: "step2", label: "Step 2: Experience\nSkills, Portfolio, Years", x: 220, y: 370, type: "step", w: 170, h: 52 },
  step3: { id: "step3", label: "Step 3: Resume\nUpload PDF/DOC", x: 410, y: 370, type: "step", w: 170, h: 52 },

  validate: { id: "validate", label: "Zod Validation\n(per-step + full schema)", x: 220, y: 480, type: "logic", w: 190, h: 52 },
  validFail: { id: "validFail", label: "Show Inline\nField Errors", x: 50, y: 560, type: "error", w: 160, h: 44 },
  validPass: { id: "validPass", label: "Submit Application", x: 280, y: 560, type: "action", w: 170, h: 44 },

  genId: { id: "genId", label: "Generate Application ID\nAPP-YYYYMMDD-XXXXXX", x: 280, y: 650, type: "logic", w: 200, h: 52 },
  zustandAdd: { id: "zustandAdd", label: "Zustand Store\naddApplication()", x: 280, y: 750, type: "store", w: 190, h: 52 },
  localStorage: { id: "localStorage", label: "localStorage\nhirelink.applications.v1", x: 280, y: 850, type: "storage", w: 200, h: 52 },
  thankYou: { id: "thankYou", label: "Thank You Page\n/thank-you/:applicationId", x: 280, y: 950, type: "page", w: 210, h: 52 },

  // ADMIN FLOW
  adminBoard: { id: "adminBoard", label: "Recruiter Dashboard\n/admin (AdminBoard)", x: 700, y: 140, type: "admin", w: 200, h: 52 },
  toolbar: { id: "toolbar", label: "Pipeline Toolbar\nSearch, Filter, Sort", x: 700, y: 260, type: "logic", w: 190, h: 52 },
  pipeline: { id: "pipeline", label: "Kanban Pipeline\n4 Stage Columns", x: 700, y: 360, type: "admin", w: 190, h: 52 },

  colA: { id: "colA", label: "Applied", x: 570, y: 460, type: "stage", w: 100, h: 36 },
  colR: { id: "colR", label: "Reviewed", x: 680, y: 460, type: "stage", w: 100, h: 36 },
  colI: { id: "colI", label: "Interview\nScheduled", x: 790, y: 460, type: "stage", w: 110, h: 44 },
  colO: { id: "colO", label: "Offer\nSent", x: 910, y: 460, type: "stage", w: 90, h: 44 },

  adminApp: { id: "adminApp", label: "Candidate Review Panel\n/admin/applications/:id", x: 700, y: 560, type: "admin", w: 210, h: 52 },

  score: { id: "score", label: "Score (1–5)", x: 570, y: 660, type: "action", w: 130, h: 36 },
  notes: { id: "notes", label: "Add Notes", x: 710, y: 660, type: "action", w: 120, h: 36 },
  schedule: { id: "schedule", label: "Schedule Interview\n→ auto-moves to Interview Scheduled", x: 570, y: 730, type: "action", w: 230, h: 52 },
  offer: { id: "offer", label: "Draft Offer Letter\n→ auto-moves to Offer Sent", x: 570, y: 810, type: "action", w: 210, h: 52 },
  moveStatus: { id: "moveStatus", label: "moveStatus()\nZustand + localStorage", x: 710, y: 880, type: "store", w: 200, h: 52 },

  // ROUTING
  router: { id: "router", label: "React Router v6\ncreateBrowserRouter", x: 460, y: 1060, type: "infra", w: 200, h: 52 },
};

const edges = [
  { from: "start", to: "jobList", label: "/ route" },
  { from: "start", to: "adminBoard", label: "/admin route" },
  { from: "jobList", to: "applyWizard", label: "Click Apply →" },
  { from: "applyWizard", to: "step1" },
  { from: "applyWizard", to: "step2" },
  { from: "applyWizard", to: "step3" },
  { from: "step1", to: "validate", label: "Next" },
  { from: "step2", to: "validate", label: "Next" },
  { from: "step3", to: "validate", label: "Submit" },
  { from: "validate", to: "validFail", label: "fails" },
  { from: "validate", to: "validPass", label: "passes" },
  { from: "validFail", to: "step1", label: "user corrects", dashed: true },
  { from: "validPass", to: "genId" },
  { from: "genId", to: "zustandAdd" },
  { from: "zustandAdd", to: "localStorage", label: "persist()" },
  { from: "zustandAdd", to: "thankYou", label: "navigate()" },
  { from: "adminBoard", to: "toolbar" },
  { from: "toolbar", to: "pipeline", label: "filtered + sorted" },
  { from: "pipeline", to: "colA" },
  { from: "pipeline", to: "colR" },
  { from: "pipeline", to: "colI" },
  { from: "pipeline", to: "colO" },
  { from: "colA", to: "adminApp", label: "Open →" },
  { from: "adminApp", to: "score" },
  { from: "adminApp", to: "notes" },
  { from: "adminApp", to: "schedule" },
  { from: "adminApp", to: "offer" },
  { from: "schedule", to: "moveStatus" },
  { from: "offer", to: "moveStatus" },
  { from: "score", to: "moveStatus", label: "updateApplication()" },
  { from: "localStorage", to: "adminBoard", label: "readJson() on init", dashed: true },
  { from: "thankYou", to: "adminBoard", label: "View in Admin →", dashed: true },
];

const TYPE_STYLES = {
  entry:   { bg: "#0f172a", border: "#38bdf8", text: "#e0f2fe", dot: "#38bdf8" },
  page:    { bg: "#1e1b4b", border: "#818cf8", text: "#e0e7ff", dot: "#818cf8" },
  step:    { bg: "#1e293b", border: "#60a5fa", text: "#bfdbfe", dot: "#60a5fa" },
  logic:   { bg: "#1a1a2e", border: "#a78bfa", text: "#ddd6fe", dot: "#a78bfa" },
  error:   { bg: "#2d0a0a", border: "#f87171", text: "#fecaca", dot: "#f87171" },
  action:  { bg: "#0f2a1a", border: "#34d399", text: "#a7f3d0", dot: "#34d399" },
  store:   { bg: "#1c1017", border: "#e879f9", text: "#f5d0fe", dot: "#e879f9" },
  storage: { bg: "#1c1708", border: "#fbbf24", text: "#fef3c7", dot: "#fbbf24" },
  admin:   { bg: "#0f1e2e", border: "#38bdf8", text: "#bae6fd", dot: "#38bdf8" },
  stage:   { bg: "#0d1f14", border: "#4ade80", text: "#bbf7d0", dot: "#4ade80" },
  infra:   { bg: "#1a0f2e", border: "#c084fc", text: "#f3e8ff", dot: "#c084fc" },
};

function getCenter(node) {
  return { x: node.x + node.w / 2, y: node.y + node.h / 2 };
}

function EdgeLine({ from, to, label, dashed, highlight }) {
  const fn = nodes[from], tn = nodes[to];
  if (!fn || !tn) return null;
  const fc = getCenter(fn), tc = getCenter(tn);
  const mx = (fc.x + tc.x) / 2;
  const my = (fc.y + tc.y) / 2;
  const dx = tc.x - fc.x, dy = tc.y - fc.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len * 18, ny = dx / len * 18;
  const cx = mx + nx, cy = my + ny;
  const path = `M ${fc.x} ${fc.y} Q ${cx} ${cy} ${tc.x} ${tc.y}`;
  const color = highlight ? "#f59e0b" : "rgba(148,163,184,0.4)";
  const lx = (fc.x + cx + tc.x) / 3 + nx * 0.5;
  const ly = (fc.y + cy + tc.y) / 3 + ny * 0.5;
  return (
    <g>
      <defs>
        <marker id={`arrow-${from}-${to}`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
          <polygon points="0 0, 7 3.5, 0 7" fill={color} />
        </marker>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={highlight ? 2 : 1.2}
        strokeDasharray={dashed ? "5,4" : undefined}
        markerEnd={`url(#arrow-${from}-${to})`}
        opacity={0.85}
      />
      {label && (
        <text x={lx} y={ly} textAnchor="middle" fill="rgba(203,213,225,0.75)" fontSize="9" fontFamily="'JetBrains Mono', monospace">
          {label}
        </text>
      )}
    </g>
  );
}

function NodeBox({ node, highlight, onClick }) {
  const s = TYPE_STYLES[node.type] || TYPE_STYLES.page;
  const lines = node.label.split("\n");
  return (
    <g
      transform={`translate(${node.x}, ${node.y})`}
      onClick={() => onClick(node.id)}
      style={{ cursor: "pointer" }}
    >
      <rect
        width={node.w}
        height={node.h}
        rx={8}
        fill={highlight ? s.border + "22" : s.bg}
        stroke={highlight ? s.dot : s.border}
        strokeWidth={highlight ? 2.5 : 1.2}
        filter={highlight ? "url(#glow)" : undefined}
      />
      <circle cx={10} cy={node.h / 2} r={3.5} fill={s.dot} opacity={0.9} />
      {lines.map((line, i) => (
        <text
          key={i}
          x={node.w / 2 + 4}
          y={node.h / 2 + (lines.length === 1 ? 4 : i === 0 ? -4 : 10)}
          textAnchor="middle"
          fill={highlight ? "#fff" : s.text}
          fontSize={i === 0 ? 11 : 9}
          fontWeight={i === 0 ? "600" : "400"}
          fontFamily={i === 0 ? "'DM Sans', sans-serif" : "'JetBrains Mono', monospace"}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

const LEGEND = [
  { type: "page", label: "Page / Route" },
  { type: "step", label: "Form Step" },
  { type: "logic", label: "Logic / Validation" },
  { type: "store", label: "Zustand Store Action" },
  { type: "storage", label: "localStorage" },
  { type: "action", label: "Recruiter Action" },
  { type: "admin", label: "Admin View" },
  { type: "error", label: "Error State" },
  { type: "infra", label: "Infrastructure" },
];

export default function HireLinkFlowchart() {
  const [active, setActive] = useState(null);

  const SVG_W = 1060;
  const SVG_H = 1140;

  function toggle(id) {
    setActive(prev => prev === id ? null : id);
  }

  const activeEdges = active
    ? edges.filter(e => e.from === active || e.to === active).map(e => `${e.from}-${e.to}`)
    : [];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060b14",
      fontFamily: "'DM Sans', sans-serif",
      padding: "24px 16px",
      color: "#e2e8f0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 1060, margin: "0 auto 24px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 11, letterSpacing: 3, color: "#64748b", textTransform: "uppercase", fontFamily: "JetBrains Mono" }}>System Architecture</span>
          <span style={{ width: 40, height: 1, background: "#334155", display: "inline-block", verticalAlign: "middle" }} />
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#f1f5f9", letterSpacing: -0.5 }}>
          HireLink — Full System Flowchart
        </h1>
        <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13 }}>
          Click any node to highlight its connections &nbsp;·&nbsp; React + Zustand + React Router v6
        </p>
      </div>

      {/* Legend */}
      <div style={{
        maxWidth: 1060, margin: "0 auto 20px",
        display: "flex", flexWrap: "wrap", gap: 8
      }}>
        {LEGEND.map(l => {
          const s = TYPE_STYLES[l.type];
          return (
            <div key={l.type} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "4px 10px", borderRadius: 6,
              border: `1px solid ${s.border}44`,
              background: s.bg,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />
              <span style={{ fontSize: 11, color: s.text, fontFamily: "JetBrains Mono" }}>{l.type}</span>
              <span style={{ fontSize: 11, color: "#64748b" }}>{l.label}</span>
            </div>
          );
        })}
      </div>

      {/* SVG Chart */}
      <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "78vh" }}>
        <svg
          width={SVG_W}
          height={SVG_H}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: "block", margin: "0 auto" }}
        >
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="bg1" cx="30%" cy="20%" r="50%">
              <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#060b14" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="bg2" cx="75%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#0f2a3a" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#060b14" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width={SVG_W} height={SVG_H} fill="#060b14" />
          <rect width={SVG_W} height={SVG_H} fill="url(#bg1)" />
          <rect width={SVG_W} height={SVG_H} fill="url(#bg2)" />

          {/* Section labels */}
          <text x={120} y={108} fill="#3b4e6b" fontSize={11} fontFamily="JetBrains Mono" letterSpacing={2}>CANDIDATE PUBLIC FLOW</text>
          <text x={640} y={108} fill="#1e3a52" fontSize={11} fontFamily="JetBrains Mono" letterSpacing={2}>RECRUITER ADMIN FLOW</text>
          <line x1={20} y1={115} x2={490} y2={115} stroke="#1e293b" strokeWidth={1} strokeDasharray="3,3" />
          <line x1={610} y1={115} x2={1040} y2={115} stroke="#1e293b" strokeWidth={1} strokeDasharray="3,3" />

          {/* Edges */}
          {edges.map(e => (
            <EdgeLine
              key={`${e.from}-${e.to}`}
              from={e.from} to={e.to}
              label={e.label}
              dashed={e.dashed}
              highlight={activeEdges.includes(`${e.from}-${e.to}`)}
            />
          ))}

          {/* Nodes */}
          {Object.values(nodes).map(node => (
            <NodeBox
              key={node.id}
              node={node}
              highlight={active === node.id}
              onClick={toggle}
            />
          ))}
        </svg>
      </div>

      {/* Active node info */}
      {active && (() => {
        const n = nodes[active];
        const connected = edges.filter(e => e.from === active || e.to === active);
        const s = TYPE_STYLES[n.type];
        return (
          <div style={{
            maxWidth: 1060, margin: "16px auto 0",
            padding: "14px 18px",
            borderRadius: 10,
            border: `1px solid ${s.border}55`,
            background: s.bg,
            display: "flex", alignItems: "flex-start", gap: 20
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: s.dot, fontFamily: "JetBrains Mono", marginBottom: 4 }}>{n.type.toUpperCase()}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#f1f5f9", marginBottom: 8 }}>{n.label.replace("\n", " — ")}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {connected.map(e => (
                  <span key={`${e.from}-${e.to}`} style={{
                    padding: "3px 9px", borderRadius: 5,
                    fontSize: 11, fontFamily: "JetBrains Mono",
                    background: "rgba(255,255,255,0.05)",
                    color: "#94a3b8",
                    border: "1px solid rgba(255,255,255,0.08)"
                  }}>
                    {e.from === active ? `→ ${e.to}` : `← ${e.from}`}
                    {e.label ? ` (${e.label})` : ""}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setActive(null)}
              style={{ background: "none", border: "none", color: "#64748b", fontSize: 18, cursor: "pointer", padding: 4 }}
            >✕</button>
          </div>
        );
      })()}
    </div>
  );
}
