"use client";

import {
  ArrowUpRight,
  BellRing,
  CalendarDays,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  FileClock,
  Gift,
  Infinity,
  LockKeyhole,
  Sparkles,
  TimerReset,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { JourneyOrbit } from "@/components/motion/journey-orbit";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/status-state";
import { deriveProgress, journeySteps } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { type DashboardSnapshot, nextStepCopy } from "./dashboard-model";
import {
  DashboardInlineSkeleton,
  DashboardMetricSkeleton,
  ReadinessDataSkeleton,
  WeeklyActivityDataSkeleton,
} from "./dashboard-data-skeleton";

const metricLabels = ["전체 준비", "완료 단계", "이번 주", "면접까지"];

const admissionsSignals = [
  {
    label: "모집요강 원문",
    source: "공식 출처",
    state: "공개 대기",
    detail: "공개되면 원문과 발행일을 먼저 확인합니다.",
    active: true,
  },
  {
    label: "지원 기준 정리",
    source: "소장님 검수",
    state: "대기",
    detail: "지원 조건과 변경점을 학생의 준비 언어로 정리합니다.",
    active: false,
  },
  {
    label: "예상 질문 · 영상 가이드",
    source: "AIHOW 준비 경로",
    state: "대기",
    detail: "검수된 기준만 질문과 영상 가이드에 연결합니다.",
    active: false,
  },
] as const;

export function StudentDashboard({
  name,
  snapshot: data,
}: {
  name?: string;
  snapshot?: DashboardSnapshot | null;
}) {
  const [membershipOpen, setMembershipOpen] = useState(false);
  const [admissionsAlertOpen, setAdmissionsAlertOpen] = useState(false);
  const isLoading = data === undefined;
  const completed = useAppStore((state) => state.completedSteps);
  const progress = deriveProgress(completed);
  const nextStep =
    journeySteps.find((step) => !completed.includes(step.id)) ??
    journeySteps[journeySteps.length - 1];
  const nextCopy = nextStepCopy[nextStep.id];
  const metrics = [
    { value: `${progress}%`, note: "현재 기준", loading: false },
    {
      value: `${completed.length}/${journeySteps.length}`,
      note: `${journeySteps.length - completed.length}개 남음`,
      loading: false,
    },
    {
      value: data ? `${data.practiceMinutes}m` : "—",
      note: data ? `+${data.weeklyDelta}분` : "데이터 없음",
      loading: isLoading,
    },
    {
      value: data ? `D-${data.daysLeft}` : "—",
      note: data ? "속도 적정" : "일정 미등록",
      loading: isLoading,
    },
  ];

  return (
    <div
      className="space-y-8 float-in md:space-y-10"
      data-testid="student-dashboard"
      aria-busy={isLoading}
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
            {name ? name : <DashboardInlineSkeleton className="w-[5.5em]" />}
            님, 다음은 {nextStep.title}입니다.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            {isLoading ? (
              <>
                현재 데이터에서 가장 영향이 큰 한 가지부터 제안합니다. 마지막
                동기화는 <DashboardInlineSkeleton />
                입니다.
              </>
            ) : data ? (
              <>
                현재 데이터에서 가장 영향이 큰 한 가지부터 제안합니다. 마지막
                동기화는 {data.savedAt}입니다.
              </>
            ) : (
              "아직 연결된 준비 데이터가 없습니다. 첫 단계를 시작하면 이 화면에 학습 신호가 쌓입니다."
            )}
          </p>
        </div>
        <div
          className="surface overflow-hidden grid grid-cols-2 bg-[var(--surface)] text-xs md:min-w-[17rem]"
          data-motion-item
        >
          <div className="border-r border-[var(--border)] px-4 py-3.5">
            <p className="font-mono text-[9px] uppercase tracking-[.12em] text-[var(--text-tertiary)]">
              Target
            </p>
            <p className="mt-1.5 flex items-center gap-2 font-bold">
              <CalendarDays className="size-3.5 text-[var(--warning)]" />
              {isLoading ? (
                <DashboardInlineSkeleton />
              ) : data ? (
                `D-${data.daysLeft}`
              ) : (
                "미등록"
              )}
            </p>
          </div>
          <div className="px-4 py-3.5">
            <p className="font-mono text-[9px] uppercase tracking-[.12em] text-[var(--text-tertiary)]">
              Workspace
            </p>
            <p className="mt-1.5 truncate font-bold">
              {isLoading ? (
                <DashboardInlineSkeleton />
              ) : data ? (
                data.schoolShort
              ) : (
                "미등록"
              )}
            </p>
          </div>
        </div>
      </header>

      <section
        className="surface grid grid-cols-2 overflow-hidden bg-[var(--surface)] lg:grid-cols-4"
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
            {metric.loading ? (
              <DashboardMetricSkeleton />
            ) : (
              <div className="mt-3 flex items-end justify-between gap-2">
                <strong className="text-2xl font-bold tracking-[-.045em]">
                  {metric.value}
                </strong>
                <span className="pb-0.5 text-[10px] font-bold text-[var(--text-secondary)]">
                  {metric.note}
                </span>
              </div>
            )}
          </div>
        ))}
      </section>

      <section
        className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,.65fr)]"
        aria-labelledby="next-action-title"
        data-motion-reveal
      >
        <article
          className="surface surface-accent dashboard-grid-surface relative overflow-hidden p-5 sm:p-7 lg:p-8"
          data-motion-item
          data-tour="student-next-action"
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
          className="surface bg-[color-mix(in_srgb,var(--surface)_84%,var(--canvas))] p-5 sm:p-6"
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

          {isLoading ? (
            <ReadinessDataSkeleton />
          ) : data && data.readinessSignals.length ? (
            <div className="mt-6 space-y-5">
              {data.readinessSignals.map((signal) => (
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
          ) : (
            <EmptyState
              className="mt-6 min-h-40"
              title="아직 준비 신호가 없어요"
              description="자소서 확인이나 질문 연습을 완료하면 판단 근거가 이곳에 표시됩니다."
            />
          )}

          <div className="mt-6 border-t border-[var(--border)] pt-4">
            <p className="flex items-center gap-2 text-xs font-bold">
              <Sparkles className="size-3.5 text-[var(--brand)]" />
              AI 해석
            </p>
            <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
              {data
                ? "근거 선택은 안정적입니다. 오늘은 답변 구조를 한 번 만들고 소리 내어 말하는 것까지 완료하세요."
                : "첫 준비 데이터를 연결하면 다음 행동의 이유와 보완 순서를 설명해 드립니다."}
            </p>
          </div>
        </aside>
      </section>

      <section
        className="grid overflow-hidden border-y border-[var(--border)] md:grid-cols-[1.1fr_.9fr]"
        data-motion-reveal
      >
        <div className="bg-[var(--brand-soft)] p-5 sm:p-6" data-motion-item>
          <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[var(--brand)]">
            <Gift className="size-3.5" /> Welcome benefit
          </p>
          <h2 className="mt-3 text-xl font-bold tracking-[-.035em]">
            무료 자소서 분석 1회가 준비되어 있어요
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
            자소서 근거를 확인하고, 면접에서 먼저 준비할 포인트와 예상 질문을
            받아보세요.
          </p>
          <Link
            href="/applications/demo/analysis"
            className="mt-5 inline-flex min-h-10 items-center gap-2 bg-[var(--brand)] px-4 text-sm font-bold text-[var(--text-on-brand)]"
          >
            무료 분석 시작하기 <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="bg-[var(--surface)] p-5 sm:p-6" data-motion-item>
          <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[var(--text-tertiary)]">
            <Infinity className="size-3.5 text-[var(--brand)]" /> Continue with
            subscription
          </p>
          <h2 className="mt-3 text-lg font-bold tracking-[-.03em]">
            준비 기록을 끊지 않고 이어가세요
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            구독하면 분석과 질문 훈련, 영상 가이드를 반복해서 활용하며 면접 직전
            노트까지 한 흐름으로 관리합니다.
          </p>
          <button
            type="button"
            onClick={() => setMembershipOpen(true)}
            className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[var(--brand)]"
          >
            구독 과정 살펴보기 <ChevronRight className="size-4" />
          </button>
        </div>
      </section>

      <section
        className="border-b border-[var(--border)] pb-8"
        aria-labelledby="admissions-update-title"
        data-motion-reveal
        data-tour="student-admissions"
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,.85fr)]">
          <div data-motion-item>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[var(--text-tertiary)]">
              Admissions signal
            </p>
            <h2
              id="admissions-update-title"
              className="mt-2 text-xl font-bold tracking-[-.035em]"
            >
              고입 정보를 준비 순서로 바꿔 드릴게요
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              공개된 자료는 그대로 쌓지 않습니다. 공식 원문을 확인하고, 소장님의
              검수를 거쳐 지원 기준·예상 질문·영상 가이드로 연결합니다.
            </p>
          </div>
          <div
            className="surface grid grid-cols-3 divide-x divide-[var(--border)] overflow-hidden bg-[var(--surface)]"
            data-motion-item
            aria-label="2027 지원 정보 현황"
          >
            <div className="p-4">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[.12em] text-[var(--text-tertiary)]">
                Year
              </p>
              <p className="mt-2 text-lg font-bold tracking-[-.04em]">2027</p>
            </div>
            <div className="p-4">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[.12em] text-[var(--text-tertiary)]">
                School
              </p>
              <p className="mt-2 truncate text-sm font-bold">
                {data?.schoolShort ?? "관심 학교"}
              </p>
            </div>
            <div className="p-4">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[.12em] text-[var(--text-tertiary)]">
                Status
              </p>
              <p className="mt-2 text-sm font-bold text-[var(--warning)]">확인 대기</p>
            </div>
          </div>
        </div>

        <div
          className="mt-5 grid overflow-hidden border-y border-[var(--border)] md:grid-cols-3"
          data-motion-item
        >
          {admissionsSignals.map((signal, index) => (
            <div
              key={signal.label}
              className="min-w-0 border-b border-[var(--border)] p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center border text-[10px] font-bold",
                    signal.active
                      ? "border-[var(--warning)] bg-[var(--warning-soft)] text-[var(--warning)]"
                      : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-tertiary)]",
                  )}
                >
                  0{index + 1}
                </span>
                <span className="text-[10px] font-bold text-[var(--text-tertiary)]">
                  {signal.state}
                </span>
              </div>
              <p className="mt-5 text-sm font-bold">{signal.label}</p>
              <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[.1em] text-[var(--brand)]">
                {signal.source}
              </p>
              <p className="mt-3 text-xs leading-5 text-[var(--text-secondary)]">
                {signal.detail}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3" data-motion-item>
          <p className="flex items-center gap-1.5 text-[11px] leading-5 text-[var(--text-tertiary)]">
            <FileClock className="size-3.5 shrink-0" /> 공개 전 자료는 확정된 지원 조건으로 안내하지 않습니다.
          </p>
          <button
            type="button"
            onClick={() => setAdmissionsAlertOpen(true)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[var(--brand)]"
          >
            <BellRing className="size-3.5" /> 업데이트 알림 설정
            <ChevronRight className="size-3.5" />
          </button>
        </div>
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
            {isLoading ? (
              <DashboardInlineSkeleton className="w-28" />
            ) : data ? (
              data.school
            ) : (
              "지원 학교 미등록"
            )}{" "}
            통합 패키지 · {completed.length}개 완료
          </p>
        </div>

        <ol
          className="surface grid overflow-hidden bg-[var(--surface)] md:grid-cols-5"
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
                            ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--text-on-brand)]"
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
            {isLoading ? (
              <DashboardInlineSkeleton className="h-6 w-24" />
            ) : data ? (
              <p className="text-right">
                <strong className="text-xl tracking-[-.04em]">
                  {data.practiceMinutes}분
                </strong>
                <span className="ml-2 text-[10px] font-bold text-[var(--success)]">
                  +{data.weeklyDelta}분
                </span>
              </p>
            ) : (
              <p className="text-right text-xs font-bold text-[var(--text-tertiary)]">
                기록 없음
              </p>
            )}
          </div>
          {isLoading ? (
            <WeeklyActivityDataSkeleton />
          ) : data && data.weeklyActivity.length ? (
            <div
              className="mt-5 grid h-20 grid-cols-7 items-end gap-2"
              aria-label="최근 7일 연습 기록"
            >
              {data.weeklyActivity.map((item, index) => (
                <div
                  key={item.day}
                  className="grid h-full grid-rows-[1fr_auto] gap-2"
                >
                  <div className="flex items-end bg-[var(--surface-muted)]">
                    <span
                      className={cn(
                        "w-full bg-[var(--brand-soft)]",
                        index === data.weeklyActivity.length - 1 &&
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
          ) : (
            <EmptyState
              className="mt-5 min-h-36"
              title="아직 집중 기록이 없어요"
              description="연습을 완료하면 최근 7일 기록이 여기에 표시됩니다."
            />
          )}
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
      <AppDialog
        open={membershipOpen}
        onClose={() => setMembershipOpen(false)}
        eyebrow="Membership guide"
        title="반복 훈련이 필요한 시점에 구독을 선택하세요"
        purpose="notice"
      >
        <div className="mt-6 grid divide-y divide-[var(--border)] border-y border-[var(--border)] text-sm">
          {[
            ["무료 분석", "자소서 근거와 첫 예상 질문을 확인"],
            ["AIHOW 코치 구독", "분석·질문 훈련·영상 가이드를 준비 기록과 연결"],
            ["전문가 진단 이용권", "필요한 결과물 하나를 소장님에게 검수 요청"],
          ].map(([label, detail]) => (
            <div key={label} className="py-3.5">
              <p className="font-bold">{label}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">{detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-[var(--text-tertiary)]">
          가격·이용 한도·응답 정책은 운영 기준이 확정된 뒤 안내합니다.
        </p>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => setMembershipOpen(false)}>확인했어요</Button>
        </div>
      </AppDialog>
      <AppDialog
        open={admissionsAlertOpen}
        onClose={() => setAdmissionsAlertOpen(false)}
        eyebrow="Admissions alerts"
        title="검수된 변경만 알려드릴게요"
        purpose="notice"
      >
        <p className="mt-6 border-y border-[var(--border)] py-4 text-sm leading-6 text-[var(--text-secondary)]">
          관심 학교의 모집요강이 공개되면 공식 원문을 확인합니다. 소장님 검수가 끝난 변경점만 준비 경로와 알림으로 안내합니다.
        </p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => setAdmissionsAlertOpen(false)}>
            나중에 설정
          </Button>
          <Link href="/settings" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--brand)] px-5 text-sm font-bold text-[var(--text-on-brand)]">
            알림 설정으로 이동 <ChevronRight className="size-4" />
          </Link>
        </div>
      </AppDialog>
    </div>
  );
}
