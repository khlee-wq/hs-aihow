"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  LockKeyhole,
  Sparkles,
  TimerReset,
} from "lucide-react";
import Link from "next/link";
import { JourneyOrbit } from "@/components/motion/journey-orbit";
import { Progress } from "@/components/ui/progress";
import { PageSkeleton } from "@/components/ui/skeleton";
import { deriveProgress, journeySteps } from "@/lib/mock-data";
import { cn, sleep } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import {
  dashboardSnapshot,
  nextStepCopy,
  readinessSignals,
  weeklyActivity,
} from "./dashboard-model";

const metricLabels = ["전체 준비", "완료 단계", "이번 주", "면접까지"];

export function StudentDashboard({ name }: { name: string }) {
  const completed = useAppStore((state) => state.completedSteps);
  const { data, isPending } = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: async () => {
      await sleep(520);
      return dashboardSnapshot;
    },
  });

  if (isPending || !data) return <PageSkeleton type="dashboard" />;

  const progress = deriveProgress(completed);
  const nextStep =
    journeySteps.find((step) => !completed.includes(step.id)) ??
    journeySteps[journeySteps.length - 1];
  const nextCopy = nextStepCopy[nextStep.id];
  const metrics = [
    { value: `${progress}%`, note: "현재 기준" },
    {
      value: `${completed.length}/${journeySteps.length}`,
      note: `${journeySteps.length - completed.length}개 남음`,
    },
    { value: `${data.practiceMinutes}m`, note: `+${data.weeklyDelta}분` },
    { value: `D-${data.daysLeft}`, note: "속도 적정" },
  ];

  return (
    <div
      className="space-y-8 float-in md:space-y-10"
      data-testid="student-dashboard"
    >
      <header
        className="grid gap-7 border-b border-[var(--border)] pb-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
        data-motion-reveal
      >
        <div data-motion-item>
          <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.16em] text-[var(--brand)]">
            <span className="size-1.5 rounded-full bg-[var(--brand)]" />
            Prep control · 2027
          </p>
          <h1 className="mt-4 max-w-4xl break-keep text-balance text-[clamp(1.85rem,4vw,3rem)] font-bold leading-[1.08] tracking-[-.052em]">
            {name}님, 다음은 {nextStep.title}입니다.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            현재 데이터에서 가장 영향이 큰 한 가지부터 제안합니다. 마지막
            동기화는 {data.savedAt}입니다.
          </p>
        </div>
        <div
          className="grid grid-cols-2 border border-[var(--border)] bg-[var(--surface)] text-xs md:min-w-[17rem]"
          data-motion-item
        >
          <div className="border-r border-[var(--border)] px-4 py-3.5">
            <p className="font-mono text-[9px] uppercase tracking-[.12em] text-[var(--text-tertiary)]">
              Target
            </p>
            <p className="mt-1.5 flex items-center gap-2 font-bold">
              <CalendarDays className="size-3.5 text-[var(--warning)]" />
              D-{data.daysLeft}
            </p>
          </div>
          <div className="px-4 py-3.5">
            <p className="font-mono text-[9px] uppercase tracking-[.12em] text-[var(--text-tertiary)]">
              Workspace
            </p>
            <p className="mt-1.5 truncate font-bold">{data.schoolShort}</p>
          </div>
        </div>
      </header>

      <section
        className="grid grid-cols-2 overflow-hidden border border-[var(--border)] bg-[var(--surface)] lg:grid-cols-4"
        aria-label="현재 준비 지표"
        data-motion-reveal
      >
        {metrics.map((metric, index) => (
          <div
            key={metricLabels[index]}
            className="min-w-0 border-b border-r border-[var(--border)] p-4 last:border-r-0 even:border-r-0 lg:border-b-0 lg:even:border-r"
            data-motion-item
          >
            <p className="font-mono text-[9px] font-bold uppercase tracking-[.12em] text-[var(--text-tertiary)]">
              0{index + 1} · {metricLabels[index]}
            </p>
            <div className="mt-3 flex items-end justify-between gap-2">
              <strong className="text-2xl font-bold tracking-[-.045em]">
                {metric.value}
              </strong>
              <span className="pb-0.5 text-[10px] font-bold text-[var(--text-secondary)]">
                {metric.note}
              </span>
            </div>
          </div>
        ))}
      </section>

      <section
        className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,.65fr)]"
        aria-labelledby="next-action-title"
        data-motion-reveal
      >
        <article
          className="dashboard-grid-surface relative overflow-hidden border border-[var(--border-strong)] bg-[var(--surface)] p-5 sm:p-7 lg:p-8"
          data-motion-item
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-3">
              <div
                className="grid size-9 place-items-center border border-[var(--border)] bg-[var(--brand-soft)]"
                data-lottie-orbit
              >
                <JourneyOrbit className="size-9" />
              </div>
              <div>
                <p className="font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[var(--brand)]">
                  AI briefing
                </p>
                <p className="mt-1 text-xs font-bold text-[var(--text-secondary)]">
                  우선순위 01 · {completed.length + 1}단계
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-[10px] font-bold text-[var(--text-secondary)]">
              <Clock3 className="size-3" />
              {nextCopy.time}
            </span>
          </div>

          <div className="relative z-10 pt-6">
            <h2
              id="next-action-title"
              className="max-w-2xl break-keep text-balance text-[clamp(1.45rem,3vw,2.15rem)] font-bold leading-[1.25] tracking-[-.045em]"
            >
              {nextCopy.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              {nextCopy.detail}
            </p>

            <dl className="mt-6 grid border-y border-[var(--border)] text-xs sm:grid-cols-2">
              <div className="border-b border-[var(--border)] py-3.5 sm:border-b-0 sm:border-r sm:pr-5">
                <dt className="font-mono text-[9px] uppercase tracking-[.12em] text-[var(--text-tertiary)]">
                  판단 근거
                </dt>
                <dd className="mt-1.5 leading-5 text-[var(--text-secondary)]">
                  {nextCopy.reason}
                </dd>
              </div>
              <div className="py-3.5 sm:pl-5">
                <dt className="font-mono text-[9px] uppercase tracking-[.12em] text-[var(--text-tertiary)]">
                  저장 방식
                </dt>
                <dd className="mt-1.5 leading-5 text-[var(--text-secondary)]">
                  단계별 자동 저장 · 언제든 이어서 진행
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href={nextStep.href}
                className="inline-flex min-h-11 items-center gap-2 bg-[var(--text-primary)] px-5 text-sm font-bold text-[var(--canvas)] transition-[transform,background] hover:-translate-y-0.5 hover:bg-[var(--brand)]"
              >
                {nextStep.title} 시작하기
                <ArrowUpRight className="size-4" />
              </Link>
              <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-tertiary)]">
                <TimerReset className="size-3.5" />
                예상 완료 {nextCopy.time}
              </span>
            </div>
          </div>
        </article>

        <aside
          className="border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_76%,var(--canvas))] p-5 sm:p-6"
          data-motion-item
          aria-labelledby="readiness-title"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[var(--text-tertiary)]">
                Readiness map
              </p>
              <h2 id="readiness-title" className="mt-2 text-lg font-bold">
                이번 주 준비 신호
              </h2>
            </div>
            <span className="grid size-8 place-items-center bg-[var(--warning-soft)] text-[var(--warning)]">
              <CircleAlert className="size-4" />
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {readinessSignals.map((signal) => (
              <div key={signal.label}>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-bold">{signal.label}</span>
                  <span className="font-mono text-[10px] text-[var(--text-secondary)]">
                    {signal.value} · {signal.state}
                  </span>
                </div>
                <div className="h-1.5 bg-[var(--surface-muted)]">
                  <div
                    className={cn(
                      "h-full",
                      signal.value >= 80
                        ? "bg-[var(--success)]"
                        : signal.value >= 60
                          ? "bg-[var(--warning)]"
                          : "bg-[var(--brand)]",
                    )}
                    style={{ width: `${signal.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-[var(--border)] pt-4">
            <p className="flex items-center gap-2 text-xs font-bold">
              <Sparkles className="size-3.5 text-[var(--brand)]" />
              AI 해석
            </p>
            <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
              근거 선택은 안정적입니다. 오늘은 답변 구조를 한 번 만들고 소리
              내어 말하는 것까지 완료하세요.
            </p>
          </div>
        </aside>
      </section>

      <section aria-labelledby="journey-title" data-motion-reveal>
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div data-motion-item>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[var(--text-tertiary)]">
              Learning sequence
            </p>
            <h2
              id="journey-title"
              className="mt-2 text-xl font-bold tracking-[-.035em]"
            >
              준비 과정
            </h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)]" data-motion-item>
            {data.school} 통합 패키지 · {completed.length}개 완료
          </p>
        </div>

        <ol
          className="grid overflow-hidden border border-[var(--border)] bg-[var(--surface)] md:grid-cols-5"
          data-motion-item
        >
          {journeySteps.map((step, index) => {
            const done = completed.includes(step.id);
            const current = nextStep.id === step.id;
            return (
              <li
                key={step.id}
                className="relative border-b border-[var(--border)] last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
              >
                <Link
                  href={step.href}
                  className={cn(
                    "group grid min-h-[5rem] grid-cols-[2.25rem_1fr_auto] items-center gap-3 p-4 transition-colors md:min-h-[8.5rem] md:grid-cols-1 md:content-between",
                    current
                      ? "bg-[color-mix(in_srgb,var(--brand-soft)_72%,var(--surface))]"
                      : "hover:bg-[var(--surface-muted)]",
                  )}
                  aria-current={current ? "step" : undefined}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "grid size-7 place-items-center border text-[10px] font-bold",
                        done
                          ? "border-[var(--success)] bg-[var(--mint-soft)] text-[var(--success)]"
                          : current
                            ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                            : "border-[var(--border-strong)] text-[var(--text-tertiary)]",
                      )}
                    >
                      {done ? <Check className="size-3.5" /> : `0${index + 1}`}
                    </span>
                    <ChevronRight className="hidden size-3.5 text-[var(--text-tertiary)] transition-transform group-hover:translate-x-0.5 md:block" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{step.title}</h3>
                    <p className="mt-1 text-[10px] text-[var(--text-secondary)]">
                      {step.short}
                    </p>
                    <p
                      className={cn(
                        "mt-2 font-mono text-[9px] font-bold uppercase tracking-[.08em]",
                        done
                          ? "text-[var(--success)]"
                          : current
                            ? "text-[var(--brand)]"
                            : "text-[var(--text-tertiary)]",
                      )}
                    >
                      {done ? "Complete" : current ? "In progress" : "Queued"}
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-[var(--text-tertiary)] md:hidden" />
                </Link>
              </li>
            );
          })}
        </ol>
        <div className="mt-3">
          <Progress value={progress} label="전체 준비 진행률" />
        </div>
      </section>

      <section
        className="grid border-y border-[var(--border)] md:grid-cols-[1.1fr_.9fr]"
        data-motion-reveal
      >
        <div
          className="py-6 md:border-r md:border-[var(--border)] md:pr-8"
          data-motion-item
        >
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[var(--text-tertiary)]">
                Weekly activity
              </p>
              <h2 className="mt-2 text-lg font-bold">집중 기록</h2>
            </div>
            <p className="text-right">
              <strong className="text-xl tracking-[-.04em]">
                {data.practiceMinutes}분
              </strong>
              <span className="ml-2 text-[10px] font-bold text-[var(--success)]">
                +{data.weeklyDelta}분
              </span>
            </p>
          </div>
          <div
            className="mt-5 grid h-20 grid-cols-7 items-end gap-2"
            aria-label="최근 7일 연습 기록"
          >
            {weeklyActivity.map((item, index) => (
              <div
                key={item.day}
                className="grid h-full grid-rows-[1fr_auto] gap-2"
              >
                <div className="flex items-end bg-[var(--surface-muted)]">
                  <span
                    className={cn(
                      "w-full bg-[var(--brand-soft)]",
                      index === weeklyActivity.length - 1 &&
                        "bg-[var(--brand)]",
                    )}
                    style={{ height: `${item.value}%` }}
                    aria-hidden
                  />
                </div>
                <span className="text-center font-mono text-[9px] text-[var(--text-tertiary)]">
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/settings#data"
          className="group block border-t border-[var(--border)] py-6 md:border-t-0 md:pl-8"
          data-motion-item
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[var(--text-tertiary)]">
                Data status
              </p>
              <h2 className="mt-2 text-lg font-bold">자료 보관 상태</h2>
            </div>
            <span className="grid size-9 place-items-center bg-[var(--mint-soft)] text-[var(--success)]">
              <LockKeyhole className="size-4" />
            </span>
          </div>
          <div className="mt-5 grid gap-2 text-xs text-[var(--text-secondary)]">
            <p className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
              <span className="flex items-center gap-2">
                <FileText className="size-3.5" /> 원문·음성 데모 저장
              </span>
              <strong className="text-[var(--success)]">없음</strong>
            </p>
            <p className="flex items-center justify-between pt-1">
              <span>보관 정책 확인</span>
              <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </p>
          </div>
        </Link>
      </section>
    </div>
  );
}
