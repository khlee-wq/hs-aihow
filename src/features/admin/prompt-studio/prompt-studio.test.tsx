import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { PromptStudio } from "./prompt-studio";
import { promptStudioStorageKey } from "./prompt-studio-storage";

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe("PromptStudio", () => {
  it("lets an expert edit and approve the coaching answer", () => {
    render(<PromptStudio />);

    fireEvent.change(screen.getByLabelText("학생에게 적용할 최종 코칭 답변"), {
      target: { value: "전문가가 직접 다듬은 코칭 답변" },
    });
    expect(screen.getByText("교사 조정본")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "승인하고 적용" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "학생 화면에는 승인된 버전만 반영됩니다",
    );
    expect(window.localStorage.getItem(promptStudioStorageKey)).toContain(
      "전문가가 직접 다듬은 코칭 답변",
    );
  });

  it("switches coaching stages without hiding the review workspace", () => {
    render(<PromptStudio />);
    fireEvent.click(screen.getByRole("button", { name: /모의면접/ }));

    expect(screen.getByText("모의면접의 판단 방식을 정합니다")).toBeVisible();
    expect(
      screen.getByLabelText("학생에게 적용할 최종 코칭 답변"),
    ).toBeVisible();
  });
});
