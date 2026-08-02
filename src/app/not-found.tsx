import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() { return <main className="grid min-h-[100svh] place-items-center p-6 text-center"><div><span className="mx-auto grid size-16 place-items-center rounded-[var(--radius-lg)] bg-[var(--brand-soft)] text-[var(--brand)]"><Compass className="size-7" /></span><p className="eyebrow mt-6">404</p><h1 className="heading-lg mt-3">이 경로는 아직 준비되지 않았어요</h1><p className="mt-3 text-sm text-[var(--text-secondary)]">주소를 확인하거나 오늘의 준비 화면으로 돌아가 주세요.</p><Link href="/" className={`${buttonVariants()} mt-7`}><ArrowLeft className="size-4" />홈으로 돌아가기</Link></div></main>; }
