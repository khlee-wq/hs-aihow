import "server-only";

import type { QuestionRule, QuestionRuleInput } from "@/features/admin/question-rules/schema";
import type { QuestionRuleRepository } from "./types";

const seedRules: QuestionRule[] = [
  { id: "rule-common-motivation", title: "지원 동기와 학교 철학 연결", school: "공통", category: "지원 동기", status: "approved", examples: 12, updatedAt: "2026-08-01T04:20:00.000Z" },
  { id: "rule-minsa-research", title: "탐구 실패 이후 가설 수정", school: "민사고", category: "탐구 태도", status: "approved", examples: 8, updatedAt: "2026-07-31T03:10:00.000Z" },
  { id: "rule-hana-community", title: "공동체 갈등에서의 실제 행동", school: "하나고", category: "협업", status: "review", examples: 6, updatedAt: "2026-07-30T09:00:00.000Z" },
  { id: "rule-hafs-learning", title: "자기주도 학습 계획의 실행 근거", school: "외대부고", category: "학습", status: "draft", examples: 4, updatedAt: "2026-07-29T08:00:00.000Z" },
];

type DemoGlobal = typeof globalThis & { __aihowQuestionRules?: QuestionRule[] };

function records() {
  const target = globalThis as DemoGlobal;
  target.__aihowQuestionRules ??= structuredClone(seedRules);
  return target.__aihowQuestionRules;
}

export class DemoQuestionRuleRepository implements QuestionRuleRepository {
  async list() {
    return [...records()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async create(input: QuestionRuleInput) {
    const rule = { ...input, id: crypto.randomUUID(), updatedAt: new Date().toISOString() };
    records().unshift(rule);
    return rule;
  }

  async update(id: string, input: Partial<QuestionRuleInput>) {
    const index = records().findIndex((rule) => rule.id === id);
    if (index < 0) return null;
    records()[index] = { ...records()[index], ...input, updatedAt: new Date().toISOString() };
    return records()[index];
  }

  async delete(id: string) {
    const index = records().findIndex((rule) => rule.id === id);
    if (index < 0) return false;
    records().splice(index, 1);
    return true;
  }
}
