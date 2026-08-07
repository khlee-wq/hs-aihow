"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  BarChart3,
  BookmarkCheck,
  BookOpenText,
  FileText,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  MessageSquareText,
  Mic2,
  School,
  ShieldCheck,
  Sparkles,
  CloudCheck,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { DemoSession } from "@/lib/session-shared";
import { cn } from "@/lib/utils";
import { SessionLifecycle } from "@/features/session/session-lifecycle";
import { ProfileMenu } from "./profile-menu";
import { ThemeToggle } from "./theme-toggle";

const studentNav = [
  {
    href: "/dashboard",
    label: "입시 지도",
    mobileLabel: "지도",
    icon: LayoutDashboard,
  },
  { href: "/applications/demo/essay", label: "자소서", icon: FileText },
  {
    href: "/applications/demo/practice",
    label: "질문 연습",
    icon: MessageSquareText,
  },
  { href: "/applications/demo/mock-interview", label: "모의면접", icon: Mic2 },
  {
    href: "/applications/demo/cheat-sheet",
    label: "파이널 노트",
    icon: BookOpenText,
  },
];

const adminNav = [
  { href: "/admin", label: "수업 개요", mobileLabel: "수업", icon: Gauge },
  {
    href: "/admin/questions",
    label: "질문 설계",
    mobileLabel: "질문",
    icon: MessageSquareText,
  },
  {
    href: "/admin/prompts",
    label: "수업 기준",
    mobileLabel: "기준",
    icon: Sparkles,
  },
  {
    href: "/admin/videos",
    label: "영상 연결",
    mobileLabel: "영상",
    icon: Video,
  },
  {
    href: "/admin/schools",
    label: "학교 데이터",
    mobileLabel: "학교",
    icon: School,
  },
  {
    href: "/admin/metrics",
    label: "학습 인사이트",
    mobileLabel: "인사이트",
    icon: BarChart3,
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin" || href === "/dashboard") return pathname === href;
  return pathname.startsWith(href);
}

type MobileNavItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  mobileLabel?: string;
};

function MobileBottomNavigation({
  ariaLabel,
  items,
  pathname,
  testId,
  tour,
}: {
  ariaLabel: string;
  items: MobileNavItem[];
  pathname: string;
  testId: string;
  tour: string;
}) {
  const [motion, setMotion] = useState<"idle" | "moving">("idle");
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousPathname = useRef(pathname);
  const activeIndex = Math.max(
    items.findIndex(({ href }) => isActive(pathname, href)),
    0,
  );

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    const previousIndex = Math.max(
      items.findIndex(({ href }) => isActive(previousPathname.current, href)),
      0,
    );
    previousPathname.current = pathname;
    if (timer.current) clearTimeout(timer.current);
    setDirection(activeIndex >= previousIndex ? "forward" : "backward");
    setMotion("moving");
    timer.current = setTimeout(() => setMotion("idle"), 560);
  }, [activeIndex, items, pathname]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const moveHighlight = (targetIndex: number, active: boolean) => {
    if (active) return;
    if (timer.current) clearTimeout(timer.current);
    setDirection(targetIndex >= activeIndex ? "forward" : "backward");
    setMotion("moving");
    timer.current = setTimeout(() => setMotion("idle"), 720);
  };

  return (
    <nav
      className="liquid-bottom-nav app-navigation fixed inset-x-3 bottom-[max(.65rem,env(safe-area-inset-bottom))] z-40 grid px-1.5 py-1.5 lg:hidden"
      aria-label={ariaLabel}
      data-testid={testId}
      data-tour={tour}
      data-active-index={activeIndex}
      data-nav-direction={direction}
      data-nav-motion={motion}
      style={
        {
          "--liquid-nav-count": items.length,
          "--liquid-nav-index": activeIndex,
        } as CSSProperties
      }
    >
      <span className="liquid-nav-highlight" aria-hidden="true" />
      {items.map(({ href, label, mobileLabel, icon: Icon }, index) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            onClick={() => moveHighlight(index, active)}
            className={cn(
              "liquid-nav-item relative z-10 grid min-h-[3.35rem] min-w-0 place-items-center gap-0.5 px-0.5 text-[9.5px] font-semibold tracking-[-.01em]",
              active ? "text-[var(--brand)]" : "text-[var(--text-tertiary)]",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon
              data-menu-icon
              className={cn(
                "size-[17px] transition-transform duration-300",
                active && "-translate-y-px",
              )}
              strokeWidth={active ? 2.6 : 1.9}
            />
            <span className="max-w-full truncate">{mobileLabel ?? label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  children,
  session,
  role,
}: {
  children: React.ReactNode;
  session: DemoSession;
  role: "user" | "admin";
}) {
  const pathname = usePathname();

  if (role === "user") {
    return (
      <StudentShell pathname={pathname} session={session}>
        {children}
      </StudentShell>
    );
  }

  return (
    <ExpertShell pathname={pathname} session={session}>
      {children}
    </ExpertShell>
  );
}

function StudentShell({
  children,
  pathname,
  session,
}: {
  children: React.ReactNode;
  pathname: string;
  session: DemoSession;
}) {
  const isPracticeSession = pathname.endsWith("/practice/session");
  const isMockInterviewSession = pathname.endsWith("/mock-interview/session");
  const isFocusedSession = isPracticeSession || isMockInterviewSession;
  const isLearningIntro =
    pathname.endsWith("/practice") || pathname.endsWith("/mock-interview");
  const isCompactWorkspace =
    isLearningIntro ||
    pathname.endsWith("/essay") ||
    pathname.endsWith("/cheat-sheet");
  if (isFocusedSession) {
    const sessionTitle = isMockInterviewSession ? "모의면접" : "질문 연습";
    const sessionDetail = isMockInterviewSession
      ? "한 질문에 집중하기"
      : "민사고 통합 패키지";
    const sessionExitHref = isMockInterviewSession
      ? "/applications/demo/mock-interview"
      : "/applications/demo/practice";
    return (
      <div
        className="min-h-[100svh] overflow-x-clip bg-[var(--canvas)]"
        data-testid={
          isMockInterviewSession
            ? "student-mock-interview-session-shell"
            : "student-practice-session-shell"
        }
      >
        <header className="pointer-events-none sticky top-3 z-40 px-[var(--space-page)]">
          <div className="liquid-glass pointer-events-auto mx-auto flex h-15 max-w-[88rem] items-center gap-3 rounded-[1.15rem] px-3.5 sm:h-17 sm:px-5">
            <Link
              href={sessionExitHref}
              className="flex shrink-0 items-center gap-2.5 leading-none"
              aria-label={`${sessionTitle} 선택 화면으로 돌아가기`}
            >
              <span className="grid size-7 place-items-center rounded-[var(--radius-xs)] bg-[var(--brand)] text-[10px] font-black text-[var(--text-on-brand)]">
                A
              </span>
              <span className="hidden text-sm font-black tracking-[-.04em] sm:block">
                AIHOW
              </span>
            </Link>
            <span className="h-5 w-px bg-[var(--border)]" />
            <div className="min-w-0">
              <p className="truncate text-xs font-black sm:text-sm">
                {sessionTitle}
              </p>
              <p className="hidden text-[10px] text-[var(--text-tertiary)] sm:block">
                {sessionDetail}
              </p>
            </div>
            {isPracticeSession ? (
              <span className="ml-auto hidden items-center gap-1.5 text-[10px] font-bold text-[var(--success)] sm:inline-flex">
                <CloudCheck className="size-3.5" /> 입력 내용 자동 저장
              </span>
            ) : null}
            <Link
              href={sessionExitHref}
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--brand-soft)] px-3 text-xs font-black text-[var(--brand)] shadow-[inset_0_1px_0_color-mix(in_srgb,white_52%,transparent)] transition-[transform,background] hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--brand-soft)_74%,var(--surface))] sm:px-4"
            >
              <BookmarkCheck className="size-3.5" />
              <span className="sm:hidden">
                {isMockInterviewSession ? "중단" : "저장 후 나가기"}
              </span>
              <span className="hidden sm:inline">
                {isMockInterviewSession
                  ? "중단하고 방식 다시 고르기"
                  : "저장하고 나중에 이어하기"}
              </span>
            </Link>
          </div>
        </header>
        <main className="min-h-[calc(100svh-3.75rem)] sm:min-h-[calc(100svh-4.25rem)]">
          {children}
        </main>
        <SessionLifecycle role="user" />
      </div>
    );
  }

  return (
    <div
      className="min-h-[100svh] bg-[var(--canvas)]"
      data-testid="student-shell"
    >
      <header className="app-navigation pointer-events-none sticky top-3 z-40 px-[var(--space-page)]">
        <div className="liquid-glass workspace-wrap pointer-events-auto flex h-16 items-center gap-4 rounded-[1.25rem] px-4 sm:px-5">
          <Link
            href="/dashboard"
            className="flex shrink-0 items-center gap-2.5 leading-none"
            aria-label="AIHOW 학생 홈"
          >
            <span className="grid size-7 place-items-center rounded-[var(--radius-xs)] bg-[var(--brand)] text-[10px] font-black text-[var(--text-on-brand)] shadow-[0_6px_14px_color-mix(in_srgb,var(--brand)_24%,transparent)]">
              A
            </span>
            <span>
              <span className="block text-[.9rem] font-black tracking-[-.045em]">
                AIHOW
              </span>
            </span>
          </Link>

          <nav
            className="ml-auto hidden items-center gap-1 lg:flex"
            aria-label="학생 메뉴"
            data-testid="student-desktop-nav"
            data-tour="student-menu"
          >
            {studentNav.map(({ href, label }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "student-desktop-nav-link relative inline-flex min-h-10 items-center px-3.5 text-[13px] font-semibold tracking-[-.015em] transition-[color,transform] after:absolute after:inset-x-3.5 after:-bottom-3 after:h-px after:origin-center after:scale-x-0 after:bg-[var(--brand)] after:transition-transform after:duration-300",
                    active
                      ? "text-[var(--text-primary)] after:scale-x-100"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  )}
                >
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-0.5 border-l border-[var(--border)] pl-2 lg:ml-2">
            <Link
              href="/admin"
              className="inline-flex min-h-9 items-center gap-1.5 px-2.5 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
              aria-label="교사 워크스페이스로 전환"
            >
              <ShieldCheck className="size-[16px]" />
              <span className="hidden sm:inline">교사 공간</span>
            </Link>
            <ThemeToggle />
            <ProfileMenu session={session} />
          </div>
        </div>
      </header>

      <main
        className={cn(
          "px-[var(--space-page)] pb-28 pt-8",
          isCompactWorkspace ? "lg:pb-2 lg:pt-4" : "lg:pb-14 lg:pt-10",
        )}
      >
        <div className="workspace-wrap">{children}</div>
      </main>

      <MobileBottomNavigation
        ariaLabel="모바일 학생 메뉴"
        items={studentNav}
        pathname={pathname}
        testId="student-mobile-nav"
        tour="student-menu"
      />
      <SessionLifecycle role="user" />
    </div>
  );
}

function ExpertShell({
  children,
  pathname,
  session,
}: {
  children: React.ReactNode;
  pathname: string;
  session: DemoSession;
}) {
  return (
    <div className="min-h-[100svh] overflow-x-clip bg-[var(--canvas)]">
      <header className="app-navigation pointer-events-none sticky top-3 z-30 px-[var(--space-page)]">
        <div className="teacher-navigation liquid-glass workspace-wrap pointer-events-auto flex min-h-16 items-center gap-4 rounded-[1.25rem] px-4 md:px-5">
          <Link
            href="/admin"
            className="flex shrink-0 items-center gap-2.5 leading-none"
            aria-label="AIHOW 교사 홈"
          >
            <span className="grid size-7 place-items-center rounded-[var(--radius-xs)] bg-[var(--brand)] text-[10px] font-black text-[var(--text-on-brand)] shadow-[0_6px_14px_color-mix(in_srgb,var(--brand)_24%,transparent)]">
              A
            </span>
            <span>
              <span className="block text-[.9rem] font-black tracking-[-.045em]">
                AIHOW
              </span>
            </span>
          </Link>
          <nav
            className="ml-auto hidden items-center gap-0.5 lg:flex"
            aria-label="교사 메뉴"
            data-testid="expert-desktop-nav"
            data-tour="admin-menu"
          >
            {adminNav.map(({ href, label }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative inline-flex min-h-10 items-center px-2.5 text-[12px] font-semibold tracking-[-.02em] transition-[color,transform] after:absolute after:inset-x-2.5 after:bottom-1 after:h-px after:origin-center after:scale-x-0 after:bg-[var(--brand)] after:transition-transform",
                    active
                      ? "text-[var(--text-primary)] after:scale-x-100"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-1 border-l border-[var(--border)] pl-2 lg:ml-1">
            <Link
              href="/dashboard"
              className="inline-flex min-h-10 items-center gap-2 px-2.5 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
              aria-label="학생 화면으로 전환"
            >
              <GraduationCap className="size-[17px]" />
              <span className="hidden sm:inline">학생 화면</span>
            </Link>
            <ThemeToggle />
            <ProfileMenu session={session} />
          </div>
        </div>
      </header>
      <main className="px-[var(--space-page)] py-8 pb-28 md:py-10 lg:pb-12">
        <div className="mx-auto max-w-[92rem]">{children}</div>
      </main>
      <MobileBottomNavigation
        ariaLabel="모바일 교사 메뉴"
        items={adminNav}
        pathname={pathname}
        testId="expert-mobile-nav"
        tour="admin-menu"
      />
      <SessionLifecycle role="admin" />
    </div>
  );
}
