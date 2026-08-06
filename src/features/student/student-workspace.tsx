"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Eye,
  Lightbulb,
  Mic2,
  ScanSearch,
  Scale,
  RotateCcw,
  ShieldCheck,
  Square,
  UploadCloud,
  Waves,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { analysisPoints, journeySteps } from "@/lib/mock-data";
import { cn, sleep } from "@/lib/utils";
import { type JourneyStep, useAppStore } from "@/stores/app-store";
import { StudentCoachGuide } from "@/features/video-guides/student-coach-guide";
import { QuestionPracticeIntro } from "./question-practice-intro";
import { LearningIntroHero } from "./learning-intro-hero";
import {
  demoFinalNoteDocument,
  FinalNotePaper,
  FinalNotePreviewDialog,
} from "./final-note-preview";

export function StudentWorkspace({ step }: { step: JourneyStep }) {
  const normalizedStep = step;
  const completed = useAppStore((state) => state.completedSteps);
  const meta = journeySteps.find((item) => item.id === normalizedStep)!;

  if (normalizedStep === "essay") return <EssayStep />;
  if (normalizedStep === "practice") return <QuestionPracticeIntro />;
  if (normalizedStep === "mock-interview") return <MockInterviewStep />;
  if (normalizedStep === "cheat-sheet") return <CheatSheetStep />;

  return (
    <div className="grid gap-6 xl:grid-cols-[13rem_minmax(0,1fr)]">
      <aside className="no-print hidden xl:block">
        <div className="sticky top-24">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-2 text-xs font-extrabold text-[var(--text-secondary)]"
          >
            <ArrowLeft className="size-4" />
            오늘의 준비
          </Link>
          <nav className="grid gap-1" aria-label="준비 단계">
            {journeySteps.map((item, index) => {
              const active = item.id === normalizedStep;
              const done = completed.includes(item.id);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-3 text-xs font-bold",
                    active
                      ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]",
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-black",
                      done
                        ? "bg-[var(--mint-soft)] text-[var(--success)]"
                        : "bg-[var(--surface-muted)] text-[var(--text-tertiary)]",
                    )}
                  >
                    {done ? <Check className="size-3.5" /> : index + 1}
                  </span>
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
      <div className="min-w-0 float-in">
        <header className="mb-7">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[var(--text-tertiary)]">
            <span>민사고 통합 패키지</span>
            <ChevronRight className="size-3" />
            <span className="text-[var(--brand)]">{meta.title}</span>
          </div>
          <h1 className="heading-lg">{meta.title}</h1>
          <div className="mt-4 xl:hidden">
            <Progress
              value={
                (journeySteps.findIndex((item) => item.id === normalizedStep) +
                  1) *
                20
              }
              label={`${journeySteps.findIndex((item) => item.id === normalizedStep) + 1}/5 단계`}
            />
          </div>
        </header>
        <AnalysisStep />
      </div>
    </div>
  );
}

function EssayStep() {
  const [status, setStatus] = useState<"ready" | "uploading" | "review">(
    "review",
  );
  const [progress, setProgress] = useState(100);
  const completeStep = useAppStore((state) => state.completeStep);
  const simulateUpload = async () => {
    setStatus("uploading");
    setProgress(12);
    for (const value of [34, 58, 79, 100]) {
      await sleep(280);
      setProgress(value);
    }
    await sleep(220);
    setStatus("review");
  };
  if (status === "ready")
    return (
      <section className="practice-session-canvas liquid-glass-group relative grid min-h-[calc(100svh-7rem)] place-items-center overflow-hidden rounded-[2rem] px-5 py-12 text-center sm:px-8">
        <LearningIntroHero
          icon={UploadCloud}
          eyebrow="자소서 원문 확인"
          title="자소서 문장부터 정확히 확인할게요"
          copy="업로드한 문장을 먼저 확인한 뒤, 면접에서 근거로 사용할 경험을 찾아갑니다. PDF 원본은 데모 서버에 남지 않아요."
          titleId="essay-upload-title"
        >
          <Button className="mt-7" size="lg" onClick={simulateUpload}>
            <UploadCloud className="size-4" />
            데모 PDF 업로드
          </Button>
          <p className="mt-4 text-[11px] text-[var(--text-tertiary)]">
            PDF · 최대 10MB · 추출 후 직접 확인
          </p>
        </LearningIntroHero>
      </section>
    );
  if (status === "uploading")
    return (
      <section className="practice-session-canvas liquid-glass-group relative grid min-h-[calc(100svh-7rem)] place-items-center overflow-hidden rounded-[2rem] px-5 py-12">
        <LearningIntroHero
          icon={FileText}
          eyebrow="자소서 확인 중"
          title="자소서의 흐름을 읽고 있어요"
          copy="페이지, 문단, 강조할 경험을 순서대로 확인합니다."
          titleId="essay-processing-title"
        >
          <div className="practice-question-glass mt-8 rounded-[1.2rem] p-5 text-left">
            <Progress value={progress} label="텍스트 추출" />
          </div>
          <Button
            variant="ghost"
            className="mt-5"
            onClick={() => setStatus("ready")}
          >
            업로드 취소
          </Button>
        </LearningIntroHero>
      </section>
    );
  return (
    <section className="student-one-page-workspace practice-session-canvas liquid-glass-group relative flex flex-col overflow-hidden rounded-[2rem] px-4 py-7 sm:px-7 sm:py-9 lg:px-7">
      <div className="workspace-page-content relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <LearningIntroHero
          icon={FileText}
          eyebrow="자소서 원문"
          title="자소서 문장을 면접의 근거로 바꿔볼게요"
          copy="추출된 원문을 먼저 확인하고, 설명이 더 필요한 표현은 다음 분석과 질문 연습으로 연결합니다."
          titleId="essay-workspace-title"
        />

        <article
          className="practice-question-glass workspace-page-panel mt-7 flex flex-1 flex-col overflow-hidden rounded-[1.7rem] lg:mt-3"
          data-motion-reveal
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[color-mix(in_srgb,var(--text-primary)_7%,transparent)] px-5 py-4 sm:px-7">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-[.85rem] bg-[var(--coral-soft)] text-[var(--coral)]">
                  <FileText className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-extrabold">
                    민사고_자기소개서_최종.pdf
                  </p>
                  <p className="text-[11px] text-[var(--text-tertiary)]">
                    3페이지 · 원본 7일 뒤 자동 삭제
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStatus("ready")}
                className="cursor-pointer text-xs font-black text-[var(--brand)]"
              >
                다른 파일로 바꾸기
              </button>
            </div>
            <WorkspaceStatus
              icon={CheckCircle2}
              title="원문 확인 완료"
              detail="3페이지 · 문단 구조 확인"
            />
          </div>
          <div className="workspace-panel-scroll grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="space-y-5 p-6 text-sm leading-8 sm:p-8 lg:space-y-3 lg:p-6 lg:leading-7">
              <p>
                <mark className="bg-[color-mix(in_srgb,var(--brand-soft)_72%,transparent)] px-1.5 py-0.5 text-[var(--text-primary)]">
                  과학 동아리에서 수질에 따른 식물 생장 차이를 탐구했습니다.
                </mark>{" "}
                처음에는 결과가 예상과 달라 당황했지만, 팀원들과 온도와 빛의
                양을 다시 기록하며 변인을 하나씩 점검했습니다.
              </p>
              <p>
                이 과정에서 정답을 빠르게 찾는 것보다 관찰한 내용을 정확히
                남기고 질문을 바꾸는 일이 중요하다는 것을 배웠습니다.
              </p>
              <p>
                <mark className="bg-[color-mix(in_srgb,var(--warning-soft)_78%,transparent)] px-1.5 py-0.5 text-[var(--text-primary)]">
                  다양한 탐구 활동을 이어가고 싶어 민사고에 지원했습니다.
                </mark>{" "}
                스스로 계획하고 동료와 지식을 나누는 환경에서 과학적 질문을 더
                깊게 발전시키고 싶습니다.
              </p>
            </div>
            <aside className="border-t border-[color-mix(in_srgb,var(--text-primary)_7%,transparent)] bg-[color-mix(in_srgb,var(--brand-soft)_32%,transparent)] p-6 lg:border-l lg:border-t-0 lg:p-6">
              <p className="student-kicker text-[9px] text-[var(--brand)]">
                다음 준비
              </p>
              <h2 className="mt-3 text-lg font-black">
                한 문장만 더 구체적으로
              </h2>
              <p className="mt-3 text-xs leading-6 text-[var(--text-secondary)]">
                “다양한 탐구 활동”이 내 경험과 어떻게 이어지는지 다음 분석
                단계에서 살펴볼게요.
              </p>
              <dl className="mt-7 divide-y divide-[color-mix(in_srgb,var(--text-primary)_7%,transparent)] border-y border-[color-mix(in_srgb,var(--text-primary)_7%,transparent)] text-xs lg:mt-4">
                {[
                  ["원본", "임시 보관"],
                  ["추출문", "이 기기 데모"],
                  ["외부 전송", "없음"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3 py-3">
                    <dt className="text-[var(--text-secondary)]">{label}</dt>
                    <dd className="font-black">{value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
          <footer className="flex flex-col items-center gap-3 border-t border-[color-mix(in_srgb,var(--text-primary)_7%,transparent)] px-5 py-5 text-center sm:px-7 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:py-3">
            <p className="max-w-xl text-[11px] leading-5 text-[var(--text-secondary)] lg:text-left">
              표시된 문장은 다음 분석에서 질문의 근거로 사용됩니다.
            </p>
            <Link
              href="/applications/demo/analysis"
              onClick={() => completeStep("essay")}
              className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--brand)] px-6 text-sm font-black text-[var(--text-on-brand)]"
            >
              내용 확인 완료 <ArrowRight className="size-4" />
            </Link>
            <span className="hidden lg:block" aria-hidden />
          </footer>
        </article>
      </div>
    </section>
  );
}

function AnalysisStep() {
  const completeStep = useAppStore((state) => state.completeStep);
  return (
    <div className="space-y-5">
      <Card className="surface-contrast border-0">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[var(--mint)]">
              Attention map
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-[-.04em]">
              면접 질문으로 이어질 포인트 3개
            </h2>
            <p className="mt-2 text-sm leading-6 opacity-60">
              자소서 문장과 전문가 기준을 함께 보고 우선순위를 정했어요.
            </p>
          </div>
          <div className="grid size-24 shrink-0 place-items-center rounded-full border-[10px] border-[var(--mint)] text-center">
            <div>
              <strong className="text-2xl">78</strong>
              <p className="text-[10px] opacity-60">준비도</p>
            </div>
          </div>
        </div>
      </Card>
      <div className="grid gap-4">
        {analysisPoints.map((point, index) => (
          <Card
            key={point.title}
            className="grid gap-5 md:grid-cols-[3rem_1fr_auto] md:items-center"
          >
            <span
              className={cn(
                "grid size-11 place-items-center rounded-full font-black",
                point.type === "강점"
                  ? "bg-[var(--mint-soft)] text-[var(--success)]"
                  : "bg-[var(--warning-soft)] text-[var(--warning)]",
              )}
            >
              {index + 1}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-black">{point.title}</h3>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[10px] font-black",
                    point.type === "강점"
                      ? "bg-[var(--mint-soft)] text-[var(--success)]"
                      : "bg-[var(--warning-soft)] text-[var(--warning)]",
                  )}
                >
                  {point.type}
                </span>
              </div>
              <p className="mt-3 rounded-[var(--radius-sm)] bg-[var(--surface-muted)] p-3 text-xs leading-6 text-[var(--text-secondary)]">
                “{point.evidence}”
              </p>
            </div>
            <div className="text-right">
              <strong className="text-2xl font-black">{point.score}</strong>
              <p className="text-[10px] text-[var(--text-tertiary)]">
                근거 명확도
              </p>
            </div>
          </Card>
        ))}
      </div>
      <Card className="border-[color-mix(in_srgb,var(--brand)_35%,var(--border))] bg-[var(--brand-soft)]">
        <div className="flex gap-4">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-[var(--brand)]" />
          <div>
            <h3 className="font-extrabold">
              다음 질문 연습에서 이렇게 연결해요
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
              탐구 과정의 강점은 유지하고, 학교 선택과 협업 경험은 구체적인
              행동을 묻는 꼬리질문으로 보완합니다.
            </p>
          </div>
        </div>
      </Card>
      <StudentCoachGuide stage="analysis" />
      <div className="flex justify-between">
        <Link
          href="/applications/demo/essay"
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--text-secondary)]"
        >
          <ChevronLeft className="size-4" />
          이전
        </Link>
        <Link
          href="/applications/demo/practice"
          onClick={() => completeStep("analysis")}
          className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--brand)] px-6 text-sm font-black text-[var(--text-on-brand)]"
        >
          질문 연습 시작 <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

type PersonaId = "coach" | "panel" | "pressure";
const personas: {
  id: PersonaId;
  name: string;
  description: string;
  pace: string;
  tone: string;
}[] = [
  {
    id: "coach",
    name: "차분한 코치",
    description: "답변을 끝까지 듣고 생각을 정리하도록 기다려 줘요.",
    pace: "여유",
    tone: "격려형",
  },
  {
    id: "panel",
    name: "학교 면접 위원",
    description: "근거와 구체성을 중심으로 균형 있게 질문해요.",
    pace: "보통",
    tone: "표준형",
  },
  {
    id: "pressure",
    name: "깊이 묻는 위원",
    description: "답변의 빈틈을 짚고 여러 단계의 꼬리질문을 해요.",
    pace: "빠름",
    tone: "집중형",
  },
];
const personaIcons = [Waves, Scale, ScanSearch] as const;

function withInstrumentalParticle(value: string) {
  const lastCharacter = value.charCodeAt(value.length - 1);
  const isHangulSyllable = lastCharacter >= 0xac00 && lastCharacter <= 0xd7a3;
  const hasFinalConsonant =
    isHangulSyllable && (lastCharacter - 0xac00) % 28 !== 0;

  return `${value}${hasFinalConsonant ? "으로" : "로"}`;
}

type InterviewPhase =
  "select" | "ready" | "recording" | "follow-up" | "feedback";
type InterviewRound = "core" | "follow-up";

const interviewFlow = [
  ["준비 확인", "방식과 질문 확인"],
  ["핵심 질문", "첫 답변 말하기"],
  ["꼬리질문", "근거 한 단계 더"],
  ["말하기 점검", "구조와 전달 확인"],
  ["피드백", "다음 연습 결정"],
] as const;

function InterviewFlow({
  phase,
  round,
}: {
  phase: InterviewPhase;
  round: InterviewRound;
}) {
  const current =
    phase === "select" || phase === "ready"
      ? 0
      : phase === "recording" && round === "core"
        ? 1
        : phase === "follow-up" ||
            (phase === "recording" && round === "follow-up")
          ? 2
          : phase === "feedback"
            ? 4
            : 3;
  return (
    <nav
      aria-label="모의면접 진행 단계"
      className="practice-question-glass interview-flow overflow-hidden rounded-[1.35rem]"
    >
      <ol className="grid grid-cols-5">
        {interviewFlow.map(([title, description], index) => (
          <li
            key={title}
            aria-current={index === current ? "step" : undefined}
            className={cn(
              "relative min-w-0 border-r border-[color-mix(in_srgb,var(--text-primary)_6%,transparent)] px-2 py-3 last:border-r-0 sm:px-4",
              index === current &&
                "bg-[color-mix(in_srgb,var(--brand-soft)_72%,transparent)] shadow-[inset_0_1px_0_color-mix(in_srgb,white_54%,transparent)]",
            )}
          >
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full font-mono text-[9px] font-black",
                index <= current
                  ? "bg-[var(--brand)] text-[var(--text-on-brand)]"
                  : "bg-[color-mix(in_srgb,var(--surface-raised)_60%,transparent)] text-[var(--text-tertiary)]",
              )}
            >
              {index < current ? <Check className="size-3" /> : index + 1}
            </span>
            <strong className="mt-2 block break-keep text-[10px] leading-4 sm:text-xs">
              {title}
            </strong>
            <span className="mt-1 hidden text-[11px] text-[var(--text-secondary)] sm:block">
              {description}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function MockInterviewStep() {
  const selected = useAppStore((state) => state.selectedPersona);
  const selectPersona = useAppStore((state) => state.selectPersona);
  const completeStep = useAppStore((state) => state.completeStep);
  const [phase, setPhase] = useState<InterviewPhase>("select");
  const [round, setRound] = useState<InterviewRound>("core");
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (phase !== "recording") return;
    const timer = window.setInterval(
      () => setSeconds((value) => value + 1),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [phase]);
  const persona = personas.find((item) => item.id === selected)!;
  if (phase === "select")
    return (
      <section
        className="practice-session-canvas learning-intro-shell mock-interview-intro-shell liquid-glass-group relative overflow-hidden rounded-[2rem] px-4 py-8 sm:px-7 sm:py-11 lg:px-8 lg:py-4"
        aria-labelledby="mock-interview-intro-title"
        data-testid="mock-interview-intro"
      >
        <LearningIntroHero
          icon={Mic2}
          eyebrow="말하기 연습"
          title="오늘은 어떤 방식으로 말하기를 연습할까요?"
          copy="난이도를 고르는 대신, 지금 보완하고 싶은 말하기 감각을 선택하세요. 같은 경험도 질문 방식에 따라 다른 답을 끌어낼 수 있어요."
          titleId="mock-interview-intro-title"
        />

        <InterviewFlow phase={phase} round={round} />

        <div
          className="practice-question-glass mock-interview-picker relative z-10 flex min-h-0 flex-col overflow-hidden rounded-[1.6rem]"
          data-motion-reveal
        >
          <div className="mock-interview-picker-head flex items-center justify-between gap-4 border-b border-[color-mix(in_srgb,var(--text-primary)_6%,transparent)] px-5 py-3 sm:px-6">
            <div>
              <p className="text-xs font-black">오늘의 말하기 감각</p>
              <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                선택한 방식은 연습 중 언제든 바꿀 수 있어요.
              </p>
            </div>
            <span className="shrink-0 font-mono text-[10px] font-black text-[var(--brand)]">
              {persona.name} 선택
            </span>
          </div>

          <div
            className="mock-interview-options grid min-h-0 flex-1 divide-y divide-[color-mix(in_srgb,var(--text-primary)_6%,transparent)] md:grid-cols-3 md:divide-x md:divide-y-0"
            role="group"
            aria-label="연습 방식 선택"
          >
            {personas.map((item, index) => {
              const PersonaIcon = personaIcons[index];
              const active = selected === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => selectPersona(item.id)}
                  className={cn(
                    "mock-interview-option relative flex min-w-0 cursor-pointer flex-col px-5 py-4 text-left transition-[background,transform,box-shadow] sm:px-6",
                    active
                      ? "bg-[color-mix(in_srgb,var(--brand-soft)_56%,transparent)] shadow-[inset_0_1px_0_color-mix(in_srgb,white_54%,transparent)]"
                      : "hover:bg-[color-mix(in_srgb,var(--surface-raised)_34%,transparent)]",
                  )}
                  aria-pressed={active}
                  data-motion-item
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        "grid size-10 place-items-center rounded-[.9rem] shadow-[inset_0_1px_0_color-mix(in_srgb,white_52%,transparent)]",
                        index === 0
                          ? "bg-[var(--mint-soft)] text-[var(--success)]"
                          : index === 1
                            ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                            : "bg-[var(--coral-soft)] text-[var(--coral)]",
                      )}
                    >
                      <PersonaIcon className="size-5" />
                    </span>
                    <span
                      className={cn(
                        "grid size-6 place-items-center rounded-full transition-colors",
                        active
                          ? "bg-[var(--brand)] text-[var(--text-on-brand)]"
                          : "bg-[color-mix(in_srgb,var(--surface-raised)_64%,transparent)] text-[var(--text-tertiary)]",
                      )}
                    >
                      {active ? (
                        <Check className="size-3.5" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-current" />
                      )}
                    </span>
                  </div>
                  <h2 className="mt-4 text-base font-black sm:text-lg">
                    {item.name}
                  </h2>
                  <p className="mt-2 break-keep text-xs leading-5 text-[var(--text-secondary)] sm:text-sm sm:leading-6">
                    {item.description}
                  </p>
                  <div className="mt-auto flex gap-2 pt-4">
                    <span className="rounded-full bg-[color-mix(in_srgb,var(--surface-raised)_62%,transparent)] px-2.5 py-1 text-[10px] font-black">
                      호흡 {item.pace}
                    </span>
                    <span className="rounded-full bg-[color-mix(in_srgb,var(--surface-raised)_62%,transparent)] px-2.5 py-1 text-[10px] font-black">
                      질문 {item.tone}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mock-interview-picker-footer flex flex-col gap-3 border-t border-[color-mix(in_srgb,var(--text-primary)_6%,transparent)] px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="break-keep text-[11px] leading-5 text-[var(--text-secondary)]">
              선택한 방식으로 핵심 질문 1개와 이어지는 질문 1개를 연습합니다.
            </p>
            <Button
              size="lg"
              className="shrink-0"
              onClick={() => {
                setRound("core");
                setPhase("ready");
              }}
            >
              {withInstrumentalParticle(persona.name)} 시작하기
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>
    );
  if (phase === "feedback")
    return (
      <div className="space-y-5">
        <InterviewFlow phase={phase} round={round} />
        <Card className="text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--mint-soft)] text-[var(--success)]">
            <CheckCircle2 className="size-8" />
          </span>
          <p className="eyebrow mt-6">Practice complete</p>
          <h2 className="mt-3 text-2xl font-black">
            첫 답변을 끝까지 잘 말했어요
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[var(--text-secondary)]">
            핵심 경험은 분명했어요. 지원 학교와의 연결을 한 문장만 더 구체적으로
            만들면 더 설득력 있어집니다.
          </p>
          <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
            <Metric title="근거 구체성" value="86" />
            <Metric title="답변 구조" value="78" />
            <Metric title="전달 안정성" value="82" />
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              variant="secondary"
              onClick={() => {
                setSeconds(0);
                setRound("core");
                setPhase("ready");
              }}
            >
              <RotateCcw className="size-4" />
              다시 연습
            </Button>
            <Link
              href="/applications/demo/cheat-sheet"
              onClick={() => completeStep("mock-interview")}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--brand)] px-5 text-sm font-bold text-[var(--text-on-brand)]"
            >
              파이널 노트 보기 <ArrowRight className="size-4" />
            </Link>
          </div>
        </Card>
      </div>
    );
  if (phase === "follow-up")
    return (
      <div className="space-y-5">
        <InterviewFlow phase={phase} round={round} />
        <section className="grid overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] lg:grid-cols-[.8fr_1.2fr]">
          <div className="border-b border-[var(--border)] bg-[var(--brand-soft)] p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <p className="font-mono text-[10px] font-black text-[var(--brand)]">
              ANSWER CAPTURED
            </p>
            <h2 className="mt-4 text-xl font-black tracking-[-.04em]">
              첫 답변에서 다음 질문을 찾았어요
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              처음부터 다시 묻지 않습니다. 방금 말한 “기록 기준”을 더 구체적으로
              설명하면 답변의 깊이가 드러납니다.
            </p>
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-xs font-black text-[var(--brand)]">
              {persona.name} · 꼬리질문
            </p>
            <p className="mt-4 text-xl font-black leading-8 sm:text-2xl">
              그때 기록 기준을 바꾼 결정이 결과에 어떤 차이를 만들었나요?
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-[var(--text-secondary)]">
                완료 기준 · 변화 전후를 한 문장씩 설명하기
              </p>
              <Button
                size="lg"
                onClick={() => {
                  setRound("follow-up");
                  setSeconds(0);
                  setPhase("recording");
                }}
              >
                <Mic2 className="size-5" /> 꼬리질문 답변 시작
              </Button>
            </div>
          </div>
        </section>
        <StudentCoachGuide stage="mock-interview" />
      </div>
    );
  return (
    <div className="space-y-5">
      <InterviewFlow phase={phase} round={round} />
      <Card className="surface-contrast relative min-h-[34rem] overflow-hidden border-0 p-6 text-center sm:p-10">
        <button
          onClick={() => {
            setRound("core");
            setPhase("select");
          }}
          className="absolute left-5 top-5 inline-flex items-center gap-1 text-xs font-bold opacity-60"
        >
          <ChevronLeft className="size-4" />
          면접관 변경
        </button>
        <div className="mx-auto mt-10 max-w-2xl">
          <div
            className={cn(
              "mx-auto grid size-28 place-items-center rounded-full border border-white/15 bg-white/10 text-3xl font-black",
              phase === "recording" &&
                "ring-8 ring-[color-mix(in_srgb,var(--coral)_22%,transparent)]",
            )}
          >
            {persona.name.slice(0, 1)}
          </div>
          <p className="mt-5 text-xs font-black text-[var(--mint)]">
            {phase === "recording"
              ? round === "core"
                ? "핵심 답변을 듣고 있어요"
                : "꼬리질문 답변을 듣고 있어요"
              : `${persona.name} · 첫 질문`}
          </p>
          <h2 className="mt-5 text-balance text-xl font-black leading-8 sm:text-2xl">
            {round === "core"
              ? "과학 동아리의 실험 결과가 예상과 달랐을 때, 무엇을 기준으로 다음 행동을 결정했나요?"
              : "그때 기록 기준을 바꾼 결정이 결과에 어떤 차이를 만들었나요?"}
          </h2>
          {phase === "recording" ? (
            <div className="mt-10">
              <div
                className="mx-auto flex h-14 max-w-sm items-center justify-center gap-1"
                aria-label="음성 입력 중"
              >
                {Array.from({ length: 19 }).map((_, index) => (
                  <span
                    key={index}
                    className="w-1 rounded-full bg-[var(--mint)]"
                    style={{
                      height: `${18 + ((index * 17) % 36)}px`,
                      animation: `pulse-soft ${0.5 + (index % 4) * 0.14}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
              <p className="mt-5 font-mono text-2xl font-black">
                {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                {String(seconds % 60).padStart(2, "0")}
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="mt-8 border-transparent bg-white text-[var(--brand-on-white)]"
                onClick={() =>
                  setPhase(round === "core" ? "follow-up" : "feedback")
                }
              >
                <Square className="size-4 fill-current" />
                답변 마치기
              </Button>
            </div>
          ) : (
            <div className="mt-9">
              <p className="text-sm opacity-55">
                준비되면 시작을 눌러 주세요. 최대 2분 동안 답할 수 있어요.
              </p>
              <Button
                size="lg"
                className="mt-7 bg-[var(--coral)] hover:bg-[var(--coral)]"
                onClick={() => {
                  setRound("core");
                  setSeconds(0);
                  setPhase("recording");
                }}
              >
                <Mic2 className="size-5" />
                답변 시작
              </Button>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs opacity-50">
                <ShieldCheck className="size-4" />
                데모 음성은 기기에 저장하지 않습니다
              </div>
            </div>
          )}
        </div>
      </Card>
      {phase === "ready" ? <StudentCoachGuide stage="mock-interview" /> : null}
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-md)] bg-[var(--surface-muted)] p-4">
      <p className="text-xs font-bold text-[var(--text-secondary)]">{title}</p>
      <p className="mt-2 text-2xl font-black">
        {value}
        <span className="text-xs text-[var(--text-tertiary)]">/100</span>
      </p>
    </div>
  );
}

function CheatSheetStep() {
  const completeStep = useAppStore((state) => state.completeStep);
  const [saved, setSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const markAsExported = () => {
    setSaved(true);
    completeStep("cheat-sheet");
  };

  return (
    <section className="student-one-page-workspace practice-session-canvas liquid-glass-group relative flex flex-col overflow-hidden rounded-[2rem] px-4 py-7 sm:px-7 sm:py-9 lg:px-7">
      <div className="workspace-page-content relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <div className="no-print">
          <LearningIntroHero
            icon={BookOpenCheck}
            eyebrow="면접 전 최종 정리"
            title="면접 직전, 이 한 장만 기억하세요"
            copy="자소서에서 찾은 근거와 질문 연습, 말하기 피드백을 마지막 확인 순서로 정리했습니다."
            titleId="cheat-sheet-workspace-title"
          >
            <div className="mt-5 flex flex-wrap justify-center gap-2 lg:mt-2">
              <Button
                variant="secondary"
                className="lg:min-h-10 lg:px-4 lg:text-xs"
                onClick={() => setPreviewOpen(true)}
              >
                <Eye className="size-4" />
                A4 미리보기
              </Button>
              <Button
                className="lg:min-h-10 lg:px-4 lg:text-xs"
                onClick={() => setPreviewOpen(true)}
              >
                PDF로 저장
              </Button>
            </div>
          </LearningIntroHero>
        </div>

        <FinalNotePaper document={demoFinalNoteDocument} />
        <FinalNotePreviewDialog
          document={demoFinalNoteDocument}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          onExport={markAsExported}
        />
        {saved ? (
          <div
            role="status"
            className="surface-contrast no-print fixed bottom-24 left-1/2 z-50 -translate-x-1/2 px-5 py-3 text-xs font-bold"
          >
            파이널 노트를 저장했어요
          </div>
        ) : null}
      </div>
    </section>
  );
}

function WorkspaceStatus({
  detail,
  icon: Icon,
  title,
  value,
}: {
  detail: string;
  icon?: LucideIcon;
  title: string;
  value?: string;
}) {
  return (
    <div className="practice-context-glass flex shrink-0 items-center gap-3 rounded-[1rem] px-3.5 py-1.5 text-left text-xs">
      <span className="grid size-8 place-items-center rounded-full bg-[var(--mint-soft)] font-mono text-[11px] font-black text-[var(--success)]">
        {Icon ? <Icon className="size-4" /> : value}
      </span>
      <div className="leading-5 text-[var(--text-secondary)]">
        <p className="font-black text-[var(--text-primary)]">{title}</p>
        <p>{detail}</p>
      </div>
    </div>
  );
}
