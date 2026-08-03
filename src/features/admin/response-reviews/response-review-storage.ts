export type ReviewStatus = "pending" | "draft" | "approved";

export type CoachingResponse = {
  id: string;
  student: string;
  school: string;
  stage: "자소서" | "예상 질문" | "답변 코칭" | "모의면접";
  studentInput: string;
  aiAnswer: string;
  expertNote: string;
  status: ReviewStatus;
  updatedAt: string;
};

export const responseReviewStorageKey = "aihow:response-reviews:v1";

export const seedCoachingResponses: CoachingResponse[] = [
  {
    id: "review-question-kim",
    student: "김하우",
    school: "민사고",
    stage: "예상 질문",
    studentInput:
      "과학 동아리 실험에서 예상과 다른 결과가 나와 변인을 다시 확인했습니다.",
    aiAnswer:
      "실험 결과가 예상과 달랐을 때 무엇을 기준으로 다음 행동을 결정했나요?",
    expertNote: "판단 기준과 팀 안에서의 역할을 순서대로 확인합니다.",
    status: "pending",
    updatedAt: "2026-08-03T09:32:00.000Z",
  },
  {
    id: "review-essay-park",
    student: "박서윤",
    school: "하나고",
    stage: "자소서",
    studentInput:
      "친구들과 토론 활동을 하며 서로 다른 의견을 조율하는 법을 배웠습니다.",
    aiAnswer:
      "‘조율했다’는 결과보다 의견이 갈렸던 장면과 본인이 취한 행동을 먼저 적어보세요.",
    expertNote: "학생의 실제 발언을 훼손하지 않고 행동 단위만 구체화합니다.",
    status: "draft",
    updatedAt: "2026-08-03T08:40:00.000Z",
  },
  {
    id: "review-interview-lee",
    student: "이도현",
    school: "상산고",
    stage: "모의면접",
    studentInput:
      "수학 문제를 여러 방식으로 풀어보며 가장 효율적인 풀이를 선택했습니다.",
    aiAnswer:
      "효율적이라고 판단한 기준은 무엇이며, 다른 풀이와 비교해 설명할 수 있나요?",
    expertNote: "정답 검증보다 풀이 선택의 판단 과정을 확인합니다.",
    status: "approved",
    updatedAt: "2026-08-02T07:10:00.000Z",
  },
];

export function loadCoachingResponses() {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(responseReviewStorageKey);
    return value ? (JSON.parse(value) as CoachingResponse[]) : null;
  } catch {
    return null;
  }
}

export function saveCoachingResponses(records: CoachingResponse[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    responseReviewStorageKey,
    JSON.stringify(records),
  );
}
