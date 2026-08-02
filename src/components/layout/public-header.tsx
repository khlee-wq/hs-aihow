import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--canvas)_88%,transparent)] backdrop-blur-xl">
      <div className="page-wrap flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-bold text-[var(--text-secondary)] md:flex" aria-label="공개 메뉴">
          <Link href="/#products">상품</Link><Link href="/#journey">준비 과정</Link><Link href="/#experts">전문가 기준</Link>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Link href="/login" className="hidden min-h-10 items-center px-3 text-sm font-bold sm:inline-flex">로그인</Link>
          <Link href="/signup" className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--brand)] px-4 text-sm font-bold text-white">시작하기 <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </header>
  );
}
