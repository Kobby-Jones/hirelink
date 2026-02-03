import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Layout from "../components/Layout";
import { JOBS } from "../data/jobs";
import { generateApplicationId } from "../utils/id";
import { useApplicationsStore } from "../store/applicationsStore";
import type { Application } from "../types/domain";

import {
  type ApplicationFormValues,
  fullSchema,
  personalSchema,
  experienceSchema,
  resumeSchema,
} from "../schemas/applicationSchemas";

type Step = 0 | 1 | 2;

const STEPS = [
  { title: "Personal", desc: "Your basic contact details" },
  { title: "Experience", desc: "Skills & background" },
  { title: "Resume", desc: "Upload PDF/DOC/DOCX" },
] as const;

export default function ApplyWizard() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const addApplication = useApplicationsStore((s) => s.addApplication);

  const job = useMemo(() => JOBS.find((j) => j.id === jobId), [jobId]);
  const [step, setStep] = useState<Step>(0);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(fullSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      yearsExperience: 0,
      skillsText: "",
      portfolioUrl: "",
      // resumeFile is set via onChange
    } as any,
  });

  if (!job) {
    return (
      <Layout title="HireLink" subtitle="Role not found">
        <div className="card">
          <div className="cardBody">
            <p className="error">This job role does not exist.</p>
            <Link className="button" to="/">
              ← Back
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  function goBack() {
    setStep((s) => (s === 0 ? 0 : ((s - 1) as Step)));
  }

  async function goNext() {
    // Step-by-step validation (only validate current step fields)
    const ok =
      step === 0
        ? personalSchema.safeParse(form.getValues()).success
        : step === 1
        ? experienceSchema.safeParse(form.getValues()).success
        : resumeSchema.safeParse(form.getValues()).success;

    if (!ok) {
      // Trigger RHF errors for current step fields so user sees messages
      if (step === 0) await form.trigger(["fullName", "email", "phone"]);
      if (step === 1)
        await form.trigger(["yearsExperience", "skillsText", "portfolioUrl"]);
      if (step === 2) await form.trigger(["resumeFile"]);
      return;
    }

    setStep((s) => (s === 2 ? 2 : ((s + 1) as Step)));
  }

  async function onSubmit(values: ApplicationFormValues) {
    setSubmitting(true);
    try {
      if (!job) return;
      const applicationId = generateApplicationId();
      const skills = values.skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const app: Application = {
        applicationId,
        jobId: job.id,
        createdAt: new Date().toISOString(),
        status: "APPLIED",

        fullName: values.fullName,
        email: values.email,
        phone: values.phone,

        yearsExperience: values.yearsExperience,
        skills,
        portfolioUrl: values.portfolioUrl ? values.portfolioUrl : undefined,

        resumeMeta: {
          fileName: values.resumeFile.name,
          fileSize: values.resumeFile.size,
          fileType: values.resumeFile.type,
        },
      };

      addApplication(app);
      navigate(`/thank-you/${applicationId}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout
      title="Application"
      subtitle={`Applying for: ${job.title} • ${job.location}`}
      right={<span className="badge">Step {step + 1} of 3</span>}
    >
      <div className="card">
        <div className="cardHeader">
          <div className="stepper">
            {STEPS.map((s, idx) => (
              <div
                key={s.title}
                className={`step ${idx === step ? "active" : ""}`}
              >
                <div className="stepTitle">
                  {idx + 1}. {s.title}
                </div>
                <div className="stepDesc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="cardBody">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {step === 0 ? <PersonalStep form={form} /> : null}
            {step === 1 ? <ExperienceStep form={form} /> : null}
            {step === 2 ? <ResumeStep form={form} /> : null}

            <hr className="hr" />

            <div className="hStack" style={{ justifyContent: "space-between" }}>
              <div className="hStack">
                <Link className="button" to="/">
                  ← Roles
                </Link>
                <button
                  type="button"
                  className="button"
                  onClick={goBack}
                  disabled={step === 0 || submitting}
                >
                  Back
                </button>
              </div>

              {step < 2 ? (
                <button
                  type="button"
                  className="button primary"
                  onClick={goNext}
                  disabled={submitting}
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  className="button primary"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>

            <p className="help" style={{ marginTop: 10 }}>
              Your application is saved locally in this browser after submission.
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <div className="error">{msg}</div>;
}

function PersonalStep({ form }: { form: ReturnType<typeof useForm<ApplicationFormValues>> }) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="vStack">
      <h3 style={{ margin: 0 }}>Personal Information</h3>
      <div className="formGrid">
        <div className="col6">
          <label className="label">Full Name *</label>
          <input className="input" placeholder="e.g. Seth Dwumah" {...register("fullName")} />
          <FieldError msg={errors.fullName?.message} />
        </div>
        <div className="col6">
          <label className="label">Email *</label>
          <input className="input" placeholder="e.g. name@email.com" {...register("email")} />
          <FieldError msg={errors.email?.message} />
        </div>
        <div className="col6">
          <label className="label">Phone *</label>
          <input className="input" placeholder="e.g. +233..." {...register("phone")} />
          <FieldError msg={errors.phone?.message} />
        </div>
        <div className="col6">
          <div className="toast">
            <strong>Tip:</strong> Use an email and phone you can access quickly.
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperienceStep({ form }: { form: ReturnType<typeof useForm<ApplicationFormValues>> }) {
  const {
    register,
    setValue,
    formState: { errors },
  } = form;

  return (
    <div className="vStack">
      <h3 style={{ margin: 0 }}>Experience & Skills</h3>

      <div className="formGrid">
        <div className="col6">
          <label className="label">Years of Experience *</label>
          <input
            className="input"
            type="number"
            min={0}
            max={50}
            onChange={(e) => setValue("yearsExperience", Number(e.target.value))}
            defaultValue={0}
          />
          <FieldError msg={errors.yearsExperience?.message as any} />
          <div className="help">Use 0 if you’re early-career.</div>
        </div>

        <div className="col6">
          <label className="label">Portfolio URL (optional)</label>
          <input
            className="input"
            placeholder="e.g. https://github.com/yourname"
            {...register("portfolioUrl")}
          />
          <FieldError msg={errors.portfolioUrl?.message} />
        </div>

        <div className="col12">
          <label className="label">Skills (comma-separated) *</label>
          <textarea
            className="textarea"
            placeholder="e.g. React, TypeScript, CSS, Zustand"
            {...register("skillsText")}
          />
          <FieldError msg={errors.skillsText?.message} />
          <div className="help">Separate each skill with commas.</div>
        </div>
      </div>
    </div>
  );
}

function ResumeStep({ form }: { form: ReturnType<typeof useForm<ApplicationFormValues>> }) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  const file = watch("resumeFile");

  return (
    <div className="vStack">
      <h3 style={{ margin: 0 }}>Resume Upload</h3>

      <div className="card" style={{ background: "rgba(255,255,255,0.04)" }}>
        <div className="cardBody">
          <label className="label">Upload Resume (PDF/DOC/DOCX) *</label>
          <input
            className="input"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setValue("resumeFile", f, { shouldValidate: true });
            }}
          />
          <FieldError msg={errors.resumeFile?.message as any} />

          {file ? (
            <div className="toast" style={{ marginTop: 12 }}>
              <div className="hStack" style={{ justifyContent: "space-between" }}>
                <div>
                  <strong>Selected:</strong> {file.name}
                  <div className="help">
                    {(file.size / 1024).toFixed(0)} KB • {file.type || "unknown"}
                  </div>
                </div>
                <span className="badge">Ready</span>
              </div>
            </div>
          ) : (
            <p className="help" style={{ marginTop: 10 }}>
              Max size: 5MB. Ensure your file opens correctly.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
