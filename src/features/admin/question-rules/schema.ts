import { z } from "zod";

export const questionRuleStatusSchema = z.enum(["draft", "review", "approved"]);

export const questionRuleInputSchema = z.object({
  title: z.string().trim().min(4, "기준 이름을 4자 이상 입력해 주세요.").max(120),
  school: z.string().trim().min(2, "학교 또는 공통 범위를 입력해 주세요.").max(80),
  category: z.string().trim().min(2, "질문 유형을 입력해 주세요.").max(60),
  status: questionRuleStatusSchema,
  examples: z.number().int().min(0).max(999),
});

export const questionRulePatchSchema = questionRuleInputSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "변경할 값이 필요합니다.",
);

export type QuestionRuleInput = z.infer<typeof questionRuleInputSchema>;
export type QuestionRuleStatus = z.infer<typeof questionRuleStatusSchema>;

export type QuestionRule = QuestionRuleInput & {
  id: string;
  updatedAt: string;
};
