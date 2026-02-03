import type { Job } from "../types/domain";

export const JOBS: Job[] = [
  {
    id: "frontend-fellow",
    title: "Frontend Fellow",
    location: "Remote (GMT)",
    shortDescription:
      "Build stateful UIs, complex forms, and clean frontend architecture.",
    fullDescription:
      "You will build frontend features with strong state management, validation, and UX.",
  },
  {
    id: "ui-engineer",
    title: "UI Engineer",
    location: "Accra, Ghana (Hybrid)",
    shortDescription:
      "Deliver polished interfaces, accessibility, and responsive layouts.",
    fullDescription:
      "You will focus on UI systems, component quality, and user experience.",
  },
  {
    id: "fullstack-fellow",
    title: "Fullstack Fellow (Frontend-leaning)",
    location: "Remote",
    shortDescription:
      "Own frontend flows end-to-end and integrate with APIs when needed.",
    fullDescription:
      "You will build user journeys and maintain consistent state across screens.",
  },
];
