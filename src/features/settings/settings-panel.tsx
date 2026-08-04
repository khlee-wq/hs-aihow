"use client";

import {
  Bell,
  Database,
  Palette,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BrandPaletteToggle } from "@/components/brand/brand-palette";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DemoSession } from "@/lib/session-shared";
import { useAppStore } from "@/stores/app-store";

export function SettingsPanel({ session }: { session: DemoSession }) {
  const notificationsEnabled = useAppStore(
    (state) => state.notificationsEnabled,
  );
  const setNotificationsEnabled = useAppStore(
    (state) => state.setNotificationsEnabled,
  );
  const resetDemo = useAppStore((state) => state.resetDemo);
  return (
    <div className="mx-auto max-w-3xl space-y-7 float-in">
      <header>
        <p className="eyebrow">Preferences</p>
        <h1 className="heading-lg mt-3">설정</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          화면, 알림과 데모 데이터 상태를 관리합니다.
        </p>
      </header>
      <Card>
        <SettingTitle
          icon={UserRound}
          title="내 프로필"
          description="데모 세션에만 보관되는 정보입니다."
        />
        <div className="mt-6 grid gap-4 rounded-[var(--radius-md)] bg-[var(--surface-muted)] p-4 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-black text-[var(--text-tertiary)]">
              이름
            </p>
            <p className="mt-1 text-sm font-extrabold">{session.name}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-[var(--text-tertiary)]">
              이메일
            </p>
            <p className="mt-1 text-sm font-extrabold">{session.email}</p>
          </div>
        </div>
      </Card>
      <Card>
        <SettingTitle
          icon={Palette}
          title="브랜드 톤"
          description="Deep Teal, Iris, Cobalt, Plum을 즉시 비교합니다. 선택한 톤은 URL과 이 기기에 유지됩니다."
        />
        <div className="mt-6">
          <BrandPaletteToggle />
        </div>
      </Card>
      <Card>
        <SettingTitle
          icon={Sparkles}
          title="첫 화면 안내"
          description="학생과 소장님은 역할에 맞는 시작 가이드를 첫 진입 시 확인합니다. 회의 중에는 이 버튼으로 언제든 다시 볼 수 있습니다."
        />
        <Button
          variant="secondary"
          className="mt-5"
          onClick={() => window.dispatchEvent(new Event("aihow:intro-preview"))}
        >
          첫 화면 안내 다시 보기
        </Button>
      </Card>
      <Card>
        <SettingTitle
          icon={ShieldCheck}
          title="화면 테마"
          description="라이트·다크·시스템 설정이 모든 인터페이스 토큰에 적용됩니다."
        />
        <div className="mt-6">
          <ThemeToggle expanded />
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between gap-4">
          <SettingTitle
            icon={Bell}
            title="준비 알림"
            description="다시 연습할 시점을 알려주는 데모 설정입니다."
          />
          <button
            type="button"
            role="switch"
            aria-checked={notificationsEnabled}
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${notificationsEnabled ? "bg-[var(--brand)]" : "bg-[var(--surface-muted)]"}`}
          >
            <span
              className={`absolute top-1 size-5 rounded-full bg-white shadow transition-transform ${notificationsEnabled ? "left-6" : "left-1"}`}
            />
          </button>
        </div>
      </Card>
      <Card id="data">
        <SettingTitle
          icon={Database}
          title="자료 보관과 삭제"
          description="실제 운영 연결 전 정책 검토가 필요한 영역을 명확히 표시합니다."
        />
        <div className="mt-6 grid gap-3 text-sm">
          <DataRow label="자소서 원본" state="데모 저장 없음" />
          <DataRow label="추출 텍스트" state="브라우저 예시만 표시" />
          <DataRow label="음성 녹음" state="장치 접근 없음" />
          <DataRow label="답변 진행 상태" state="이 기기 localStorage" />
        </div>
        <Button variant="danger" className="mt-5" onClick={resetDemo}>
          <RotateCcw className="size-4" />
          데모 진행 상태 초기화
        </Button>
      </Card>
      <Card>
        <SettingTitle
          icon={ShieldCheck}
          title="자동 로그아웃 안내"
          description="30분간 활동이 없으면 5분 전 경고를 표시하고, 남은 시간이 지나면 안전하게 로그인 화면으로 이동합니다."
        />
        <Button
          variant="secondary"
          className="mt-5"
          onClick={() => window.dispatchEvent(new Event("aihow:session-warning-preview"))}
        >
          자동 로그아웃 경고 보기
        </Button>
      </Card>
    </div>
  );
}
function SettingTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--brand-soft)] text-[var(--brand)]">
        <Icon className="size-5" />
      </span>
      <div>
        <h2 className="font-black">{title}</h2>
        <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
          {description}
        </p>
      </div>
    </div>
  );
}
function DataRow({ label, state }: { label: string; state: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[var(--radius-sm)] bg-[var(--surface-muted)] px-4 py-3">
      <span className="font-bold">{label}</span>
      <span className="text-xs text-[var(--text-secondary)]">{state}</span>
    </div>
  );
}
