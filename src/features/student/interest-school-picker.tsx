"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppDialog } from "@/components/ui/app-dialog";
import type { InterestSchool } from "./interest-school-directory";
import { InterestSchoolConfirmationContent } from "./interest-school-confirmation";
import { InterestSchoolSearch } from "./interest-school-search";

export function InterestSchoolPicker({
  open,
  onChoose,
  onLater,
}: {
  open: boolean;
  onChoose: (school: InterestSchool) => void;
  onLater: () => void;
}) {
  const [isChoosing, setIsChoosing] = useState(false);
  const [schoolToConfirm, setSchoolToConfirm] =
    useState<InterestSchool | null>(null);
  const chooseTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (chooseTimer.current) window.clearTimeout(chooseTimer.current);
    },
    [],
  );

  const chooseSchool = (school: InterestSchool) => {
    if (isChoosing) return;
    setIsChoosing(true);
    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const duration = reducedMotion ? 0 : 420;
    chooseTimer.current = window.setTimeout(() => {
      chooseTimer.current = null;
      setSchoolToConfirm(null);
      setIsChoosing(false);
      onChoose(school);
    }, duration);
  };

  const closePicker = () => {
    if (chooseTimer.current) window.clearTimeout(chooseTimer.current);
    chooseTimer.current = null;
    setIsChoosing(false);
    setSchoolToConfirm(null);
    onLater();
  };

  return (
    <AppDialog
      open={open}
      onClose={closePicker}
      eyebrow="관심 학교 설정"
      title={
        schoolToConfirm
          ? `${schoolToConfirm.name}를 선택할까요?`
          : "가장 먼저 준비할 학교를 골라볼까요?"
      }
      className="max-w-2xl"
      dismissible
    >
      {schoolToConfirm ? (
        <InterestSchoolConfirmationContent
          school={schoolToConfirm}
          confirming={isChoosing}
          onCancel={() => setSchoolToConfirm(null)}
          onConfirm={() => chooseSchool(schoolToConfirm)}
        />
      ) : (
        <>
          <div
            className={`relative mt-6 transition-[opacity,transform,filter] duration-300 ease-out motion-reduce:transition-none ${
              isChoosing
                ? "pointer-events-none -translate-y-2 scale-[.985] opacity-0 blur-sm"
                : "opacity-100"
            }`}
          >
            <p className="max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
              학교 이름을 검색해 보세요. 선택한 학교의 지원 흐름과 모집 인원을 준비
              지도에 먼저 보여드려요.
            </p>

            <div className="mt-5">
              <InterestSchoolSearch
                autoFocus
                dialogInitialFocus
                onChoose={setSchoolToConfirm}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end border-t border-[var(--border)] pt-4">
            <button
              type="button"
              onClick={closePicker}
              disabled={isChoosing}
              className="min-h-10 px-3 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              나중에 선택하기
            </button>
          </div>
        </>
      )}
    </AppDialog>
  );
}

export function InterestSchoolPrompt({ onOpen }: { onOpen: () => void }) {
  return (
    <section
      className="border-b border-[var(--border)] pb-8"
      aria-labelledby="interest-school-prompt-title"
      data-testid="interest-school-prompt"
    >
      <div className="practice-context-glass flex flex-col gap-5 rounded-[1.25rem] px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex gap-4">
          <span
            className="grid size-11 shrink-0 place-items-center rounded-[.9rem] bg-[color-mix(in_srgb,var(--brand)_12%,transparent)] text-[var(--brand)]"
            aria-hidden
          >
            <Search className="size-5" />
          </span>
          <div>
            <p className="student-kicker text-[var(--brand)]">관심 학교</p>
            <h2
              id="interest-school-prompt-title"
              className="mt-1 text-xl font-bold tracking-[-.04em]"
            >
              관심 학교를 선택하면 준비 지도가 시작돼요.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              학교별 지원 흐름과 모집 인원을 먼저 보고, 내 자소서와 질문 연습의
              우선순위를 이어서 확인할 수 있어요.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-[var(--text-primary)] px-5 text-xs font-bold text-[var(--canvas)] transition-transform hover:-translate-y-0.5"
        >
          학교 찾기 <Search className="size-3.5" />
        </button>
      </div>
    </section>
  );
}
