export type CoachingStage = "essay" | "questions" | "answer" | "interview";

export type PromptStudioDraft = {
  stage: CoachingStage;
  school: string;
  tone: "warm" | "direct" | "pressure";
  followUpDepth: number;
  instruction: string;
  expertAnswer: string;
  safeguards: string[];
  version: number;
  status: "draft" | "approved";
  updatedAt: string;
};

export const promptStudioStorageKey = "aihow:expert-prompt-studio:v1";

export const defaultPromptStudioDraft: PromptStudioDraft = {
  stage: "answer",
  school: "민사고",
  tone: "direct",
  followUpDepth: 2,
  instruction:
    "학생이 말한 경험 안에서 역할·행동·판단 근거를 구체화합니다. 결론을 대신 작성하지 말고, 한 번에 하나의 질문으로 학생의 생각을 끌어냅니다.",
  expertAnswer:
    "팀을 이끌었다는 표현보다 당시 맡은 역할과 실제 행동을 먼저 말해보세요. 의견이 갈렸던 순간에 어떤 기준으로 선택했고, 그 선택 이후 팀의 행동이 어떻게 달라졌는지 한 문장씩 연결하면 답변의 근거가 선명해집니다.",
  safeguards: ["noGhostwriting", "approvedKnowledge", "showEvidence"],
  version: 12,
  status: "draft",
  updatedAt: "2026-08-03T09:00:00.000Z",
};

export function loadPromptStudioDraft(): PromptStudioDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(promptStudioStorageKey);
    return value ? (JSON.parse(value) as PromptStudioDraft) : null;
  } catch {
    return null;
  }
}

export function savePromptStudioDraft(draft: PromptStudioDraft) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(promptStudioStorageKey, JSON.stringify(draft));
}
