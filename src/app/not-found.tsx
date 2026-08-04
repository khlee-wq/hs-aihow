import Link from "next/link";
import { ArrowLeft, Compass, House, Map, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden px-5 py-10">
      <div className="pointer-events-none absolute -right-24 top-16 size-72 rounded-full bg-[var(--brand-soft)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 size-60 rounded-full bg-[var(--mint-soft)] blur-3xl" />
      <section className="relative w-full max-w-xl text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-[var(--radius-lg)] bg-[var(--brand-soft)] text-[var(--brand)] shadow-[var(--shadow-sm)]">
          <Compass className="size-7" />
        </span>
        <p className="eyebrow mt-7">404 · ROUTE NOT FOUND</p>
        <h1 className="heading-lg mt-3">찾으시는 화면이 없어요</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
          주소가 바뀌었거나, 아직 공개되지 않은 화면일 수 있습니다. 이전에 열어 둔
          링크라면 현재 운영 흐름에 맞는 메뉴에서 다시 시작해 주세요.
        </p>

        <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
          <Link href="/" className="surface surface-interactive flex min-h-24 items-center gap-3 p-4">
            <span className="grid size-10 place-items-center rounded-[var(--radius-sm)] bg-[var(--brand-soft)] text-[var(--brand)]"><House className="size-5" /></span>
            <span><strong className="block text-sm">서비스 소개로 이동</strong><span className="mt-1 block text-xs text-[var(--text-secondary)]">AIHOW의 준비 흐름 확인</span></span>
          </Link>
          <Link href="/login" className="surface surface-interactive flex min-h-24 items-center gap-3 p-4">
            <span className="grid size-10 place-items-center rounded-[var(--radius-sm)] bg-[var(--mint-soft)] text-[var(--success)]"><Sparkles className="size-5" /></span>
            <span><strong className="block text-sm">로그인 화면으로 이동</strong><span className="mt-1 block text-xs text-[var(--text-secondary)]">내 준비 화면 이어가기</span></span>
          </Link>
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-3">
          <Link href="/" className={`${buttonVariants()} min-w-40`}><ArrowLeft className="size-4" />홈으로 돌아가기</Link>
          <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 px-3 text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--brand)]"><Map className="size-4" />오늘의 준비 보기</Link>
        </div>
      </section>
    </main>
  );
}
