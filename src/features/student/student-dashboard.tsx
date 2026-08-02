"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  LockKeyhole,
} from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { PageSkeleton } from "@/components/ui/skeleton";
import { deriveProgress, journeySteps } from "@/lib/mock-data";
import { cn, sleep } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";

const nextStepCopy = {
  essay: {
    title: "자소서를 올리고, 문장이 정확히 읽혔는지 확인해 주세요.",
    detail:
      "원문을 먼저 확인해야 이후 분석과 질문이 내 경험에서 벗어나지 않아요.",
    time: "약 8분",
  },
  analysis: {
    title: "자소서에서 면접 답변의 근거가 될 경험을 찾아볼 차례예요.",
    detail:
      "강점과 보완점을 확인하고, 내가 꼭 설명하고 싶은 경험을 골라 주세요.",
    time: "약 10분",
  },
  practice: {
    title: "자소서에서 찾은 근거를, 이제 내 말로 정리해볼 차례예요.",
    detail:
      "예상 질문 한 개부터 답해 보세요. 저장한 답변은 꼬리질문의 기준이 됩니다.",
    time: "약 12분",
  },
  "mock-interview": {
    title: "작성한 답변을 보지 않고 말하는 연습을 시작해 보세요.",
    detail: "짧은 모의면접으로 답변의 길이와 말의 속도를 확인할 수 있어요.",
    time: "약 15분",
  },
  "cheat-sheet": {
    title: "면접 직전에 다시 볼 답변만 한 장으로 정리해 주세요.",
    detail: "질문별 핵심 근거와 꼭 기억할 표현을 마지막으로 점검합니다.",
    time: "약 6분",
  },
};

export function StudentDashboard({ name }: { name: string }) {
  const completed = useAppStore((state) => state.completedSteps);
  const { data, isPending } = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: async () => {
      await sleep(520);
      return {
        school: "민족사관고등학교",
        daysLeft: 42,
        savedAt: "오늘 오전 10:24",
      };
    },
  });

  if (isPending || !data) return <PageSkeleton type="dashboard" />;

  const progress = deriveProgress(completed);
  const nextStep =
    journeySteps.find((step) => !completed.includes(step.id)) ??
    journeySteps[journeySteps.length - 1];
  const nextCopy = nextStepCopy[nextStep.id];

  return (
    <div
      className="space-y-12 float-in md:space-y-16"
      data-testid="student-dashboard"
    >
      <header className="grid gap-7 border-b border-[var(--border)] pb-9 md:grid-cols-[minmax(0,1fr)_12rem] md:items-end md:pb-11">
        <div>
          <p className="text-xs font-extrabold tracking-[.04em] text-[var(--brand)]">
            오늘의 준비
          </p>
          <h1 className="mt-4 max-w-3xl text-balance text-[clamp(1.75rem,4vw,3.15rem)] font-bold leading-[1.1] tracking-[-.05em]">
            <span>{name}님,</span>{" "}
            <span className="block sm:inline">
              다음은 {nextStep.title}입니다.
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] md:text-base">
            한 번에 하나씩 진행하면 됩니다. 마지막 내용은 {data.savedAt}에
            저장됐어요.
          </p>
        </div>
        <div className="flex items-end justify-between gap-4 border-l-2 border-[var(--warning)] pl-4 md:block">
          <p className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
            <CalendarDays className="size-4" />
            면접까지
          </p>
          <p className="mt-2 text-3xl font-bold tracking-[-.05em] md:text-4xl">
            D-{data.daysLeft}
          </p>
          <p className="mt-2 text-xs text-[var(--text-tertiary)]">
            준비 속도는 적당해요
          </p>
        </div>
      </header>

      <section
        className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(17rem,.65fr)]"
        aria-labelledby="next-action-title"
      >
        <article className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-strong)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] sm:p-9 lg:p-11">
          <div className="absolute right-0 top-0 h-full w-1 bg-[var(--brand)]" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-extrabold text-[var(--brand)]">
              {completed.length + 1}단계 · {nextStep.title}
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-tertiary)]">
              <Clock3 className="size-3.5" />
              {nextCopy.time}
            </span>
          </div>
          <h2
            id="next-action-title"
            className="mt-7 max-w-2xl text-balance text-2xl font-bold leading-[1.3] tracking-[-.04em] sm:text-[2rem]"
          >
            {nextCopy.title}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
            {nextCopy.detail}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={nextStep.href}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--brand)] px-6 text-sm font-extrabold text-white transition-transform hover:-translate-y-0.5"
            >
              {nextStep.title} 시작하기
              <ArrowRight className="size-4" />
            </Link>
            <span className="text-xs leading-5 text-[var(--text-tertiary)]">
              중간에 나가도 이 기기에 자동 저장됩니다.
            </span>
          </div>
        </article>

        <div className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_72%,var(--canvas))] p-6 sm:p-7">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs font-bold text-[var(--text-tertiary)]">
                전체 준비
              </p>
              <p className="mt-2 text-lg font-bold">차근차근 진행 중</p>
            </div>
            <strong className="text-3xl tracking-[-.05em]">{progress}%</strong>
          </div>
          <div className="mt-6">
            <Progress value={progress} label="전체 준비 진행률" />
          </div>
          <dl className="mt-8 divide-y divide-[var(--border)] border-y border-[var(--border)] text-sm">
            <div className="flex items-center justify-between py-3.5">
              <dt className="text-[var(--text-secondary)]">완료한 단계</dt>
              <dd className="font-bold">
                {completed.length} / {journeySteps.length}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <dt className="text-[var(--text-secondary)]">현재 단계</dt>
              <dd className="font-bold text-[var(--brand)]">
                {nextStep.title}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <dt className="text-[var(--text-secondary)]">지원 학교</dt>
              <dd className="font-bold">민사고</dd>
            </div>
          </dl>
        </div>
      </section>

      <section aria-labelledby="journey-title">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2
              id="journey-title"
              className="text-xl font-bold tracking-[-.035em]"
            >
              준비 과정
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {data.school} 통합 패키지 · 앞 단계의 결과가 다음 단계로
              이어집니다.
            </p>
          </div>
          <p className="text-xs font-bold text-[var(--text-tertiary)]">
            {completed.length}개 완료 · {journeySteps.length - completed.length}
            개 남음
          </p>
        </div>

        <ol className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
          {journeySteps.map((step, index) => {
            const done = completed.includes(step.id);
            const current = nextStep.id === step.id;
            return (
              <li
                key={step.id}
                className="border-b border-[var(--border)] last:border-b-0"
              >
                <Link
                  href={step.href}
                  className={cn(
                    "group grid min-h-[5.5rem] grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-3 px-4 transition-colors sm:grid-cols-[3.25rem_minmax(0,1fr)_7rem_auto] sm:px-6",
                    current
                      ? "bg-[color-mix(in_srgb,var(--brand-soft)_62%,var(--surface))]"
                      : "hover:bg-[var(--surface-muted)]",
                  )}
                  aria-current={current ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "grid size-8 place-items-center rounded-full border text-xs font-bold",
                      done
                        ? "border-[var(--success)] bg-[var(--mint-soft)] text-[var(--success)]"
                        : current
                          ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                          : "border-[var(--border-strong)] text-[var(--text-tertiary)]",
                    )}
                  >
                    {done ? <Check className="size-4" /> : index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold sm:text-[.95rem]">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {step.short}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "hidden text-xs font-bold sm:block",
                      done
                        ? "text-[var(--success)]"
                        : current
                          ? "text-[var(--brand)]"
                          : "text-[var(--text-tertiary)]",
                    )}
                  >
                    {done ? "완료" : current ? "지금 할 일" : "예정"}
                  </span>
                  <ChevronRight className="size-4 text-[var(--text-tertiary)] transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="grid gap-8 border-t border-[var(--border)] pt-8 md:grid-cols-2 md:gap-14">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[var(--text-tertiary)]">
                이번 주 연습
              </p>
              <p className="mt-2 text-2xl font-bold tracking-[-.04em]">48분</p>
            </div>
            <Clock3 className="size-5 text-[var(--brand)]" />
          </div>
          <div
            className="mt-6 flex h-12 items-end gap-2"
            aria-label="최근 7일 연습 기록"
          >
            {[28, 44, 20, 62, 38, 78, 52].map((height, index) => (
              <span
                key={index}
                className="flex-1 rounded-t-sm bg-[var(--brand-soft)] last:bg-[var(--brand)]"
                style={{ height: `${height}%` }}
                aria-hidden
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-[var(--text-secondary)]">
            지난주보다 16분 더 집중했어요.
          </p>
        </div>

        <Link href="/settings#data" className="group block">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-[var(--text-tertiary)]">
                자료 보관 상태
              </p>
              <p className="mt-2 text-2xl font-bold tracking-[-.04em]">안전</p>
            </div>
            <span className="grid size-10 place-items-center rounded-full bg-[var(--mint-soft)] text-[var(--success)]">
              <LockKeyhole className="size-5" />
            </span>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4 text-sm">
            <span className="flex items-center gap-2 text-[var(--text-secondary)]">
              <FileText className="size-4" />
              원문·음성 데모 저장 없음
            </span>
            <ChevronRight className="size-4 text-[var(--text-tertiary)] transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </section>
    </div>
  );
}
