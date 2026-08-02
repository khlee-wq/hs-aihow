import type { JourneyStep } from "@/stores/app-store";

export const journeySteps: { id: JourneyStep; title: string; short: string; href: string }[] = [
  { id: "essay", title: "자소서 확인", short: "원문·추출 확인", href: "/applications/demo/essay" },
  { id: "analysis", title: "핵심 분석", short: "소재·논리 코칭", href: "/applications/demo/analysis" },
  { id: "practice", title: "질문 연습", short: "예상·꼬리질문", href: "/applications/demo/practice" },
  { id: "mock-interview", title: "모의면접", short: "말하기 실전", href: "/applications/demo/mock-interview" },
  { id: "cheat-sheet", title: "파이널 노트", short: "면접 직전 한 장", href: "/applications/demo/cheat-sheet" },
];

export const questions = [
  { id: "q1", category: "지원 동기", priority: "필수", question: "민사고의 교육 철학과 본인의 탐구 경험이 어떻게 연결되는지 설명해 보세요.", source: "자소서 1번 · 과학 동아리 실험 설계", tip: "학교 소개를 반복하기보다, 내 행동이 어떻게 달라졌는지 연결해 보세요." },
  { id: "q2", category: "협업 경험", priority: "높음", question: "팀원과 의견이 달랐던 순간에 어떤 기준으로 결정을 내렸나요?", source: "자소서 2번 · 교내 환경 프로젝트", tip: "갈등 자체보다 내가 들은 의견, 바꾼 행동, 결과를 순서대로 말해 보세요." },
  { id: "q3", category: "탐구 태도", priority: "높음", question: "실험이 예상과 다르게 나온 뒤 가설을 어떻게 수정했나요?", source: "자소서 1번 · 결과 오차 기록", tip: "처음 가설과 수정한 가설의 차이가 드러나면 좋아요." },
];

export const analysisPoints = [
  { title: "과정을 기록하는 탐구 태도", score: 92, type: "강점", evidence: "결과가 다르게 나온 이유를 팀원들과 변인별로 다시 기록했다." },
  { title: "학교 선택과 경험의 연결", score: 74, type: "보완", evidence: "다양한 탐구 활동을 이어가고 싶어 지원했다." },
  { title: "협업에서의 나의 행동", score: 68, type: "보완", evidence: "친구들의 의견을 들으며 프로젝트를 완성했다." },
];

export function deriveProgress(completed: JourneyStep[]) {
  return Math.round((new Set(completed).size / journeySteps.length) * 100);
}
