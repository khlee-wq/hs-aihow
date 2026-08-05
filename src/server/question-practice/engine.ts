import "server-only";

import { questionTracks } from "@/features/student/question-practice-data";
import type {
  QuestionPracticeRequest,
  QuestionPracticeResponse,
} from "@/features/student/question-practice-schema";

export interface QuestionPracticeEngine {
  evaluate(
    input: QuestionPracticeRequest,
  ): Promise<QuestionPracticeResponse | null>;
}

class DemoQuestionPracticeEngine implements QuestionPracticeEngine {
  async evaluate(input: QuestionPracticeRequest) {
    const track = questionTracks.find((item) => item.id === input.trackId);
    const priorityIndex = track?.priorities.findIndex(
      (item) => item.id === input.questionId,
    );
    if (!track || priorityIndex === undefined || priorityIndex < 0) return null;

    const question = track.priorities[priorityIndex];
    const completedCount = input.answer.length >= 80 ? 2 : 1;
    const completedCheckpoints = question.checkpoints.slice(0, completedCount);
    const revisionFocus = question.checkpoints[completedCount] ?? null;
    const nextQuestion = track.priorities[priorityIndex + 1] ?? null;

    return {
      attemptId: crypto.randomUUID(),
      status: "accepted" as const,
      evaluation: {
        summary:
          completedCount > 1
            ? "상황과 판단 근거가 함께 드러났습니다. 다음 관점으로 이어갈 수 있어요."
            : "핵심 장면은 확인했습니다. 판단 근거를 한 문장 더 구체화해 보세요.",
        completedCheckpoints,
        revisionFocus,
      },
      next: nextQuestion
        ? {
            questionId: nextQuestion.id,
            label: nextQuestion.label,
            question: nextQuestion.question,
          }
        : null,
      evaluatedAt: new Date().toISOString(),
    };
  }
}

const demoEngine = new DemoQuestionPracticeEngine();

export function questionPracticeEngine(): QuestionPracticeEngine {
  return demoEngine;
}
