"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { InterestSchool } from "./interest-school-directory";
import { InterestSchoolSearch } from "./interest-school-search";
import {
  loadInterestSchoolPreference,
  saveInterestSchoolPreference,
} from "./interest-school-preference";

export function InterestSchoolOnboarding() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<InterestSchool | null>(
    null,
  );
  const transitionTimer = useRef<number | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (loadInterestSchoolPreference()) {
        router.replace("/dashboard");
        return;
      }
      setReady(true);
    });
    return () => {
      window.cancelAnimationFrame(frame);
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current);
    };
  }, [router]);

  const chooseSchool = (school: InterestSchool) => {
    if (selectedSchool) return;
    saveInterestSchoolPreference(school);
    window.sessionStorage.setItem(
      "aihow:skip-intro-after-interest-school:v1",
      "true",
    );
    setSelectedSchool(school);
    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    transitionTimer.current = window.setTimeout(
      () => router.replace("/dashboard"),
      reducedMotion ? 0 : 620,
    );
  };

  const chooseLater = () => router.replace("/dashboard");

  if (!ready) return <main className="min-h-[100svh]" aria-busy="true" />;

  return (
    <main
      className="relative min-h-[100svh] overflow-hidden bg-[var(--canvas)] px-5 py-5 text-[var(--text-primary)] sm:px-8 sm:py-8"
      data-testid="interest-school-onboarding"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,color-mix(in_srgb,var(--brand-soft)_78%,transparent),transparent_42%)]" />
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-black tracking-[-.03em]"
          aria-label="AIHOW 홈"
        >
          <span className="grid size-9 place-items-center rounded-[.7rem] bg-[var(--brand)] text-xs text-[var(--text-on-brand)]">
            A
          </span>
          AIHOW
        </Link>
        <button
          type="button"
          onClick={chooseLater}
          className="min-h-10 px-3 text-sm font-bold text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          나중에 선택하기
        </button>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-5xl items-center justify-center py-10 sm:py-12">
        <div
          className={`w-full transition-[opacity,transform,filter] duration-500 ease-out motion-reduce:transition-none ${
            selectedSchool
              ? "pointer-events-none -translate-y-5 scale-[.98] opacity-0 blur-sm"
              : "translate-y-0 opacity-100"
          }`}
        >
          <div className="mx-auto text-center">
            <h1 className="student-display interest-school-onboarding-title">
              어느 고등학교를 준비하고 있나요?
            </h1>
            <p className="student-lead mx-auto mt-5 max-w-lg text-[var(--text-secondary)]">
              관심 학교를 고르면 지원 흐름과 모집 인원을 바탕으로, 오늘 준비할
              순서를 함께 정리해 드려요.
            </p>
          </div>

          <div className="mx-auto mt-9 max-w-xl">
            <InterestSchoolSearch autoFocus onChoose={chooseSchool} />
            <p className="mt-4 text-center text-xs leading-5 text-[var(--text-tertiary)]">
              학교명 일부만 입력해도 찾을 수 있어요. 선택은 언제든 입시 지도에서
              바꿀 수 있습니다.
            </p>
          </div>
        </div>

        <div
          className={`pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center text-center transition-[opacity,transform] duration-500 motion-reduce:transition-none ${
            selectedSchool ? "opacity-100" : "translate-y-3 opacity-0"
          }`}
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="grid size-14 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)] shadow-[var(--shadow-md)]">
            <Sparkles className="size-5" />
          </span>
          <p className="mt-5 student-kicker text-[var(--brand)]">
            {selectedSchool?.shortName} 준비 지도
          </p>
          <p className="mt-2 text-2xl font-black tracking-[-.045em]">
            준비 지도를 만들고 있어요
          </p>
        </div>
      </section>
    </main>
  );
}
