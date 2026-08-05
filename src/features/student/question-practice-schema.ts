import { z } from "zod";

export const questionPracticeRequestSchema = z.object({
  applicationId: z.string().trim().min(1).max(80),
  trackId: z.string().trim().min(1).max(80),
  questionId: z.string().trim().min(1).max(80),
  answer: z.string().trim().min(10).max(4000),
});

export const questionPracticeResponseSchema = z.object({
  attemptId: z.string().min(1),
  status: z.literal("accepted"),
  evaluation: z.object({
    summary: z.string().min(1),
    completedCheckpoints: z.array(z.string()),
    revisionFocus: z.string().nullable(),
  }),
  next: z
    .object({
      questionId: z.string().min(1),
      label: z.string().min(1),
      question: z.string().min(1),
    })
    .nullable(),
  evaluatedAt: z.string().datetime(),
});

export type QuestionPracticeRequest = z.infer<
  typeof questionPracticeRequestSchema
>;
export type QuestionPracticeResponse = z.infer<
  typeof questionPracticeResponseSchema
>;
