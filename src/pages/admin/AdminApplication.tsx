import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Layout from "../../components/Layout";
import { JOBS } from "../../data/jobs";
import { useApplicationsStore } from "../../store/applicationsStore";
import type { Application } from "../../types/domain";
import { STATUS_LABEL, getNextStatus, getPrevStatus } from "../../utils/status";

function bytesToKB(n: number) {
  return `${Math.round(n / 1024)} KB`;
}

function buildOfferDraft(app: Application, jobTitle: string) {
  return `Subject: Offer — ${jobTitle}

Dear ${app.fullName},

We are pleased to offer you the position of ${jobTitle}. Based on our review process, we believe your skills and experience align with our needs.

Next Steps:
1) Confirm your availability for onboarding.
2) Provide any required documents upon request.

Best regards,
Hiring Team
(HireLink Demo)`;
}

export default function AdminApplication() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const app = useApplicationsStore((s) =>
    applicationId ? s.getById(applicationId) : undefined
  );
  const updateApplication = useApplicationsStore((s) => s.updateApplication);
  const moveStatus = useApplicationsStore((s) => s.moveStatus);

  const job = useMemo(
    () => (app ? JOBS.find((j) => j.id === app.jobId) : undefined),
    [app]
  );

  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  if (!app || !applicationId) {
    return (
      <Layout title="Candidate Review" subtitle="Application not found">
        <div className="card">
          <div className="cardBody">
            <div className="emptyState">
              <div style={{ fontWeight: 750, marginBottom: 6 }}>
                Application not found
              </div>
              <div className="small">
                The application may not exist in this browser’s local storage.
              </div>
            </div>

            <div className="hStack" style={{ marginTop: 14 }}>
              <Link className="button" to="/admin">
                ← Back to pipeline
              </Link>
              <Link className="button" to="/">
                Public site
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const prev = getPrevStatus(app.status);
  const next = getNextStatus(app.status);

  function flashSaved(message: string) {
    setSavedMsg(message);
    window.setTimeout(() => setSavedMsg(null), 1500);
  }

  function setScore(score: 1 | 2 | 3 | 4 | 5) {
    updateApplication(applicationId as string, { score });
    flashSaved("Score saved");
  }

  function setNotes(notes: string) {
    updateApplication(applicationId as string, { notes });
  }

  function saveNotes() {
    flashSaved("Notes saved");
  }
function scheduleInterview(dt: string) {
  if (!dt) return;
  updateApplication(applicationId as string, { interviewDateTime: dt });
  moveStatus(applicationId as string, "INTERVIEW_SCHEDULED");
  flashSaved("Interview scheduled");
}


  function generateOffer() {
    if (!app) return;
    const draft = buildOfferDraft(app, job?.title ?? "Role");
    updateApplication(applicationId as string, { offerDraft: draft });
    moveStatus(applicationId as string, "OFFER_SENT");
    flashSaved("Offer drafted");
  }

  async function copyOffer() {
    if (!app || !app.offerDraft) return;
    try {
      await navigator.clipboard.writeText(app.offerDraft);
      flashSaved("Offer copied");
    } catch {
      flashSaved("Copy failed");
    }
  }

  return (
    <Layout
      title="Candidate Review"
      subtitle={`Application ID: ${app.applicationId}`}
      right={
        <span className="badge">
          Status: {STATUS_LABEL[app.status]}
        </span>
      }
    >
      <div className="card">
        <div className="cardHeader">
          <div className="dividerRow">
            <div className="pillRow">
              <Link className="button" to="/admin">
                ← Pipeline
              </Link>
              <button
                type="button"
                className="button"
                onClick={() => navigate(-1)}
              >
                Back
              </button>

              <button
                type="button"
                className="button"
                disabled={!prev}
                onClick={() => prev && moveStatus(applicationId, prev)}
                title="Move to previous stage"
              >
                ← Move
              </button>

              <button
                type="button"
                className="button"
                disabled={!next}
                onClick={() => next && moveStatus(applicationId, next)}
                title="Move to next stage"
              >
                Move →
              </button>
            </div>

            {savedMsg ? <div className="toast">{savedMsg}</div> : null}
          </div>

          <div className="hStack" style={{ justifyContent: "space-between" }}>
            <div>
              <div className="badge">{job?.location ?? "—"}</div>
              <h2 style={{ margin: "10px 0 0" }}>{app.fullName}</h2>
              <div className="small" style={{ marginTop: 6 }}>
                Applied for: <strong>{job?.title ?? "Unknown role"}</strong>
              </div>
            </div>
            <div className="pillRow">
              <span className="badge">{app.email}</span>
              <span className="badge">{app.phone}</span>
            </div>
          </div>
        </div>

        <div className="cardBody">
          <div className="reviewLayout">
            {/* LEFT: Applicant details */}
            <div className="vStack">
              <div>
                <div className="sectionTitle">Application Details</div>
                <div className="metaGrid">
                  <div className="metaItem">
                    <div className="metaLabel">Experience</div>
                    <div className="metaValue">{app.yearsExperience} years</div>
                  </div>

                  <div className="metaItem">
                    <div className="metaLabel">Portfolio</div>
                    <div className="metaValue">
                      {app.portfolioUrl ? (
                        <a href={app.portfolioUrl} target="_blank" rel="noreferrer">
                          {app.portfolioUrl}
                        </a>
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>

                  <div className="metaItem" style={{ gridColumn: "span 12" }}>
                    <div className="metaLabel">Skills</div>
                    <div className="pillRow" style={{ marginTop: 10 }}>
                      {app.skills.length ? (
                        app.skills.map((s) => (
                          <span className="badge" key={s}>
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="small">—</span>
                      )}
                    </div>
                  </div>

                  <div className="metaItem" style={{ gridColumn: "span 12" }}>
                    <div className="metaLabel">Resume</div>
                    <div className="metaValue" style={{ marginTop: 10 }}>
                      {app.resumeMeta.fileName}
                    </div>
                    <div className="small" style={{ marginTop: 6 }}>
                      {bytesToKB(app.resumeMeta.fileSize)} • {app.resumeMeta.fileType || "unknown"}
                    </div>
                    <div className="help" style={{ marginTop: 8 }}>
                      Resume file contents are not uploaded; only metadata is stored locally.
                    </div>
                  </div>
                </div>
              </div>

              <div className="card" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="cardBody">
                  <div className="sectionTitle">Recruiter Notes</div>
                  <label className="label">Notes</label>
                  <textarea
                    className="textarea"
                    defaultValue={app.notes ?? ""}
                    placeholder="Write evaluation notes: strengths, concerns, follow-ups..."
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <div className="hStack" style={{ justifyContent: "space-between", marginTop: 10 }}>
                    <span className="help">Saved to localStorage</span>
                    <button type="button" className="button primary" onClick={saveNotes}>
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>

              {app.offerDraft ? (
                <div className="card" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="cardBody">
                    <div className="dividerRow">
                      <div className="sectionTitle" style={{ margin: 0 }}>Offer Draft</div>
                      <div className="hStack">
                        <button type="button" className="button" onClick={copyOffer}>
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="offerBox">{app.offerDraft}</div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* RIGHT: Actions panel */}
            <div className="vStack">
              <div className="card">
                <div className="cardBody">
                  <div className="sectionTitle">Score</div>
                  <div className="help" style={{ marginBottom: 10 }}>
                    Rate candidate from 1 (weak) to 5 (strong).
                  </div>
                  <div className="hStack">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`button ${app.score === n ? "primary" : ""}`}
                        onClick={() => setScore(n as 1 | 2 | 3 | 4 | 5)}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <div className="small" style={{ marginTop: 10 }}>
                    Current: <strong>{app.score ? `${app.score}/5` : "—"}</strong>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="cardBody">
                  <div className="sectionTitle">Interview Scheduler</div>
                  <label className="label">Interview date & time</label>
                  <input
                    className="input"
                    type="datetime-local"
                    defaultValue={app.interviewDateTime ?? ""}
                    onChange={(e) => scheduleInterview(e.target.value)}
                  />
                  <div className="help" style={{ marginTop: 8 }}>
                    Setting a date auto-moves the candidate to <strong>Interview Scheduled</strong>.
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="cardBody">
                  <div className="sectionTitle">Offer</div>
                  <div className="help" style={{ marginBottom: 10 }}>
                    Generate a simple offer draft template.
                  </div>
                  <button type="button" className="button primary" onClick={generateOffer}>
                    Draft Offer Letter
                  </button>
                  <div className="help" style={{ marginTop: 10 }}>
                    Drafting an offer auto-moves the candidate to <strong>Offer Sent</strong>.
                  </div>
                </div>
              </div>

              <div className="card" style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="cardBody">
                  <div className="sectionTitle">Status Controls</div>
                  <div className="small">
                    You can also move stages manually using the buttons above.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="hr" />

          <div className="small">
            Note: This demo uses browser persistence only (localStorage). Refreshing keeps data.
          </div>
        </div>
      </div>
    </Layout>
  );
}
