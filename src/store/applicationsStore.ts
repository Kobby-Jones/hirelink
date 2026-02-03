import { create } from "zustand";
import type { Application, ApplicationStatus } from "../types/domain";
import { readJson, writeJson } from "../utils/storage";

const STORAGE_KEY = "hirelink.applications.v1";

type ApplicationsState = {
  applications: Application[];

  addApplication: (app: Application) => void;
  updateApplication: (applicationId: string, patch: Partial<Application>) => void;
  moveStatus: (applicationId: string, status: ApplicationStatus) => void;

  getById: (applicationId: string) => Application | undefined;
};

function persist(applications: Application[]) {
  writeJson(STORAGE_KEY, applications);
}

export const useApplicationsStore = create<ApplicationsState>((set, get) => {
  const initial = readJson<Application[]>(STORAGE_KEY, []);

  return {
    applications: initial,

    addApplication: (app) =>
      set((state) => {
        const next = [app, ...state.applications];
        persist(next);
        return { applications: next };
      }),

    updateApplication: (applicationId, patch) =>
      set((state) => {
        const next = state.applications.map((a) =>
          a.applicationId === applicationId ? { ...a, ...patch } : a
        );
        persist(next);
        return { applications: next };
      }),

    moveStatus: (applicationId, status) =>
      set((state) => {
        const next = state.applications.map((a) =>
          a.applicationId === applicationId ? { ...a, status } : a
        );
        persist(next);
        return { applications: next };
      }),

    getById: (applicationId) =>
      get().applications.find((a) => a.applicationId === applicationId),
  };
});
