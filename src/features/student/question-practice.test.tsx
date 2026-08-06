import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAppStore } from "@/stores/app-store";
import { QuestionPractice } from "./question-practice";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

function renderPractice() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <QuestionPractice />
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  useAppStore.setState({ draftAnswers: {} });
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          attemptId: "attempt-test",
          status: "accepted",
          evaluation: {
            summary: "상황과 판단 근거가 함께 드러났습니다.",
            completedCheckpoints: ["문제가 생긴 시점"],
            revisionFocus: "내가 맡은 역할",
          },
          next: {
            questionId: "motivation-choice",
            label: "선택의 이유",
            question:
              "여러 해결 방법 중 기록 방식을 다시 점검하기로 한 이유는 무엇인가요?",
          },
          evaluatedAt: "2026-08-05T08:00:00.000Z",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    ),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("QuestionPractice", () => {
  it("shows three question tracks and four priority questions", () => {
    renderPractice();

    expect(
      screen.getByRole("heading", {
        name: "자소서에서 물어볼 이야기를 함께 찾아볼게요",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: /01 · 0\/4지원 동기/ }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: /02 · 0\/4탐구 태도/ }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: /03 · 0\/4협업 경험/ }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: "먼저 답해 볼 질문 경험 확인" }),
    ).toBeEnabled();
    expect(
      screen.getByRole("button", {
        name: "이유를 이어 말할 질문 선택의 이유 잠김",
      }),
    ).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "집중해서 답하기" }),
    ).toBeVisible();
  });

  it("unlocks the next priority question after saving a usable answer", async () => {
    renderPractice();

    fireEvent.change(
      screen.getByRole("textbox", { name: "이 질문에 대한 내 답변" }),
      {
        target: {
          value:
            "실험 결과가 예상과 달랐을 때 기록 기준을 다시 세우고 팀원과 변인을 확인했습니다.",
        },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: "답변 제출" }));

    await waitFor(() =>
      expect(
        screen.getByRole("button", {
          name: "이유를 이어 말할 질문 선택의 이유",
        }),
      ).toBeEnabled(),
    );
    expect(screen.getByRole("status")).toHaveTextContent("다음 질문 열림");
  });
});
