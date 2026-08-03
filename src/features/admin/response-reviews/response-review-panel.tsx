"use client";

import {
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  MessageSquareText,
  PencilLine,
  Plus,
  Save,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { inputClass, textareaClass } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import {
  loadCoachingResponses,
  saveCoachingResponses,
  seedCoachingResponses,
  type CoachingResponse,
  type ReviewStatus,
} from "./response-review-storage";

const statusMeta: Record<ReviewStatus, { label: string; className: string }> = {
  pending: {
    label: "검수 대기",
    className: "bg-[var(--warning-soft)] text-[var(--warning)]",
  },
  draft: {
    label: "수정 중",
    className: "bg-[var(--brand-soft)] text-[var(--brand)]",
  },
  approved: {
    label: "승인",
    className: "bg-[var(--mint-soft)] text-[var(--success)]",
  },
};

const emptyResponse: CoachingResponse = {
  id: "",
  student: "",
  school: "민사고",
  stage: "답변 코칭",
  studentInput: "",
  aiAnswer: "",
  expertNote: "",
  status: "draft",
  updatedAt: "",
};

export function ResponseReviewPanel() {
  const [records, setRecords] = useState(seedCoachingResponses);
  const [selectedId, setSelectedId] = useState(seedCoachingResponses[0].id);
  const [form, setForm] = useState(seedCoachingResponses[0]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"전체" | ReviewStatus>("전체");
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      const stored = loadCoachingResponses();
      if (!stored?.length) return;
      setRecords(stored);
      setSelectedId(stored[0].id);
      setForm(stored[0]);
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return records.filter((record) => {
      const matchesStatus = filter === "전체" || record.status === filter;
      const matchesQuery =
        !keyword ||
        [record.student, record.school, record.stage, record.studentInput].some(
          (value) => value.toLowerCase().includes(keyword),
        );
      return matchesStatus && matchesQuery;
    });
  }, [filter, query, records]);

  function select(record: CoachingResponse) {
    setSelectedId(record.id);
    setForm(record);
    setMessage("");
    setConfirmDelete(false);
  }

  function create() {
    setSelectedId("create");
    setForm(emptyResponse);
    setMessage("");
    setConfirmDelete(false);
  }

  function persist(next: CoachingResponse[], feedback: string) {
    setRecords(next);
    saveCoachingResponses(next);
    setMessage(feedback);
  }

  function save(status: ReviewStatus) {
    if (
      !form.student.trim() ||
      !form.studentInput.trim() ||
      !form.aiAnswer.trim()
    ) {
      setMessage("학생 이름·입력 내용·코칭 답변을 모두 작성해 주세요.");
      return;
    }
    const nextRecord: CoachingResponse = {
      ...form,
      id: form.id || crypto.randomUUID(),
      status,
      updatedAt: new Date().toISOString(),
    };
    const next = form.id
      ? records.map((record) => (record.id === form.id ? nextRecord : record))
      : [nextRecord, ...records];
    setForm(nextRecord);
    setSelectedId(nextRecord.id);
    persist(
      next,
      status === "approved"
        ? "수정한 답변을 승인했습니다. 학생 화면에는 승인된 답변만 적용됩니다."
        : form.id
          ? "수정 내용을 저장했습니다."
          : "새 코칭 응답을 등록했습니다.",
    );
  }

  function remove() {
    if (!form.id) {
      select(records[0]);
      return;
    }
    const next = records.filter((record) => record.id !== form.id);
    persist(next, "코칭 응답을 삭제했습니다.");
    const fallback = next[0] ?? emptyResponse;
    setSelectedId(fallback.id || "create");
    setForm(fallback);
    setConfirmDelete(false);
  }

  const isCreating = selectedId === "create";

  return (
    <div className="min-w-0 space-y-7 float-in" data-testid="response-review-panel">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">Response operations</p>
          <h1 className="heading-lg mt-3">코칭 응답 검수</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            학생이 입력한 내용과 AI 코칭 답변을 한 화면에서 비교하고, 소장님이
            직접 수정·승인합니다.
          </p>
        </div>
        <Button onClick={create}>
          <Plus className="size-4" />새 응답 만들기
        </Button>
      </header>

      {message ? (
        <p
          role="status"
          className={cn(
            "flex items-start gap-2 rounded-[var(--radius-sm)] px-4 py-3 text-sm font-bold",
            message.includes("모두 작성")
              ? "bg-[var(--coral-soft)] text-[var(--danger)]"
              : "bg-[var(--mint-soft)] text-[var(--success)]",
          )}
        >
          {message.includes("모두 작성") ? (
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
          ) : (
            <Check className="mt-0.5 size-4 shrink-0" />
          )}
          {message}
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <Card className="h-fit p-0 xl:sticky xl:top-24">
          <div className="p-3">
            <label className="relative block">
              <span className="sr-only">코칭 응답 검색</span>
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                className={cn(inputClass, "pl-10")}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="학생, 학교, 입력 내용 검색"
              />
            </label>
            <div className="mt-2 flex gap-1 overflow-x-auto">
              {(["전체", "pending", "draft", "approved"] as const).map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={cn(
                      "min-h-9 shrink-0 rounded-[var(--radius-xs)] px-3 text-[11px] font-black",
                      filter === item
                        ? "bg-[var(--brand)] text-[var(--text-on-brand)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]",
                    )}
                  >
                    {item === "전체" ? item : statusMeta[item].label}
                  </button>
                ),
              )}
            </div>
          </div>
          <div className="max-h-[38rem] overflow-y-auto border-t border-[var(--border)]">
            {filtered.map((record) => (
              <button
                key={record.id}
                onClick={() => select(record)}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-[var(--border)] p-4 text-left last:border-0 hover:bg-[var(--surface-muted)]",
                  selectedId === record.id && "bg-[var(--brand-soft)]",
                )}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--surface)] text-xs font-black text-[var(--brand)]">
                  {record.student.slice(0, 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <strong className="truncate text-sm">
                      {record.student} · {record.school}
                    </strong>
                    <ChevronRight className="size-4 shrink-0 text-[var(--text-tertiary)]" />
                  </span>
                  <span className="mt-1 block truncate text-xs text-[var(--text-secondary)]">
                    {record.stage} · {record.studentInput}
                  </span>
                  <span
                    className={cn(
                      "mt-2 inline-flex rounded-full px-2 py-1 text-[9px] font-black",
                      statusMeta[record.status].className,
                    )}
                  >
                    {statusMeta[record.status].label}
                  </span>
                </span>
              </button>
            ))}
            {!filtered.length ? (
              <p className="p-8 text-center text-sm text-[var(--text-secondary)]">
                조건에 맞는 응답이 없습니다.
              </p>
            ) : null}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border)] p-5 sm:p-6">
            <div>
              <p className="text-xs font-black text-[var(--brand)]">
                {isCreating ? "NEW RESPONSE" : "RESPONSE REVIEW"}
              </p>
              <h2 className="mt-2 text-lg font-black">
                {isCreating
                  ? "새 코칭 응답 등록"
                  : `${form.student} 학생 응답 편집`}
              </h2>
            </div>
            {!isCreating ? (
              <span
                className={cn(
                  "rounded-full px-3 py-1.5 text-[10px] font-black",
                  statusMeta[form.status].className,
                )}
              >
                {statusMeta[form.status].label}
              </span>
            ) : null}
          </div>

          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              학생 이름
              <input
                className={inputClass}
                value={form.student}
                onChange={(event) =>
                  setForm({
                    ...form,
                    student: event.target.value,
                    status: "draft",
                  })
                }
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              지원 학교
              <input
                className={inputClass}
                value={form.school}
                onChange={(event) =>
                  setForm({
                    ...form,
                    school: event.target.value,
                    status: "draft",
                  })
                }
              />
            </label>
            <label className="grid gap-2 text-sm font-bold lg:col-span-2">
              코칭 단계
              <select
                className={inputClass}
                value={form.stage}
                onChange={(event) =>
                  setForm({
                    ...form,
                    stage: event.target.value as CoachingResponse["stage"],
                    status: "draft",
                  })
                }
              >
                <option>자소서</option>
                <option>예상 질문</option>
                <option>답변 코칭</option>
                <option>모의면접</option>
              </select>
            </label>

            <section
              className="rounded-[var(--radius-md)] bg-[var(--surface-muted)] p-4 sm:p-5 lg:col-span-2"
              aria-labelledby="student-input-title"
            >
              <div className="flex items-center gap-2">
                <UserRound className="size-4 text-[var(--text-secondary)]" />
                <h3 id="student-input-title" className="text-sm font-black">
                  학생 입력
                </h3>
              </div>
              <textarea
                aria-label="학생 입력 내용"
                className={cn(
                  textareaClass,
                  "mt-3 min-h-32 bg-[var(--surface)]",
                )}
                value={form.studentInput}
                onChange={(event) =>
                  setForm({
                    ...form,
                    studentInput: event.target.value,
                    status: "draft",
                  })
                }
                placeholder="학생이 작성하거나 말한 내용을 입력합니다."
              />
            </section>

            <section
              className="surface-contrast rounded-[var(--radius-md)] p-4 sm:p-5 lg:col-span-2"
              aria-labelledby="answer-edit-title"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="size-4 text-[var(--mint)]" />
                  <h3 id="answer-edit-title" className="text-sm font-black">
                    학생에게 전달할 코칭 답변
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-white/55">
                  소장님이 직접 수정할 수 있습니다
                </span>
              </div>
              <textarea
                aria-label="최종 코칭 답변 수정"
                className="mt-3 min-h-52 w-full resize-y rounded-[var(--radius-sm)] border border-white/15 bg-white/5 p-4 text-sm leading-7 text-white outline-none focus:border-[var(--mint)]"
                value={form.aiAnswer}
                onChange={(event) =>
                  setForm({
                    ...form,
                    aiAnswer: event.target.value,
                    status: "draft",
                  })
                }
                placeholder="AI 답변을 불러오거나 전문가 답변을 직접 입력합니다."
              />
            </section>

            <label className="grid gap-2 text-sm font-bold lg:col-span-2">
              내부 검수 메모
              <textarea
                className={cn(textareaClass, "min-h-24")}
                value={form.expertNote}
                onChange={(event) =>
                  setForm({
                    ...form,
                    expertNote: event.target.value,
                    status: "draft",
                  })
                }
                placeholder="학생에게 보이지 않는 판단 근거를 기록합니다."
              />
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              {confirmDelete ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[var(--danger)]">
                    정말 삭제할까요?
                  </span>
                  <Button variant="danger" size="sm" onClick={remove}>
                    삭제
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDelete(false)}
                  >
                    취소
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="size-4" />
                  {isCreating ? "작성 취소" : "응답 삭제"}
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="secondary" onClick={() => save("draft")}>
                <Save className="size-4" />
                {isCreating ? "응답 등록" : "수정 저장"}
              </Button>
              <Button onClick={() => save("approved")}>
                <CheckCircle2 className="size-4" />
                승인하고 학생에게 적용
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-[var(--brand-soft)]">
        <div className="flex items-start gap-3">
          <PencilLine className="mt-0.5 size-5 shrink-0 text-[var(--brand)]" />
          <div>
            <h2 className="font-black">운영 기준이 제품 안에 남는 구조</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              학생 입력과 최초 AI 답변, 전문가 수정본, 승인 상태를 하나의
              기록으로 관리합니다. 현재는 로컬 데모이며 계정·데이터베이스 연결
              후에도 동일한 필드 구조를 사용합니다.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
