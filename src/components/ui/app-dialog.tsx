"use client";

import { X } from "lucide-react";
import { useEffect, useId } from "react";
import { cn } from "@/lib/utils";

export function AppDialog({
  open,
  onClose,
  eyebrow,
  title,
  children,
  className,
  purpose = "notice",
  dismissible,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  purpose?: "notice" | "confirmation" | "danger" | "session";
  dismissible?: boolean;
}) {
  const titleId = useId();
  const canDismiss = dismissible ?? purpose !== "session";

  useEffect(() => {
    if (!open || !canDismiss) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [canDismiss, onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-[var(--surface-overlay)] p-4 backdrop-blur-[1px]"
      role="presentation"
      onMouseDown={(event) => {
        if (canDismiss && event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={cn(
          "surface w-full bg-[var(--surface)] p-5 shadow-[var(--shadow-md)] sm:p-7",
          purpose === "notice" && "max-w-lg",
          purpose === "confirmation" && "max-w-md",
          purpose === "danger" && "max-w-md border-[color-mix(in_srgb,var(--danger)_32%,var(--border))]",
          purpose === "session" && "max-w-md border-[color-mix(in_srgb,var(--warning)_32%,var(--border))]",
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-motion-dialog
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
            <h2 id={titleId} className="mt-2 text-xl font-black tracking-[-.035em]">
              {title}
            </h2>
          </div>
          {canDismiss ? (
            <button
              type="button"
              onClick={onClose}
              className="grid size-10 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
              aria-label="닫기"
            >
              <X className="size-5" />
            </button>
          ) : null}
        </div>
        {children}
      </section>
    </div>
  );
}
