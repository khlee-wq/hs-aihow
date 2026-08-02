import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] py-10 text-xs leading-6 text-[var(--text-tertiary)]">
      <div className="page-wrap grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div><Logo /><p className="mt-4">주식회사 에스씨에이아이하우 · 대표 이사 Adam Lee<br />고입 준비 과정의 판단과 실행을 돕는 교육 플랫폼</p></div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end"><Link href="/privacy">개인정보 처리방침</Link><Link href="/terms">이용약관</Link><span>© 2026 AIHOW</span></div>
      </div>
    </footer>
  );
}
