export type Job = {
  id: string;
  title: string;
  location: string;
  shortDescription: string;
  fullDescription?: string;
};

export type ApplicationStatus =
  | "APPLIED"
  | "REVIEWED"
  | "INTERVIEW_SCHEDULED"
  | "OFFER_SENT";

export type ResumeMeta = {
  fileName: string;
  fileSize: number; // bytes
  fileType: string; // mime
};

export type Application = {
  applicationId: string;
  jobId: string;
  createdAt: string; // ISO string
  status: ApplicationStatus;

  // Candidate
  fullName: string;
  email: string;
  phone: string;

  yearsExperience: number;
  skills: string[];
  portfolioUrl?: string;

  resumeMeta: ResumeMeta;

  // Recruiter
  score?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  interviewDateTime?: string; // ISO or datetime-local string
  offerDraft?: string;
};
