"use client";

import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Lightbulb,
  LockKeyhole,
  Map,
  Save,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { AppDialog } from "@/components/ui/app-dialog";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { submitQuestionPracticeAnswer } from "./question-practice-client";
import {
  questionTracks,
  totalQuestionPriorities,
  type QuestionTrack,
} from "./question-practice-data";
import type { QuestionPracticeResponse } from "./question-practice-schema";

function isQuestionUnlocked(
  track: QuestionTrack,
  priorityIndex: number,
  answers: Record<string, string>,
) {
  return (
    priorityIndex === 0 ||
    Boolean(answers[track.priorities[priorityIndex - 1].id])
  );
}

function answeredQuestions(answers: Record<string, string>) {
  return questionTracks.reduce(
    (total, track) =>
      total +
      track.priorities.filter((question) => Boolean(answers[question.id]))
        .length,
    0,
  );
}

const questionOrderLabels = [
  "먼저 답해 볼 질문",
  "이유를 이어 말할 질문",
  "연결해 볼 질문",
  "생각을 넓힐 질문",
] as const;

const questionTutorialStorageKey = "aihow-question-practice-tutorial-seen";

const coachSteps = [
  {
    icon: FileText,
    number: "01",
    title: "자소서에서 근거 찾기",
    description: "학생이 쓴 활동과 생각에서 면접관이 확인할 지점을 찾습니다.",
  },
  {
    icon: Map,
    number: "02",
    title: "먼저 준비할 질문 고르기",
    description: "학교와 준비 흐름을 함께 보고 지금 필요한 질문부터 꺼냅니다.",
  },
  {
    icon: CheckCircle2,
    number: "03",
    title: "답변에 맞춰 다음 질문 잇기",
    description:
      "답변에서 더 확인할 부분을 찾아 다음 질문으로 자연스럽게 이어 갑니다.",
  },
] as const;

export function QuestionPractice() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [priorityIndex, setPriorityIndex] = useState(0);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const answers = useAppStore((state) => state.draftAnswers);
  const saveAnswer = useAppStore((state) => state.saveAnswer);
  const completeStep = useAppStore((state) => state.completeStep);
  const track = questionTracks[trackIndex];
  const question = track.priorities[priorityIndex];
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>({});
  const [feedbackByQuestion, setFeedbackByQuestion] = useState<
    Record<string, QuestionPracticeResponse>
  >({});
  const [generatedQuestions, setGeneratedQuestions] = useState<
    Record<string, string>
  >({});
  const answer = localAnswers[question.id] ?? answers[question.id] ?? "";
  const currentQuestion = generatedQuestions[question.id] ?? question.question;
  const currentFeedback = feedbackByQuestion[question.id];
  const completedCount = answeredQuestions(answers);
  const currentSaved =
    Boolean(answers[question.id]) && answers[question.id] === answer;
  const isLastQuestion = priorityIndex === track.priorities.length - 1;
  const isLastTrack = trackIndex === questionTracks.length - 1;
  const currentOrderLabel = questionOrderLabels[priorityIndex];

  useEffect(() => {
    if (window.localStorage.getItem(questionTutorialStorageKey)) return;
    const openTutorial = window.requestAnimationFrame(() => {
      setIsTutorialOpen(true);
    });
    return () => window.cancelAnimationFrame(openTutorial);
  }, []);

  const closeTutorial = ({ focusAnswer = false } = {}) => {
    window.localStorage.setItem(questionTutorialStorageKey, "true");
    setIsTutorialOpen(false);
    if (focusAnswer) {
      window.requestAnimationFrame(() => {
        document.getElementById("question-answer")?.focus();
      });
    }
  };

  const mutation = useMutation({
    mutationFn: () =>
      submitQuestionPracticeAnswer({
        applicationId: "demo",
        trackId: track.id,
        questionId: question.id,
        answer: answer.trim(),
      }),
    onSuccess: (result) => {
      saveAnswer(question.id, answer.trim());
      setFeedbackByQuestion((current) => ({
        ...current,
        [question.id]: result,
      }));
      if (result.next) {
        setGeneratedQuestions((current) => ({
          ...current,
          [result.next!.questionId]: result.next!.question,
        }));
      }
    },
  });

  const answeredInTrack = useMemo(
    () => track.priorities.filter((item) => Boolean(answers[item.id])).length,
    [answers, track],
  );

  const selectTrack = (nextTrackIndex: number) => {
    const nextTrack = questionTracks[nextTrackIndex];
    const firstIncomplete = nextTrack.priorities.findIndex(
      (item, index) =>
        !answers[item.id] && isQuestionUnlocked(nextTrack, index, answers),
    );
    setTrackIndex(nextTrackIndex);
    setPriorityIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
  };

  const goNext = () => {
    if (!isLastQuestion) {
      setPriorityIndex((value) => value + 1);
      return;
    }
    if (!isLastTrack) {
      setTrackIndex((value) => value + 1);
      setPriorityIndex(0);
    }
  };

  return (
    <section className="space-y-5" aria-labelledby="question-practice-title">
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--text-primary)] text-[var(--canvas)]">
        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-black tracking-[.2em] text-[var(--mint)]">
              AI 준비 코치
            </p>
            <h2
              id="question-practice-title"
              className="mt-3 text-2xl font-black tracking-[-.045em] sm:text-3xl"
            >
              자소서에서 물어볼 이야기를 함께 찾아볼게요
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 opacity-65">
              자소서 근거에서 먼저 확인할 이야기를 고르고, 답변을 바탕으로 다음
              질문을 이어가며 면접 답변을 단단하게 만듭니다.
            </p>
          </div>
          <div className="border-t border-white/10 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <div className="flex items-center justify-between gap-3 text-[11px] font-bold text-white/65">
              <span>AI가 도와주는 순서</span>
              <button
                type="button"
                onClick={() => setIsTutorialOpen(true)}
                className="inline-flex cursor-pointer items-center gap-1.5 text-[var(--mint)] hover:text-white"
                aria-haspopup="dialog"
              >
                <Sparkles className="size-3.5" /> 연습 안내 보기
              </button>
            </div>
            <div className="mt-4 grid gap-2">
              {coachSteps.map(({ icon: StepIcon, title }, index) => {
                return (
                  <div
                    key={title}
                    className="flex items-center gap-3 text-xs font-bold"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/10 text-[var(--mint)]">
                      <StepIcon className="size-3.5" />
                    </span>
                    <span>{title}</span>
                    {index < 2 ? (
                      <span className="ml-auto text-white/30">↓</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
              <div>
                <p className="text-[11px] font-bold text-white/65">
                  전체 질문 지도
                </p>
                <p className="mt-1 text-sm font-black">
                  {completedCount}/{totalQuestionPriorities} 준비함
                </p>
              </div>
              <strong className="text-3xl font-black tabular-nums text-[var(--mint)]">
                {String(completedCount).padStart(2, "0")}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <nav aria-label="질문군 선택" className="border-y border-[var(--border)]">
        <div className="grid grid-cols-3">
          {questionTracks.map((item, itemIndex) => {
            const active = itemIndex === trackIndex;
            const done = item.priorities.filter(
              (entry) => answers[entry.id],
            ).length;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={active ? "step" : undefined}
                onClick={() => selectTrack(itemIndex)}
                className={cn(
                  "relative min-w-0 cursor-pointer border-r border-[var(--border)] px-3 py-3 text-left last:border-r-0 sm:min-h-[6.4rem] sm:px-5 sm:py-4",
                  active && "bg-[var(--brand-soft)] text-[var(--text-primary)]",
                )}
              >
                <span className="font-mono text-[9px] font-black text-[var(--brand)] sm:text-[10px]">
                  0{itemIndex + 1} · {done}/{item.priorities.length}
                </span>
                <strong className="mt-1.5 block text-xs sm:mt-2 sm:text-sm">
                  {item.category}
                </strong>
                <span className="mt-1 block hidden text-xs text-[var(--text-secondary)] sm:block">
                  {item.title}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="grid overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] xl:grid-cols-[15rem_minmax(0,1fr)_18rem]">
        <aside className="border-b border-[var(--border)] bg-[var(--surface-muted)] p-4 sm:p-5 xl:border-b-0 xl:border-r">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-black text-[var(--brand)]">
                질문 순서
              </p>
              <h3 className="mt-2 text-sm font-black">{track.category}</h3>
            </div>
            <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-[10px] font-black text-[var(--text-secondary)] xl:hidden">
              {String(priorityIndex + 1).padStart(2, "0")}/
              {String(track.priorities.length).padStart(2, "0")}
            </span>
          </div>
          <ol
            className="mt-4 grid grid-cols-4 gap-2 xl:grid-cols-1 xl:gap-1"
            aria-label={`${track.category} 우선 질문`}
          >
            {track.priorities.map((item, itemIndex) => {
              const unlocked = isQuestionUnlocked(track, itemIndex, answers);
              const answered = Boolean(answers[item.id]);
              const active = itemIndex === priorityIndex;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    disabled={!unlocked}
                    onClick={() => setPriorityIndex(itemIndex)}
                    aria-current={active ? "step" : undefined}
                    aria-label={`${questionOrderLabels[itemIndex]} ${item.label}${unlocked ? "" : " 잠김"}`}
                    className={cn(
                      "group flex min-h-16 w-full cursor-pointer flex-col justify-between gap-2 rounded-[var(--radius-sm)] border px-2.5 py-2.5 text-left transition-colors disabled:cursor-not-allowed xl:min-h-0 xl:flex-row xl:items-center xl:border-transparent xl:px-3 xl:py-3",
                      active
                        ? "border-[var(--brand)] bg-[var(--surface)] text-[var(--text-primary)] xl:border-[var(--border)]"
                        : "border-[var(--border)] text-[var(--text-secondary)] xl:border-transparent",
                      !unlocked && "opacity-45",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-black",
                          answered
                            ? "bg-[var(--mint-soft)] text-[var(--success)]"
                            : active
                              ? "bg-[var(--brand)] text-[var(--text-on-brand)]"
                              : "bg-[var(--surface)] text-[var(--text-tertiary)]",
                        )}
                      >
                        {unlocked ? (
                          String(itemIndex + 1).padStart(2, "0")
                        ) : (
                          <LockKeyhole className="size-3" />
                        )}
                      </span>
                      <span className="hidden text-xs font-extrabold xl:inline">
                        {item.label}
                      </span>
                    </span>
                    <span className="text-[10px] font-bold xl:hidden">
                      {item.shortLabel}
                    </span>
                    {active ? (
                      <ChevronRight className="hidden size-3.5 text-[var(--brand)] xl:block" />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-5 hidden border-t border-[var(--border)] pt-4 xl:block">
            <p className="text-[11px] leading-5 text-[var(--text-secondary)]">
              {answeredInTrack === track.priorities.length
                ? "이 질문군의 우선 질문을 모두 준비했어요."
                : "답변을 제출할 때마다 다음 우선 질문이 열립니다."}
            </p>
          </div>
        </aside>

        <article className="min-w-0 p-5 sm:p-7 lg:p-9">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--coral-soft)] px-3 py-1.5 text-[10px] font-black text-[var(--coral)]">
                {currentOrderLabel}
              </span>
              <span className="font-mono text-[10px] font-black text-[var(--text-tertiary)]">
                {String(priorityIndex + 1).padStart(2, "0")}/
                {String(track.priorities.length).padStart(2, "0")}
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--text-tertiary)]">
              <Map className="size-3.5" /> 질문을 이어가는 순서
            </span>
          </div>

          <p className="mt-6 text-xs font-black text-[var(--brand)]">
            {question.label} · {question.intent}
          </p>
          <h3 className="mt-3 max-w-3xl text-balance text-xl font-black leading-8 tracking-[-.035em] sm:text-2xl sm:leading-9">
            {currentQuestion}
          </h3>

          <div className="mt-6 grid gap-3 border-y border-[var(--border)] py-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:gap-5">
            <span className="inline-flex items-center gap-2 text-xs font-black">
              <FileText className="size-4 text-[var(--brand)]" /> 자소서 근거
            </span>
            <p className="text-xs leading-6 text-[var(--text-secondary)]">
              {track.source}
            </p>
          </div>

          <label
            className="mt-6 block text-sm font-extrabold"
            htmlFor="question-answer"
          >
            이 질문에 대한 내 답변
          </label>
          <textarea
            id="question-answer"
            value={answer}
            onChange={(event) =>
              setLocalAnswers((current) => ({
                ...current,
                [question.id]: event.target.value,
              }))
            }
            className="mt-2 min-h-52 w-full resize-y rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-7 outline-none transition-[border-color,box-shadow] placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--brand)_12%,transparent)]"
            placeholder="완성된 문장보다 당시 상황과 내 행동부터 적어 보세요."
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="text-[var(--text-tertiary)]">
              {answer.length}자 · 답변을 제출하면 다음 우선 질문이 이어집니다
            </span>
            {currentSaved ? (
              <span
                className="flex items-center gap-1.5 font-bold text-[var(--success)]"
                role="status"
              >
                <CheckCircle2 className="size-3.5" /> 답변 반영됨 · 다음 질문
                열림
              </span>
            ) : null}
          </div>
          {mutation.isError ? (
            <p
              className="mt-3 text-xs font-bold text-[var(--danger)]"
              role="alert"
            >
              {mutation.error.message}
            </p>
          ) : null}

          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="ghost"
              disabled={priorityIndex === 0}
              onClick={() => setPriorityIndex((value) => value - 1)}
            >
              <ChevronLeft className="size-4" /> 이전 질문
            </Button>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="secondary"
                loading={mutation.isPending}
                disabled={answer.trim().length < 10 || currentSaved}
                onClick={() => mutation.mutate()}
              >
                <Save className="size-4" /> 답변 제출
              </Button>
              {isLastQuestion && isLastTrack ? (
                <Link
                  href="/applications/demo/mock-interview"
                  onClick={() => completeStep("practice")}
                  aria-disabled={!currentSaved}
                  className={cn(
                    "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--brand)] px-5 text-sm font-bold text-[var(--text-on-brand)]",
                    !currentSaved && "pointer-events-none opacity-45",
                  )}
                >
                  질문 연습 완료 <ArrowRight className="size-4" />
                </Link>
              ) : (
                <Button disabled={!currentSaved} onClick={goNext}>
                  {isLastQuestion ? "다음 질문군" : "다음 질문"}
                  <ChevronRight className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </article>

        <aside className="border-t border-[var(--border)] p-5 sm:p-6 xl:border-l xl:border-t-0">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[var(--brand)]" />
            <h3 className="text-sm font-black">답변 설계 기준</h3>
          </div>
          <p className="mt-3 text-xs leading-6 text-[var(--text-secondary)]">
            {question.guide}
          </p>

          <ol className="mt-5 border-y border-[var(--border)] py-2">
            {question.checkpoints.map((checkpoint, itemIndex) => (
              <li
                key={checkpoint}
                className="flex items-center gap-3 border-b border-[var(--border)] py-3 last:border-b-0"
              >
                <span
                  className={cn(
                    "grid size-6 shrink-0 place-items-center rounded-full font-mono text-[9px] font-black",
                    currentSaved &&
                      currentFeedback?.evaluation.completedCheckpoints.includes(
                        checkpoint,
                      )
                      ? "bg-[var(--mint-soft)] text-[var(--success)]"
                      : "bg-[var(--brand-soft)] text-[var(--brand)]",
                  )}
                >
                  {currentSaved &&
                  currentFeedback?.evaluation.completedCheckpoints.includes(
                    checkpoint,
                  ) ? (
                    <Check className="size-3.5" />
                  ) : (
                    `0${itemIndex + 1}`
                  )}
                </span>
                <span className="text-xs font-bold">{checkpoint}</span>
              </li>
            ))}
          </ol>

          <div
            className={cn(
              "mt-5 rounded-[var(--radius-md)] p-4",
              currentSaved && currentFeedback
                ? "bg-[var(--mint-soft)]"
                : "bg-[var(--warning-soft)]",
            )}
          >
            <div
              className={cn(
                "flex items-center gap-2 text-xs font-black",
                currentSaved && currentFeedback
                  ? "text-[var(--success)]"
                  : "text-[var(--warning)]",
              )}
            >
              {currentSaved && currentFeedback ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Lightbulb className="size-4" />
              )}
              {currentSaved && currentFeedback ? "답변 확인" : "지금의 초점"}
            </div>
            <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">
              {currentSaved && currentFeedback
                ? currentFeedback.evaluation.summary
                : "문장을 매끄럽게 만드는 것보다 세 가지 기준이 답변 안에 실제로 들어갔는지 먼저 확인하세요."}
            </p>
            {currentSaved && currentFeedback?.evaluation.revisionFocus ? (
              <p className="mt-2 border-t border-[var(--border)] pt-2 text-[11px] font-bold text-[var(--text-secondary)]">
                다음 보완 · {currentFeedback.evaluation.revisionFocus}
              </p>
            ) : null}
          </div>

          {!isQuestionUnlocked(track, priorityIndex + 1, answers) &&
          !isLastQuestion ? (
            <p className="mt-5 flex items-start gap-2 text-[11px] leading-5 text-[var(--text-tertiary)]">
              <LockKeyhole className="mt-0.5 size-3.5 shrink-0" />
              현재 답변을 제출하면 “{track.priorities[priorityIndex + 1].label}”
              질문이 열립니다.
            </p>
          ) : null}
        </aside>
      </div>

      <AppDialog
        open={isTutorialOpen}
        onClose={() => closeTutorial()}
        eyebrow="질문 연습 안내"
        title="외운 답 대신, 내 판단이 드러나는 이야기를 만들어요"
        className="max-w-2xl"
      >
        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          전문가의 면접 기준을 따라 자소서 속 장면을 꺼내고, 그때의 판단과 다음
          행동까지 차례로 정리합니다. 한 질문씩 답하면 다음 질문이 자연스럽게
          이어집니다.
        </p>
        <div className="mt-6 rounded-[var(--radius-md)] bg-[var(--brand-soft)] p-4 sm:p-5">
          <p className="font-mono text-[10px] font-black tracking-[.16em] text-[var(--brand)]">
            이번 수업의 출발점
          </p>
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg font-black">{track.category}</h3>
            <span className="text-xs font-bold text-[var(--text-secondary)]">
              {track.source}
            </span>
          </div>
          <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">
            {track.summary}
          </p>
        </div>
        <ol className="mt-5 grid gap-2 sm:grid-cols-3">
          {coachSteps.map(({ icon: StepIcon, number, title, description }) => (
            <li
              key={number}
              className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-muted)] p-4"
            >
              <span className="grid size-8 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                <StepIcon className="size-4" />
              </span>
              <span className="mt-4 block font-mono text-[10px] font-black tracking-[.16em] text-[var(--brand)]">
                {number}
              </span>
              <h3 className="mt-2 text-sm font-black">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
                {description}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-5 border-t border-[var(--border)] pt-5">
          <p className="text-sm font-bold leading-6">
            첫 질문부터 완벽하게 답하려 하지 않아도 괜찮아요. 실제 장면과 내
            행동을 먼저 적으면, 다음 질문이 답변의 깊이를 더해 줍니다.
          </p>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => closeTutorial()}>
              나중에 할게요
            </Button>
            <Button onClick={() => closeTutorial({ focusAnswer: true })}>
              첫 질문 시작하기 <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </AppDialog>
    </section>
  );
}
