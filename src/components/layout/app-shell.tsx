"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
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
  Video,
} from "lucide-react";
import type { DemoSession } from "@/lib/session-shared";
import { cn } from "@/lib/utils";
import { SessionLifecycle } from "@/features/session/session-lifecycle";
import { Logo } from "./logo";
import { ProfileMenu } from "./profile-menu";
import { ThemeToggle } from "./theme-toggle";

const studentNav = [
  { href: "/dashboard", label: "오늘", icon: LayoutDashboard },
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
  { href: "/admin", label: "수업 개요", icon: Gauge },
  { href: "/admin/questions", label: "질문 설계", icon: MessageSquareText },
  { href: "/admin/prompts", label: "코칭 레시피", icon: Sparkles },
  { href: "/admin/videos", label: "영상 연결", icon: Video },
  { href: "/admin/schools", label: "학교 데이터", icon: School },
  { href: "/admin/metrics", label: "학습 인사이트", icon: BarChart3 },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin" || href === "/dashboard") return pathname === href;
  return pathname.startsWith(href);
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
  return (
    <div
      className="min-h-[100svh] bg-[var(--canvas)]"
      data-testid="student-shell"
    >
      <header className="app-navigation pointer-events-none sticky top-3 z-40 px-[var(--space-page)]">
        <div className="liquid-glass pointer-events-auto mx-auto flex h-16 max-w-[96rem] items-center gap-4 rounded-[1.25rem] px-4 sm:px-5">
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
              <span className="mt-1 hidden font-mono text-[.5rem] font-bold tracking-[.14em] text-[var(--text-tertiary)] sm:block">
                PREP OS
              </span>
            </span>
          </Link>

          <div className="hidden h-6 w-px bg-[var(--border)] xl:block" />
          <div className="hidden items-center gap-2 text-[.7rem] font-bold text-[var(--text-secondary)] xl:flex">
            <span className="size-1.5 rounded-full bg-[var(--success)]" />
            민사고 · 2027
          </div>

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

      <main className="px-[var(--space-page)] pb-28 pt-8 lg:pb-14 lg:pt-10">
        <div className="mx-auto max-w-[92rem]">{children}</div>
      </main>

      <nav
        className="liquid-bottom-nav app-navigation fixed inset-x-3 bottom-[max(.65rem,env(safe-area-inset-bottom))] z-40 grid grid-cols-5 px-1.5 py-1.5 lg:hidden"
        aria-label="모바일 학생 메뉴"
        data-testid="student-mobile-nav"
        data-tour="student-menu"
      >
        {studentNav.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "liquid-nav-item relative grid min-h-[3.35rem] place-items-center gap-0.5 text-[9.5px] font-semibold tracking-[-.01em]",
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
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
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
      <header className="teacher-navigation liquid-glass app-navigation sticky top-3 z-30 mx-3 mt-3 flex min-h-16 items-center gap-4 rounded-[1.25rem] px-4 md:mx-[var(--space-page)] md:px-5">
        <div className="shrink-0 sm:hidden"><Logo compact /></div>
        <div className="hidden shrink-0 sm:block"><Logo /></div>
        <div className="hidden min-w-0 border-l border-[var(--border)] pl-4 xl:block">
          <p className="text-xs font-black">교사 워크스페이스</p>
          <p className="mt-0.5 text-[10px] text-[var(--text-tertiary)]">2027학년도 고입 수업 설계</p>
        </div>
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
      </header>
      <nav
        className="teacher-navigation liquid-glass app-navigation no-scrollbar sticky top-[5.25rem] z-20 mx-3 flex max-w-[calc(100vw-1.5rem)] gap-1 overflow-x-auto rounded-[1rem] p-1.5 lg:hidden"
        aria-label="교사 메뉴"
        data-testid="expert-mobile-nav"
        data-tour="admin-menu"
      >
        {adminNav.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-[var(--radius-sm)] px-3 text-xs font-bold",
                active
                  ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                  : "text-[var(--text-secondary)]",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon data-menu-icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <main className="px-[var(--space-page)] py-8 pb-28 md:py-10 md:pb-12">
        <div className="mx-auto max-w-[92rem]">{children}</div>
      </main>
      <SessionLifecycle role="admin" />
    </div>
  );
}
