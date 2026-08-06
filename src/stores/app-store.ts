"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type JourneyStep =
  "essay" | "analysis" | "practice" | "mock-interview" | "cheat-sheet";

type AppState = {
  completedSteps: JourneyStep[];
  draftAnswers: Record<string, string>;
  practiceDrafts: Record<string, string>;
  practiceDraftUpdatedAt: Record<string, number>;
  selectedPersona: "coach" | "panel" | "pressure";
  notificationsEnabled: boolean;
  completeStep: (step: JourneyStep) => void;
  saveAnswer: (questionId: string, value: string) => void;
  savePracticeDraft: (questionId: string, value: string) => void;
  clearPracticeDraft: (questionId: string) => void;
  selectPersona: (persona: AppState["selectedPersona"]) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  resetDemo: () => void;
};

const initialSteps: JourneyStep[] = ["essay", "analysis"];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      completedSteps: initialSteps,
      draftAnswers: {},
      practiceDrafts: {},
      practiceDraftUpdatedAt: {},
      selectedPersona: "coach",
      notificationsEnabled: true,
      completeStep: (step) =>
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, step])],
        })),
      saveAnswer: (questionId, value) =>
        set((state) => ({
          draftAnswers: { ...state.draftAnswers, [questionId]: value },
        })),
      savePracticeDraft: (questionId, value) =>
        set((state) => {
          const practiceDrafts = { ...state.practiceDrafts };
          const practiceDraftUpdatedAt = { ...state.practiceDraftUpdatedAt };
          const normalizedValue = value.trim() ? value : "";

          if (normalizedValue) {
            practiceDrafts[questionId] = value;
            practiceDraftUpdatedAt[questionId] = Date.now();
          } else {
            delete practiceDrafts[questionId];
            delete practiceDraftUpdatedAt[questionId];
          }

          return { practiceDrafts, practiceDraftUpdatedAt };
        }),
      clearPracticeDraft: (questionId) =>
        set((state) => {
          const practiceDrafts = { ...state.practiceDrafts };
          const practiceDraftUpdatedAt = { ...state.practiceDraftUpdatedAt };
          delete practiceDrafts[questionId];
          delete practiceDraftUpdatedAt[questionId];
          return { practiceDrafts, practiceDraftUpdatedAt };
        }),
      selectPersona: (selectedPersona) => set({ selectedPersona }),
      setNotificationsEnabled: (notificationsEnabled) =>
        set({ notificationsEnabled }),
      resetDemo: () =>
        set({
          completedSteps: initialSteps,
          draftAnswers: {},
          practiceDrafts: {},
          practiceDraftUpdatedAt: {},
          selectedPersona: "coach",
        }),
    }),
    {
      name: "aihow-demo-progress",
      version: 2,
      migrate: (persistedState) => ({
        ...(persistedState as Partial<AppState>),
        practiceDrafts:
          (persistedState as Partial<AppState>)?.practiceDrafts ?? {},
        practiceDraftUpdatedAt:
          (persistedState as Partial<AppState>)?.practiceDraftUpdatedAt ?? {},
      }),
    },
  ),
);
