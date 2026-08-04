export type VideoGuideStage = "analysis" | "practice" | "mock-interview";
export type VideoGuideStatus = "draft" | "review" | "published";

export type VideoGuide = {
  id: string;
  title: string;
  stage: VideoGuideStage;
  school: string;
  duration: string;
  status: VideoGuideStatus;
  takeaway: string;
  promptAnchor: string;
  sourceUrl: string;
  updatedAt: string;
};

export const videoGuideStorageKey = "aihow:video-guides:v1";

export const defaultVideoGuides: VideoGuide[] = [
  {
    id: "guide-school-connection",
    title: "지원 동기를 학교와 연결하는 법",
    stage: "analysis",
    school: "공통",
    duration: "04:18",
    status: "published",
    takeaway:
      "학교 소개를 반복하지 말고, 내 경험 이후 무엇을 더 탐구하고 싶은지 한 장면으로 연결해 보세요.",
    promptAnchor:
      "학생의 자소서 근거에서 행동 변화와 학교 선택의 연결을 한 번에 하나씩 묻습니다.",
    sourceUrl: "",
    updatedAt: "2026-08-04T02:20:00.000Z",
  },
  {
    id: "guide-follow-up-listening",
    title: "꼬리질문을 끝까지 듣는 연습",
    stage: "practice",
    school: "공통",
    duration: "03:42",
    status: "published",
    takeaway:
      "질문을 다 듣고, 결론보다 내가 선택한 행동부터 말하면 답변이 흔들리지 않습니다.",
    promptAnchor:
      "답변 뒤에는 이유를 확인하는 꼬리질문을 하나만 제시하고, 학생의 말에서 다음 질문을 만듭니다.",
    sourceUrl: "",
    updatedAt: "2026-08-03T08:20:00.000Z",
  },
  {
    id: "guide-experiment-setback",
    title: "탐구 실패를 구체적으로 설명하기",
    stage: "analysis",
    school: "민사고",
    duration: "05:06",
    status: "review",
    takeaway:
      "실패를 결과로 끝내지 않고, 가설을 어떻게 다시 세웠는지 보여줍니다.",
    promptAnchor:
      "실패 경험에서는 처음 가설, 관찰한 차이, 다음 선택을 차례로 확인합니다.",
    sourceUrl: "",
    updatedAt: "2026-08-04T01:05:00.000Z",
  },
];

export function loadVideoGuides(): VideoGuide[] {
  if (typeof window === "undefined") return defaultVideoGuides;
  try {
    const stored = window.localStorage.getItem(videoGuideStorageKey);
    if (!stored) return defaultVideoGuides;
    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed)
      ? (parsed as VideoGuide[])
      : defaultVideoGuides;
  } catch {
    return defaultVideoGuides;
  }
}

export function saveVideoGuides(guides: VideoGuide[]) {
  window.localStorage.setItem(videoGuideStorageKey, JSON.stringify(guides));
}
