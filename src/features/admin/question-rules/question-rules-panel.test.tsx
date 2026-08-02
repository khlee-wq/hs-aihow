import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { QuestionRulesPanel } from "./question-rules-panel";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function renderPanel() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <QuestionRulesPanel />
    </QueryClientProvider>,
  );
}

describe("QuestionRulesPanel data states", () => {
  it("shows an actionable empty state for an empty API response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ rules: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    renderPanel();

    expect(await screen.findByText("등록된 질문 기준이 없어요")).toBeVisible();
    expect(screen.getByRole("button", { name: "첫 기준 등록" })).toBeVisible();
  });

  it("separates request errors from empty data and offers retry", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "internal detail" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    renderPanel();

    expect(
      await screen.findByText("질문 기준을 불러오지 못했어요"),
    ).toBeVisible();
    expect(screen.queryByText("internal detail")).toBeNull();
    expect(screen.getByRole("button", { name: "다시 시도" })).toBeVisible();
  });
});
