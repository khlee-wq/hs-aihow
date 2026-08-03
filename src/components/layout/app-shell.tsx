"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpenText,
  ClipboardCheck,
  FileText,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  MessageSquareText,
  Mic2,
  School,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import type { DemoSession } from "@/lib/session-shared";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
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
  { href: "/admin", label: "운영 홈", icon: Gauge },
  { href: "/admin/reviews", label: "검수 큐", icon: ClipboardCheck },
  { href: "/admin/questions", label: "질문 기준", icon: MessageSquareText },
  { href: "/admin/prompts", label: "코칭 프롬프트", icon: Sparkles },
  { href: "/admin/videos", label: "영상 가이드", icon: Video },
  { href: "/admin/schools", label: "학교 기준", icon: School },
  { href: "/admin/users", label: "사용자", icon: Users },
  { href: "/admin/metrics", label: "운영 지표", icon: BarChart3 },
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
  role: "student" | "expert";
}) {
  const pathname = usePathname();

  if (role === "student") {
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
              aria-label="운영 화면으로 전환"
            >
              <ShieldCheck className="size-[16px]" />
              <span className="hidden sm:inline">운영 화면</span>
            </Link>
            <ThemeToggle />
            <Link
              href="/settings"
              className="inline-flex min-h-9 items-center justify-center px-2.5 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
              aria-label="설정"
            >
              <Settings className="size-[17px] sm:hidden" />
              <span className="hidden sm:inline">설정</span>
            </Link>
            <Link
              href="/settings"
              className="ml-1 hidden size-8 place-items-center rounded-full border border-[color-mix(in_srgb,var(--mint)_24%,var(--border))] bg-[var(--mint-soft)] text-xs font-black text-[var(--success)] shadow-[var(--shadow-sm)] sm:grid"
              aria-label={`${session.name} 프로필`}
            >
              {session.name.slice(0, 1)}
            </Link>
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
    <div className="min-h-[100svh] overflow-x-hidden bg-[var(--canvas)] md:grid md:grid-cols-[16.5rem_1fr]">
      <aside className="liquid-glass app-navigation sticky top-3 m-3 hidden h-[calc(100svh-1.5rem)] flex-col rounded-[1.25rem] p-4 md:flex">
        <div className="px-2 py-2">
          <Logo />
        </div>
        <div className="mt-6 px-3">
          <span className="eyebrow">Expert operations</span>
        </div>
        <nav
          className="mt-3 grid gap-1"
          aria-label="전문가 메뉴"
          data-testid="expert-desktop-nav"
        >
          {adminNav.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "expert-desktop-nav-link relative flex min-h-11 items-center rounded-[var(--radius-sm)] px-4 text-[13px] font-semibold tracking-[-.01em] transition-[color,background,transform] before:absolute before:left-0 before:h-5 before:w-0.5 before:origin-center before:scale-y-0 before:bg-[var(--brand)] before:transition-transform before:duration-300",
                  active
                    ? "bg-[color-mix(in_srgb,var(--brand-soft)_82%,var(--surface))] text-[var(--brand)] shadow-[inset_0_0_0_1px_var(--border-soft)] before:scale-y-100"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
                )}
                aria-current={active ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto grid gap-2 border-t border-[var(--border)] pt-4">
          <Link
            href="/settings"
            className="expert-desktop-nav-link flex min-h-10 items-center rounded-[var(--radius-sm)] px-4 text-[13px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
          >
            설정
          </Link>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="grid size-9 place-items-center rounded-full bg-[var(--mint-soft)] font-black text-[var(--success)]">
              {session.name.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{session.name}</p>
              <p className="truncate text-xs text-[var(--text-tertiary)]">
                전문가
              </p>
            </div>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="liquid-glass app-navigation sticky top-3 z-30 mx-3 mt-3 flex h-16 items-center justify-between rounded-[1.25rem] px-4 md:mx-[var(--space-page)] md:px-5">
          <div className="md:hidden">
            <Logo compact />
          </div>
          <div className="hidden items-center text-xs font-bold text-[var(--text-secondary)] md:flex">
            2027학년도 운영 기준
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex min-h-10 items-center gap-2 rounded-[var(--radius-sm)] px-3 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
              aria-label="학생 화면으로 전환"
            >
              <GraduationCap className="size-[17px]" />
              <span className="hidden sm:inline">학생 화면</span>
            </Link>
            <ThemeToggle />
            <Link
              href="/settings"
              className="grid size-10 place-items-center rounded-[var(--radius-sm)] hover:bg-[var(--surface-muted)]"
              aria-label="설정"
            >
              <Settings className="size-[18px]" />
            </Link>
          </div>
        </header>
        <nav
          className="liquid-glass app-navigation no-scrollbar sticky top-[5.25rem] z-20 mx-3 flex max-w-[calc(100vw-1.5rem)] gap-1 overflow-x-auto rounded-[1rem] p-1.5 md:hidden"
          aria-label="모바일 전문가 메뉴"
          data-testid="expert-mobile-nav"
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
      </div>
    </div>
  );
}
