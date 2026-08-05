import { z } from "zod";
import type { JourneyStep } from "@/stores/app-store";

const readinessSignalSchema = z.object({
  label: z.string().trim().min(1),
  value: z.number().min(0).max(100),
  state: z.string().trim().min(1),
});

const weeklyActivitySchema = z.object({
  day: z.string().trim().min(1),
  value: z.number().min(0).max(100),
});

const admissionsInsightSchema = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1),
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  signal: z.string().trim().min(1),
  access: z.enum(["open", "preview", "locked"]),
});

const admissionsOutlookSchema = z.object({
  category: z.string().trim().min(1),
  period: z.string().trim().min(1),
  headline: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  revealedCount: z.number().int().nonnegative(),
  totalCount: z.number().int().positive(),
  insights: z.array(admissionsInsightSchema).min(1).max(3),
});

export const dashboardSnapshotSchema = z.object({
  school: z.string().trim().min(1),
  schoolShort: z.string().trim().min(1),
  daysLeft: z.number().int().nonnegative(),
  savedAt: z.string().trim().min(1),
  practiceMinutes: z.number().int().nonnegative(),
  weeklyDelta: z.number().int(),
  readinessSignals: z.array(readinessSignalSchema),
  weeklyActivity: z.array(weeklyActivitySchema),
  admissionsOutlook: admissionsOutlookSchema.nullable(),
});

export type DashboardSnapshot = z.infer<typeof dashboardSnapshotSchema>;

export const dashboardSnapshot = dashboardSnapshotSchema.parse({
  school: "민족사관고등학교",
  schoolShort: "민사고",
  daysLeft: 42,
  savedAt: "오늘 오전 10:24",
  practiceMinutes: 48,
  weeklyDelta: 16,
  readinessSignals: [
    { label: "경험 근거", value: 84, state: "안정" },
    { label: "답변 구조", value: 61, state: "보완" },
    { label: "말하기 반복", value: 48, state: "시작" },
  ],
  weeklyActivity: [
    { day: "월", value: 28 },
    { day: "화", value: 44 },
    { day: "수", value: 20 },
    { day: "목", value: 62 },
    { day: "금", value: 38 },
    { day: "토", value: 78 },
    { day: "오늘", value: 52 },
  ],
  admissionsOutlook: {
    category: "전국단위 자사고",
    period: "2026학년도 지원 데이터 기준",
    headline: "지원자가 줄었다고, 준비가 쉬워진 건 아니에요.",
    summary:
      "중3 학생 수는 늘었지만 특목·자사고 모집 자리는 줄었습니다. 지원자 수 하나보다 학교 유형과 모집 인원을 함께 봐야 해요.",
    revealedCount: 1,
    totalCount: 3,
    insights: [
      {
        id: "capacity-window",
        label: "이번 공개 인사이트",
        title: "준비할 수 있는 자리는 더 촘촘해졌어요",
        summary:
          "학생 수는 늘고 모집 인원은 줄었습니다. 지원 학교를 정했다면 서류 근거와 말하기 준비를 한 단계 먼저 시작할 시점이에요.",
        signal: "학생 수 ↑ · 모집 인원 ↓",
        access: "open",
      },
      {
        id: "category-shift",
        label: "유형별 변화",
        title: "모든 학교가 같은 방향은 아니에요",
        summary:
          "외고·국제고는 관심이 늘었지만 자사고·과학고는 학교별 차이가 더 커졌어요.",
        signal: "유형별 흐름이 엇갈림",
        access: "preview",
      },
      {
        id: "school-reading",
        label: "선택 학교 상세 해석",
        title: "비슷한 경쟁률 안에도 다른 준비 신호가 있어요",
        summary:
          "전형별 모집 인원과 지원 흐름을 함께 읽어야 실제 준비 우선순위를 알 수 있어요.",
        signal: "구독에서 전체 공개",
        access: "locked",
      },
    ],
  },
});

export const nextStepCopy: Record<
  JourneyStep,
  { title: string; detail: string; time: string; reason: string }
> = {
  essay: {
    title: "자소서를 올리고, 문장이 정확히 읽혔는지 확인해 주세요.",
    detail:
      "원문을 먼저 확인해야 이후 분석과 질문이 내 경험에서 벗어나지 않아요.",
    time: "약 8분",
    reason: "원문 확인 전에는 질문 근거를 정확히 연결할 수 없습니다.",
  },
  analysis: {
    title: "자소서에서 면접 답변의 근거가 될 경험을 찾아볼 차례예요.",
    detail:
      "강점과 보완점을 확인하고, 내가 꼭 설명하고 싶은 경험을 골라 주세요.",
    time: "약 10분",
    reason: "선택한 경험이 이후 예상 질문과 꼬리질문의 기준이 됩니다.",
  },
  practice: {
    title: "자소서의 근거를 내 말로 바꾸는 연습이 필요해요.",
    detail:
      "예상 질문 한 개부터 답해 보세요. 저장한 답변은 꼬리질문의 기준이 됩니다.",
    time: "약 12분",
    reason: "근거는 충분하지만 답변 구조와 말하기 반복 점수가 아직 낮습니다.",
  },
  "mock-interview": {
    title: "작성한 답변을 보지 않고 말하는 연습을 시작해 보세요.",
    detail: "짧은 모의면접으로 답변의 길이와 말의 속도를 확인할 수 있어요.",
    time: "약 15분",
    reason: "작성 답변은 준비됐고 실전 회상과 말하기 속도 확인이 남았습니다.",
  },
  "cheat-sheet": {
    title: "면접 직전에 다시 볼 답변만 한 장으로 정리해 주세요.",
    detail: "질문별 핵심 근거와 꼭 기억할 표현을 마지막으로 점검합니다.",
    time: "약 6분",
    reason: "완료한 연습에서 반복된 핵심 근거를 압축할 차례입니다.",
  },
};
