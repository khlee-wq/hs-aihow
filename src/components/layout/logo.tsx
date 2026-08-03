import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2 font-black tracking-[-.04em]" aria-label="AIHOW 홈">
      <span className="grid size-8 place-items-center rounded-[var(--radius-xs)] bg-[var(--brand)] text-sm text-[var(--text-on-brand)]">A</span>
      {compact ? null : <span className="text-lg">AIHOW</span>}
    </Link>
  );
}
