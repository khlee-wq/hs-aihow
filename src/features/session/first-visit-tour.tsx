"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/lib/session-shared";

type TourStep = { selector: string; title: string; detail: string };

const tours: Record<UserRole, TourStep[]> = {
  user: [
    { selector: "[data-tour='student-next-action']", title: "오늘은 여기부터 시작하세요", detail: "AIHOW가 현재 준비 상태에서 가장 영향이 큰 한 가지를 먼저 제안합니다." },
    { selector: "[data-tour='student-admissions']", title: "지원 정보는 이곳에서 확인해요", detail: "공식 원문과 검토가 끝난 정보만 준비 과정에 반영됩니다." },
    { selector: "[data-tour='student-menu']", title: "준비 단계는 아래에서 이어가세요", detail: "자소서부터 질문 연습, 모의면접, 파이널 노트까지 순서대로 이어집니다." },
  ],
  admin: [
    { selector: "[data-tour='admin-guide']", title: "교사의 기준을 수업에 적용하는 흐름입니다", detail: "개별 결과를 확인하지 않고, 단계·학교별 코칭 레시피를 승인해 학생별 상황에 자동 적용합니다." },
    { selector: "[data-tour='admin-prompt-recipes']", title: "지금 적용 중인 코칭 레시피입니다", detail: "학생 수가 늘어도 이 기준을 한 번 관리하면 모든 관련 결과에 일관되게 반영됩니다." },
    { selector: "[data-tour='admin-menu']", title: "필요한 도구만 여기에서 여세요", detail: "메뉴를 전부 익힐 필요 없이, 지금 설계할 수업 단계에 맞는 화면으로 이동하면 됩니다." },
  ],
};

export function FirstVisitTour({
  role,
  open,
  onClose,
  onComplete,
  onPostpone,
  onNever,
}: {
  role: UserRole;
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  onPostpone: () => void;
  onNever: () => void;
}) {
  const steps = tours[role];
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = steps[index];

  useEffect(() => {
    if (!open) return;
    const target = document.querySelector(step.selector);
    const update = () => setRect(target?.getBoundingClientRect() ?? null);
    target?.scrollIntoView({ block: "center", behavior: "smooth" });
    const frame = window.requestAnimationFrame(update);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [open, step.selector]);

  if (!open || typeof document === "undefined") return null;
  const closeTour = () => {
    setIndex(0);
    onClose();
  };
  const postponeTour = () => {
    setIndex(0);
    onPostpone();
  };
  const neverTour = () => {
    setIndex(0);
    onNever();
  };
  const completeTour = () => {
    setIndex(0);
    onComplete();
  };
  const mobile = window.innerWidth < 640;
  const tooltipWidth = Math.min(460, window.innerWidth - 32);
  const top = mobile
    ? Math.max(84, window.innerHeight - 330)
    : rect
      ? Math.min(rect.bottom + 18, window.innerHeight - 275)
      : 80;
  const left = mobile
    ? 16
    : rect
    ? Math.max(16, Math.min(rect.left, window.innerWidth - tooltipWidth - 16))
    : Math.max(16, (window.innerWidth - tooltipWidth) / 2);

  return createPortal(
    <div className="fixed inset-0 z-[110]" role="presentation">
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--surface-inverse)_18%,transparent)] backdrop-blur-[2px]" />
      {rect ? (
        <div
          className="pointer-events-none fixed rounded-[var(--radius-sm)] border-[3px] border-[var(--brand)] shadow-[0_0_0_6px_color-mix(in_srgb,var(--brand)_24%,transparent),0_16px_36px_color-mix(in_srgb,var(--brand)_28%,transparent)]"
          style={{ height: rect.height, left: rect.left, top: rect.top, width: rect.width }}
        />
      ) : null}
      <section
        className="fixed surface bg-[var(--surface)] p-5 shadow-[var(--shadow-md)] sm:p-7"
        style={{ left, top, width: tooltipWidth }}
        role="dialog"
        aria-modal="true"
        aria-label={`시작 안내 ${index + 1}단계`}
      >
        <div className="flex items-start gap-3">
          <span className="font-mono text-[10px] font-bold tracking-[.14em] text-[var(--brand)]">수업 안내 · {String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
          <button type="button" onClick={closeTour} className="ml-auto text-[var(--text-tertiary)] hover:text-[var(--text-primary)]" aria-label="투어 닫기"><X className="size-4" /></button>
        </div>
        <h2 className="mt-4 text-xl font-black tracking-[-.04em] sm:text-2xl">{step.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{step.detail}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-4">
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" disabled={index === 0} onClick={() => setIndex((current) => current - 1)}><ChevronLeft className="size-3.5" /> 이전</Button>
            <Button size="sm" onClick={() => index === steps.length - 1 ? completeTour() : setIndex((current) => current + 1)}>{index === steps.length - 1 ? "완료" : "다음"}<ChevronRight className="size-3.5" /></Button>
          </div>
          <div className="flex gap-2 text-[10px] font-bold text-[var(--text-tertiary)]">
            <button type="button" onClick={postponeTour}>24시간 숨기기</button>
            <button type="button" onClick={neverTour}>다시 보지 않기</button>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}
