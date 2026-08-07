import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAppStore } from "@/stores/app-store";
import { dashboardSnapshot } from "./dashboard-model";
import { StudentDashboard } from "./student-dashboard";

vi.mock("@/components/motion/journey-orbit", () => ({
  JourneyOrbit: () => <svg aria-hidden />,
}));

afterEach(() => cleanup());

beforeEach(() => {
  window.localStorage.setItem("aihow:interest-school:v1", "minsago");
});

describe("StudentDashboard loading boundaries", () => {
  it("keeps actions visible while every server-backed region is loading", () => {
    useAppStore.setState({ completedSteps: ["essay", "practice"] });
    const { container } = render(<StudentDashboard />);

    expect(screen.getByTestId("student-dashboard")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(screen.getByTestId("dashboard-header-skeleton")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "모의면접 시작하기" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "준비 과정" })).toBeVisible();
    expect(screen.getAllByTestId("dashboard-metric-skeleton")).toHaveLength(2);
    expect(screen.getByTestId("readiness-data-skeleton")).toBeVisible();
    expect(screen.getByTestId("dashboard-insight-skeleton")).toBeVisible();
    expect(screen.getByTestId("weekly-activity-skeleton")).toBeVisible();
    expect(screen.getByTestId("admissions-outlook-skeleton")).toBeVisible();
    expect(container.querySelector("p div, h1 div")).toBeNull();
  });

  it("removes data skeletons after the server snapshot arrives", async () => {
    render(<StudentDashboard name="김하우" snapshot={dashboardSnapshot} />);

    await screen.findByRole("button", { name: "민사고 준비 지도 보기" });

    expect(screen.getByTestId("student-dashboard")).toHaveAttribute(
      "aria-busy",
      "false",
    );
    expect(screen.queryByTestId("dashboard-metric-skeleton")).toBeNull();
    expect(screen.queryByTestId("dashboard-header-skeleton")).toBeNull();
    expect(screen.queryByTestId("readiness-data-skeleton")).toBeNull();
    expect(screen.queryByTestId("dashboard-insight-skeleton")).toBeNull();
    expect(screen.queryByTestId("weekly-activity-skeleton")).toBeNull();
    expect(screen.queryByTestId("admissions-outlook-skeleton")).toBeNull();
    expect(screen.getByText("48m")).toBeVisible();
    expect(screen.getByText("D-42")).toBeVisible();
    expect(screen.getByTestId("admissions-outlook")).toBeVisible();
    expect(screen.getByTestId("admissions-insight-deck")).toBeVisible();
    expect(screen.getByText("입시 지도", { exact: true })).toBeVisible();
    const schoolGuide = screen.getByRole("button", {
      name: "민사고 준비 지도 보기",
    });
    expect(within(schoolGuide).getByText("민사고")).toBeVisible();
    expect(within(schoolGuide).getByText("214명")).toBeVisible();
    expect(within(schoolGuide).getByText("96명")).toBeVisible();
    expect(screen.queryByText(/Prep control/)).toBeNull();
    expect(screen.queryByText(/마지막 동기화/)).toBeNull();
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
      screen.getByRole("link", { name: "모의면접 시작하기" }),
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

  it("lets a student who skipped onboarding set an interest school later", async () => {
    window.localStorage.removeItem("aihow:interest-school:v1");
    render(<StudentDashboard name="김하우" snapshot={dashboardSnapshot} />);

    await screen.findByTestId("interest-school-prompt");
    fireEvent.click(screen.getByRole("button", { name: "학교 찾기" }));
    const dialog = await screen.findByRole("dialog", {
      name: "가장 먼저 준비할 학교를 골라볼까요?",
    });
    fireEvent.change(within(dialog).getByRole("searchbox"), {
      target: { value: "민" },
    });
    expect(
      within(dialog).getByRole("button", { name: /민족사관고등학교/ }),
    ).toBeVisible();
    expect(
      within(dialog).queryByRole("button", { name: /한일고/ }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      within(dialog).getByRole("button", { name: /민족사관고등학교/ }),
    );
    const confirmation = await screen.findByRole("dialog", {
      name: "민족사관고등학교를 선택할까요?",
    });
    fireEvent.click(
      within(confirmation).getByRole("button", { name: "민사고 선택" }),
    );
    expect(
      await screen.findByRole("button", { name: "민사고 준비 지도 보기" }),
    ).toBeVisible();
    expect(window.localStorage.getItem("aihow:interest-school:v1")).toBe(
      "minsago",
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "관심 학교 변경" }));
    const reopenedDialog = await screen.findByRole("dialog", {
      name: "가장 먼저 준비할 학교를 골라볼까요?",
    });
    const search = within(reopenedDialog).getByRole("searchbox");
    fireEvent.change(search, { target: { value: "민" } });
    fireEvent.click(
      within(reopenedDialog).getByRole("button", { name: "검색어 지우기" }),
    );
    expect(search).toHaveValue("");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(
      screen.queryByRole("dialog", {
        name: "가장 먼저 준비할 학교를 골라볼까요?",
      }),
    ).not.toBeInTheDocument();
  });
});
