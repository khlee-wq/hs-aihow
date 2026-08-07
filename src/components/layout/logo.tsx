import Link from "next/link";

type LogoProps = {
  compact?: boolean;
  /** 학생·교사 작업 공간 헤더와 같은 밀도의 브랜드 시그니처입니다. */
  variant?: "default" | "workspace";
};

export function Logo({ compact = false, variant = "default" }: LogoProps) {
  const isWorkspaceVariant = variant === "workspace";

  return (
    <Link
      href="/"
      className={isWorkspaceVariant
        ? "inline-flex items-center gap-2.5 leading-none"
        : "inline-flex items-center gap-2 font-black tracking-[-.04em]"}
      aria-label="AIHOW 홈"
    >
      <span className={isWorkspaceVariant
        ? "grid size-7 place-items-center rounded-[var(--radius-xs)] bg-[var(--brand)] text-[10px] font-black text-[var(--text-on-brand)] shadow-[0_6px_14px_color-mix(in_srgb,var(--brand)_24%,transparent)]"
        : "grid size-8 place-items-center rounded-[var(--radius-xs)] bg-[var(--brand)] text-sm text-[var(--text-on-brand)]"}
      >
        A
      </span>
      {compact ? null : (
        <span className={isWorkspaceVariant
          ? "text-[.9rem] font-black tracking-[-.045em]"
          : "text-lg"}
        >
          AIHOW
        </span>
      )}
    </Link>
  );
}
