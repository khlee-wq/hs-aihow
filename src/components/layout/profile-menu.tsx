"use client";

import { LogOut, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AppDialog } from "@/components/ui/app-dialog";
import { Button } from "@/components/ui/button";
import type { DemoSession } from "@/lib/session-shared";

export function ProfileMenu({ session }: { session: DemoSession }) {
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", closeOutside);
    return () => window.removeEventListener("pointerdown", closeOutside);
  }, []);

  const logout = async () => {
    setLogoutPending(true);
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) window.location.assign("/");
    else setLogoutPending(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`${session.name} 계정 메뉴`}
        className="grid size-9 place-items-center rounded-full border border-[color-mix(in_srgb,var(--mint)_24%,var(--border))] bg-[var(--mint-soft)] text-xs font-black text-[var(--success)] shadow-[var(--shadow-sm)]"
      >
        <span className="hidden sm:inline">{session.name.slice(0, 1)}</span>
        <UserRound className="size-4 sm:hidden" />
      </button>
      {open ? (
        <div
          className="surface absolute right-0 top-[calc(100%+0.65rem)] z-50 w-56 bg-[var(--surface)] p-2 shadow-[var(--shadow-md)]"
          role="menu"
          aria-label="계정 메뉴"
        >
          <div className="border-b border-[var(--border)] px-3 py-2.5">
            <p className="text-sm font-bold">{session.name}</p>
            <p className="mt-0.5 truncate text-[11px] text-[var(--text-tertiary)]">{session.email}</p>
          </div>
          <Link
            href="/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="mt-1 flex min-h-10 items-center gap-2 px-3 text-sm font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
          >
            <Settings className="size-4" /> 설정
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              setLogoutOpen(true);
            }}
            className="flex min-h-10 w-full items-center gap-2 px-3 text-left text-sm font-bold text-[var(--danger)] hover:bg-[var(--coral-soft)]"
          >
            <LogOut className="size-4" /> 로그아웃
          </button>
        </div>
      ) : null}
      <AppDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        eyebrow="Session"
        title="지금 로그아웃할까요?"
        purpose="danger"
        dismissible={!logoutPending}
      >
        <p className="mt-6 border-y border-[var(--border)] py-4 text-sm leading-6 text-[var(--text-secondary)]">
          준비 진행 상태는 이 기기에 남지만, 현재 역할 세션은 즉시 종료됩니다. 다시 로그인하면 이어서 확인할 수 있어요.
        </p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={() => setLogoutOpen(false)}>
            계속 둘러보기
          </Button>
          <Button variant="danger" loading={logoutPending} onClick={logout}>
            <LogOut className="size-4" /> 로그아웃
          </Button>
        </div>
      </AppDialog>
    </div>
  );
}
