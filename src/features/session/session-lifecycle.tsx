"use client";

import { Clock3, LogOut, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/lib/session-shared";
import { FirstVisitTour } from "./first-visit-tour";
import {
  loadOnboardingPreference,
  saveOnboardingPreference,
  shouldShowOnboarding,
} from "./onboarding-preferences";
import { loadInterestSchoolPreference } from "@/features/student/interest-school-preference";

const IDLE_LIMIT_MS = 30 * 60 * 1000;
const WARNING_WINDOW_MS = 5 * 60 * 1000;
const INTRO_PREVIEW_KEY = "aihow:intro-preview:v1";
const SKIP_INTRO_AFTER_INTEREST_SCHOOL_KEY =
  "aihow:skip-intro-after-interest-school:v1";

export function SessionLifecycle({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const lastActivity = useRef(0);
  const loggingOut = useRef(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(
    Math.ceil(WARNING_WINDOW_MS / 1000),
  );
  const [introOpen, setIntroOpen] = useState(false);

  const finishLogout = useCallback(async () => {
    if (loggingOut.current) return;
    loggingOut.current = true;
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    window.location.assign("/login?reason=session-expired");
  }, []);

  const continueSession = useCallback(() => {
    lastActivity.current = Date.now();
    setWarningOpen(false);
    setSecondsLeft(Math.ceil(WARNING_WINDOW_MS / 1000));
  }, []);

  useEffect(() => {
    lastActivity.current = Date.now();
    const recordActivity = () => {
      if (!warningOpen) lastActivity.current = Date.now();
    };
    const events: (keyof WindowEventMap)[] = [
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) =>
      window.addEventListener(event, recordActivity, { passive: true }),
    );
    const timer = window.setInterval(() => {
      const remaining = IDLE_LIMIT_MS - (Date.now() - lastActivity.current);
      if (remaining <= 0) {
        void finishLogout();
        return;
      }
      if (remaining <= WARNING_WINDOW_MS) {
        setSecondsLeft(Math.ceil(remaining / 1000));
        setWarningOpen(true);
      }
    }, 1000);
    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, recordActivity),
      );
      window.clearInterval(timer);
    };
  }, [finishLogout, warningOpen]);

  useEffect(() => {
    const showPreview = () => {
      setSecondsLeft(Math.ceil(WARNING_WINDOW_MS / 1000));
      setWarningOpen(true);
    };
    window.addEventListener("aihow:session-warning-preview", showPreview);
    return () =>
      window.removeEventListener("aihow:session-warning-preview", showPreview);
  }, []);

  useEffect(() => {
    const isStartPage =
      (role === "user" && pathname === "/dashboard") ||
      (role === "admin" && pathname === "/admin");
    if (!isStartPage) {
      const frame = window.requestAnimationFrame(() => setIntroOpen(false));
      return () => window.cancelAnimationFrame(frame);
    }
    const frame = window.requestAnimationFrame(() => {
      if (
        role === "user" &&
        window.sessionStorage.getItem(SKIP_INTRO_AFTER_INTEREST_SCHOOL_KEY)
      ) {
        window.sessionStorage.removeItem(SKIP_INTRO_AFTER_INTEREST_SCHOOL_KEY);
        setIntroOpen(false);
        return;
      }
      // 학생은 처음에 관심 학교를 고른 뒤에만 작업공간 안내를 받습니다.
      // 서로 다른 두 모달이 겹쳐 첫 진입의 선택 흐름을 방해하지 않게 합니다.
      if (role === "user" && !loadInterestSchoolPreference()) {
        setIntroOpen(false);
        return;
      }
      if (window.sessionStorage.getItem(INTRO_PREVIEW_KEY) === role) {
        window.sessionStorage.removeItem(INTRO_PREVIEW_KEY);
        setIntroOpen(true);
        return;
      }
      if (shouldShowOnboarding(loadOnboardingPreference(role)))
        setIntroOpen(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, role]);

  useEffect(() => {
    const showPreview = () => {
      const isStartPage =
        (role === "user" && pathname === "/dashboard") ||
        (role === "admin" && pathname === "/admin");
      if (isStartPage) {
        setIntroOpen(true);
        return;
      }
      window.sessionStorage.setItem(INTRO_PREVIEW_KEY, role);
      window.location.assign(role === "user" ? "/dashboard" : "/admin");
    };
    window.addEventListener("aihow:intro-preview", showPreview);
    return () => window.removeEventListener("aihow:intro-preview", showPreview);
  }, [pathname, role]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const dismissIntro = () => setIntroOpen(false);
  const postponeIntro = () => {
    saveOnboardingPreference(role, {
      dismissedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
    dismissIntro();
  };
  const neverShowIntro = () => {
    saveOnboardingPreference(role, { neverShowAgain: true });
    dismissIntro();
  };
  const completeIntro = () => {
    saveOnboardingPreference(role, { completedAt: new Date().toISOString() });
    dismissIntro();
  };

  return (
    <>
      <FirstVisitTour
        role={role}
        open={introOpen}
        onClose={dismissIntro}
        onComplete={completeIntro}
        onPostpone={postponeIntro}
        onNever={neverShowIntro}
      />

      <AppDialog
        open={warningOpen}
        onClose={continueSession}
        eyebrow="Session protection"
        title="잠시 후 자동 로그아웃됩니다"
        purpose="session"
      >
        <div className="mt-6 flex items-start gap-4 border-y border-[var(--border)] py-5">
          <span className="grid size-10 shrink-0 place-items-center bg-[var(--warning-soft)] text-[var(--warning)]">
            <Clock3 className="size-5" />
          </span>
          <div>
            <p className="font-mono text-2xl font-bold tracking-[-.05em] text-[var(--text-primary)]">
              {minutes}:{seconds}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              활동이 없으면 열어 둔 준비 화면을 보호하기 위해 자동으로
              로그아웃합니다. 계속 이용하면 세션이 연장됩니다.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => void finishLogout()}>
            <LogOut className="size-4" /> 지금 로그아웃
          </Button>
          <Button onClick={continueSession}>
            <ShieldCheck className="size-4" /> 계속 준비하기
          </Button>
        </div>
      </AppDialog>
    </>
  );
}
