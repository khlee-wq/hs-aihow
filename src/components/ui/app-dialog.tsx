"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const focusableSelector = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

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
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarGap > 0) document.body.style.paddingRight = `${scrollbarGap}px`;

    const focusFrame = window.requestAnimationFrame(() => {
      if (!dialog || dialog.contains(document.activeElement)) return;
      const preferred = dialog.querySelector<HTMLElement>(
        "[autofocus], [data-dialog-initial-focus]",
      );
      (preferred ?? closeButtonRef.current ?? dialog).focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && canDismiss) {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => !element.hasAttribute("hidden"));
      const first = focusable[0] ?? dialog;
      const last = focusable.at(-1) ?? dialog;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      if (previouslyFocused?.isConnected) previouslyFocused.focus();
    };
  }, [canDismiss, onClose, open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex min-h-[100dvh] items-end justify-center overflow-y-auto overscroll-contain bg-[var(--surface-overlay)] p-0 backdrop-blur-[1px] sm:items-center sm:p-6"
      role="presentation"
      data-testid="app-dialog-overlay"
      onMouseDown={(event) => {
        if (canDismiss && event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className={cn(
          "surface max-h-[min(92dvh,48rem)] w-full overflow-y-auto rounded-b-none bg-[var(--surface)] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-[var(--shadow-md)] outline-none sm:rounded-[var(--radius-lg)] sm:p-7",
          purpose === "notice" && "max-w-xl",
          purpose === "confirmation" && "max-w-md",
          purpose === "danger" && "max-w-md border-[color-mix(in_srgb,var(--danger)_32%,var(--border))]",
          purpose === "session" && "max-w-md border-[color-mix(in_srgb,var(--warning)_32%,var(--border))]",
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-motion-dialog
        tabIndex={-1}
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
              ref={closeButtonRef}
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
    </div>,
    document.body,
  );
}
