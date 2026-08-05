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
    const { container } = render(<StudentDashboard />);

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
    expect(screen.getByTestId("admissions-outlook-skeleton")).toBeVisible();
    expect(container.querySelector("p div, h1 div")).toBeNull();
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
    expect(screen.queryByTestId("admissions-outlook-skeleton")).toBeNull();
    expect(screen.getByText("48m")).toBeVisible();
    expect(screen.getAllByText("D-42")).toHaveLength(2);
    expect(screen.getByTestId("admissions-outlook")).toBeVisible();
    expect(screen.getByTestId("admissions-insight-deck")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "민사고 상세 해석 보기" }),
    ).toBeVisible();
  });

  it("shows explicit no-data fallbacks without replacing the page layout", () => {
    render(<StudentDashboard name="김하우" snapshot={null} />);

    expect(screen.getByTestId("student-dashboard")).toHaveAttribute(
      "aria-busy",
      "false",
    );
    expect(screen.queryByTestId("dashboard-metric-skeleton")).toBeNull();
    expect(screen.getByText("아직 준비 신호가 없어요")).toBeVisible();
    expect(screen.getByText("아직 집중 기록이 없어요")).toBeVisible();
    expect(
      screen.getByText("지원 학교 미등록", { exact: false }),
    ).toBeVisible();
    expect(
      screen.getByRole("link", { name: "질문 연습 시작하기" }),
    ).toBeVisible();
    expect(screen.queryByTestId("admissions-outlook")).toBeNull();
  });

  it("handles empty server collections as no data instead of blank regions", () => {
    render(
      <StudentDashboard
        name="김하우"
        snapshot={{
          ...dashboardSnapshot,
          readinessSignals: [],
          weeklyActivity: [],
          admissionsOutlook: null,
        }}
      />,
    );

    expect(screen.getByText("아직 준비 신호가 없어요")).toBeVisible();
    expect(screen.getByText("아직 집중 기록이 없어요")).toBeVisible();
    expect(screen.queryByTestId("admissions-outlook")).toBeNull();
  });
});
