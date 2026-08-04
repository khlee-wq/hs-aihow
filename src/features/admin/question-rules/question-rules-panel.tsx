"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Check,
  MessageCircleQuestion,
  PencilLine,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { EmptyState, ErrorState } from "@/components/ui/status-state";
import { cn } from "@/lib/utils";
import {
  questionRuleInputSchema,
  questionRulesResponseSchema,
  type QuestionRule,
  type QuestionRuleInput,
  type QuestionRuleStatus,
} from "./schema";
import { QuestionRulesListSkeleton } from "./question-rules-skeleton";

const statusMeta: Record<
  QuestionRuleStatus,
  { label: string; className: string }
> = {
  approved: {
    label: "승인",
    className: "bg-[var(--mint-soft)] text-[var(--success)]",
  },
  review: {
    label: "검토 중",
    className: "bg-[var(--warning-soft)] text-[var(--warning)]",
  },
  draft: {
    label: "초안",
    className: "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
  },
};

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message ?? "요청을 처리하지 못했습니다.");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function QuestionRulesPanel() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<QuestionRule | "create" | null>(null);
  const [message, setMessage] = useState("");
  const rulesQuery = useQuery({
    queryKey: ["question-rules"],
    queryFn: async () =>
      questionRulesResponseSchema.parse(
        await api<unknown>("/api/question-rules"),
      ),
  });
  const filtered = useMemo(() => {
    const rules = rulesQuery.data?.rules ?? [];
    const keyword = query.trim().toLowerCase();
    if (!keyword) return rules;
    return rules.filter((rule) =>
      [
        rule.title,
        rule.school,
        rule.category,
        statusMeta[rule.status].label,
      ].some((value) => value.toLowerCase().includes(keyword)),
    );
  }, [query, rulesQuery.data?.rules]);

  async function refreshed(feedback: string) {
    await queryClient.invalidateQueries({ queryKey: ["question-rules"] });
    setEditing(null);
    setMessage(feedback);
  }

  return (
    <div className="space-y-7 float-in">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Question standards</p>
          <h1 className="heading-lg mt-3">질문 기준</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            학교·학년도·전형별 적용 조건과 질문 예시를
            생성·조회·수정·삭제합니다.
          </p>
        </div>
        <Button
          onClick={() => {
            setMessage("");
            setEditing("create");
          }}
        >
          <Plus className="size-4" />
          질문 기준 등록
        </Button>
      </header>

      <Card className="p-3">
        <label className="relative block">
          <span className="sr-only">질문 기준 검색</span>
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={cn(inputClass, "pl-10")}
            placeholder="기준, 학교, 유형으로 검색"
          />
        </label>
      </Card>

      {message ? (
        <p
          className="flex items-center gap-2 bg-[var(--mint-soft)] px-4 py-3 text-sm font-bold text-[var(--success)]"
          role="status"
        >
          <Check className="size-4" />
          {message}
        </p>
      ) : null}
      {rulesQuery.isPending ? (
        <QuestionRulesListSkeleton />
      ) : rulesQuery.isError ? (
        <ErrorState
          title="질문 기준을 불러오지 못했어요"
          description="네트워크 상태를 확인한 뒤 다시 시도해 주세요. 작성 중인 입력은 유지됩니다."
          retry={() => void rulesQuery.refetch()}
        />
      ) : filtered.length ? (
        <div className="grid gap-3" data-motion-list>
          {filtered.map((rule) => (
            <Card
              key={rule.id}
              className="grid gap-5 p-5 lg:grid-cols-[1fr_auto] lg:items-center"
              data-motion-item
            >
              <div className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--brand-soft)] text-[var(--brand)]">
                  <MessageCircleQuestion className="size-5" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-black">{rule.title}</h2>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[9px] font-black",
                        statusMeta[rule.status].className,
                      )}
                    >
                      {statusMeta[rule.status].label}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[var(--text-secondary)]">
                    {rule.school} · {rule.category} · 예시 {rule.examples}개 ·{" "}
                    {new Intl.DateTimeFormat("ko-KR", {
                      month: "short",
                      day: "numeric",
                    }).format(new Date(rule.updatedAt))}{" "}
                    수정
                  </p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setMessage("");
                  setEditing(rule);
                }}
                aria-label={`${rule.title} 편집`}
              >
                <PencilLine className="size-4" />
                편집
              </Button>
            </Card>
          ))}
        </div>
      ) : query ? (
        <EmptyState
          title="검색 결과가 없어요"
          description="검색어를 지우거나 다른 기준명·학교로 찾아보세요."
        />
      ) : (
        <EmptyState
          title="등록된 질문 기준이 없어요"
          description="첫 질문 기준을 등록하면 학교·전형별 검수 흐름을 시작할 수 있습니다."
          action={
            <Button onClick={() => setEditing("create")}>
              <Plus className="size-4" />첫 기준 등록
            </Button>
          }
        />
      )}

      {editing ? (
        <QuestionRuleDialog
          rule={editing === "create" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(rule) =>
            refreshed(
              rule ? "질문 기준을 저장했습니다." : "질문 기준을 삭제했습니다.",
            )
          }
        />
      ) : null}
    </div>
  );
}

function QuestionRuleDialog({
  rule,
  onClose,
  onSaved,
}: {
  rule: QuestionRule | null;
  onClose: () => void;
  onSaved: (rule?: QuestionRule) => Promise<void>;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const form = useForm<QuestionRuleInput>({
    resolver: zodResolver(questionRuleInputSchema),
    defaultValues: rule
      ? {
          title: rule.title,
          school: rule.school,
          category: rule.category,
          status: rule.status,
          examples: rule.examples,
        }
      : {
          title: "",
          school: "공통",
          category: "지원 동기",
          status: "draft",
          examples: 0,
        },
  });
  const save = useMutation({
    mutationFn: (input: QuestionRuleInput) =>
      rule
        ? api<{ rule: QuestionRule }>(`/api/question-rules/${rule.id}`, {
            method: "PATCH",
            body: JSON.stringify(input),
          })
        : api<{ rule: QuestionRule }>("/api/question-rules", {
            method: "POST",
            body: JSON.stringify(input),
          }),
    onSuccess: ({ rule: savedRule }) => onSaved(savedRule),
  });
  const remove = useMutation({
    mutationFn: () =>
      api<void>(`/api/question-rules/${rule!.id}`, { method: "DELETE" }),
    onSuccess: () => onSaved(),
  });

  return (
    <AppDialog
      open
      onClose={onClose}
      eyebrow="CRUD workspace"
      title={rule ? "질문 기준 편집" : "질문 기준 등록"}
      purpose="confirmation"
      className="max-w-xl"
    >
        <form
          className="mt-6 grid gap-4"
          onSubmit={form.handleSubmit((input) => save.mutate(input))}
        >
          <Field label="기준 이름" error={form.formState.errors.title?.message}>
            <input
              {...form.register("title")}
              className={inputClass}
              placeholder="예: 지원 동기와 학교 철학 연결"
              autoFocus
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="학교 범위"
              error={form.formState.errors.school?.message}
            >
              <input {...form.register("school")} className={inputClass} />
            </Field>
            <Field
              label="질문 유형"
              error={form.formState.errors.category?.message}
            >
              <input {...form.register("category")} className={inputClass} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="상태" error={form.formState.errors.status?.message}>
              <select {...form.register("status")} className={inputClass}>
                <option value="draft">초안</option>
                <option value="review">검토 중</option>
                <option value="approved">승인</option>
              </select>
            </Field>
            <Field
              label="연결 예시 수"
              error={form.formState.errors.examples?.message}
            >
              <input
                {...form.register("examples", { valueAsNumber: true })}
                className={inputClass}
                type="number"
                min={0}
                max={999}
              />
            </Field>
          </div>
          {save.error || remove.error ? (
            <p
              role="alert"
              className="bg-[var(--coral-soft)] p-3 text-sm font-bold text-[var(--danger)]"
            >
              {save.error?.message ?? remove.error?.message}
            </p>
          ) : null}
          <div className="mt-2 flex flex-col-reverse justify-between gap-3 sm:flex-row">
            {rule ? (
              confirmDelete ? (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="danger"
                    loading={remove.isPending}
                    onClick={() => remove.mutate()}
                  >
                    정말 삭제
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setConfirmDelete(false)}
                  >
                    취소
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="size-4" />
                  삭제
                </Button>
              )
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                닫기
              </Button>
              <Button type="submit" loading={save.isPending}>
                {rule ? "변경 저장" : "기준 등록"}
              </Button>
            </div>
          </div>
        </form>
    </AppDialog>
  );
}
