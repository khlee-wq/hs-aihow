import type { JourneyStep } from "@/stores/app-store";

export const journeySteps: { id: JourneyStep; title: string; short: string; href: string }[] = [
  { id: "essay", title: "자소서 확인", short: "원문·추출 확인", href: "/applications/demo/essay" },
  { id: "analysis", title: "핵심 분석", short: "소재·논리 코칭", href: "/applications/demo/analysis" },
  { id: "practice", title: "질문 연습", short: "예상·꼬리질문", href: "/applications/demo/practice" },
  { id: "mock-interview", title: "모의면접", short: "말하기 실전", href: "/applications/demo/mock-interview" },
  { id: "cheat-sheet", title: "파이널 노트", short: "면접 직전 한 장", href: "/applications/demo/cheat-sheet" },
];

export const analysisPoints = [
  { title: "과정을 기록하는 탐구 태도", score: 92, type: "강점", evidence: "결과가 다르게 나온 이유를 팀원들과 변인별로 다시 기록했다." },
  { title: "학교 선택과 경험의 연결", score: 74, type: "보완", evidence: "다양한 탐구 활동을 이어가고 싶어 지원했다." },
  { title: "협업에서의 나의 행동", score: 68, type: "보완", evidence: "친구들의 의견을 들으며 프로젝트를 완성했다." },
];

export function deriveProgress(completed: JourneyStep[]) {
  return Math.round((new Set(completed).size / journeySteps.length) * 100);
}
