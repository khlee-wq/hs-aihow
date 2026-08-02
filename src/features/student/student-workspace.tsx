"use client";

import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Download,
  FileText,
  Lightbulb,
  LockKeyhole,
  Mic2,
  Printer,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Square,
  UploadCloud,
  Volume2,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { analysisPoints, journeySteps, questions } from "@/lib/mock-data";
import { cn, sleep } from "@/lib/utils";
import { type JourneyStep, useAppStore } from "@/stores/app-store";

export function StudentWorkspace({ step }: { step: JourneyStep }) {
  const normalizedStep = step;
  const completed = useAppStore((state) => state.completedSteps);
  const meta = journeySteps.find((item) => item.id === normalizedStep)!;
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
        {normalizedStep === "essay" ? (
          <EssayStep />
        ) : normalizedStep === "analysis" ? (
          <AnalysisStep />
        ) : normalizedStep === "practice" ? (
          <PracticeStep />
        ) : normalizedStep === "mock-interview" ? (
          <MockInterviewStep />
        ) : (
          <CheatSheetStep />
        )}
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
      <Card className="grid min-h-[30rem] place-items-center text-center">
        <div className="max-w-md">
          <span className="mx-auto grid size-16 place-items-center rounded-[var(--radius-lg)] bg-[var(--brand-soft)] text-[var(--brand)]">
            <UploadCloud className="size-7" />
          </span>
          <h2 className="mt-6 text-xl font-black">
            완성한 자소서를 올려 주세요
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            PDF 파일만 가능하며, 업로드 후 추출된 문장을 직접 확인할 수 있어요.
            데모 파일은 서버에 저장되지 않습니다.
          </p>
          <Button className="mt-7" onClick={simulateUpload}>
            <UploadCloud className="size-4" />
            데모 PDF 업로드
          </Button>
          <p className="mt-4 text-xs text-[var(--text-tertiary)]">
            PDF · 최대 10MB
          </p>
        </div>
      </Card>
    );
  if (status === "uploading")
    return (
      <Card className="grid min-h-[30rem] place-items-center">
        <div className="w-full max-w-md text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
            <FileText className="size-7 animate-pulse" />
          </span>
          <h2 className="mt-6 text-xl font-black">자소서를 읽고 있어요</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            페이지와 문단 구조를 확인하는 중입니다.
          </p>
          <div className="mt-8">
            <Progress value={progress} label="텍스트 추출" />
          </div>
          <Button
            variant="ghost"
            className="mt-5"
            onClick={() => setStatus("ready")}
          >
            업로드 취소
          </Button>
        </div>
      </Card>
    );
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] bg-[var(--mint-soft)] px-4 py-3 text-sm">
        <span className="flex items-center gap-2 font-extrabold text-[var(--success)]">
          <CheckCircle2 className="size-5" />
          원문 3페이지를 정확히 읽었어요
        </span>
        <button
          onClick={() => setStatus("ready")}
          className="text-xs font-bold text-[var(--text-secondary)] underline underline-offset-4"
        >
          다른 파일 올리기
        </button>
      </div>
      <Card className="p-0">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-[var(--radius-sm)] bg-[var(--coral-soft)] text-[var(--coral)]">
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
          <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-[10px] font-black">
            OCR 확인
          </span>
        </div>
        <div className="grid lg:grid-cols-[1fr_18rem]">
          <article className="space-y-5 p-6 text-sm leading-8 sm:p-8">
            <p>
              <mark className="rounded bg-[var(--brand-soft)] px-1 text-[var(--text-primary)]">
                과학 동아리에서 수질에 따른 식물 생장 차이를 탐구했습니다.
              </mark>{" "}
              처음에는 결과가 예상과 달라 당황했지만, 팀원들과 온도와 빛의 양을
              다시 기록하며 변인을 하나씩 점검했습니다.
            </p>
            <p>
              이 과정에서 정답을 빠르게 찾는 것보다 관찰한 내용을 정확히 남기고
              질문을 바꾸는 일이 중요하다는 것을 배웠습니다.
            </p>
            <p>
              <mark className="rounded bg-[var(--warning-soft)] px-1 text-[var(--text-primary)]">
                다양한 탐구 활동을 이어가고 싶어 민사고에 지원했습니다.
              </mark>{" "}
              스스로 계획하고 동료와 지식을 나누는 환경에서 과학적 질문을 더
              깊게 발전시키고 싶습니다.
            </p>
          </article>
          <aside className="border-t border-[var(--border)] bg-[var(--surface-muted)] p-5 lg:border-l lg:border-t-0">
            <p className="text-xs font-black">확인이 필요한 표현</p>
            <div className="mt-4 rounded-[var(--radius-sm)] bg-[var(--surface)] p-4">
              <p className="text-xs font-extrabold text-[var(--warning)]">
                연결을 더 구체적으로
              </p>
              <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">
                “다양한 탐구 활동”이 내 경험과 어떻게 이어지는지 다음 분석
                단계에서 살펴볼게요.
              </p>
            </div>
            <div className="mt-5 text-xs leading-6 text-[var(--text-secondary)]">
              <p className="font-extrabold text-[var(--text-primary)]">
                보관 상태
              </p>
              <p className="mt-2">원본: 임시 보관</p>
              <p>추출문: 이 기기 데모</p>
              <p>외부 AI 전송: 없음</p>
            </div>
          </aside>
        </div>
      </Card>
      <div className="flex justify-end">
        <Link
          href="/applications/demo/analysis"
          onClick={() => completeStep("essay")}
          className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--brand)] px-6 text-sm font-black text-white"
        >
          내용 확인 완료 <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function AnalysisStep() {
  const completeStep = useAppStore((state) => state.completeStep);
  return (
    <div className="space-y-5">
      <Card className="border-0 bg-[var(--surface-inverse)] text-[var(--text-inverse)]">
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
          className="inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--brand)] px-6 text-sm font-black text-white"
        >
          질문 연습 시작 <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function PracticeStep() {
  const [index, setIndex] = useState(0);
  const question = questions[index];
  const answers = useAppStore((state) => state.draftAnswers);
  const saveAnswer = useAppStore((state) => state.saveAnswer);
  const completeStep = useAppStore((state) => state.completeStep);
  const [answer, setAnswer] = useState(answers[question.id] ?? "");
  const [saved, setSaved] = useState(Boolean(answers[question.id]));
  const mutation = useMutation({
    mutationFn: async () => {
      await sleep(620);
      saveAnswer(question.id, answer);
      return true;
    },
    onSuccess: () => setSaved(true),
  });
  const go = (nextIndex: number) => {
    const nextQuestion = questions[nextIndex];
    setAnswer(answers[nextQuestion.id] ?? "");
    setSaved(Boolean(answers[nextQuestion.id]));
    setIndex(nextIndex);
  };
  return (
    <div className="space-y-5">
      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold">예상 질문 퀘스트</p>
            <p className="mt-1 text-[11px] text-[var(--text-tertiary)]">
              핵심 질문 {index + 1}/{questions.length}
            </p>
          </div>
          <div className="w-40 sm:w-60">
            <Progress
              value={((index + (saved ? 1 : 0)) / questions.length) * 100}
            />
          </div>
        </div>
      </Card>
      <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
        <Card className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--coral-soft)] px-3 py-1.5 text-[10px] font-black text-[var(--coral)]">
              {question.category}
            </span>
            <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1.5 text-[10px] font-black text-[var(--text-secondary)]">
              우선순위 {question.priority}
            </span>
          </div>
          <h2 className="mt-6 text-balance text-xl font-black leading-8 tracking-[-.03em] sm:text-2xl">
            {question.question}
          </h2>
          <div className="mt-6 rounded-[var(--radius-md)] bg-[var(--brand-soft)] p-4">
            <p className="text-xs font-black text-[var(--brand)]">
              자소서에서 가져온 근거
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {question.source}
            </p>
          </div>
          <label className="mt-6 block text-sm font-extrabold" htmlFor="answer">
            내 답변
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(event) => {
              setAnswer(event.target.value);
              setSaved(false);
            }}
            className="mt-2 min-h-52 w-full resize-y rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-7 outline-none focus:border-[var(--brand)]"
            placeholder="완벽하게 쓰려 하지 말고, 내 경험과 행동부터 적어 보세요."
          />
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-[var(--text-tertiary)]">
              {answer.length}자 · 작성 내용은 이 기기에 저장돼요
            </span>
            {saved ? (
              <span className="flex items-center gap-1 font-bold text-[var(--success)]">
                <Check className="size-3" />
                저장됨
              </span>
            ) : null}
          </div>
          <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row">
            <Button
              variant="ghost"
              disabled={index === 0}
              onClick={() => go(index - 1)}
            >
              <ChevronLeft className="size-4" />
              이전 질문
            </Button>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                loading={mutation.isPending}
                disabled={answer.trim().length < 10}
                onClick={() => mutation.mutate()}
              >
                <Save className="size-4" />
                답변 저장
              </Button>
              {index < questions.length - 1 ? (
                <Button disabled={!saved} onClick={() => go(index + 1)}>
                  다음 질문 <ChevronRight className="size-4" />
                </Button>
              ) : (
                <Link
                  href="/applications/demo/mock-interview"
                  onClick={() => completeStep("practice")}
                  className={cn(
                    "inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--brand)] px-5 text-sm font-bold text-white",
                    !saved && "pointer-events-none opacity-50",
                  )}
                >
                  연습 완료 <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </Card>
        <aside className="space-y-4">
          <Card className="shadow-none">
            <div className="flex items-center gap-2 text-sm font-extrabold">
              <Lightbulb className="size-4 text-[var(--warning)]" />
              답변 힌트
            </div>
            <p className="mt-3 text-xs leading-6 text-[var(--text-secondary)]">
              {question.tip}
            </p>
          </Card>
          <Card
            className={cn(
              "shadow-none transition-opacity",
              saved ? "opacity-100" : "opacity-55",
            )}
          >
            <div className="flex items-center gap-2 text-sm font-extrabold">
              {saved ? (
                <Sparkles className="size-4 text-[var(--brand)]" />
              ) : (
                <LockKeyhole className="size-4" />
              )}
              꼬리질문
            </div>
            <p className="mt-3 text-xs leading-6 text-[var(--text-secondary)]">
              {saved
                ? "팀원들의 기록 방식과 본인의 방식은 무엇이 달랐나요?"
                : "답변을 저장하면 전문가 기준에 따른 꼬리질문이 열려요."}
            </p>
          </Card>
          <Card className="shadow-none">
            <p className="text-xs font-extrabold">질문 목록</p>
            <div className="mt-3 grid gap-2">
              {questions.map((item, questionIndex) => (
                <button
                  key={item.id}
                  onClick={() => go(questionIndex)}
                  className={cn(
                    "flex items-center gap-2 rounded-[var(--radius-xs)] p-2 text-left text-xs font-bold",
                    index === questionIndex &&
                      "bg-[var(--brand-soft)] text-[var(--brand)]",
                  )}
                >
                  {answers[item.id] ? (
                    <CheckCircle2 className="size-4 text-[var(--success)]" />
                  ) : (
                    <Circle className="size-4 text-[var(--text-tertiary)]" />
                  )}
                  {item.category}
                </button>
              ))}
            </div>
          </Card>
        </aside>
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

function MockInterviewStep() {
  const selected = useAppStore((state) => state.selectedPersona);
  const selectPersona = useAppStore((state) => state.selectPersona);
  const completeStep = useAppStore((state) => state.completeStep);
  const [phase, setPhase] = useState<
    "select" | "ready" | "recording" | "feedback"
  >("select");
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
      <div className="space-y-5">
        <Card className="border-0 bg-[var(--surface-inverse)] text-[var(--text-inverse)]">
          <p className="text-xs font-black text-[var(--mint)]">
            INTERVIEW MODE
          </p>
          <h2 className="mt-3 text-2xl font-black">
            오늘 연습할 면접관 방식을 고르세요
          </h2>
          <p className="mt-2 text-sm leading-7 opacity-60">
            난이도보다 지금 필요한 연습 방식으로 선택하면 돼요. 압박형도 공포
            이미지나 화난 표현을 사용하지 않습니다.
          </p>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          {personas.map((item, index) => (
            <button
              key={item.id}
              onClick={() => selectPersona(item.id)}
              className={cn(
                "surface bg-[var(--surface)] p-6 text-left transition-all hover:-translate-y-1",
                selected === item.id &&
                  "border-[var(--brand)] ring-2 ring-[color-mix(in_srgb,var(--brand)_18%,transparent)]",
              )}
              aria-pressed={selected === item.id}
            >
              <div
                className={cn(
                  "grid size-16 place-items-center rounded-[var(--radius-lg)] text-2xl font-black",
                  index === 0
                    ? "bg-[var(--mint-soft)] text-[var(--success)]"
                    : index === 1
                      ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                      : "bg-[var(--coral-soft)] text-[var(--coral)]",
                )}
              >
                {["온", "균", "집"][index]}
              </div>
              <h3 className="mt-5 text-lg font-black">{item.name}</h3>
              <p className="mt-2 min-h-18 text-sm leading-6 text-[var(--text-secondary)]">
                {item.description}
              </p>
              <div className="mt-5 flex gap-2">
                <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[10px] font-black">
                  {item.pace}
                </span>
                <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[10px] font-black">
                  {item.tone}
                </span>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-end">
          <Button size="lg" onClick={() => setPhase("ready")}>
            이 방식으로 연습 <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    );
  if (phase === "feedback")
    return (
      <div className="space-y-5">
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
                setPhase("ready");
              }}
            >
              <RotateCcw className="size-4" />
              다시 연습
            </Button>
            <Link
              href="/applications/demo/cheat-sheet"
              onClick={() => completeStep("mock-interview")}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--brand)] px-5 text-sm font-bold text-white"
            >
              파이널 노트 보기 <ArrowRight className="size-4" />
            </Link>
          </div>
        </Card>
      </div>
    );
  return (
    <Card className="relative min-h-[34rem] overflow-hidden border-0 bg-[var(--surface-inverse)] p-6 text-center text-[var(--text-inverse)] sm:p-10">
      <button
        onClick={() => setPhase("select")}
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
            ? "답변을 듣고 있어요"
            : `${persona.name} · 첫 질문`}
        </p>
        <h2 className="mt-5 text-balance text-xl font-black leading-8 sm:text-2xl">
          과학 동아리의 실험 결과가 예상과 달랐을 때, 무엇을 기준으로 다음
          행동을 결정했나요?
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
              className="mt-8 border-transparent bg-white text-[#16233f]"
              onClick={() => setPhase("feedback")}
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
              onClick={() => setPhase("recording")}
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
  return (
    <div className="space-y-5">
      <div className="no-print flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 rounded-full bg-[var(--mint-soft)] px-4 py-2 text-xs font-extrabold text-[var(--success)]">
          <CheckCircle2 className="size-4" />
          준비 결과를 한 장으로 정리했어요
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => window.print()}>
            <Printer className="size-4" />
            인쇄
          </Button>
          <Button
            onClick={() => {
              setSaved(true);
              completeStep("cheat-sheet");
            }}
          >
            <Download className="size-4" />
            PDF 저장
          </Button>
        </div>
      </div>
      <article className="surface mx-auto max-w-[52rem] overflow-hidden bg-[var(--surface)] p-6 sm:p-10">
        <header className="flex flex-col justify-between gap-5 border-b-2 border-[var(--text-primary)] pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">AIHOW Final note</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-.05em]">
              김하우의 면접 한 장
            </h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              민족사관고등학교 · 2027학년도
            </p>
          </div>
          <div className="text-left text-xs leading-6 text-[var(--text-secondary)] sm:text-right">
            <p>
              완성도 <strong className="text-[var(--text-primary)]">84%</strong>
            </p>
            <p>최근 연습 2026.08.01</p>
          </div>
        </header>
        <section className="mt-8">
          <NoteTitle number="01" title="나를 설명하는 한 문장" />
          <blockquote className="mt-4 rounded-[var(--radius-md)] bg-[var(--brand-soft)] p-5 text-lg font-black leading-8 text-[var(--brand)]">
            “결과보다 과정을 기록하며, 다음 질문을 스스로 만드는 탐구자”
          </blockquote>
        </section>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <section>
            <NoteTitle number="02" title="꼭 말할 경험 3가지" />
            <ol className="mt-4 grid gap-4">
              {[
                "수질과 식물 생장 실험에서 변인을 다시 기록한 경험",
                "환경 프로젝트에서 팀의 기준을 합의한 경험",
                "실패한 가설을 질문으로 바꾸어 탐구를 이어간 경험",
              ].map((item, index) => (
                <li key={item} className="flex gap-3 text-sm leading-6">
                  <span className="font-black text-[var(--brand)]">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </section>
          <section>
            <NoteTitle number="03" title="학교와 연결할 키워드" />
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "자율 탐구",
                "공동체",
                "과정 기록",
                "질문 확장",
                "지식 나눔",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[var(--surface-muted)] px-3 py-2 text-xs font-extrabold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        </div>
        <section className="mt-8 border-t border-[var(--border)] pt-8">
          <NoteTitle number="04" title="답변할 때 기억할 것" />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Reminder
              icon={Clock3}
              title="70초 안에"
              text="상황보다 행동에 시간을 쓰기"
            />
            <Reminder
              icon={WandSparkles}
              title="근거부터"
              text="자소서 문장과 내 행동 연결"
            />
            <Reminder
              icon={Volume2}
              title="한 박자 쉬기"
              text="꼬리질문을 끝까지 듣기"
            />
          </div>
        </section>
        <footer className="mt-9 flex items-center justify-between border-t border-[var(--border)] pt-5 text-[10px] text-[var(--text-tertiary)]">
          <span>AIHOW · 학생이 직접 작성하고 연습한 내용을 요약했습니다.</span>
          <span>1 / 1</span>
        </footer>
      </article>
      {saved ? (
        <div
          role="status"
          className="no-print fixed bottom-24 left-1/2 z-50 -translate-x-1/2 bg-[var(--surface-inverse)] px-5 py-3 text-xs font-bold text-[var(--text-inverse)]"
        >
          파이널 노트를 저장했어요
        </div>
      ) : null}
    </div>
  );
}

function NoteTitle({ number, title }: { number: string; title: string }) {
  return (
    <h3 className="flex items-center gap-3 text-sm font-black">
      <span className="text-[var(--brand)]">{number}</span>
      {title}
    </h3>
  );
}
function Reminder({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Clock3;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] p-4">
      <Icon className="size-5 text-[var(--brand)]" />
      <p className="mt-4 text-sm font-black">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
        {text}
      </p>
    </div>
  );
}
