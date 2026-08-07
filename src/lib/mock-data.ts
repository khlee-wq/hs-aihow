import type { JourneyStep } from "@/stores/app-store";

export const journeySteps: { id: JourneyStep; title: string; short: string; href: string }[] = [
  { id: "essay", title: "자소서 확인", short: "원문·추출 확인", href: "/applications/essay" },
  { id: "practice", title: "질문 연습", short: "예상·꼬리질문", href: "/applications/practice" },
  { id: "mock-interview", title: "모의면접", short: "말하기 실전", href: "/applications/mock-interview" },
  { id: "cheat-sheet", title: "파이널 노트", short: "면접 직전 한 장", href: "/applications/cheat-sheet" },
];

export function deriveProgress(completed: JourneyStep[]) {
  return Math.round((new Set(completed).size / journeySteps.length) * 100);
}
