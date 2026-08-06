"use client";

import {
  Clock3,
  Download,
  FileText,
  Minus,
  Plus,
  Printer,
  Volume2,
  WandSparkles,
} from "lucide-react";
import { useState } from "react";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FinalNoteDocument = {
  studentName: string;
  schoolName: string;
  admissionYear: string;
  readiness: number;
  lastPracticedAt: string;
  identityStatement: string;
  experiences: string[];
  keywords: string[];
  reminders: Array<{
    kind: "time" | "evidence" | "pace";
    title: string;
    description: string;
  }>;
};

export const demoFinalNoteDocument: FinalNoteDocument = {
  studentName: "김하우",
  schoolName: "민족사관고등학교",
  admissionYear: "2027학년도",
  readiness: 84,
  lastPracticedAt: "2026.08.01",
  identityStatement:
    "결과보다 과정을 기록하며, 다음 질문을 스스로 만드는 탐구자",
  experiences: [
    "수질과 식물 생장 실험에서 변인을 다시 기록한 경험",
    "환경 프로젝트에서 팀의 기준을 합의한 경험",
    "실패한 가설을 질문으로 바꾸어 탐구를 이어간 경험",
  ],
  keywords: ["자율 탐구", "공동체", "과정 기록", "질문 확장", "지식 나눔"],
  reminders: [
    {
      kind: "time",
      title: "70초 안에",
      description: "상황보다 행동에 시간을 쓰기",
    },
    {
      kind: "evidence",
      title: "근거부터",
      description: "자소서 문장과 내 행동 연결",
    },
    {
      kind: "pace",
      title: "한 박자 쉬기",
      description: "꼬리질문을 끝까지 듣기",
    },
  ],
};

const reminderIcons = {
  time: Clock3,
  evidence: WandSparkles,
  pace: Volume2,
};

export function FinalNotePaper({
  document,
  mode = "workspace",
}: {
  document: FinalNoteDocument;
  mode?: "workspace" | "preview";
}) {
  const preview = mode === "preview";

  return (
    <article
      className={cn(
        "final-note-paper flex w-full flex-col",
        preview
          ? "final-note-paper-preview aspect-[210/297] bg-white px-10 py-11 text-[#142d29] shadow-[0_32px_90px_rgba(15,42,37,.18)] sm:px-14 sm:py-14"
          : "practice-question-glass workspace-page-panel workspace-panel-scroll mx-auto mt-7 max-w-[58rem] flex-1 overflow-y-auto rounded-[1.7rem] p-5 sm:p-8 lg:mt-2 lg:max-w-none lg:px-4 lg:py-2",
      )}
      data-testid="final-note-paper"
      data-motion-reveal={preview ? undefined : ""}
    >
      <header
        className={cn(
          "flex flex-col justify-between gap-5 border-b border-[color-mix(in_srgb,var(--text-primary)_8%,transparent)] sm:flex-row sm:items-end",
          preview ? "pb-7" : "pb-6 lg:pb-2",
        )}
      >
        <div>
          <p className="student-kicker text-[9px] text-[var(--brand)]">
            나의 면접 노트
          </p>
          <h2
            className={cn(
              "font-extrabold tracking-[-.032em]",
              preview
                ? "mt-3 text-3xl sm:text-4xl"
                : "mt-3 text-3xl sm:text-4xl lg:mt-1 lg:text-3xl",
            )}
          >
            {document.studentName}의 면접 한 장
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)] lg:mt-1">
            {document.schoolName} · {document.admissionYear}
          </p>
        </div>
        <div className="practice-context-glass flex shrink-0 items-center gap-3 rounded-[1rem] px-3.5 py-1.5 text-left text-xs">
          <span className="grid size-8 place-items-center rounded-full bg-[var(--mint-soft)] font-mono text-[11px] font-black text-[var(--success)]">
            {document.readiness}
          </span>
          <div className="leading-5 text-[var(--text-secondary)]">
            <p className="font-black text-[var(--text-primary)]">
              준비 흐름 확인
            </p>
            <p>최근 연습 {document.lastPracticedAt}</p>
          </div>
        </div>
      </header>

      <section className={preview ? "mt-8" : "mt-7 lg:mt-4"}>
        <NoteTitle number="01" title="나를 설명하는 한 문장" />
        <blockquote
          className={cn(
            "rounded-[1.15rem] bg-[color-mix(in_srgb,var(--brand-soft)_62%,transparent)] font-black text-[var(--brand)] shadow-[inset_0_1px_0_color-mix(in_srgb,white_52%,transparent)]",
            preview
              ? "mt-4 px-6 py-5 text-xl leading-8"
              : "mt-4 p-5 text-lg leading-8 sm:p-6 sm:text-xl lg:mt-2 lg:px-5 lg:py-2 lg:leading-7",
          )}
        >
          “{document.identityStatement}”
        </blockquote>
      </section>

      <div
        className={cn(
          "grid flex-1 overflow-hidden rounded-[1.15rem] border border-[color-mix(in_srgb,var(--text-primary)_7%,transparent)] lg:grid-cols-[1.05fr_.95fr] lg:divide-x lg:divide-[color-mix(in_srgb,var(--text-primary)_7%,transparent)]",
          preview ? "mt-8" : "mt-7 lg:mt-3",
        )}
      >
        <section className={preview ? "p-6" : "p-5 sm:p-6 lg:px-4 lg:py-2.5"}>
          <NoteTitle number="02" title="꼭 말할 경험 3가지" />
          <ol
            className={cn(
              "grid",
              preview ? "mt-5 gap-4" : "mt-4 gap-4 lg:mt-2.5 lg:gap-2",
            )}
          >
            {document.experiences.map((item, index) => (
              <li
                key={item}
                className={cn(
                  "flex gap-3",
                  preview
                    ? "text-sm leading-6"
                    : "text-sm leading-6 lg:text-[13px] lg:leading-5",
                )}
              >
                <span className="font-black text-[var(--brand)]">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </section>
        <div className="border-t border-[color-mix(in_srgb,var(--text-primary)_7%,transparent)] lg:border-l-0 lg:border-t-0">
          <section className={preview ? "p-6" : "p-5 sm:p-6 lg:px-4 lg:py-2.5"}>
            <NoteTitle number="03" title="학교와 연결할 키워드" />
            <div
              className={cn(
                "flex flex-wrap gap-2",
                preview ? "mt-5" : "mt-4 lg:mt-3",
              )}
            >
              {document.keywords.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[color-mix(in_srgb,var(--surface-raised)_58%,transparent)] px-3 py-2 text-xs font-extrabold shadow-[inset_0_1px_0_color-mix(in_srgb,white_48%,transparent)] lg:py-1.5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>
          <section
            className={cn(
              "border-t border-[color-mix(in_srgb,var(--text-primary)_7%,transparent)]",
              preview ? "p-6" : "p-5 sm:p-6 lg:px-4 lg:py-2.5",
            )}
          >
            <NoteTitle number="04" title="답변할 때 기억할 것" />
            <div
              className={cn(
                "grid overflow-hidden lg:grid-cols-3 lg:divide-x lg:divide-[color-mix(in_srgb,var(--text-primary)_7%,transparent)]",
                preview ? "mt-5" : "mt-4 lg:mt-2",
              )}
            >
              {document.reminders.map((reminder) => {
                const Icon = reminderIcons[reminder.kind];
                return (
                  <div key={reminder.kind} className="py-3 lg:px-3">
                    <Icon className="size-4 text-[var(--brand)]" />
                    <p className="mt-2 text-xs font-black">{reminder.title}</p>
                    <p className="mt-1 text-[10px] leading-4 text-[var(--text-secondary)]">
                      {reminder.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <footer
        className={cn(
          "flex gap-2 border-t border-[color-mix(in_srgb,var(--text-primary)_7%,transparent)] text-[10px] text-[var(--text-tertiary)] sm:flex-row sm:items-center sm:justify-between",
          preview ? "mt-auto pt-6" : "mt-7 pt-5 lg:hidden",
        )}
      >
        <span>
          AIHOW · 학생이 작성하고 연습한 내용을 한 장으로 정리했습니다.
        </span>
        <span>1 / 1</span>
      </footer>
    </article>
  );
}

export function FinalNotePreviewDialog({
  document,
  onClose,
  onExport,
  open,
}: {
  document: FinalNoteDocument;
  onClose: () => void;
  onExport: () => void;
  open: boolean;
}) {
  const [zoom, setZoom] = useState(0.85);

  const printDocument = () => {
    onExport();
    documentBodyClass("add");
    const cleanup = () => documentBodyClass("remove");
    window.addEventListener("afterprint", cleanup, { once: true });
    window.print();
    window.setTimeout(cleanup, 1_000);
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      eyebrow="A4 문서 확인"
      title="파이널 노트 미리보기"
      className="final-note-preview-dialog h-[100dvh] max-h-[100dvh] max-w-[72rem] rounded-none bg-[color-mix(in_srgb,var(--canvas)_88%,var(--surface))] p-4 sm:h-auto sm:max-h-[94dvh] sm:rounded-[1.75rem] sm:p-6"
    >
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-[var(--border)] py-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
          <FileText className="size-4 text-[var(--brand)]" />
          A4 · 세로 · 1페이지
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="미리보기 축소"
            className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-[var(--surface-muted)]"
            onClick={() => setZoom((value) => Math.max(0.7, value - 0.15))}
          >
            <Minus className="size-4" />
          </button>
          <span className="w-12 text-center font-mono text-[11px] font-black">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            aria-label="미리보기 확대"
            className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-[var(--surface-muted)]"
            onClick={() => setZoom((value) => Math.min(1.15, value + 0.15))}
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      <div
        className="final-note-preview-viewport mt-4 min-h-0 overflow-auto overscroll-contain rounded-[1.25rem] bg-[color-mix(in_srgb,var(--surface-inverse)_8%,var(--surface-muted))] p-4 sm:max-h-[calc(94dvh-13rem)] sm:p-8"
        data-testid="final-note-preview"
      >
        <div
          className="final-note-print-root mx-auto transition-[width] duration-300"
          style={{ width: `${52 * zoom}rem`, minWidth: "36rem" }}
        >
          <FinalNotePaper document={document} mode="preview" />
        </div>
      </div>

      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={printDocument}>
          <Printer className="size-4" />
          인쇄
        </Button>
        <Button onClick={printDocument} data-dialog-initial-focus>
          <Download className="size-4" />
          PDF로 저장
        </Button>
      </div>
      <p className="mt-3 text-center text-[11px] leading-5 text-[var(--text-tertiary)] sm:text-right">
        PDF 저장을 누르면 인쇄 창이 열립니다. 대상에서 ‘PDF로 저장’을
        선택하세요.
      </p>
    </AppDialog>
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

function documentBodyClass(action: "add" | "remove") {
  document.body.classList[action]("final-note-printing");
}
