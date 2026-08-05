import {
  questionPracticeResponseSchema,
  type QuestionPracticeRequest,
  type QuestionPracticeResponse,
} from "./question-practice-schema";

export async function submitQuestionPracticeAnswer(
  input: QuestionPracticeRequest,
): Promise<QuestionPracticeResponse> {
  const response = await fetch("/api/practice/respond", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("답변을 반영하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }

  return questionPracticeResponseSchema.parse(await response.json());
}
