"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpenText,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  MessageSquareText,
  Mic2,
  School,
  Settings,
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
  const nav = role === "student" ? studentNav : adminNav;
  return (
    <div className="min-h-[100svh] bg-[var(--canvas)] md:grid md:grid-cols-[15.5rem_1fr]">
      <aside className="app-navigation sticky top-0 hidden h-[100svh] flex-col border-r border-[var(--border)] bg-[var(--surface)] p-4 md:flex">
        <div className="px-2 py-2">
          <Logo />
        </div>
        <div className="mt-6 px-3">
          <span className="eyebrow">
            {role === "student" ? "Student journey" : "Expert operations"}
          </span>
        </div>
        <nav
          className="mt-3 grid gap-1"
          aria-label={role === "student" ? "학생 메뉴" : "전문가 메뉴"}
        >
          {nav.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin" || href === "/dashboard"
                ? pathname === href
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-[var(--radius-sm)] px-3 text-sm font-bold transition-colors",
                  active
                    ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-[18px]" strokeWidth={2.2} />
                {label}
                {active ? <ChevronRight className="ml-auto size-4" /> : null}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto grid gap-2 border-t border-[var(--border)] pt-4">
          <Link
            href="/settings"
            className="flex min-h-10 items-center gap-3 rounded-[var(--radius-sm)] px-3 text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
          >
            <Settings className="size-[18px]" />
            설정
          </Link>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="grid size-9 place-items-center rounded-full bg-[var(--mint-soft)] font-black text-[var(--success)]">
              {session.name.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{session.name}</p>
              <p className="truncate text-xs text-[var(--text-tertiary)]">
                {role === "student" ? "학생·학부모" : "전문가"}
              </p>
            </div>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="app-navigation sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--canvas)_90%,transparent)] px-4 backdrop-blur-xl md:px-8">
          <div className="md:hidden">
            <Logo compact />
          </div>
          <div className="hidden items-center gap-2 text-xs font-bold text-[var(--text-secondary)] md:flex">
            <GraduationCap className="size-4 text-[var(--brand)]" />
            {role === "student"
              ? "민사고 통합 패키지 · 준비 중"
              : "2027학년도 운영 기준"}
          </div>
          <div className="ml-auto flex items-center gap-2">
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
        {role === "expert" ? (
          <nav
            className="app-navigation no-scrollbar sticky top-16 z-20 flex gap-1 overflow-x-auto border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--canvas)_94%,transparent)] px-3 py-2 backdrop-blur-xl md:hidden"
            aria-label="모바일 전문가 메뉴"
          >
            {adminNav.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/admin"
                  ? pathname === href
                  : pathname.startsWith(href);
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
                  <Icon className="size-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        ) : null}
        <main className="px-[var(--space-page)] py-7 pb-28 md:py-10 md:pb-12">
          <div className="mx-auto max-w-[74rem]">{children}</div>
        </main>
      </div>
      {role === "student" ? (
        <nav
          className="app-navigation fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-1 pb-[max(.45rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden"
          aria-label="모바일 학생 메뉴"
        >
          {studentNav.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/dashboard"
                ? pathname === href
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "grid min-h-12 place-items-center gap-0.5 rounded-[var(--radius-xs)] text-[10px] font-bold",
                  active
                    ? "text-[var(--brand)]"
                    : "text-[var(--text-tertiary)]",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className={cn("size-5", active && "stroke-[2.7]")} />
                {label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
