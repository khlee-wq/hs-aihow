import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAppStore } from "@/stores/app-store";
import { dashboardSnapshot } from "./dashboard-model";
import { StudentDashboard } from "./student-dashboard";

vi.mock("@/components/motion/journey-orbit", () => ({
  JourneyOrbit: () => <svg aria-hidden />,
}));

afterEach(() => cleanup());

describe("StudentDashboard loading boundaries", () => {
  it("keeps the page structure and only skeletonizes server data slots", () => {
    useAppStore.setState({ completedSteps: ["essay", "analysis"] });
    render(<StudentDashboard />);

    expect(screen.getByTestId("student-dashboard")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(
      screen.getByRole("heading", { name: /다음은 질문 연습입니다/ }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "질문 연습 시작하기" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "준비 과정" })).toBeVisible();
    expect(screen.getAllByTestId("dashboard-metric-skeleton")).toHaveLength(2);
    expect(screen.getByTestId("readiness-data-skeleton")).toBeVisible();
    expect(screen.getByTestId("weekly-activity-skeleton")).toBeVisible();
  });

  it("removes data skeletons after the server snapshot arrives", () => {
    render(<StudentDashboard name="김하우" snapshot={dashboardSnapshot} />);

    expect(screen.getByTestId("student-dashboard")).toHaveAttribute(
      "aria-busy",
      "false",
    );
    expect(screen.queryByTestId("dashboard-metric-skeleton")).toBeNull();
    expect(screen.queryByTestId("readiness-data-skeleton")).toBeNull();
    expect(screen.queryByTestId("weekly-activity-skeleton")).toBeNull();
    expect(screen.getByText("48m")).toBeVisible();
    expect(screen.getAllByText("D-42")).toHaveLength(2);
  });
});
