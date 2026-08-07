import {
  BarChart3,
  Check,
  Compass,
  Layers3,
  LockKeyhole,
  MoveRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { DashboardSnapshot } from "./dashboard-model";

type AdmissionsOutlookData = NonNullable<
  DashboardSnapshot["admissionsOutlook"]
>;

function IndexTrack({
  label,
  values,
  tone,
}: {
  label: string;
  values: number[];
  tone: "brand" | "warm";
}) {
  const color = tone === "brand" ? "var(--brand)" : "var(--warning)";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-bold">
        <span className="text-[var(--text-secondary)]">{label}</span>
        <span className="font-mono text-[9px] text-[var(--text-tertiary)]">
          100 기준
        </span>
      </div>
      <div className="flex h-14 items-end gap-1.5" aria-hidden>
        {values.map((value, index) => (
          <span
            key={`${label}-${index}`}
            className="min-w-0 flex-1 rounded-t-[.35rem] transition-[height,opacity] duration-500"
            style={{
              height: `${Math.max(value * 0.42, 14)}%`,
              backgroundColor: color,
              opacity: 0.42 + index * 0.16,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function AdmissionsOutlook({
  school,
  data,
  loading,
  onOpenDetail,
  onChangeSchool,
}: {
  school: string;
  data: AdmissionsOutlookData | null | undefined;
  loading: boolean;
  onOpenDetail: () => void;
  onChangeSchool: () => void;
}) {
  if (loading) {
    return (
      <section
        className="border-b border-[var(--border)] pb-8"
        aria-label="입시 인사이트를 불러오는 중"
        data-testid="admissions-outlook-skeleton"
      >
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(20rem,.78fr)] md:items-end">
          <div>
            <Skeleton className="h-3 w-28 rounded-[.2rem]" />
            <Skeleton className="mt-3 h-8 w-72 max-w-full rounded-[.2rem]" />
            <Skeleton className="mt-3 h-5 w-[34rem] max-w-full rounded-[.2rem]" />
          </div>
          <div className="skeleton-glass-cluster grid grid-cols-3 overflow-hidden rounded-[1.15rem] p-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="px-3 py-3" aria-hidden>
                <Skeleton className="h-2.5 w-12 rounded-full" />
                <Skeleton className="mt-3 h-4 w-full max-w-[10rem] rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-[1.2fr_.8fr]">
          <Skeleton className="h-80 rounded-[var(--radius-lg)]" />
          <div className="grid gap-3">
            <Skeleton className="h-[9.6rem] rounded-[var(--radius-lg)]" />
            <Skeleton className="h-[9.6rem] rounded-[var(--radius-lg)]" />
          </div>
        </div>
        <span className="sr-only">
          관심 학교의 입시 인사이트를 불러오고 있습니다.
        </span>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section
      className="border-b border-[var(--border)] pb-8"
      aria-labelledby="admissions-outlook-title"
      data-testid="admissions-outlook"
      data-motion-reveal
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(20rem,.78fr)] md:items-end">
        <div data-motion-item>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[var(--brand)]">
            입시 지도 · {school}
          </p>
          <h2
            id="admissions-outlook-title"
            className="mt-2 max-w-3xl text-balance text-2xl font-bold tracking-[-.045em] sm:text-3xl"
          >
            {school}의 흐름을 먼저 확인해 보세요.
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
            지원자 수만 보지 않고, 모집 여건까지 함께 읽어 내 준비 순서를
            정합니다.
          </p>
          <button
            type="button"
            onClick={onChangeSchool}
            className="mt-3 inline-flex min-h-9 items-center gap-1.5 border border-[var(--border)] px-3 text-xs font-bold text-[var(--text-secondary)] transition-[transform,border-color,color] hover:-translate-y-0.5 hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]"
          >
            관심 학교 변경
            <MoveRight className="size-3" />
          </button>
        </div>
        <button
          type="button"
          onClick={onOpenDetail}
          className="practice-context-glass group grid overflow-hidden rounded-[1.15rem] text-left text-xs transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] sm:grid-cols-[.84fr_.72fr_.72fr]"
          data-motion-item
          aria-label={`${school} 준비 지도 보기`}
        >
          <div className="border-b border-[var(--border)] px-4 py-3.5 sm:border-b-0 sm:border-r">
            <p className="font-mono text-[9px] uppercase tracking-[.12em] text-[var(--text-tertiary)]">
              관심 학교
            </p>
            <p className="mt-1.5 flex items-center gap-2 font-bold">
              <Compass className="size-3.5 text-[var(--brand)]" />
              {school}
            </p>
            <span className="mt-1.5 inline-flex items-center text-[10px] font-bold text-[var(--brand)]">
              준비 지도 보기
              <MoveRight className="ml-1 size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
          <div className="border-b border-[var(--border)] px-4 py-3.5 sm:border-b-0 sm:border-r">
            <p className="font-mono text-[9px] uppercase tracking-[.12em] text-[var(--text-tertiary)]">
              지원자 흐름
            </p>
            <p className="mt-1 font-mono text-lg font-bold tracking-[-.04em] text-[var(--text-primary)]">
              {data.latestAdmissions.applicants.toLocaleString()}명
            </p>
            <p className="text-[10px] text-[var(--text-secondary)]">
              {data.latestAdmissions.year} 지원 인원
            </p>
          </div>
          <div className="px-4 py-3.5">
            <p className="font-mono text-[9px] uppercase tracking-[.12em] text-[var(--text-tertiary)]">
              모집 인원
            </p>
            <p className="mt-1 font-mono text-lg font-bold tracking-[-.04em] text-[var(--text-primary)]">
              {data.latestAdmissions.capacity.toLocaleString()}명
            </p>
            <p className="text-[10px] text-[var(--text-secondary)]">
              {data.latestAdmissions.year}학년도
            </p>
          </div>
        </button>
      </div>

      <div
        className="mt-5 grid gap-3 lg:grid-cols-[1.18fr_.82fr]"
        data-testid="admissions-insight-deck"
        aria-label="입시 인사이트 미리 보기"
      >
        <article
          className="relative overflow-hidden border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,var(--brand-soft))] p-5 shadow-[var(--shadow-sm)] sm:p-6"
          data-motion-item
          data-insight-access="open"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[var(--brand)]">
                {data.timeline.fromYear} → {data.timeline.toYear} 지원 흐름
              </p>
              <h3 className="mt-2 text-xl font-bold tracking-[-.035em] sm:text-2xl">
                숫자 사이의 간격이
                <br />
                지금 준비할 이유가 됩니다.
              </h3>
            </div>
            <span
              className="grid size-10 place-items-center rounded-full border border-[color-mix(in_srgb,var(--brand)_26%,transparent)] bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] text-[var(--brand)]"
              aria-hidden
            >
              <BarChart3 className="size-4" />
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6 border-y border-[var(--border)] py-5">
            <IndexTrack
              label="지원자 흐름"
              values={data.timeline.applicantIndex}
              tone="brand"
            />
            <IndexTrack
              label="모집 여건"
              values={data.timeline.recruitmentIndex}
              tone="warm"
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
            <span className="inline-flex w-fit items-center gap-1.5 bg-[var(--brand)] px-2.5 py-1.5 text-[10px] font-bold text-[var(--text-on-brand)]">
              <Check className="size-3" /> 이번 공개 해석
            </span>
            <p className="text-sm font-bold leading-6">
              {data.insights[0]?.title}
            </p>
          </div>
          <p className="mt-2 max-w-xl text-xs leading-5 text-[var(--text-secondary)]">
            {data.insights[0]?.summary}
          </p>
        </article>

        <div className="grid gap-3">
          {data.insights.slice(1).map((insight, index) => {
            const locked = insight.access === "locked";
            return (
              <article
                key={insight.id}
                className={cn(
                  "relative flex min-h-[9.75rem] flex-col overflow-hidden border p-5",
                  locked
                    ? "border-[color-mix(in_srgb,var(--brand)_24%,var(--border))] bg-[var(--surface)]"
                    : "border-[var(--border)] bg-[var(--surface-muted)]",
                )}
                data-motion-item
                data-insight-access={insight.access}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[var(--text-tertiary)]">
                    0{index + 2} · {insight.label}
                  </p>
                  {locked ? (
                    <LockKeyhole className="size-3.5 text-[var(--brand)]" />
                  ) : (
                    <Layers3 className="size-3.5 text-[var(--brand)]" />
                  )}
                </div>
                <h3 className="mt-3 text-base font-bold tracking-[-.025em]">
                  {insight.title}
                </h3>
                <p className="mt-1.5 text-[11px] leading-5 text-[var(--text-secondary)]">
                  {insight.signal}
                </p>
                {locked ? (
                  <div
                    className="pointer-events-none absolute inset-x-5 bottom-0 h-9 bg-gradient-to-t from-[var(--surface)] via-[color-mix(in_srgb,var(--surface)_88%,transparent)] to-transparent"
                    aria-hidden
                  />
                ) : null}
              </article>
            );
          })}
        </div>
      </div>

      <p
        className="mt-3 text-[10px] leading-5 text-[var(--text-tertiary)]"
        data-motion-item
      >
        {data.category} · {data.period} · 지수는 원본 흐름을 비교하기 쉽게 100
        기준으로 정리한 값입니다.
      </p>
    </section>
  );
}
