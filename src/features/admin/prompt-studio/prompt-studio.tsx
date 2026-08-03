"use client";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  FileText,
  MessageCircleQuestion,
  Mic2,
  Play,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { inputClass, textareaClass } from "@/components/ui/field";
import { cn, sleep } from "@/lib/utils";
import {
  defaultPromptStudioDraft,
  loadPromptStudioDraft,
  savePromptStudioDraft,
  type CoachingStage,
  type PromptStudioDraft,
} from "./prompt-studio-storage";

const stages: Array<{
  id: CoachingStage;
  label: string;
  description: string;
  icon: typeof FileText;
}> = [
  {
    id: "essay",
    label: "자소서 코칭",
    description: "소재와 근거를 구체화",
    icon: FileText,
  },
  {
    id: "questions",
    label: "예상 질문",
    description: "질문 의도와 우선순위",
    icon: MessageCircleQuestion,
  },
  {
    id: "answer",
    label: "답변 코칭",
    description: "학생의 말로 구조화",
    icon: Sparkles,
  },
  {
    id: "interview",
    label: "모의면접",
    description: "압박·꼬리질문 피드백",
    icon: Mic2,
  },
];

const safeguardOptions = [
  { id: "noGhostwriting", label: "학생 대신 완성 답안을 쓰지 않기" },
  { id: "approvedKnowledge", label: "승인된 학교 기준만 사용하기" },
  { id: "showEvidence", label: "코칭 근거를 함께 보여주기" },
  { id: "oneQuestion", label: "한 번에 질문 하나만 제시하기" },
];

const toneOptions = [
  { id: "warm" as const, label: "따뜻하게" },
  { id: "direct" as const, label: "명확하게" },
  { id: "pressure" as const, label: "압박형" },
];

const sampleStudentAnswer =
  "탐구 프로젝트에서 팀을 이끌어 성공적으로 마무리했습니다. 역할을 나누고 친구들을 도와 결과를 완성했습니다.";

function buildDemoAnswer(draft: PromptStudioDraft) {
  const tone =
    draft.tone === "warm"
      ? "좋은 출발이에요. "
      : draft.tone === "pressure"
        ? "‘이끌었다’는 말만으로는 역할이 확인되지 않습니다. "
        : "팀을 이끌었다는 표현보다 실제 행동을 먼저 보여주세요. ";
  const depth =
    draft.followUpDepth >= 3
      ? "그 선택에 반대한 팀원이 있었다면 어떻게 설득했는지, 결과가 달라졌다는 근거까지 이어서 설명해보세요."
      : "의견이 갈린 순간 어떤 기준으로 선택했는지 한 문장으로 답해보세요.";
  return `${tone}${depth}`;
}

export function PromptStudio() {
  const [draft, setDraft] = useState(defaultPromptStudioDraft);
  const [studentAnswer, setStudentAnswer] = useState(sampleStudentAnswer);
  const [generatedAnswer, setGeneratedAnswer] = useState(
    defaultPromptStudioDraft.expertAnswer,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [hasExpertEdit, setHasExpertEdit] = useState(false);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      const stored = loadPromptStudioDraft();
      if (!stored) return;
      setDraft(stored);
      setGeneratedAnswer(stored.expertAnswer);
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  const selectedStage = useMemo(
    () => stages.find((stage) => stage.id === draft.stage) ?? stages[0],
    [draft.stage],
  );

  function updateDraft(patch: Partial<PromptStudioDraft>) {
    setDraft((current) => ({ ...current, ...patch, status: "draft" }));
    setFeedback("");
  }

  async function generatePreview() {
    setIsGenerating(true);
    setFeedback("");
    await sleep(650);
    const answer = buildDemoAnswer(draft);
    setGeneratedAnswer(answer);
    setDraft((current) => ({
      ...current,
      expertAnswer: answer,
      status: "draft",
    }));
    setHasExpertEdit(false);
    setIsGenerating(false);
    setFeedback("현재 규칙으로 코칭 답변을 다시 만들었습니다.");
  }

  function save(status: PromptStudioDraft["status"]) {
    const next = {
      ...draft,
      expertAnswer: generatedAnswer,
      status,
      version: status === "approved" ? draft.version + 1 : draft.version,
      updatedAt: new Date().toISOString(),
    };
    setDraft(next);
    savePromptStudioDraft(next);
    setHasExpertEdit(false);
    setFeedback(
      status === "approved"
        ? `v${next.version} 기준으로 승인했습니다. 학생 화면에는 승인된 버전만 반영됩니다.`
        : "이 기기에 초안을 저장했습니다.",
    );
  }

  return (
    <div className="space-y-7 float-in" data-testid="prompt-studio">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">Expert coaching studio</p>
          <h1 className="heading-lg mt-3">코칭 설계실</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            소장님의 판단 기준을 단계별 규칙으로 만들고, AI 답변을 직접 수정한
            뒤 승인된 결과만 학생에게 적용합니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => save("draft")}>
            <Save className="size-4" />
            초안 저장
          </Button>
          <Button onClick={() => save("approved")}>
            <CheckCircle2 className="size-4" />
            승인하고 적용
          </Button>
        </div>
      </header>

      <section
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="코칭 단계 선택"
      >
        {stages.map(({ id, label, description, icon: Icon }, index) => {
          const active = draft.stage === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => updateDraft({ stage: id })}
              aria-pressed={active}
              className={cn(
                "surface group flex min-h-24 items-center gap-4 bg-[var(--surface)] p-4 text-left transition-[transform,border-color,background] hover:-translate-y-0.5",
                active && "border-[var(--brand)] bg-[var(--brand-soft)]",
              )}
            >
              <span
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--surface-muted)] text-[var(--text-secondary)]",
                  active && "bg-[var(--surface)] text-[var(--brand)]",
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="text-[10px] font-black text-[var(--text-tertiary)]">
                  0{index + 1}
                </span>
                <strong className="mt-1 block text-sm">{label}</strong>
                <span className="mt-1 block text-[11px] text-[var(--text-secondary)]">
                  {description}
                </span>
              </span>
            </button>
          );
        })}
      </section>

      {feedback ? (
        <p
          role="status"
          className="flex items-start gap-2 rounded-[var(--radius-sm)] bg-[var(--mint-soft)] px-4 py-3 text-sm font-bold text-[var(--success)]"
        >
          <Check className="mt-0.5 size-4 shrink-0" />
          {feedback}
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(22rem,.95fr)]">
        <div className="space-y-5">
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black text-[var(--brand)]">
                  STEP 1 · 기준 설정
                </p>
                <h2 className="mt-2 text-lg font-black">
                  {selectedStage.label}의 판단 방식을 정합니다
                </h2>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1.5 text-[10px] font-black",
                  draft.status === "approved"
                    ? "bg-[var(--mint-soft)] text-[var(--success)]"
                    : "bg-[var(--warning-soft)] text-[var(--warning)]",
                )}
              >
                v{draft.version} ·{" "}
                {draft.status === "approved" ? "승인됨" : "편집 중"}
              </span>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                적용 학교
                <select
                  className={inputClass}
                  value={draft.school}
                  onChange={(event) =>
                    updateDraft({ school: event.target.value })
                  }
                >
                  <option>공통</option>
                  <option>민사고</option>
                  <option>하나고</option>
                  <option>외대부고</option>
                  <option>상산고</option>
                </select>
              </label>
              <fieldset>
                <legend className="text-sm font-bold">코칭 어조</legend>
                <div className="mt-2 grid grid-cols-3 gap-1 rounded-[var(--radius-sm)] bg-[var(--surface-muted)] p-1">
                  {toneOptions.map((tone) => (
                    <button
                      key={tone.id}
                      type="button"
                      aria-pressed={draft.tone === tone.id}
                      onClick={() => updateDraft({ tone: tone.id })}
                      className={cn(
                        "min-h-10 rounded-[var(--radius-xs)] px-2 text-xs font-bold text-[var(--text-secondary)]",
                        draft.tone === tone.id &&
                          "bg-[var(--surface)] text-[var(--text-primary)] shadow-[var(--shadow-sm)]",
                      )}
                    >
                      {tone.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>

            <label
              className="mt-5 block text-sm font-bold"
              htmlFor="coaching-instruction"
            >
              소장님 코칭 지침
            </label>
            <textarea
              id="coaching-instruction"
              className={cn(textareaClass, "mt-2 min-h-40")}
              value={draft.instruction}
              onChange={(event) =>
                updateDraft({ instruction: event.target.value })
              }
            />

            <div className="mt-5">
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm font-bold" htmlFor="follow-up-depth">
                  꼬리질문 깊이
                </label>
                <strong className="text-sm text-[var(--brand)]">
                  {draft.followUpDepth}단계
                </strong>
              </div>
              <input
                id="follow-up-depth"
                type="range"
                min="1"
                max="4"
                value={draft.followUpDepth}
                onChange={(event) =>
                  updateDraft({ followUpDepth: Number(event.target.value) })
                }
                className="mt-3 w-full accent-[var(--brand)]"
              />
              <div className="mt-1 flex justify-between text-[10px] font-bold text-[var(--text-tertiary)]">
                <span>핵심 확인</span>
                <span>근거 추적</span>
                <span>압박 검증</span>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-[var(--radius-sm)] bg-[var(--mint-soft)] text-[var(--success)]">
                <ShieldCheck className="size-5" />
              </span>
              <div>
                <p className="text-xs font-black text-[var(--success)]">
                  STEP 2 · 적용 원칙
                </p>
                <h2 className="mt-1 font-black">반드시 지킬 코칭 규칙</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {safeguardOptions.map((rule) => {
                const checked = draft.safeguards.includes(rule.id);
                return (
                  <label
                    key={rule.id}
                    className={cn(
                      "flex min-h-14 cursor-pointer items-center gap-3 rounded-[var(--radius-sm)] bg-[var(--surface-muted)] px-4 py-3 text-xs font-bold",
                      checked && "bg-[var(--mint-soft)] text-[var(--success)]",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        updateDraft({
                          safeguards: checked
                            ? draft.safeguards.filter((id) => id !== rule.id)
                            : [...draft.safeguards, rule.id],
                        })
                      }
                      className="size-4 accent-[var(--success)]"
                    />
                    <span>{rule.label}</span>
                  </label>
                );
              })}
            </div>
          </Card>
        </div>

        <Card className="h-fit p-0 xl:sticky xl:top-24">
          <div className="p-5 sm:p-6">
            <p className="text-xs font-black text-[var(--brand)]">
              STEP 3 · 결과 검수
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-black">
                학생에게 보일 답변을 직접 다듬습니다
              </h2>
              <span className="rounded-full bg-[var(--surface-muted)] px-3 py-1 text-[10px] font-black text-[var(--text-secondary)]">
                데모 학생 · 민사고
              </span>
            </div>
            <label
              className="mt-5 block text-xs font-extrabold"
              htmlFor="student-answer"
            >
              학생 답변
            </label>
            <textarea
              id="student-answer"
              className={cn(
                textareaClass,
                "mt-2 min-h-28 bg-[var(--surface-muted)]",
              )}
              value={studentAnswer}
              onChange={(event) => setStudentAnswer(event.target.value)}
            />
            <Button
              full
              className="mt-3"
              loading={isGenerating}
              onClick={() => void generatePreview()}
            >
              <Play className="size-4" />
              현재 규칙으로 답변 만들기
            </Button>
          </div>

          <div className="bg-[var(--surface-inverse)] p-5 text-[var(--text-inverse)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-[var(--mint)]" />
                <h3 className="text-sm font-black">AI 코칭 초안</h3>
              </div>
              {hasExpertEdit ? (
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[9px] font-black text-[var(--mint)]">
                  전문가 수정됨
                </span>
              ) : null}
            </div>
            <label className="sr-only" htmlFor="expert-answer">
              학생에게 적용할 최종 코칭 답변
            </label>
            <textarea
              id="expert-answer"
              value={generatedAnswer}
              onChange={(event) => {
                setGeneratedAnswer(event.target.value);
                setHasExpertEdit(true);
                setFeedback("");
              }}
              className="mt-4 min-h-52 w-full resize-y rounded-[var(--radius-sm)] border border-white/15 bg-white/5 p-4 text-sm leading-7 text-white outline-none placeholder:text-white/40 focus:border-[var(--mint)]"
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => {
                  setGeneratedAnswer(buildDemoAnswer(draft));
                  setHasExpertEdit(false);
                }}
                className="inline-flex min-h-10 items-center gap-2 text-xs font-bold text-white/70 hover:text-white"
              >
                <RotateCcw className="size-4" />
                AI 초안으로 되돌리기
              </button>
              <Button
                size="sm"
                onClick={() => save("approved")}
                className="bg-[var(--mint)] text-[var(--text-on-mint)] hover:opacity-90"
              >
                <Check className="size-4" />이 답변을 기준으로 승인
              </Button>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-3 text-xs leading-5 text-[var(--text-secondary)]">
              <CircleAlert className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" />
              <p>
                현재는 로컬 데모 저장 방식입니다. 계정과 데이터베이스가 연결되면
                작성자·수정 이력·승인 버전을 그대로 기록하도록 분리해
                두었습니다.
              </p>
            </div>
            <Link
              href="/admin/reviews"
              className="mt-5 flex min-h-11 items-center justify-between text-sm font-black"
            >
              전체 학생 검수 큐에서 확인{" "}
              <span className="flex items-center text-[var(--brand)]">
                이동 <ChevronRight className="size-4" />
              </span>
            </Link>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden bg-[var(--brand-soft)]">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="eyebrow">Knowledge loop</p>
            <h2 className="mt-2 text-lg font-black">
              수정한 답변이 다음 코칭의 기준이 됩니다
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
              프롬프트 설정 → AI 초안 → 전문가 수정 → 승인 버전 적용 순서로
              소장님의 판단 방식을 제품 안에 축적합니다.
            </p>
          </div>
          <ol className="flex flex-wrap items-center gap-2 text-[10px] font-black text-[var(--text-secondary)]">
            {["규칙 설정", "초안 생성", "직접 수정", "승인 적용"].map(
              (item, index) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-full bg-[var(--surface)] text-[var(--brand)]">
                    {index + 1}
                  </span>
                  {item}
                  {index < 3 ? (
                    <ArrowRight className="size-3 text-[var(--text-tertiary)]" />
                  ) : null}
                </li>
              ),
            )}
          </ol>
        </div>
      </Card>
    </div>
  );
}
