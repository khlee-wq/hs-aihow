import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "hairline-top inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] px-5 text-sm font-bold transition-[transform,background,color,border-color,box-shadow,opacity] duration-[var(--motion-fast)] disabled:pointer-events-none disabled:opacity-50 active:scale-[.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--brand)] text-[var(--text-on-brand)] shadow-[var(--shadow-brand)] hover:-translate-y-0.5 hover:bg-[var(--brand-strong)]",
        secondary:
          "bg-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border)] shadow-[var(--shadow-sm)] hover:-translate-y-0.5 hover:border-[var(--border-strong)]",
        ghost:
          "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
        inverse:
          "bg-[var(--text-primary)] text-[var(--canvas)] hover:opacity-90",
        danger: "bg-[var(--coral-soft)] text-[var(--danger)] hover:opacity-80",
      },
      size: {
        sm: "min-h-9 px-3 text-xs",
        md: "min-h-11 px-5",
        lg: "min-h-13 px-7 text-base",
      },
      full: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { loading?: boolean };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, children, loading, disabled, variant, size, full, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, full }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <LoaderCircle aria-hidden className="size-4 animate-spin" />
      ) : null}
      {children}
    </button>
  ),
);
Button.displayName = "Button";

export { buttonVariants };
