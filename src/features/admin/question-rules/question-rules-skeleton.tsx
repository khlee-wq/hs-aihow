import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function QuestionRulesListSkeleton() {
  return (
    <div
      className="grid gap-3"
      role="status"
      aria-label="질문 기준 목록을 불러오는 중"
      data-testid="question-rules-list-skeleton"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <Card
          key={index}
          className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:items-center"
        >
          <div className="flex gap-4">
            <Skeleton className="size-11 shrink-0 rounded-[var(--radius-sm)]" />
            <div className="min-w-0 flex-1 space-y-2.5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <Skeleton className="h-3 max-w-md" />
            </div>
          </div>
          <Skeleton className="h-9 w-20" />
        </Card>
      ))}
      <span className="sr-only">질문 기준 데이터를 불러오고 있습니다.</span>
    </div>
  );
}
