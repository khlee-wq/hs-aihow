import { AlertTriangle, Inbox, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type StateProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  className,
}: StateProps) {
  return (
    <div
      className={cn(
        "grid min-h-52 place-items-center bg-[var(--surface-muted)] px-6 py-10 text-center",
        className,
      )}
    >
      <div>
        <Inbox className="mx-auto mb-4 size-7 text-[var(--text-tertiary)]" />
        <h3 className="font-extrabold">{title}</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
          {description}
        </p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}

export function ErrorState({
  retry,
  title = "잠시 연결이 불안정해요",
  description = "작성 중인 내용은 이 기기에 보관했습니다. 다시 연결해 주세요.",
  className,
}: {
  retry?: () => void;
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid min-h-52 place-items-center bg-[var(--surface-muted)] px-6 py-10 text-center",
        className,
      )}
    >
      <div>
        <AlertTriangle className="mx-auto mb-4 size-7 text-[var(--danger)]" />
        <h3 className="font-extrabold">{title}</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
          {description}
        </p>
        {retry ? (
          <Button className="mt-5" variant="secondary" onClick={retry}>
            <RotateCcw className="size-4" />
            다시 시도
          </Button>
        ) : null}
      </div>
    </div>
  );
}
