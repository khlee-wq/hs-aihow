import { AlertTriangle, Inbox, RotateCcw } from "lucide-react";
import { Button } from "./button";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="grid min-h-64 place-items-center rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] p-8 text-center"><div><Inbox className="mx-auto mb-4 size-9 text-[var(--text-tertiary)]" /><h3 className="font-extrabold">{title}</h3><p className="mt-2 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">{description}</p></div></div>;
}

export function ErrorState({ retry }: { retry?: () => void }) {
  return <div className="grid min-h-64 place-items-center rounded-[var(--radius-lg)] bg-[var(--coral-soft)] p-8 text-center"><div><AlertTriangle className="mx-auto mb-4 size-9 text-[var(--danger)]" /><h3 className="font-extrabold">잠시 연결이 불안정해요</h3><p className="mt-2 text-sm text-[var(--text-secondary)]">작성 중인 내용은 이 기기에 보관했습니다. 다시 연결해 주세요.</p>{retry ? <Button className="mt-5" variant="secondary" onClick={retry}><RotateCcw className="size-4" />다시 시도</Button> : null}</div></div>;
}
