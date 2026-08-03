import { cn } from "@/lib/utils";

type CardVariant = "raised" | "glass";

export function Card({
  className,
  children,
  variant = "raised",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: CardVariant }) {
  return (
    <div
      className={cn(
        "surface min-w-0 p-5 sm:p-6",
        variant === "raised"
          ? "surface-raised bg-[var(--surface)]"
          : "surface-glass",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
