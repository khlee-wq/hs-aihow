"use client";

import {
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  FileText,
  Eye,
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
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn, sleep } from "@/lib/utils";
import { type JourneyStep, useAppStore } from "@/stores/app-store";
import { QuestionPracticeIntro } from "./question-practice-intro";
import { LearningIntroHero } from "./learning-intro-hero";
import {
  demoFinalNoteDocument,
  FinalNotePaper,
  FinalNotePreviewDialog,
} from "./final-note-preview";
import {
  interviewPersonas as personas,
  minsagoInterviewQuestions,
} from "./mock-interview-model";

export function StudentWorkspace({ step }: { step: JourneyStep }) {
  const normalizedStep = step;
  if (normalizedStep === "essay") return <EssayStep />;
  if (normalizedStep === "practice") return <QuestionPracticeIntro />;
  if (normalizedStep === "mock-interview") return <MockInterviewStep />;
  if (normalizedStep === "cheat-sheet") return <CheatSheetStep />;
  return null;
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
    <section className="student-one-page-workspace practice-session-canvas liquid-glass-group relative flex flex-col overflow-hidden rounded-[2rem] px-4 py-7 sm:px-7 sm:py-9 lg:px-8">
      <div className="learning-canvas-content workspace-page-content relative z-10 mx-auto flex flex-1 flex-col">
        <LearningIntroHero
          icon={FileText}
          eyebrow="자소서 원문"
          title="자소서 문장을 면접의 근거로 바꿔볼게요"
          copy="추출된 원문을 먼저 확인하고, 설명이 더 필요한 표현은 다음 질문 연습으로 연결합니다."
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
                다음 질문 연습
              </p>
              <h2 className="mt-3 text-lg font-black">
                이 경험을 내 말로 설명해 볼게요
              </h2>
              <p className="mt-3 text-xs leading-6 text-[var(--text-secondary)]">
                이 경험을 바탕으로 답변의 흐름을 만들고, 이어지는 질문까지
                차분히 연습해 볼게요.
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
              표시된 문장은 다음 질문 연습에서 답변의 근거로 사용됩니다.
            </p>
            <Link
              href="/applications/practice"
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

const personaIcons = [Waves, Scale, ScanSearch] as const;

function withInstrumentalParticle(value: string) {
  const lastCharacter = value.charCodeAt(value.length - 1);
  const isHangulSyllable = lastCharacter >= 0xac00 && lastCharacter <= 0xd7a3;
  const hasFinalConsonant =
    isHangulSyllable && (lastCharacter - 0xac00) % 28 !== 0;

  return `${value}${hasFinalConsonant ? "으로" : "로"}`;
}

type InterviewPhase =
  "select" | "ready" | "asking" | "recording" | "follow-up" | "feedback";
type InterviewRound = "main" | "follow-up";

function InterviewFlow({
  questionIndex,
  completedCount,
  className,
}: {
  questionIndex: number;
  completedCount: number;
  className?: string;
}) {
  return (
    <nav
      aria-label="모의면접 진행 단계"
      className={cn(
        "practice-question-glass interview-flow overflow-hidden rounded-[1.35rem]",
        className,
      )}
    >
      <ol className="grid grid-cols-5">
        {minsagoInterviewQuestions.map((question, index) => (
          <li
            key={question.id}
            aria-current={index === questionIndex ? "step" : undefined}
            className={cn(
              "relative min-w-0 border-r border-[color-mix(in_srgb,var(--text-primary)_6%,transparent)] px-2 py-3 last:border-r-0 sm:px-4",
              index === questionIndex &&
                "bg-[color-mix(in_srgb,var(--brand-soft)_72%,transparent)] shadow-[inset_0_1px_0_color-mix(in_srgb,white_54%,transparent)]",
            )}
          >
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full font-mono text-[9px] font-black",
                index <= completedCount
                  ? "bg-[var(--brand)] text-[var(--text-on-brand)]"
                  : "bg-[color-mix(in_srgb,var(--surface-raised)_60%,transparent)] text-[var(--text-tertiary)]",
              )}
            >
              {index < completedCount ? (
                <Check className="size-3" />
              ) : (
                index + 1
              )}
            </span>
            <strong className="mt-2 block break-keep text-[10px] leading-4 sm:text-xs">
              {question.type}
            </strong>
            <span className="mt-1 hidden text-[11px] text-[var(--text-secondary)] sm:block">
              {question.year} 유형
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function MockInterviewSessionFrame({
  children,
  phase,
  questionIndex,
  completedCount,
  personaName,
  onAbort,
}: {
  children: ReactNode;
  phase: InterviewPhase;
  questionIndex: number;
  completedCount: number;
  personaName: string;
  onAbort: () => void;
}) {
  const hasActiveAnswer = phase === "asking" || phase === "recording";

  return (
    <section
      className="mock-interview-session-frame student-one-page-workspace practice-session-canvas liquid-glass-group relative mx-auto flex max-w-[100rem] flex-col overflow-hidden rounded-[2rem] px-4 py-6 sm:px-7 sm:py-8 lg:px-8"
      data-testid="mock-interview-session"
      aria-label="모의면접 집중 연습"
    >
      <div className="learning-canvas-content relative z-10 mx-auto flex min-h-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 px-1 sm:px-2">
          <div>
            <p className="font-mono text-[10px] font-black tracking-[.16em] text-[var(--brand)]">
              실전 대화 연습
            </p>
            <p className="mt-1 text-xs font-bold text-[var(--text-secondary)]">
              {personaName}과 한 질문씩 이어가고 있어요
            </p>
          </div>
          <button
            type="button"
            onClick={onAbort}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--text-primary)_9%,transparent)] bg-[color-mix(in_srgb,var(--surface-raised)_56%,transparent)] px-3 text-xs font-bold text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
          >
            <ChevronLeft className="size-4" />
            {hasActiveAnswer ? "중단하고 돌아가기" : "방식 다시 고르기"}
          </button>
        </header>

        <div className="practice-question-glass mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.7rem]">
          <InterviewFlow
            questionIndex={questionIndex}
            completedCount={completedCount}
            className="rounded-none border-x-0 border-t-0 bg-transparent shadow-none backdrop-blur-none"
          />
          {children}
        </div>
      </div>
    </section>
  );
}

export function MockInterviewSession() {
  return <MockInterviewStep initialPhase="ready" focused />;
}

function MockInterviewStep({
  initialPhase = "select",
  focused = false,
}: {
  initialPhase?: InterviewPhase;
  focused?: boolean;
}) {
  const router = useRouter();
  const selected = useAppStore((state) => state.selectedPersona);
  const selectPersona = useAppStore((state) => state.selectPersona);
  const completeStep = useAppStore((state) => state.completeStep);
  const [phase, setPhase] = useState<InterviewPhase>(initialPhase);
  const [round, setRound] = useState<InterviewRound>("main");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(120);
  const question = minsagoInterviewQuestions[questionIndex];
  const persona = personas.find((item) => item.id === question.personaId)!;
  const selectedPersona =
    personas.find((item) => item.id === selected) ?? personas[0];

  const advanceAfterFollowUp = useCallback(() => {
    const nextCompletedCount = completedCount + 1;
    setCompletedCount(nextCompletedCount);
    if (questionIndex === minsagoInterviewQuestions.length - 1) {
      setPhase("feedback");
      return;
    }
    setQuestionIndex((value) => value + 1);
    setRound("main");
    setRemainingSeconds(120);
    setPhase("ready");
  }, [completedCount, questionIndex]);

  const finishCurrentAnswer = useCallback(() => {
    if (round === "main") {
      setPhase("follow-up");
      return;
    }
    advanceAfterFollowUp();
  }, [advanceAfterFollowUp, round]);

  useEffect(() => {
    if (phase !== "recording") return;
    const timer = window.setInterval(() => {
      setRemainingSeconds((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          window.setTimeout(finishCurrentAnswer, 0);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [finishCurrentAnswer, phase]);

  useEffect(
    () => () => {
      window.speechSynthesis?.cancel();
    },
    [],
  );

  const speakQuestion = useCallback(
    (nextRound: InterviewRound) => {
      const prompt =
        nextRound === "main" ? question.prompt : question.followUp.prompt;
      setRound(nextRound);
      setRemainingSeconds(question.timeLimitSeconds);
      setPhase("asking");

      if (!("speechSynthesis" in window)) {
        setPhase("recording");
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(prompt);
      utterance.lang = "ko-KR";
      utterance.rate = persona.voiceRate;
      utterance.pitch = persona.voicePitch;
      const koreanVoices = window.speechSynthesis
        .getVoices()
        .filter((voice) => voice.lang.toLowerCase().startsWith("ko"));
      if (koreanVoices.length === 0) {
        setPhase("recording");
        return;
      }
      const personaIndex = personas.findIndex((item) => item.id === persona.id);
      utterance.voice =
        koreanVoices[personaIndex % koreanVoices.length] ?? null;
      utterance.onend = () => setPhase("recording");
      utterance.onerror = () => setPhase("recording");
      window.speechSynthesis.speak(utterance);
    },
    [persona, question],
  );

  const discardInterview = () => {
    window.speechSynthesis?.cancel();
    setRemainingSeconds(120);
    setRound("main");
    setQuestionIndex(0);
    setCompletedCount(0);
    if (focused) {
      router.push("/applications/mock-interview");
      return;
    }
    setPhase("select");
  };
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

        <div
          className="learning-canvas-content practice-question-glass mock-interview-map relative z-10 mx-auto flex min-h-0 flex-col overflow-hidden rounded-[1.6rem]"
          data-motion-reveal
        >
          <InterviewFlow
            questionIndex={0}
            completedCount={0}
            className="rounded-none border-x-0 border-t-0 bg-transparent shadow-none backdrop-blur-none"
          />

          <div className="mock-interview-picker flex min-h-0 flex-1 flex-col">
            <div className="mock-interview-picker-head flex items-center justify-between gap-4 border-b border-[color-mix(in_srgb,var(--text-primary)_6%,transparent)] px-5 py-3 sm:px-6">
              <div>
                <p className="text-xs font-black">오늘의 말하기 감각</p>
                <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                  선택한 방식은 연습 중 언제든 바꿀 수 있어요.
                </p>
              </div>
              <span className="shrink-0 font-mono text-[10px] font-black text-[var(--brand)]">
                {selectedPersona.name} 선택
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
                2024~2026년 민사고 유형을 재구성한 다섯 질문을, 서로 다른 위원과
                2분씩 이어갑니다.
              </p>
              <Link
                href="/applications/mock-interview/session"
                className="hairline-top inline-flex min-h-13 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--brand)] px-7 text-base font-bold text-[var(--text-on-brand)] shadow-[var(--shadow-brand)] transition-[transform,background] hover:-translate-y-0.5 hover:bg-[var(--brand-strong)]"
              >
                {withInstrumentalParticle(selectedPersona.name)} 시작하기
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  if (phase === "feedback")
    return (
      <MockInterviewSessionFrame
        phase={phase}
        questionIndex={questionIndex}
        completedCount={completedCount}
        personaName={persona.name}
        onAbort={discardInterview}
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-7 sm:px-8 sm:py-10">
          <section className="practice-context-glass mx-auto w-full max-w-5xl rounded-[1.6rem] px-5 py-8 text-center sm:px-10 sm:py-10">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--mint-soft)] text-[var(--success)]">
              <CheckCircle2 className="size-8" />
            </span>
            <p className="eyebrow mt-6">연습 마무리</p>
            <h2 className="mt-3 text-2xl font-black">
              다섯 번의 대화를 끝까지 이어갔어요
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[var(--text-secondary)]">
              메인 질문과 이어지는 질문을 함께 살펴, 답변마다 잘된 점과 다음
              연습 포인트를 정리했어요.
            </p>
            <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
              <Metric title="근거 구체성" value="86" />
              <Metric title="판단 선명도" value="84" />
              <Metric title="전달 안정성" value="83" />
            </div>
            <div className="mt-6 space-y-3 text-left">
              {minsagoInterviewQuestions.map((item, index) => (
                <article
                  key={item.id}
                  className="rounded-[1.1rem] border border-[color-mix(in_srgb,var(--text-primary)_7%,transparent)] bg-[color-mix(in_srgb,var(--surface-raised)_48%,transparent)] p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong>
                      {index + 1}. {item.type}
                    </strong>
                    <span className="font-mono text-[10px] font-black text-[var(--brand)]">
                      {item.year} 유형 ·{" "}
                      {
                        personas.find((entry) => entry.id === item.personaId)
                          ?.name
                      }
                    </span>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-black text-[var(--brand)]">
                        첫 답변
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                        {item.feedback.summary} {item.feedback.next}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[var(--brand)]">
                        이어지는 답변
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                        {item.followUp.feedback.summary}{" "}
                        {item.followUp.feedback.next}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                variant="secondary"
                onClick={() => {
                  setRemainingSeconds(120);
                  setRound("main");
                  setQuestionIndex(0);
                  setCompletedCount(0);
                  setPhase("ready");
                }}
              >
                <RotateCcw className="size-4" />
                다시 연습
              </Button>
              <Link
                href="/applications/cheat-sheet"
                onClick={() => completeStep("mock-interview")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--brand)] px-5 text-sm font-bold text-[var(--text-on-brand)]"
              >
                파이널 노트 보기 <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>
        </div>
      </MockInterviewSessionFrame>
    );
  if (phase === "follow-up")
    return (
      <MockInterviewSessionFrame
        phase={phase}
        questionIndex={questionIndex}
        completedCount={completedCount}
        personaName={persona.name}
        onAbort={discardInterview}
      >
        <section className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[.8fr_1.2fr]">
          <div className="border-b border-[color-mix(in_srgb,var(--text-primary)_6%,transparent)] bg-[color-mix(in_srgb,var(--brand-soft)_64%,transparent)] p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <p className="font-mono text-[10px] font-black text-[var(--brand)]">
              첫 답변 확인
            </p>
            <h2 className="mt-4 text-xl font-black tracking-[-.04em]">
              첫 답변에서 다음 질문을 찾았어요
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              {question.followUp.triggerQuote} 처음부터 다시 묻지 않고, 방금
              답한 장면에서 한 걸음 더 들어갑니다.
            </p>
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <p className="text-xs font-black text-[var(--brand)]">
              {persona.name} · 꼬리질문
            </p>
            <p className="mt-4 text-xl font-black leading-8 sm:text-2xl">
              {question.followUp.prompt}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-[var(--text-secondary)]">
                말해 볼 순서 · {question.followUp.answerGuide.join(" · ")}
              </p>
              <Button
                size="lg"
                onClick={() => {
                  speakQuestion("follow-up");
                }}
              >
                <Mic2 className="size-5" /> 꼬리질문 답변 시작
              </Button>
            </div>
          </div>
        </section>
      </MockInterviewSessionFrame>
    );
  return (
    <MockInterviewSessionFrame
      phase={phase}
      questionIndex={questionIndex}
      completedCount={completedCount}
      personaName={persona.name}
      onAbort={discardInterview}
    >
      <div className="grid min-h-0 flex-1 place-items-center overflow-y-auto px-5 py-7 sm:px-8 sm:py-10">
        <div className="practice-context-glass w-full max-w-2xl rounded-[1.6rem] px-5 py-8 text-center sm:px-10 sm:py-10">
          <div
            className={cn(
              "mx-auto grid size-24 place-items-center rounded-full border border-[color-mix(in_srgb,var(--text-primary)_10%,transparent)] bg-[color-mix(in_srgb,var(--surface-raised)_54%,transparent)] text-3xl font-black shadow-[inset_0_1px_0_color-mix(in_srgb,white_58%,transparent)]",
              (phase === "asking" || phase === "recording") &&
                "ring-8 ring-[color-mix(in_srgb,var(--coral)_18%,transparent)]",
            )}
          >
            {persona.name.slice(0, 1)}
          </div>
          <p className="mt-5 text-xs font-black text-[var(--brand)]">
            {phase === "asking"
              ? `${persona.name}이 질문하고 있어요`
              : phase === "recording"
                ? round === "main"
                  ? "핵심 답변을 듣고 있어요"
                  : "꼬리질문 답변을 듣고 있어요"
                : `${question.year} 유형 · ${persona.name}`}
          </p>
          <h2 className="mt-5 text-balance text-xl font-black leading-8 sm:text-2xl">
            {round === "main" ? question.prompt : question.followUp.prompt}
          </h2>
          {phase === "asking" ? (
            <div className="mt-9">
              <VoiceWave label={`${persona.name} 질문 재생 중`} />
              <p className="mt-4 text-xs text-[var(--text-secondary)]">
                질문이 끝나면 답변 시간이 자동으로 시작됩니다.
              </p>
            </div>
          ) : phase === "recording" ? (
            <div className="mt-10">
              <div
                className="mx-auto flex h-14 max-w-sm items-center justify-center gap-1"
                aria-label="음성 입력 중"
              >
                <VoiceWave label="학생 답변 입력 중" />
              </div>
              <p className="mt-5 font-mono text-2xl font-black tabular-nums">
                {String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:
                {String(remainingSeconds % 60).padStart(2, "0")}
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="mt-8"
                onClick={finishCurrentAnswer}
              >
                <Square className="size-4 fill-current" />
                답변 마치기
              </Button>
            </div>
          ) : (
            <div className="mt-9">
              <p className="text-sm text-[var(--text-secondary)]">
                준비되면 시작을 눌러 주세요. 최대 2분 동안 답할 수 있어요.
              </p>
              <Button
                size="lg"
                className="mt-7 bg-[var(--coral)] hover:bg-[var(--coral)]"
                onClick={() => {
                  speakQuestion("main");
                }}
              >
                <Mic2 className="size-5" />
                답변 시작
              </Button>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--text-tertiary)]">
                <ShieldCheck className="size-4" />
                연습 음성은 이 기기에 저장하지 않습니다
              </div>
            </div>
          )}
        </div>
      </div>
    </MockInterviewSessionFrame>
  );
}

function VoiceWave({ label }: { label: string }) {
  return (
    <div
      className="mx-auto flex h-14 max-w-sm items-center justify-center gap-1"
      aria-label={label}
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
    <section className="student-one-page-workspace practice-session-canvas liquid-glass-group relative flex flex-col overflow-hidden rounded-[2rem] px-4 py-7 sm:px-7 sm:py-9 lg:px-8">
      <div className="learning-canvas-content workspace-page-content relative z-10 mx-auto flex flex-1 flex-col">
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
