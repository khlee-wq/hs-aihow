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
        className="space-y-8 md:space-y-10"
        aria-label="페이지를 불러오는 중"
        role="status"
      >
        <div className="grid gap-6 border-b border-[var(--border)] pb-7 md:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="space-y-4">
            <Skeleton className="h-3 w-36 rounded-none" />
            <Skeleton className="h-11 max-w-2xl rounded-none" />
            <Skeleton className="h-4 max-w-lg rounded-none" />
          </div>
          <div className="grid grid-cols-2 border border-[var(--border)]">
            <Skeleton className="h-16 rounded-none border-r border-[var(--border)]" />
            <Skeleton className="h-16 rounded-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 border border-[var(--border)] lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-20 rounded-none border-r border-[var(--border)] last:border-r-0"
            />
          ))}
        </div>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(19rem,.65fr)]">
          <Skeleton className="h-80 rounded-none" />
          <Skeleton className="h-80 rounded-none" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-7 w-32 rounded-none" />
          <div className="grid overflow-hidden border border-[var(--border)] md:grid-cols-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-20 rounded-none border-b border-r border-[var(--border)] last:border-r-0 md:h-[8.5rem] md:border-b-0"
              />
            ))}
          </div>
          <Skeleton className="h-7 rounded-none" />
        </div>
        <Skeleton className="h-40 rounded-none" />
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
