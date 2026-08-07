import { Check, Compass } from "lucide-react";
import type { InterestSchool } from "./interest-school-directory";

type InterestSchoolConfirmationContentProps = {
  school: InterestSchool;
  confirming?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function InterestSchoolConfirmationContent({
  school,
  confirming = false,
  onCancel,
  onConfirm,
}: InterestSchoolConfirmationContentProps) {
  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
            <Compass className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--text-secondary)]">
              선택한 관심 학교
            </p>
            <p className="mt-0.5 text-lg font-bold text-[var(--text-primary)]">
              {school.name}
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {school.latestAdmissions.year}학년도 모집 인원 {school.latestAdmissions.capacity}명
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm leading-6 text-[var(--text-secondary)]">
        선택하면 지원자 흐름과 모집 인원을 바탕으로 준비 지도를 열어드려요.
        학교는 언제든 입시 지도에서 바꿀 수 있어요.
      </p>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={confirming}
          className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] px-5 text-sm font-bold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          다시 고르기
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirming}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--brand)] px-5 text-sm font-bold text-[var(--text-on-brand)] shadow-[var(--shadow-brand)] transition-[transform,background] hover:-translate-y-0.5 hover:bg-[var(--brand-strong)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {confirming ? "준비 지도를 여는 중" : `${school.shortName} 선택`}
          {!confirming ? <Check className="size-4" aria-hidden="true" /> : null}
        </button>
      </div>
    </div>
  );
}
