import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
};

export function Field({ label, error, hint, children }: FieldProps) {
  return (
    <label className="grid gap-2 text-sm font-bold">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs font-medium text-[var(--danger)]" role="alert">{error}</span> : hint ? <span className="text-xs font-medium text-[var(--text-tertiary)]">{hint}</span> : null}
    </label>
  );
}

export const inputClass = cn("min-h-12 w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--text-primary)] transition-colors placeholder:text-[var(--text-tertiary)] hover:border-[var(--border-strong)] focus:border-[var(--brand)] focus:outline-none");
export const textareaClass = cn(inputClass, "min-h-32 resize-y py-3 leading-7");
