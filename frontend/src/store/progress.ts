import { create } from "zustand";
import { persist } from "zustand/middleware";

type SessionProgress = Record<string, boolean>;

interface ProgressState {
  bySession: Record<string, SessionProgress>;
  toggleTask: (sessionId: string, taskKey: string) => void;
  isDone: (sessionId: string, taskKey: string) => boolean;
  resetProgress: (sessionId: string) => void;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      bySession: {},
      toggleTask: (sessionId, taskKey) =>
        set((state) => {
          const current = state.bySession[sessionId] ?? {};
          const next = { ...current, [taskKey]: !current[taskKey] };
          return { bySession: { ...state.bySession, [sessionId]: next } };
        }),
      isDone: (sessionId, taskKey) => {
        return !!get().bySession[sessionId]?.[taskKey];
      },
      resetProgress: (sessionId) =>
        set((state) => {
          const rest = { ...state.bySession };
          delete rest[sessionId];
          return { bySession: rest };
        }),
    }),
    { name: "prep-ai-progress" }
  )
);
