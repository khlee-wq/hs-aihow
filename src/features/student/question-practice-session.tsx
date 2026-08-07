"use client";

import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  FileText,
  Lightbulb,
  Save,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppStore } from "@/stores/app-store";
import { submitQuestionPracticeAnswer } from "./question-practice-client";
import {
  questionTracks,
  totalQuestionPriorities,
} from "./question-practice-data";
import type { QuestionPracticeResponse } from "./question-practice-schema";

const questionOrderLabels = [
  "먼저 답해 볼 질문",
  "이유를 이어 말할 질문",
  "경험과 학교를 연결할 질문",
  "생각을 넓혀 볼 질문",
] as const;

const flatQuestions = questionTracks.flatMap((track, trackIndex) =>
  track.priorities.map((question, priorityIndex) => ({
    track,
    trackIndex,
    question,
    priorityIndex,
  })),
);

export function QuestionPracticeSession({
  applicationId,
}: {
  applicationId: string;
}) {
  const router = useRouter();
  const persistedAnswers = useAppStore((state) => state.draftAnswers);
  const practiceDrafts = useAppStore((state) => state.practiceDrafts);
  const practiceDraftUpdatedAt = useAppStore(
    (state) => state.practiceDraftUpdatedAt,
  );
  const saveAnswer = useAppStore((state) => state.saveAnswer);
  const savePracticeDraft = useAppStore((state) => state.savePracticeDraft);
  const clearPracticeDraft = useAppStore((state) => state.clearPracticeDraft);
  const completeStep = useAppStore((state) => state.completeStep);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProgressReady, setIsProgressReady] = useState(false);
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>({});
  const [feedbackByQuestion, setFeedbackByQuestion] = useState<
    Record<string, QuestionPracticeResponse>
  >({});
  const [generatedQuestions, setGeneratedQuestions] = useState<
    Record<string, string>
  >({});
  const hasRestoredProgress = useRef(false);
  const questionScene = useRef<HTMLDivElement>(null);
  const feedbackPanel = useRef<HTMLDivElement>(null);
  const motionDirection = useRef<1 | -1>(1);
  const draftSnapshot = useRef({ questionId: "", answer: "", savedAnswer: "" });

  const current = flatQuestions[currentIndex];
  const { track, question, trackIndex, priorityIndex } = current;
  const answer =
    localAnswers[question.id] ??
    practiceDrafts[question.id] ??
    persistedAnswers[question.id] ??
    "";
  const savedAnswer = persistedAnswers[question.id] ?? "";
  const currentFeedback = feedbackByQuestion[question.id];
  const currentQuestion = generatedQuestions[question.id] ?? question.question;
  const isSaved = Boolean(savedAnswer) && savedAnswer === answer.trim();
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === flatQuestions.length - 1;
  const progress = ((currentIndex + 1) / totalQuestionPriorities) * 100;
  const isDraftSaved =
    Boolean(answer.trim()) && practiceDrafts[question.id] === answer;

  useEffect(() => {
    const markProgressReady = () => setIsProgressReady(true);
    const unsubscribe =
      useAppStore.persist.onFinishHydration(markProgressReady);
    if (useAppStore.persist.hasHydrated()) markProgressReady();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isProgressReady) return;
    if (hasRestoredProgress.current) return;
    hasRestoredProgress.current = true;
    const latestDraftId = Object.entries(practiceDraftUpdatedAt)
      .filter(([questionId]) => Boolean(practiceDrafts[questionId]))
      .sort((left, right) => right[1] - left[1])[0]?.[0];
    const latestDraftIndex = latestDraftId
      ? flatQuestions.findIndex(
          ({ question: item }) => item.id === latestDraftId,
        )
      : -1;
    const nextIncomplete = flatQuestions.findIndex(
      ({ question: item }) => !persistedAnswers[item.id],
    );
    const restoreProgress = window.requestAnimationFrame(() => {
      const resumeIndex =
        latestDraftIndex >= 0 ? latestDraftIndex : nextIncomplete;
      if (resumeIndex > 0) setCurrentIndex(resumeIndex);
    });
    return () => window.cancelAnimationFrame(restoreProgress);
  }, [
    isProgressReady,
    persistedAnswers,
    practiceDraftUpdatedAt,
    practiceDrafts,
  ]);

  useEffect(() => {
    draftSnapshot.current = {
      questionId: question.id,
      answer,
      savedAnswer,
    };
  }, [answer, question.id, savedAnswer]);

  useEffect(() => {
    if (!isProgressReady) return;
    if (isSaved || practiceDrafts[question.id] === answer) return;
    const autosave = window.setTimeout(() => {
      savePracticeDraft(question.id, answer);
    }, 450);
    return () => window.clearTimeout(autosave);
  }, [
    answer,
    isProgressReady,
    isSaved,
    practiceDrafts,
    question.id,
    savePracticeDraft,
  ]);

  useEffect(() => {
    const flushCurrentDraft = () => {
      if (!useAppStore.persist.hasHydrated()) return;
      const snapshot = draftSnapshot.current;
      if (snapshot.answer.trim() !== snapshot.savedAnswer) {
        savePracticeDraft(snapshot.questionId, snapshot.answer);
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushCurrentDraft();
    };

    window.addEventListener("pagehide", flushCurrentDraft);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      flushCurrentDraft();
      window.removeEventListener("pagehide", flushCurrentDraft);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [savePracticeDraft]);

  useEffect(() => {
    const scene = questionScene.current;
    if (
      !scene ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let cancelled = false;
    let dispose: (() => void) | undefined;
    const animateQuestion = async () => {
      const { default: gsap } = await import("gsap");
      if (cancelled || !questionScene.current) return;

      const context = gsap.context(() => {
        const items = gsap.utils.toArray<HTMLElement>(
          "[data-question-motion]",
          questionScene.current,
        );
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(
            questionScene.current,
            {
              autoAlpha: 0,
              x: 18 * motionDirection.current,
              scale: 0.992,
            },
            {
              autoAlpha: 1,
              x: 0,
              scale: 1,
              duration: 0.5,
              clearProps: "transform,opacity,visibility",
            },
          )
          .fromTo(
            items,
            { autoAlpha: 0, y: 14 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.46,
              stagger: 0.055,
              clearProps: "transform,opacity,visibility",
            },
            "-=0.28",
          );
      }, scene);
      dispose = () => context.revert();
    };

    void animateQuestion();
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [currentIndex]);

  useEffect(() => {
    if (
      !currentFeedback ||
      !feedbackPanel.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    let cancelled = false;
    let dispose: (() => void) | undefined;
    const animateFeedback = async () => {
      const { default: gsap } = await import("gsap");
      if (cancelled || !feedbackPanel.current) return;
      const tween = gsap.fromTo(
        feedbackPanel.current,
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
        },
      );
      dispose = () => tween.kill();
    };
    void animateFeedback();
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [currentFeedback]);

  const mutation = useMutation({
    mutationFn: () =>
      submitQuestionPracticeAnswer({
        applicationId,
        trackId: track.id,
        questionId: question.id,
        answer: answer.trim(),
      }),
    onSuccess: (result) => {
      saveAnswer(question.id, answer.trim());
      clearPracticeDraft(question.id);
      setFeedbackByQuestion((currentFeedbacks) => ({
        ...currentFeedbacks,
        [question.id]: result,
      }));
      if (result.next) {
        setGeneratedQuestions((currentQuestions) => ({
          ...currentQuestions,
          [result.next!.questionId]: result.next!.question,
        }));
      }
    },
  });

  const completedCount = useMemo(
    () =>
      flatQuestions.filter(({ question: item }) => persistedAnswers[item.id])
        .length,
    [persistedAnswers],
  );

  const goNext = () => {
    if (!isSaved) return;
    if (isLast) {
      completeStep("practice");
      router.push(`/applications/${applicationId}/mock-interview`);
      return;
    }
    motionDirection.current = 1;
    setCurrentIndex((value) => value + 1);
  };

  return (
    <section
      className="practice-session-canvas liquid-glass-group relative mx-auto flex min-h-[calc(100svh-3.75rem)] max-w-[100rem] flex-col overflow-hidden rounded-[2rem] px-[var(--space-page)] sm:min-h-[calc(100svh-4.25rem)]"
      aria-labelledby="practice-session-question"
      aria-busy={!isProgressReady}
      data-progress-ready={isProgressReady}
    >
      <div className="relative z-10 pt-5 sm:pt-7" data-motion-reveal>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="student-kicker text-[var(--brand)]">
              {track.category} · {questionOrderLabels[priorityIndex]}
            </p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              한 질문씩 답하며 내 이야기의 기준을 찾아갑니다.
            </p>
          </div>
          <p className="shrink-0 font-mono text-xs font-black tabular-nums text-[var(--text-secondary)]">
            {String(currentIndex + 1).padStart(2, "0")} /{" "}
            {totalQuestionPriorities}
          </p>
        </div>
        <div
          className="mt-4 h-1 overflow-hidden rounded-full bg-[var(--surface-muted)]"
          aria-label={`질문 연습 ${currentIndex + 1}/${totalQuestionPriorities}`}
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={totalQuestionPriorities}
          aria-valuenow={currentIndex + 1}
        >
          <div
            className="h-full rounded-full bg-[var(--brand)] transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div
        ref={questionScene}
        className="relative z-10 grid flex-1 items-stretch gap-5 py-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8 lg:py-7"
        data-testid="question-practice-scene"
      >
        <article className="practice-question-glass flex min-w-0 flex-col rounded-[1.6rem] p-5 sm:p-7 lg:p-9">
          <div
            className="flex flex-wrap items-center gap-2 text-[11px] font-bold"
            data-question-motion
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--coral-soft)] px-3 py-1.5 text-[var(--coral)]">
              <Sparkles className="size-3.5" />{" "}
              {questionOrderLabels[priorityIndex]}
            </span>
            <span className="text-[var(--text-tertiary)]">
              {trackIndex + 1}번째 이야기 · {priorityIndex + 1}번째 질문
            </span>
          </div>

          <h1
            id="practice-session-question"
            className="student-question-title mt-5"
            data-question-motion
          >
            {currentQuestion}
          </h1>

          <div
            className="practice-context-glass mt-5 flex items-start gap-3 rounded-[var(--radius-md)] px-4 py-3.5 sm:mt-6"
            data-question-motion
          >
            <FileText className="mt-0.5 size-4 shrink-0 text-[var(--brand)]" />
            <div className="min-w-0">
              <p className="text-[10px] font-black text-[var(--brand)]">
                자소서 근거
              </p>
              <p className="mt-1 break-keep text-xs leading-5 text-[var(--text-secondary)] sm:text-sm">
                {track.source}
              </p>
            </div>
          </div>

          <details
            className="practice-context-glass mt-3 rounded-[var(--radius-md)] lg:hidden"
            data-question-motion
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2.5 px-4 text-xs font-black marker:hidden">
              <Lightbulb className="size-4 text-[var(--brand)]" />
              답변 기준 살펴보기
              <span className="ml-auto text-[var(--text-tertiary)]">＋</span>
            </summary>
            <div className="border-t border-[var(--border)] px-4 py-3.5">
              <p className="break-keep text-xs leading-5 text-[var(--text-secondary)]">
                {question.guide}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {question.checkpoints.map((checkpoint) => (
                  <span
                    key={checkpoint}
                    className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-[10px] font-bold text-[var(--text-secondary)]"
                  >
                    {checkpoint}
                  </span>
                ))}
              </div>
            </div>
          </details>

          <label
            className="mt-5 block text-xs font-black sm:mt-6"
            htmlFor="practice-answer"
            data-question-motion
          >
            이 질문에 대한 내 답변
          </label>
          <textarea
            id="practice-answer"
            value={answer}
            disabled={!isProgressReady}
            onChange={(event) => {
              setLocalAnswers((currentAnswers) => ({
                ...currentAnswers,
                [question.id]: event.target.value,
              }));
              mutation.reset();
            }}
            placeholder="완성된 문장보다, 그때의 장면과 내가 한 행동부터 적어 보세요."
            className="liquid-answer-field mt-2 min-h-40 w-full flex-1 resize-none rounded-[var(--radius-md)] border border-[color-mix(in_srgb,var(--text-primary)_8%,transparent)] p-4 text-sm leading-7 outline-none transition-[border-color,background,box-shadow] placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand)] focus:bg-[color-mix(in_srgb,var(--surface)_58%,transparent)] focus:shadow-[0_0_0_3px_var(--brand-soft)] sm:min-h-48 sm:p-5 sm:text-base"
            data-question-motion
          />

          <div
            className="mt-3 flex min-h-6 items-center justify-between gap-3 text-[11px] text-[var(--text-tertiary)]"
            data-question-motion
          >
            <span>{answer.trim().length}자 · 이 기기에 자동 보관됩니다</span>
            {isSaved ? (
              <span
                role="status"
                className="inline-flex items-center gap-1.5 font-bold text-[var(--success)]"
              >
                <Check className="size-3.5" /> 답변 저장됨
              </span>
            ) : isDraftSaved ? (
              <span
                role="status"
                className="inline-flex items-center gap-1.5 font-bold text-[var(--brand)]"
              >
                <Check className="size-3.5" /> 임시 저장됨
              </span>
            ) : answer.trim() ? (
              <span role="status">자동 저장 중…</span>
            ) : null}
          </div>

          {currentFeedback ? (
            <div
              ref={feedbackPanel}
              className="practice-feedback-glass mt-4 rounded-[var(--radius-md)] px-4 py-3.5"
            >
              <p className="text-xs font-black text-[var(--brand)]">
                답변에서 찾은 강점
              </p>
              <p className="mt-1 break-keep text-sm leading-6 text-[var(--text-secondary)]">
                {currentFeedback.evaluation.summary}
              </p>
            </div>
          ) : null}
        </article>

        <aside
          className="practice-guide-glass hidden rounded-[1.6rem] p-6 lg:flex lg:flex-col"
          data-question-motion
        >
          <div className="flex items-center gap-2 text-xs font-black">
            <span className="grid size-8 place-items-center rounded-full bg-[var(--surface)] text-[var(--brand)]">
              <Lightbulb className="size-4" />
            </span>
            답변을 만드는 기준
          </div>
          <p className="mt-4 break-keep text-sm leading-6 text-[var(--text-secondary)]">
            {question.guide}
          </p>
          <ul className="mt-5 grid gap-2.5" aria-label="답변 확인 기준">
            {question.checkpoints.map((checkpoint, index) => (
              <li
                key={checkpoint}
                className="flex items-center gap-2.5 text-xs font-bold"
              >
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--surface)] font-mono text-[9px] text-[var(--brand)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {checkpoint}
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-[var(--border)] pt-4 lg:mt-auto">
            <p className="text-[10px] font-black text-[var(--text-tertiary)]">
              현재까지
            </p>
            <p className="mt-1 text-sm font-black">
              {completedCount}/{totalQuestionPriorities}개의 답변을 준비했어요
            </p>
          </div>
        </aside>
      </div>

      <footer className="practice-session-footer sticky bottom-0 z-30 -mx-[var(--space-page)] px-[var(--space-page)] py-3 sm:py-4">
        <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-3">
          <button
            type="button"
            disabled={isFirst}
            onClick={() => {
              motionDirection.current = -1;
              setCurrentIndex((value) => Math.max(0, value - 1));
            }}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 px-2 text-xs font-bold text-[var(--text-secondary)] disabled:cursor-not-allowed disabled:opacity-35 sm:px-4 sm:text-sm"
          >
            <ChevronLeft className="size-4" /> 이전 질문
          </button>

          <div className="hidden items-center gap-2 font-mono text-xs font-black text-[var(--text-tertiary)] sm:flex">
            <span className="text-[var(--text-primary)]">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>
            <span>/</span>
            <span>{totalQuestionPriorities}</span>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            {!isSaved ? (
              <button
                type="button"
                disabled={answer.trim().length < 10 || mutation.isPending}
                onClick={() => mutation.mutate()}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[var(--radius-md)] bg-[var(--brand)] px-4 text-xs font-black text-[var(--text-on-brand)] transition-[transform,background] hover:-translate-y-0.5 hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-45 sm:px-5 sm:text-sm"
              >
                <Save className="size-4" />
                {mutation.isPending ? "답변 살펴보는 중" : "답변 저장"}
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[var(--radius-md)] bg-[var(--text-primary)] px-4 text-xs font-black text-[var(--canvas)] transition-[transform,background] hover:-translate-y-0.5 hover:bg-[var(--brand)] sm:px-5 sm:text-sm"
              >
                {isLast ? "모의면접으로 이어가기" : "다음 질문"}
                <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </div>
      </footer>
    </section>
  );
}
