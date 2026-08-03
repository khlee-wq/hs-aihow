import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function DashboardInlineSkeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "skeleton inline-block h-[1em] w-16 rounded-[.2rem] align-middle",
        className,
      )}
    />
  );
}

export function DashboardMetricSkeleton() {
  return (
    <div
      className="mt-3 flex items-end justify-between gap-2"
      role="status"
      data-testid="dashboard-metric-skeleton"
    >
      <Skeleton className="h-7 w-16 rounded-[.2rem]" />
      <Skeleton className="h-3 w-12 rounded-[.2rem]" />
      <span className="sr-only">준비 지표를 불러오는 중입니다.</span>
    </div>
  );
}

export function ReadinessDataSkeleton() {
  return (
    <div
      className="mt-6 space-y-5"
      role="status"
      data-testid="readiness-data-skeleton"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index}>
          <div className="mb-2 flex items-center justify-between">
            <Skeleton className="h-3 w-16 rounded-[.2rem]" />
            <Skeleton className="h-3 w-12 rounded-[.2rem]" />
          </div>
          <Skeleton className="h-1.5 rounded-none" />
        </div>
      ))}
      <span className="sr-only">이번 주 준비 신호를 불러오는 중입니다.</span>
    </div>
  );
}

export function WeeklyActivityDataSkeleton() {
  return (
    <div
      className="mt-5 grid h-20 grid-cols-7 items-end gap-2"
      role="status"
      data-testid="weekly-activity-skeleton"
    >
      {Array.from({ length: 7 }).map((_, index) => (
        <div key={index} className="grid h-full grid-rows-[1fr_auto] gap-2">
          <div className="flex items-end bg-[var(--surface-muted)]">
            <Skeleton
              className="w-full rounded-none"
              style={{ height: `${28 + ((index * 13) % 42)}%` }}
            />
          </div>
          <Skeleton className="mx-auto h-2 w-4 rounded-[.15rem]" />
        </div>
      ))}
      <span className="sr-only">주간 집중 기록을 불러오는 중입니다.</span>
    </div>
  );
}
