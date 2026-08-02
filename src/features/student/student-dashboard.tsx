"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, Check, ChevronRight, Clock3, FileText, MessageCircleQuestion, Target } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageSkeleton } from "@/components/ui/skeleton";
import { deriveProgress, journeySteps } from "@/lib/mock-data";
import { sleep } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";

export function StudentDashboard({ name }: { name: string }) {
  const completed = useAppStore((state) => state.completedSteps);
  const { data, isPending } = useQuery({ queryKey: ["student-dashboard"], queryFn: async () => { await sleep(520); return { school: "민족사관고등학교", daysLeft: 42, savedAt: "오늘 오전 10:24" }; } });
  if (isPending || !data) return <PageSkeleton type="dashboard" />;
  const progress = deriveProgress(completed);
  const nextStep = journeySteps.find((step) => !completed.includes(step.id)) ?? journeySteps[journeySteps.length - 1];
  return (
    <div className="space-y-8 float-in">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">Good morning</p><h1 className="heading-lg mt-3">{name}님, 오늘도 한 걸음만 가볼까요?</h1><p className="mt-2 text-sm text-[var(--text-secondary)]">마지막 내용은 {data.savedAt}에 안전하게 저장됐어요.</p></div><div className="flex items-center gap-2 rounded-full bg-[var(--warning-soft)] px-4 py-2 text-xs font-extrabold text-[var(--warning)]"><CalendarDays className="size-4" />면접까지 {data.daysLeft}일</div></header>
      <section className="grid gap-4 lg:grid-cols-[1.55fr_.8fr]">
        <Card className="relative overflow-hidden border-0 bg-[var(--brand)] p-7 text-white shadow-[var(--shadow-md)] sm:p-8"><div className="absolute -right-20 -top-24 size-72 rounded-full bg-white/10" /><p className="text-xs font-black uppercase tracking-[.12em] text-white/65">Today’s next step</p><h2 className="mt-4 max-w-lg text-balance text-2xl font-black leading-tight tracking-[-.04em] sm:text-3xl">{nextStep.title}에서<br />내 답변의 근거를 만들어 보세요.</h2><p className="mt-4 max-w-xl text-sm leading-7 text-white/70">{nextStep.short} 단계는 약 12분 정도 걸려요. 작성 중 나가도 이 기기에 자동 저장됩니다.</p><Link href={nextStep.href} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-sm)] bg-white px-5 text-sm font-black text-[var(--brand-on-white)]">이어서 준비하기 <ArrowRight className="size-4" /></Link></Card>
        <Card className="flex flex-col justify-between"><div><div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-[var(--radius-sm)] bg-[var(--mint-soft)] text-[var(--success)]"><Target /></span><span className="text-3xl font-black tracking-[-.05em]">{progress}%</span></div><h2 className="mt-6 font-extrabold">전체 준비 진행률</h2><p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{journeySteps.length}단계 중 {completed.length}단계를 완료했어요.</p></div><div className="mt-8"><Progress value={progress} /></div></Card>
      </section>
      <section><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-black">나의 준비 경로</h2><p className="mt-1 text-sm text-[var(--text-secondary)]">{data.school} 통합 패키지</p></div></div><div className="grid gap-3 md:grid-cols-5">{journeySteps.map((step, index) => { const done = completed.includes(step.id); const current = nextStep.id === step.id; return <Link key={step.id} href={step.href} className={`group rounded-[var(--radius-md)] border p-4 transition-all ${current ? "border-[var(--brand)] bg-[var(--brand-soft)]" : "border-[var(--border)] bg-[var(--surface)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]"}`}><div className="flex items-center justify-between"><span className={`grid size-7 place-items-center rounded-full text-xs font-black ${done ? "bg-[var(--mint-soft)] text-[var(--success)]" : current ? "bg-[var(--brand)] text-white" : "bg-[var(--surface-muted)] text-[var(--text-tertiary)]"}`}>{done ? <Check className="size-4" /> : index + 1}</span>{current ? <span className="text-[10px] font-black text-[var(--brand)]">NOW</span> : null}</div><h3 className="mt-6 text-sm font-extrabold">{step.title}</h3><p className="mt-1 text-xs text-[var(--text-secondary)]">{step.short}</p></Link>; })}</div></section>
      <section className="grid gap-4 lg:grid-cols-3"><Card><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-[var(--radius-sm)] bg-[var(--coral-soft)] text-[var(--coral)]"><MessageCircleQuestion /></span><div><p className="text-xs font-bold text-[var(--text-tertiary)]">답변할 질문</p><p className="mt-1 text-xl font-black">3개</p></div></div><Link href="/applications/demo/practice" className="mt-6 flex items-center justify-between text-sm font-extrabold">질문 연습 열기 <ChevronRight className="size-4 text-[var(--text-tertiary)]" /></Link></Card><Card><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-[var(--radius-sm)] bg-[var(--brand-soft)] text-[var(--brand)]"><Clock3 /></span><div><p className="text-xs font-bold text-[var(--text-tertiary)]">이번 주 연습</p><p className="mt-1 text-xl font-black">48분</p></div></div><p className="mt-6 text-sm text-[var(--text-secondary)]">지난주보다 16분 더 집중했어요.</p></Card><Card><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-[var(--radius-sm)] bg-[var(--mint-soft)] text-[var(--success)]"><FileText /></span><div><p className="text-xs font-bold text-[var(--text-tertiary)]">자료 보관 상태</p><p className="mt-1 text-xl font-black">안전</p></div></div><Link href="/settings#data" className="mt-6 flex items-center justify-between text-sm font-extrabold">보관·삭제 확인 <ChevronRight className="size-4 text-[var(--text-tertiary)]" /></Link></Card></section>
    </div>
  );
}
