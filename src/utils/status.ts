import type { ApplicationStatus } from "../types/domain";

export const STATUS_ORDER: ApplicationStatus[] = [
  "APPLIED",
  "REVIEWED",
  "INTERVIEW_SCHEDULED",
  "OFFER_SENT",
];

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  APPLIED: "Applied",
  REVIEWED: "Reviewed",
  INTERVIEW_SCHEDULED: "Interview Scheduled",
  OFFER_SENT: "Offer Sent",
};

export function getPrevStatus(s: ApplicationStatus): ApplicationStatus | null {
  const idx = STATUS_ORDER.indexOf(s);
  return idx > 0 ? STATUS_ORDER[idx - 1] : null;
}

export function getNextStatus(s: ApplicationStatus): ApplicationStatus | null {
  const idx = STATUS_ORDER.indexOf(s);
  return idx >= 0 && idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null;
}
