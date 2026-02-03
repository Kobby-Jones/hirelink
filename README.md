# HireLink

HireLink is a client-side hiring workflow demo featuring:

- Public job listings
- Multi-step candidate application wizard (validated per step)
- Admin pipeline (Applied → Reviewed → Interview Scheduled → Offer Sent)
- Candidate review panel (score, notes, interview scheduling, offer drafting)
- Persistence via browser localStorage

## Tech Stack

- React + TypeScript (Vite)
- React Router (client-side routing)
- Zustand (state management + localStorage persistence)
- React Hook Form + Zod (form state + validation)

## How to Run
```bash
npm install
npm run dev
```

## Key Features

### Candidate flow

- Browse roles on `/`
- Apply via multi-step wizard on `/jobs/:jobId/apply`
- Step-by-step validation (each step must pass before advancing)
- Resume upload validation (PDF/DOC/DOCX, size limit)
- Application ID generated on frontend and shown on Thank You page

### Recruiter flow

- Admin pipeline board at `/admin`
- Search, filters (role, min score), sorting
- Stage movement controls
- Candidate review panel at `/admin/applications/:applicationId`
- Score (1–5) + notes persistence
- Interview scheduling auto-moves to Interview Scheduled
- Offer draft generation auto-moves to Offer Sent

## Persistence

Applications are stored in localStorage under:
```
hirelink.applications.v1
```

Refreshing the page retains all applications and recruiter updates.

## Architecture Notes

- `src/types/domain.ts` defines the domain model (Job, Application, statuses)
- `src/store/applicationsStore.ts` is the single source of truth
- UI is built with lightweight global CSS + reusable layout components (no external UI kit)

## Tradeoffs / Future Improvements

- Add authentication/role-based access for admin
- Drag-and-drop pipeline (e.g., dnd-kit) for stage movement
- Store actual resume file contents or upload to a backend
- Better date formatting + timezone normalization
