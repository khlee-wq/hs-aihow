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
      {error ? (
        <span className="text-xs font-medium text-[var(--danger)]" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="text-xs font-medium text-[var(--text-tertiary)]">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export const inputClass = cn(
  "min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-primary)] shadow-[inset_0_1px_2px_color-mix(in_srgb,var(--surface-inverse)_4%,transparent)] transition-[background,border-color,box-shadow] placeholder:text-[var(--text-tertiary)] hover:border-[var(--border-strong)] focus:border-[var(--border-accent)] focus:bg-[var(--surface)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--brand)_10%,transparent)] focus:outline-none",
);
export const textareaClass = cn(inputClass, "min-h-32 resize-y py-3 leading-7");
