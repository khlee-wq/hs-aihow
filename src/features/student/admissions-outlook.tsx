import {
  ArrowUpRight,
  Check,
  Layers3,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { DashboardSnapshot } from "./dashboard-model";

type AdmissionsOutlookData = NonNullable<
  DashboardSnapshot["admissionsOutlook"]
>;

const accessLabel = {
  open: "무료 공개",
  preview: "미리 보기",
  locked: "학교별 구독 분석",
} as const;

export function AdmissionsOutlook({
  school,
  data,
  loading,
  onOpenDetail,
}: {
  school: string;
  data: AdmissionsOutlookData | null | undefined;
  loading: boolean;
  onOpenDetail: () => void;
}) {
  if (loading) {
    return (
      <section
        className="border-b border-[var(--border)] pb-8"
        aria-label="입시 인사이트를 불러오는 중"
        data-testid="admissions-outlook-skeleton"
      >
        <Skeleton className="h-3 w-28 rounded-[.2rem]" />
        <Skeleton className="mt-3 h-8 w-72 max-w-full rounded-[.2rem]" />
        <Skeleton className="mt-3 h-5 w-[34rem] max-w-full rounded-[.2rem]" />
        <div className="mt-5 grid gap-3 lg:grid-cols-[1.12fr_.94fr_.94fr]">
          <Skeleton className="h-72 rounded-[var(--radius-lg)]" />
          <Skeleton className="h-72 rounded-[var(--radius-lg)]" />
          <Skeleton className="h-72 rounded-[var(--radius-lg)]" />
        </div>
        <span className="sr-only">관심 학교의 입시 인사이트를 불러오고 있습니다.</span>
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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div data-motion-item>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[var(--brand)]">
            Admissions brief
          </p>
          <h2
            id="admissions-outlook-title"
            className="mt-2 max-w-3xl text-balance text-2xl font-bold tracking-[-.045em] sm:text-3xl"
          >
            {data.headline}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
            {data.summary}
          </p>
        </div>
        <div
          className="flex w-fit items-center gap-2 border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
          data-motion-item
        >
          <span className="font-mono text-[10px] font-bold text-[var(--brand)]">
            {data.revealedCount}/{data.totalCount}
          </span>
          <span className="text-[10px] font-bold text-[var(--text-secondary)]">
            인사이트 공개
          </span>
        </div>
      </div>

      <div
        className="mt-5 -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0 lg:grid lg:grid-cols-[1.12fr_.94fr_.94fr] lg:overflow-visible lg:pb-0"
        data-testid="admissions-insight-deck"
        aria-label="입시 인사이트 미리 보기"
      >
        {data.insights.map((insight, index) => {
          const open = insight.access === "open";

          return (
            <article
              key={insight.id}
              className={cn(
                "relative flex min-h-72 min-w-[82vw] max-w-[22rem] snap-center flex-col overflow-hidden border p-5 sm:min-w-[20rem] sm:p-6 lg:min-w-0 lg:max-w-none",
                open
                  ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--text-on-brand)] shadow-[var(--shadow-brand)]"
                  : "border-[var(--border)] bg-[var(--surface)]",
              )}
              data-motion-item
              data-insight-access={insight.access}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className={cn(
                      "font-mono text-[9px] font-bold uppercase tracking-[.14em]",
                      open
                        ? "text-[color-mix(in_srgb,var(--text-on-brand)_70%,transparent)]"
                        : "text-[var(--text-tertiary)]",
                    )}
                  >
                    0{index + 1} · {insight.label}
                  </p>
                  <span
                    className={cn(
                      "mt-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-bold",
                      open
                        ? "bg-[color-mix(in_srgb,var(--text-on-brand)_14%,transparent)]"
                        : "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
                    )}
                  >
                    {open ? (
                      <Check className="size-3" />
                    ) : (
                      <LockKeyhole className="size-3" />
                    )}
                    {accessLabel[insight.access]}
                  </span>
                </div>
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center border",
                    open
                      ? "border-[color-mix(in_srgb,var(--text-on-brand)_24%,transparent)]"
                      : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--brand)]",
                  )}
                  aria-hidden
                >
                  {index === 0 ? (
                    <Sparkles className="size-4" />
                  ) : (
                    <Layers3 className="size-4" />
                  )}
                </span>
              </div>

              <div className="mt-auto pt-10">
                <p
                  className={cn(
                    "text-[11px] font-bold",
                    open
                      ? "text-[color-mix(in_srgb,var(--text-on-brand)_74%,transparent)]"
                      : "text-[var(--brand)]",
                  )}
                >
                  {insight.signal}
                </p>
                <h3 className="mt-2 text-xl font-bold leading-[1.35] tracking-[-.035em]">
                  {insight.title}
                </h3>
                <p
                  className={cn(
                    "mt-3 text-xs leading-5",
                    open
                      ? "text-[color-mix(in_srgb,var(--text-on-brand)_76%,transparent)]"
                      : "text-[var(--text-secondary)]",
                  )}
                >
                  {insight.summary}
                </p>
              </div>

              {!open ? (
                <div
                  className="pointer-events-none absolute inset-x-5 bottom-5 h-12 bg-gradient-to-t from-[var(--surface)] via-[color-mix(in_srgb,var(--surface)_92%,transparent)] to-transparent sm:inset-x-6"
                  aria-hidden
                />
              ) : null}
            </article>
          );
        })}
      </div>

      <div
        className="mt-4 flex flex-col gap-4 border-y border-[var(--border)] bg-[color-mix(in_srgb,var(--brand-soft)_38%,var(--surface))] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
        data-motion-item
      >
        <div>
          <p className="text-sm font-bold">
            {school}에 맞는 변화 이유와 준비 순서를 이어서 보세요.
          </p>
          <p className="mt-1 text-[11px] leading-5 text-[var(--text-secondary)]">
            경쟁률 숫자만 보여주지 않고, 전형과 모집 인원을 함께 읽어 지금 할 일로 바꿔드려요.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenDetail}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-[var(--text-primary)] px-5 text-xs font-bold text-[var(--canvas)] transition-transform hover:-translate-y-0.5"
        >
          {school} 상세 해석 보기 <ArrowUpRight className="size-3.5" />
        </button>
      </div>

      <p className="mt-3 text-[10px] leading-5 text-[var(--text-tertiary)]" data-motion-item>
        {data.category} · {data.period} · 공개 화면에는 준비 판단에 필요한 해석만 제공합니다.
      </p>
    </section>
  );
}
