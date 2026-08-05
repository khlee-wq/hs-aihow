export type VideoGuideStage = "analysis" | "practice" | "mock-interview";
export type VideoGuideStatus = "draft" | "review" | "published";

export type VideoGuide = {
  id: string;
  title: string;
  stage: VideoGuideStage;
  topic: string;
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
    topic: "지원 동기",
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
    topic: "답변 구조",
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
    topic: "탐구 경험",
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
  {
    id: "guide-before-mock-interview",
    title: "첫 답변 뒤 한 단계 더 말하는 법",
    stage: "mock-interview",
    topic: "꼬리질문",
    school: "공통",
    duration: "02:54",
    status: "published",
    takeaway:
      "꼬리질문은 틀린 답을 찾는 과정이 아니라, 방금 말한 선택의 이유를 한 장면 더 보여주는 과정입니다.",
    promptAnchor:
      "첫 답변에서 언급한 행동 하나를 골라 변화 전후를 한 문장씩 설명해 보세요.",
    sourceUrl: "",
    updatedAt: "2026-08-04T07:10:00.000Z",
  },
];

export function loadVideoGuides(): VideoGuide[] {
  if (typeof window === "undefined") return defaultVideoGuides;
  try {
    const stored = window.localStorage.getItem(videoGuideStorageKey);
    if (!stored) return defaultVideoGuides;
    const parsed = JSON.parse(stored) as unknown;
    return Array.isArray(parsed)
      ? (parsed as Partial<VideoGuide>[]).map((guide) => ({
          id: guide.id ?? `guide-${crypto.randomUUID()}`,
          title: guide.title ?? "제목 없는 영상",
          stage: guide.stage ?? "analysis",
          topic: guide.topic ?? "핵심 준비",
          school: guide.school ?? "공통",
          duration: guide.duration ?? "",
          status: guide.status ?? "draft",
          takeaway: guide.takeaway ?? "",
          promptAnchor: guide.promptAnchor ?? "",
          sourceUrl: guide.sourceUrl ?? "",
          updatedAt: guide.updatedAt ?? new Date().toISOString(),
        }))
      : defaultVideoGuides;
  } catch {
    return defaultVideoGuides;
  }
}

export function toVideoEmbedUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    if (url.hostname === "youtu.be")
      return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
    if (url.hostname.includes("youtube.com")) {
      const videoId = url.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url.href;
    }
    if (url.hostname === "vimeo.com")
      return `https://player.vimeo.com/video${url.pathname}`;
    if (url.hostname === "player.vimeo.com") return url.href;
  } catch {
    return "";
  }
  return "";
}

export function saveVideoGuides(guides: VideoGuide[]) {
  window.localStorage.setItem(videoGuideStorageKey, JSON.stringify(guides));
}
