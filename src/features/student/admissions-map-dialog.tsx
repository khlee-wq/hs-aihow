"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Compass,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { AppDialog } from "@/components/ui/app-dialog";
import { cn } from "@/lib/utils";
import type { DashboardSnapshot } from "./dashboard-model";

type AdmissionsOutlookData = NonNullable<
  DashboardSnapshot["admissionsOutlook"]
>;

type MapView = "flow" | "capacity" | "guide" | "action";

const viewCopy: Record<
  MapView,
  { label: string; title: string; body: string; signal: string }
> = {
  flow: {
    label: "지원 흐름",
    title: "지원자 수만으로는 판단이 끝나지 않아요.",
    body: "관심이 움직이는 시기와 학교별 지원 흐름을 함께 읽어야, 숫자가 줄어도 준비를 늦추지 않을 이유가 보입니다.",
    signal: "관심 흐름을 먼저 확인",
  },
  capacity: {
    label: "모집 여건",
    title: "모집 한 자리가 바꾸는 준비의 밀도",
    body: "모집 여건이 달라지면 같은 경쟁률도 전혀 다른 준비를 요구할 수 있어요. 전형과 모집 인원을 함께 해석합니다.",
    signal: "모집 여건을 함께 비교",
  },
  guide: {
    label: "모집요강",
    title: "2026학년도 모집요강에서 먼저 볼 항목",
    body: "모집 인원과 전형별 일정, 제출 자료, 면접 안내를 한 화면에서 확인한 뒤 자소서와 질문 연습으로 이어갑니다.",
    signal: "모집요강 핵심 확인",
  },
  action: {
    label: "내 준비",
    title: "민사고에 맞춰 오늘 먼저 할 일",
    body: "숫자 해석을 자소서 근거와 질문 연습으로 바꿉니다. 막연한 비교 대신, 지금 답할 경험부터 골라 보세요.",
    signal: "자소서 근거 → 질문 연습",
  },
};

function IndexBars({
  label,
  values,
  tone,
}: {
  label: string;
  values: number[];
  tone: "brand" | "warning";
}) {
  const color = tone === "brand" ? "var(--brand)" : "var(--warning)";

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_76%,transparent)] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold">{label}</p>
        <span className="font-mono text-[9px] font-bold tracking-[.1em] text-[var(--text-tertiary)]">
          100 기준
        </span>
      </div>
      <div className="mt-4 flex h-20 items-end gap-2" aria-hidden>
        {values.map((value, index) => (
          <span
            key={`${label}-${index}`}
            className="min-w-0 flex-1 rounded-t-[.4rem] transition-[height,opacity] duration-500"
            style={{
              height: `${Math.max(value * 0.52, 18)}%`,
              backgroundColor: color,
              opacity: 0.38 + index * 0.18,
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[9px] text-[var(--text-tertiary)]">
        <span>초기</span>
        <span>최근</span>
      </div>
    </div>
  );
}

export function AdmissionsMapDialog({
  open,
  onClose,
  school,
  data,
  initialView = "flow",
}: {
  open: boolean;
  onClose: () => void;
  school: string;
  data: AdmissionsOutlookData | null | undefined;
  initialView?: MapView;
}) {
  const [view, setView] = useState<MapView>(initialView);
  const copy = viewCopy[view];
  const hasData = Boolean(data);
  const outlook = useMemo(() => data ?? null, [data]);

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      eyebrow="Admissions map"
      title={`${school} 준비 지도`}
      purpose="notice"
      className="sm:max-w-4xl"
    >
      {hasData && outlook ? (
        <div className="mt-5 space-y-4">
          <section className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[color-mix(in_srgb,var(--brand)_26%,var(--border))] bg-[color-mix(in_srgb,var(--brand-soft)_55%,var(--surface))] p-5 shadow-[var(--shadow-sm)] sm:p-6">
            <div
              className="pointer-events-none absolute -right-12 -top-16 size-48 rounded-full bg-[color-mix(in_srgb,var(--brand)_13%,transparent)] blur-3xl"
              aria-hidden
            />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[var(--brand)]">
                  <Compass className="size-3.5" /> {outlook.timeline.fromYear} →{" "}
                  {outlook.timeline.toYear}
                </p>
                <h3 className="mt-3 max-w-xl break-keep text-balance text-[clamp(1.4rem,3vw,2rem)] font-bold leading-[1.2] tracking-[-.045em]">
                  {outlook.latestAdmissions.year}학년도 {school} 입시 흐름
                </h3>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--brand)_22%,transparent)] bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] px-3 py-1.5 text-[10px] font-bold text-[var(--brand)]">
                <Sparkles className="size-3" /> {school} 기준
              </span>
            </div>

            <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
              <IndexBars
                label="지원자 흐름"
                values={outlook.timeline.applicantIndex}
                tone="brand"
              />
              <IndexBars
                label="모집 여건"
                values={outlook.timeline.recruitmentIndex}
                tone="warning"
              />
            </div>
            <div className="relative mt-3 grid grid-cols-2 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_72%,transparent)]">
              <div className="border-r border-[var(--border)] px-4 py-3">
                <p className="text-[10px] font-bold text-[var(--text-secondary)]">
                  {outlook.latestAdmissions.year} 지원 인원
                </p>
                <p className="mt-1 font-mono text-xl font-bold tracking-[-.05em]">
                  {outlook.latestAdmissions.applicants.toLocaleString()}명
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] font-bold text-[var(--text-secondary)]">
                  {outlook.latestAdmissions.year} 모집 인원
                </p>
                <p className="mt-1 font-mono text-xl font-bold tracking-[-.05em]">
                  {outlook.latestAdmissions.capacity.toLocaleString()}명
                </p>
              </div>
            </div>
            <p className="relative mt-3 text-[11px] leading-5 text-[var(--text-secondary)]">
              원본 수치를 노출하지 않고, 연도별 변화를 비교하기 쉬운 100
              기준으로 정리했습니다.
            </p>
          </section>

          <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]">
            <div className="grid grid-cols-2 border-b border-[var(--border)] sm:grid-cols-4">
              {(Object.keys(viewCopy) as MapView[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setView(item)}
                  className={cn(
                    "relative min-h-12 px-3 text-center text-xs font-bold transition-colors sm:text-sm",
                    view === item
                      ? "bg-[color-mix(in_srgb,var(--brand-soft)_54%,var(--surface))] text-[var(--brand)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]",
                  )}
                  aria-pressed={view === item}
                >
                  {viewCopy[item].label}
                  {view === item ? (
                    <span className="absolute inset-x-5 bottom-0 h-0.5 bg-[var(--brand)]" />
                  ) : null}
                </button>
              ))}
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_14rem] sm:p-6">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.13em] text-[var(--brand)]">
                  {copy.signal}
                </p>
                <h4 className="mt-2 break-keep text-xl font-bold tracking-[-.035em]">
                  {copy.title}
                </h4>
                <p className="mt-3 max-w-xl break-keep text-sm leading-6 text-[var(--text-secondary)]">
                  {copy.body}
                </p>
              </div>
              <aside className="rounded-[var(--radius-md)] bg-[var(--surface-muted)] p-4">
                <p className="flex items-center gap-2 text-xs font-bold">
                  <LockKeyhole className="size-3.5 text-[var(--brand)]" />{" "}
                  구독에서 이어지는 해석
                </p>
                <p className="mt-2 text-[11px] leading-5 text-[var(--text-secondary)]">
                  비슷한 흐름의 학교 비교와 전형별 준비 우선순위를 내 기록에
                  맞춰 이어갑니다.
                </p>
              </aside>
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-[var(--radius-lg)] bg-[var(--text-primary)] p-5 text-[var(--canvas)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold text-[color-mix(in_srgb,var(--canvas)_72%,transparent)]">
                <Check className="size-3.5 text-[var(--brand)]" /> 지금 시작할
                준비
              </p>
              <p className="mt-2 break-keep text-base font-bold">
                자소서에서 민사고에 연결할 경험 하나를 먼저 골라 보세요.
              </p>
            </div>
            <Link
              href="/applications/demo/practice"
              onClick={onClose}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-[var(--brand)] px-5 text-sm font-bold text-[var(--text-on-brand)] transition-transform hover:-translate-y-0.5"
            >
              질문 연습 시작하기 <ArrowUpRight className="size-4" />
            </Link>
          </section>
        </div>
      ) : (
        <p className="mt-6 text-sm leading-6 text-[var(--text-secondary)]">
          관심 학교를 선택하면 지원 흐름과 모집 여건을 준비 순서로 정리해
          드립니다.
        </p>
      )}
    </AppDialog>
  );
}
