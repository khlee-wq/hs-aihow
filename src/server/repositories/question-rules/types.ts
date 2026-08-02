import type { QuestionRule, QuestionRuleInput } from "@/features/admin/question-rules/schema";

export interface QuestionRuleRepository {
  list(): Promise<QuestionRule[]>;
  create(input: QuestionRuleInput): Promise<QuestionRule>;
  update(id: string, input: Partial<QuestionRuleInput>): Promise<QuestionRule | null>;
  delete(id: string): Promise<boolean>;
}
