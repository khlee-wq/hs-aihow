"use client";

import {
  ArrowRight,
  Check,
  Clock3,
  MessageSquareText,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useAppStore } from "@/stores/app-store";
import {
  questionTracks,
  totalQuestionPriorities,
} from "./question-practice-data";

export function QuestionPracticeIntro() {
  const answers = useAppStore((state) => state.draftAnswers);
  const completedCount = useMemo(
    () =>
      questionTracks.reduce(
        (total, track) =>
          total +
          track.priorities.filter((question) => answers[question.id]).length,
        0,
      ),
    [answers],
  );
  const hasStarted = completedCount > 0;

  return (
    <section
      className="practice-session-canvas learning-intro-shell question-practice-intro-shell liquid-glass-group relative overflow-hidden rounded-[2rem] px-4 py-8 sm:px-7 sm:py-11 lg:px-8 lg:py-4"
      aria-labelledby="question-practice-intro-title"
      data-testid="question-practice-intro"
    >
      <div
        className="learning-intro-hero relative z-10 mx-auto max-w-5xl text-center"
        data-motion-hero
      >
        <span className="learning-intro-icon mx-auto grid size-13 place-items-center rounded-[1.1rem] bg-[color-mix(in_srgb,var(--surface-raised)_62%,transparent)] text-[var(--brand)] shadow-[inset_0_1px_0_color-mix(in_srgb,white_65%,transparent),var(--shadow-sm)] backdrop-blur-xl lg:size-10 lg:rounded-[.9rem]">
          <MessageSquareText className="size-6 lg:size-5" />
        </span>
        <p className="learning-intro-eyebrow mt-5 font-mono text-[10px] font-black tracking-[.18em] text-[var(--brand)] lg:mt-2">
          AIHOW QUESTION JOURNEY
        </p>
        <h1
          id="question-practice-intro-title"
          className="learning-intro-title mx-auto mt-4 max-w-3xl break-keep text-[clamp(1.8rem,4.2vw,3.7rem)] font-black leading-[1.15] tracking-[-.055em] lg:mt-2 lg:text-[clamp(2.3rem,3.4vw,3rem)] lg:leading-[1.06]"
        >
          준비한 이야기를
          <br />
          질문으로 꺼내볼까요?
        </h1>
        <p className="learning-intro-copy mx-auto mt-5 max-w-2xl break-keep text-sm leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8 lg:mt-3 lg:max-w-none lg:text-sm lg:leading-6 xl:whitespace-nowrap">
          열두 문제를 한꺼번에 푸는 시험이 아닙니다. 실제 경험을 찾고, 판단의
          이유를 말하고, 새로운 상황까지 생각을 넓히는 세 번의 연습입니다.
        </p>
        <div
          className="learning-intro-action mt-6 flex flex-col items-center lg:mt-3"
          data-motion-reveal
        >
          <Link
            href="/applications/demo/practice/session"
            className="group inline-flex min-h-13 items-center gap-3 rounded-[var(--radius-md)] bg-[var(--text-primary)] px-7 text-sm font-black text-[var(--canvas)] shadow-[0_18px_40px_color-mix(in_srgb,var(--surface-inverse)_16%,transparent)] transition-[transform,background,box-shadow] hover:-translate-y-1 hover:bg-[var(--brand)] hover:shadow-[0_22px_44px_color-mix(in_srgb,var(--brand)_22%,transparent)] lg:min-h-11 lg:px-6 lg:text-xs"
            data-motion-item
          >
            {hasStarted ? (
              <RotateCcw className="size-4" />
            ) : (
              <MessageSquareText className="size-4" />
            )}
            {hasStarted ? "이어서 질문 연습하기" : "질문 연습 시작하기"}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <div
            className="learning-intro-meta mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-[var(--text-tertiary)] lg:mt-2 lg:text-[10px]"
            data-motion-item
          >
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5" /> 약 12분
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3.5 text-[var(--success)]" /> 답변 자동
              저장
            </span>
            <span>언제든 이어서 진행</span>
          </div>
        </div>
      </div>

      <div
        className="practice-question-glass practice-intro-map relative z-10 mx-auto mt-8 w-full max-w-6xl overflow-hidden rounded-[1.6rem] sm:mt-10 lg:mt-4"
        data-motion-reveal
      >
        <div className="practice-intro-map-head flex flex-col gap-2 border-b border-[color-mix(in_srgb,var(--text-primary)_6%,transparent)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-5 lg:py-3">
          <div>
            <p className="text-xs font-black">오늘 이어갈 생각의 순서</p>
            <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
              각 영역의 네 질문은 앞선 답변을 바탕으로 이어집니다.
            </p>
          </div>
          <span className="font-mono text-[10px] font-black text-[var(--brand)]">
            {completedCount} / {totalQuestionPriorities} 준비
          </span>
        </div>

        <ol className="practice-intro-stages divide-y divide-[color-mix(in_srgb,var(--text-primary)_6%,transparent)] lg:grid lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {questionTracks.map((track, trackIndex) => {
            const answeredInTrack = track.priorities.filter(
              (question) => answers[question.id],
            ).length;
            return (
              <li
                key={track.id}
                className="practice-intro-stage grid gap-4 px-5 py-5 sm:grid-cols-[3.5rem_13rem_minmax(0,1fr)] sm:items-center sm:px-7 sm:py-6 lg:grid-cols-1 lg:content-start lg:items-start lg:gap-3 lg:px-5 lg:py-3"
                data-motion-item
              >
                <div className="flex items-center justify-between sm:block">
                  <span className="practice-intro-stage-index font-mono text-2xl font-black tracking-[-.06em] text-[color-mix(in_srgb,var(--brand)_42%,var(--text-tertiary))] sm:text-3xl lg:text-2xl">
                    0{trackIndex + 1}
                  </span>
                  <span className="text-[10px] font-black text-[var(--brand)] sm:hidden">
                    {answeredInTrack}/4 준비
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="practice-intro-stage-title text-base font-black sm:text-lg">
                      {track.category}
                    </h3>
                    {answeredInTrack === track.priorities.length ? (
                      <Check className="size-4 text-[var(--success)]" />
                    ) : null}
                  </div>
                  <p className="mt-1 break-keep text-xs leading-5 text-[var(--text-secondary)]">
                    {track.title}
                  </p>
                  <p className="mt-2 hidden text-[10px] font-black text-[var(--brand)] sm:block">
                    {answeredInTrack}/4 준비
                  </p>
                </div>
                <div className="practice-intro-priorities grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-4 sm:gap-2 lg:grid-cols-2">
                  {track.priorities.map((question, questionIndex) => {
                    const answered = Boolean(answers[question.id]);
                    return (
                      <div
                        key={question.id}
                        className="practice-intro-priority flex min-w-0 items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--surface-raised)_46%,transparent)] px-2.5 py-2 text-[10px] font-bold text-[var(--text-secondary)] shadow-[inset_0_1px_0_color-mix(in_srgb,white_48%,transparent)] lg:px-2 lg:py-1.5"
                      >
                        <span
                          className={`grid size-5 shrink-0 place-items-center rounded-full font-mono text-[8px] ${
                            answered
                              ? "bg-[var(--brand)] text-[var(--text-on-brand)]"
                              : "bg-[var(--surface)] text-[var(--brand)]"
                          }`}
                        >
                          {answered ? (
                            <Check className="size-3" />
                          ) : (
                            questionIndex + 1
                          )}
                        </span>
                        <span className="truncate">{question.label}</span>
                      </div>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="relative z-10 mx-auto mt-6 max-w-3xl text-center lg:hidden">
        <p className="inline-flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
          <Sparkles className="size-4 text-[var(--brand)]" />
          답변에 따라 다음 질문이 자연스럽게 달라집니다.
        </p>
      </div>
    </section>
  );
}
