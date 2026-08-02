"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type JourneyStep = "essay" | "analysis" | "practice" | "mock-interview" | "cheat-sheet";

type AppState = {
  completedSteps: JourneyStep[];
  draftAnswers: Record<string, string>;
  selectedPersona: "coach" | "panel" | "pressure";
  notificationsEnabled: boolean;
  completeStep: (step: JourneyStep) => void;
  saveAnswer: (questionId: string, value: string) => void;
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
      selectedPersona: "coach",
      notificationsEnabled: true,
      completeStep: (step) => set((state) => ({ completedSteps: [...new Set([...state.completedSteps, step])] })),
      saveAnswer: (questionId, value) => set((state) => ({ draftAnswers: { ...state.draftAnswers, [questionId]: value } })),
      selectPersona: (selectedPersona) => set({ selectedPersona }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      resetDemo: () => set({ completedSteps: initialSteps, draftAnswers: {}, selectedPersona: "coach" }),
    }),
    { name: "aihow-demo-progress", version: 1 },
  ),
);
