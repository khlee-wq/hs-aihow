import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "./logo";

export function PublicHeader() {
  return (
    <header className="pointer-events-none sticky top-3 z-40 px-[var(--space-page)]">
      <div className="public-navigation-glass pointer-events-auto mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-2 rounded-[1.25rem] px-3 sm:gap-4 sm:px-5">
        <div className="shrink-0">
          <Logo />
        </div>
        <nav
          className="hidden items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--surface-muted)_62%,transparent)] p-1 text-sm font-bold text-[var(--text-secondary)] lg:flex"
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
          <Link
            className="rounded-full px-4 py-2 transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
            href="/#pricing"
          >
            요금
          </Link>
        </nav>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Link
            href="/login"
            className="hidden min-h-10 items-center px-3 text-sm font-bold sm:inline-flex"
          >
            로그인
          </Link>
          <Link
            href="/signup"
            className="hairline-top inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[var(--radius-md)] bg-[var(--brand)] px-3 text-sm font-bold text-[var(--text-on-brand)] shadow-[0_10px_24px_color-mix(in_srgb,var(--brand)_22%,transparent)] sm:px-4"
          >
            시작하기 <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
