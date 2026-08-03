import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function PublicHeader() {
  return (
    <header className="pointer-events-none sticky top-3 z-40 px-[var(--space-page)]">
      <div className="liquid-glass pointer-events-auto mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-4 rounded-[1.25rem] px-4 sm:px-5">
        <Logo />
        <nav
          className="hidden items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--surface-muted)_62%,transparent)] p-1 text-sm font-bold text-[var(--text-secondary)] md:flex"
          aria-label="공개 메뉴"
        >
          <Link
            className="rounded-full px-4 py-2 transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            href="/#products"
          >
            상품
          </Link>
          <Link
            className="rounded-full px-4 py-2 transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            href="/#journey"
          >
            준비 과정
          </Link>
          <Link
            className="rounded-full px-4 py-2 transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            href="/#experts"
          >
            전문가 기준
          </Link>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Link
            href="/login"
            className="hidden min-h-10 items-center px-3 text-sm font-bold sm:inline-flex"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="hairline-top inline-flex min-h-10 items-center gap-1.5 rounded-[var(--radius-md)] bg-[var(--brand)] px-4 text-sm font-bold text-white shadow-[0_10px_24px_color-mix(in_srgb,var(--brand)_22%,transparent)]"
          >
            시작하기 <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
