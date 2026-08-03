import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ResponseReviewPanel } from "./response-review-panel";
import { responseReviewStorageKey } from "./response-review-storage";

beforeEach(() => window.localStorage.clear());
afterEach(() => cleanup());

describe("ResponseReviewPanel", () => {
  it("updates and approves an AI coaching response", () => {
    render(<ResponseReviewPanel />);

    fireEvent.change(screen.getByLabelText("최종 코칭 답변 수정"), {
      target: { value: "전문가가 직접 수정한 최종 코칭 답변" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "승인하고 학생에게 적용" }),
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "승인된 답변만 적용됩니다",
    );
    expect(window.localStorage.getItem(responseReviewStorageKey)).toContain(
      "전문가가 직접 수정한 최종 코칭 답변",
    );
  });

  it("creates a new response record", () => {
    render(<ResponseReviewPanel />);
    fireEvent.click(screen.getByRole("button", { name: "새 응답 만들기" }));

    fireEvent.change(screen.getByLabelText("학생 이름"), {
      target: { value: "신규학생" },
    });
    fireEvent.change(screen.getByLabelText("학생 입력 내용"), {
      target: { value: "제가 직접 작성한 학생 답변입니다." },
    });
    fireEvent.change(screen.getByLabelText("최종 코칭 답변 수정"), {
      target: { value: "경험의 판단 근거부터 말해보세요." },
    });
    fireEvent.click(screen.getByRole("button", { name: "응답 등록" }));

    expect(screen.getByRole("status")).toHaveTextContent("등록했습니다");
    expect(screen.getByText(/신규학생 · 민사고/)).toBeVisible();
  });
});
