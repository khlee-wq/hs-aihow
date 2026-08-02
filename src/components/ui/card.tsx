import { cn } from "@/lib/utils";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("surface bg-[var(--surface)] p-5 sm:p-6", className)} {...props}>{children}</div>;
}
