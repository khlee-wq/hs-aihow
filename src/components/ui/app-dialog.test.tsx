import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppDialog } from "./app-dialog";

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
});

describe("AppDialog", () => {
  it("portals the overlay to the viewport and locks background scrolling", async () => {
    render(
      <div data-testid="transformed-host" style={{ transform: "translateY(1px)" }}>
        <AppDialog open onClose={() => undefined} title="공통 모달">
          <button type="button">확인</button>
        </AppDialog>
      </div>,
    );

    const overlay = screen.getByTestId("app-dialog-overlay");
    expect(overlay.parentElement).toBe(document.body);
    expect(screen.getByRole("dialog", { name: "공통 모달" })).toBeVisible();
    expect(document.body.style.overflow).toBe("hidden");
    await waitFor(() => expect(screen.getByRole("button", { name: "닫기" })).toHaveFocus());
  });

  it("dismisses with Escape and restores the trigger focus", async () => {
    const onClose = vi.fn();
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            열기
          </button>
          <AppDialog
            open={open}
            onClose={() => {
              onClose();
              setOpen(false);
            }}
            title="닫기 검증"
          >
            <button type="button">작업</button>
          </AppDialog>
        </>
      );
    }

    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "열기" });
    trigger.focus();
    fireEvent.click(trigger);
    await waitFor(() => expect(screen.getByRole("button", { name: "닫기" })).toHaveFocus());

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.getByRole("button", { name: "열기" })).toHaveFocus());
  });
});
