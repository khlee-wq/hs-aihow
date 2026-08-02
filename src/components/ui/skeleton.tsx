import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton h-4 w-full", className)} />;
}

export function PageSkeleton({
  type = "dashboard",
}: {
  type?: "dashboard" | "workspace" | "admin" | "auth";
}) {
  if (type === "auth")
    return (
      <div className="reading-wrap grid min-h-[70svh] place-items-center py-12">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="mx-auto h-10 w-48" />
          <Skeleton className="h-[28rem] rounded-[var(--radius-lg)]" />
        </div>
      </div>
    );
  if (type === "dashboard")
    return (
      <div
        className="space-y-12"
        aria-label="페이지를 불러오는 중"
        role="status"
      >
        <div className="grid gap-6 border-b border-[var(--border)] pb-9 md:grid-cols-[minmax(0,1fr)_12rem]">
          <div className="space-y-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-12 max-w-2xl" />
            <Skeleton className="h-5 max-w-md" />
          </div>
          <div className="space-y-3 border-l-2 border-[var(--border)] pl-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(17rem,.65fr)]">
          <Skeleton className="h-72 rounded-[var(--radius-xl)]" />
          <Skeleton className="h-72 rounded-[var(--radius-xl)]" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-7 w-32" />
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)]">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-[5.5rem] rounded-none border-b border-[var(--border)] last:border-b-0"
              />
            ))}
          </div>
        </div>
        <span className="sr-only">콘텐츠를 불러오고 있습니다.</span>
      </div>
    );
  return (
    <div className="space-y-6" aria-label="페이지를 불러오는 중" role="status">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 max-w-lg" />
        <Skeleton className="h-5 max-w-sm" />
      </div>
      <div
        className={cn(
          "grid gap-4",
          type === "admin" ? "md:grid-cols-4" : "md:grid-cols-3",
        )}
      >
        {Array.from({ length: type === "admin" ? 4 : 3 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-[var(--radius-lg)]" />
        ))}
      </div>
      <Skeleton
        className={cn(
          "rounded-[var(--radius-lg)]",
          type === "workspace" ? "h-[30rem]" : "h-72",
        )}
      />
      <span className="sr-only">콘텐츠를 불러오고 있습니다.</span>
    </div>
  );
}
