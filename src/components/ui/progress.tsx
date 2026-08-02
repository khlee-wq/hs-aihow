export function Progress({ value, label }: { value: number; label?: string }) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div className="grid gap-2">
      {label ? <div className="flex items-center justify-between text-xs font-bold"><span>{label}</span><span className="text-[var(--text-secondary)]">{safeValue}%</span></div> : null}
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-muted)]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safeValue} aria-label={label ?? "진행률"}>
        <div className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-[var(--motion-slow)]" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}
