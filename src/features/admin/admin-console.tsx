"use client";

import {
  Activity,
  ArrowUpRight,
  BellRing,
  BookOpenCheck,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileClock,
  FileUp,
  MessageCircleQuestion,
  Plus,
  PlayCircle,
  School,
  Sparkles,
  TrendingUp,
  UserRoundCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PromptStudio } from "./prompt-studio/prompt-studio";
import { QuestionRulesPanel } from "./question-rules/question-rules-panel";
import { VideoGuidesPanel } from "../video-guides/video-guides-panel";

type AdminSection =
  "home" | "questions" | "prompts" | "videos" | "schools" | "metrics";
const validSections = new Set<AdminSection>([
  "home",
  "questions",
  "prompts",
  "videos",
  "schools",
  "metrics",
]);

export function AdminConsole({ section }: { section: string }) {
  const normalized = validSections.has(section as AdminSection)
    ? (section as AdminSection)
    : "home";
  if (normalized === "home") return <AdminHome />;
  if (normalized === "questions") return <QuestionRulesPanel />;
  if (normalized === "prompts") return <PromptStudio />;
  if (normalized === "videos") return <VideoGuidesPanel />;
  if (normalized === "schools") return <Schools />;
  return <Metrics />;
}

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="heading-lg mt-3">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          {description}
        </p>
      </div>
      {action}
    </header>
  );
}

function AdminHome() {
  return (
    <div className="space-y-8 float-in">
      <PageHeader
        eyebrow="어드민 워크스페이스"
        title="수업 기준이 학생의 연습을 이끕니다"
        description="운영 노하우를 질문과 피드백 기준으로 정리하고, 학교 자료를 학생의 준비 흐름에 맞게 연결하세요."
        action={
          <Link href="/admin/prompts" className={buttonVariants()}>
            <Plus className="size-4" />새 수업 기준
          </Link>
        }
      />
      <CoachStartGuide />
      <section className="grid gap-4 sm:grid-cols-3">
        <Stat
          icon={FileCheck2}
          label="적용 중인 수업 기준"
          value="12"
          change="이번 주 +2"
          tone="coral"
        />
        <Stat
          icon={MessageCircleQuestion}
          label="질문 설계 기준"
          value="148"
          change="이번 주 +9"
          tone="blue"
        />
        <Stat
          icon={School}
          label="학교 기준"
          value="8"
          change="2027학년도"
          tone="mint"
        />
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.4fr_.8fr]">
        <Card className="overflow-hidden p-0" data-tour="admin-prompt-recipes">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
            <div>
              <h2 className="font-black">내 수업에 적용 중인 기준</h2>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                어드민이 정한 기준은 학생 수와 관계없이 각 준비 단계에 자동
                적용됩니다.
              </p>
            </div>
            <Link
              href="/admin/prompts"
              className="text-xs font-extrabold text-[var(--brand)]"
            >
              수업 기준 열기
            </Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {[
              [
                "자소서 분석",
                "공통",
                "근거를 먼저 짚고 다음 행동 제안",
                "기준 3.2",
              ],
              [
                "예상 질문",
                "민사고",
                "학교 관점과 이어 묻는 질문 반영",
                "기준 2.4",
              ],
              [
                "답변 피드백",
                "공통",
                "학생의 말투를 살린 구체적 피드백",
                "기준 1.8",
              ],
            ].map(([stage, school, rule, version]) => (
              <div key={stage} className="flex items-center gap-4 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-[var(--brand-soft)] text-[var(--brand)]">
                  <Sparkles className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm">{stage}</strong>
                  <span className="mt-1 block text-xs text-[var(--text-secondary)]">
                    {school} · {rule}
                  </span>
                </span>
                <span className="text-[10px] font-bold text-[var(--text-tertiary)]">
                  {version}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-5">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-black">학교 데이터 최신도</h2>
              <span className="text-xs font-extrabold text-[var(--success)]">
                양호
              </span>
            </div>
            <div className="mt-6 grid gap-4">
              {[
                ["민사고", "2027", 94],
                ["하나고", "2027", 82],
                ["외대부고", "2026", 67],
              ].map(([school, year, value]) => (
                <div key={school as string}>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-extrabold">{school}</span>
                    <span className="text-[var(--text-tertiary)]">
                      {year} · {value}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--surface-muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--brand)]"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/admin/schools"
              className="mt-6 flex items-center justify-between text-xs font-extrabold"
            >
              학교 데이터 열기 <ChevronRight className="size-4" />
            </Link>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-[var(--radius-sm)] bg-[var(--mint-soft)] text-[var(--success)]">
                <Activity />
              </span>
              <div>
                <p className="text-xs font-bold text-[var(--text-secondary)]">
                  이번 주 학습 흐름
                </p>
                <p className="mt-1 text-sm font-black">
                  질문 연습 전환이 가장 낮아요
                </p>
              </div>
            </div>
            <div
              className="mt-5 grid grid-cols-4 gap-1"
              aria-label="이번 주 학습 단계 흐름"
            >
              {[
                ["자소서", "64", "100"],
                ["질문", "43", "67"],
                ["면접", "22", "34"],
                ["노트", "12", "19"],
              ].map(([label, count, rate], index) => (
                <div key={label} className="min-w-0">
                  <p className="text-[10px] font-bold text-[var(--text-tertiary)]">
                    {label}
                  </p>
                  <p className="mt-1 text-base font-black tracking-[-.04em]">
                    {count}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-muted)]">
                    <div
                      className="h-full rounded-full bg-[var(--brand)]"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                  {index < 3 ? (
                    <span className="mt-1 block text-[9px] text-[var(--text-tertiary)]">
                      {rate}%
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
            <Link
              href="/admin/metrics"
              className="mt-5 flex items-center justify-between text-xs font-extrabold text-[var(--brand)]"
            >
              학습 인사이트에서 원인 보기 <ChevronRight className="size-4" />
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}

const coachGuideSteps = [
  {
    eyebrow: "01 · 수업 기준",
    title: "반복할 판단 기준을 수업에 담으세요",
    description:
      "개별 학생의 결과를 하나씩 확인하지 않습니다. 자소서·질문·면접 단계별 운영 기준을 정하면 학생 상황에 맞춰 적용됩니다.",
    action: "수업 기준 열기",
    href: "/admin/prompts",
    note: "운영 노하우 → 단계별 수업 기준 → 학생별 적용",
  },
  {
    eyebrow: "02 · 학교 데이터",
    title: "학교별 기준을 최신 상태로 유지하세요",
    description:
      "모집요강과 학교별 수업 기준은 검토 후 갱신합니다. 이 정보는 해당 학교 학생에게만 자동으로 결합됩니다.",
    action: "학교 데이터 열기",
    href: "/admin/schools",
    note: "공식 출처 → 학교 정보 갱신 → 대상 학생에게 자동 반영",
  },
  {
    eyebrow: "03 · 영상 연결",
    title: "완성한 영상은 주소만 연결하세요",
    description:
      "영상 편집은 익숙한 도구에서 마친 뒤 URL만 붙입니다. 학생이 필요한 단계에서 바로 재생되도록 간단히 연결합니다.",
    action: "영상 연결 열기",
    href: "/admin/videos",
    note: "영상 URL → 재생 미리보기 → 학생 단계 연결",
  },
] as const;

function CoachStartGuide() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = coachGuideSteps[activeIndex];

  return (
    <section
      className="grid overflow-hidden border-y border-[var(--border)] lg:grid-cols-[minmax(0,1fr)_minmax(22rem,.7fr)]"
      aria-labelledby="coach-start-title"
      data-tour="admin-guide"
    >
      <div className="bg-[var(--brand-soft)] p-5 sm:p-7">
        <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[var(--brand)]">
          <BookOpenCheck className="size-4" /> 어드민 운영 도구
        </p>
        <h2
          id="coach-start-title"
          className="mt-3 text-2xl font-black tracking-[-.045em]"
        >
          내 수업 기준을 세 곳에서 설계하세요
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
          메뉴를 외울 필요는 없습니다. 학생에게 어떤 학습 경험을 만들지
          기준으로, 수업 설계에 필요한 도구만 연결합니다.
        </p>
        <div
          className="mt-6 flex flex-wrap gap-2"
          role="tablist"
          aria-label="수업 설계 시작 가이드"
        >
          {coachGuideSteps.map((step, index) => (
            <button
              key={step.eyebrow}
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "min-h-10 border px-3 text-xs font-bold transition-colors",
                activeIndex === index
                  ? "border-[var(--brand)] bg-[var(--brand)] text-[var(--text-on-brand)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
              )}
            >
              {index + 1}. {step.eyebrow.split("·")[1].trim()}
            </button>
          ))}
        </div>
      </div>
      <div className="relative p-5 sm:p-7" role="tabpanel">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[.14em] text-[var(--brand)]">
          {active.eyebrow}
        </p>
        <h3 className="mt-3 text-xl font-black tracking-[-.035em]">
          {active.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          {active.description}
        </p>
        <div className="mt-5 flex items-start gap-3 border-y border-[var(--border)] py-3.5 text-xs leading-5 text-[var(--text-secondary)]">
          <PlayCircle className="mt-0.5 size-4 shrink-0 text-[var(--brand)]" />
          {active.note}
        </div>
        <Link
          href={active.href}
          className="mt-5 inline-flex min-h-10 items-center gap-2 bg-[var(--text-primary)] px-4 text-sm font-bold text-[var(--canvas)] hover:bg-[var(--brand)]"
        >
          {active.action} <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  change,
  tone,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  change: string;
  tone: "blue" | "mint" | "coral";
}) {
  return (
    <Card className="surface-interactive">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "grid size-10 place-items-center rounded-[var(--radius-sm)]",
            tone === "mint"
              ? "bg-[var(--mint-soft)] text-[var(--success)]"
              : tone === "coral"
                ? "bg-[var(--coral-soft)] text-[var(--coral)]"
                : "bg-[var(--brand-soft)] text-[var(--brand)]",
          )}
        >
          <Icon className="size-5" />
        </span>
        <span className="text-[10px] font-bold text-[var(--text-tertiary)]">
          {change}
        </span>
      </div>
      <p className="mt-6 text-3xl font-black tracking-[-.06em]">{value}</p>
      <p className="mt-1 text-xs font-bold text-[var(--text-secondary)]">
        {label}
      </p>
    </Card>
  );
}
const schools = [
  ["민족사관고등학교", "민사고", 94, "2027", 38],
  ["하나고등학교", "하나고", 82, "2027", 26],
  ["용인한국외국어대학교부설고", "외대부고", 67, "2026", 19],
  ["상산고등학교", "상산고", 76, "2027", 22],
] as const;
function Schools() {
  const [selectedFileName, setSelectedFileName] = useState("");
  return (
    <div className="space-y-7 float-in">
      <PageHeader
        eyebrow="학교 데이터"
        title="자료를 기준으로 바꾸는 곳"
        description="모집요강 PDF와 경쟁률 파일을 가져오면, 학교·학년도·전형별로 나누어 추출 초안을 만듭니다. 어드민은 필요한 부분만 확인해 적용합니다."
        action={
          <label className={buttonVariants()}>
            <FileUp className="size-4" /> 자료 가져오기
            <input
              className="hidden"
              type="file"
              accept="application/pdf,.pdf,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(event) =>
                setSelectedFileName(event.target.files?.[0]?.name ?? "")
              }
            />
          </label>
        }
      />
      <section className="grid overflow-hidden border-y border-[var(--border)] lg:grid-cols-[1.1fr_.9fr]">
        <label className="group flex min-h-52 cursor-pointer flex-col justify-between bg-[var(--brand-soft)] p-5 sm:p-7">
          <span className="grid size-11 place-items-center rounded-[var(--radius-sm)] bg-[var(--surface)] text-[var(--brand)] shadow-[var(--shadow-sm)]">
            <FileUp className="size-5" />
          </span>
          <span>
            <strong className="block text-lg tracking-[-.03em]">
              PDF 또는 엑셀 자료를 놓아 주세요
            </strong>
            <span className="mt-2 block text-sm leading-6 text-[var(--text-secondary)]">
              모집요강 PDF는 OCR로 항목·일정·지원 조건을, 경쟁률 엑셀은
              학교·전형·연도별 표를 읽어 옵니다.
            </span>
          </span>
          <span className="mt-5 inline-flex w-fit items-center gap-2 text-xs font-black text-[var(--brand)]">
            파일 선택{" "}
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
          <input
            className="hidden"
            type="file"
            accept="application/pdf,.pdf,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            onChange={(event) =>
              setSelectedFileName(event.target.files?.[0]?.name ?? "")
            }
          />
        </label>
        <div className="grid content-center gap-4 p-5 sm:p-7">
          <p className="eyebrow">Import flow</p>
          {[
            [
              "01",
              "원본 보관",
              "비공개 자료는 권한 있는 어드민만 볼 수 있는 저장소에 보관",
            ],
            [
              "02",
              "자동 추출",
              "OCR·표 파서가 학교, 전형, 일정, 경쟁률 후보를 분리",
            ],
            [
              "03",
              "확인 후 적용",
              "추출 초안을 확인한 항목만 학생 준비 화면에 반영",
            ],
          ].map(([number, title, detail]) => (
            <div
              key={number}
              className="flex gap-3 border-t border-[var(--border)] pt-3 first:border-t-0 first:pt-0"
            >
              <span className="font-mono text-[10px] font-bold text-[var(--brand)]">
                {number}
              </span>
              <span>
                <strong className="block text-sm">{title}</strong>
                <span className="mt-1 block text-xs leading-5 text-[var(--text-secondary)]">
                  {detail}
                </span>
              </span>
            </div>
          ))}
          {selectedFileName ? (
            <p
              role="status"
              className="border-t border-[var(--border)] pt-4 text-xs font-bold text-[var(--success)]"
            >
              선택됨 · {selectedFileName} — 서버 연결 후 자동 추출을 시작합니다.
            </p>
          ) : null}
        </div>
      </section>
      <section className="grid overflow-hidden border-y border-[var(--border)] md:grid-cols-3">
        <div className="bg-[var(--warning-soft)] p-5">
          <p className="flex items-center gap-2 text-xs font-black text-[var(--warning)]">
            <FileClock className="size-4" /> 현재 상태
          </p>
          <p className="mt-3 text-lg font-black">모집요강 공개 대기</p>
          <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
            공개 전 정보는 학생에게 확정 기준처럼 노출하지 않습니다.
          </p>
        </div>
        <div className="border-t border-[var(--border)] p-5 md:border-l md:border-t-0">
          <p className="text-xs font-black">공개 후 확인 순서</p>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            모집요강 원문 확인 → 지원 조건 정리 → 질문·영상 가이드 반영
          </p>
        </div>
        <div className="border-t border-[var(--border)] p-5 md:border-l md:border-t-0">
          <p className="flex items-center gap-2 text-xs font-black">
            <BellRing className="size-4 text-[var(--brand)]" /> 학생 알림
          </p>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            확인된 변경만 해당 학교 학생의 준비 경로에 안내합니다.
          </p>
        </div>
      </section>
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="bg-[var(--surface-muted)] text-xs text-[var(--text-secondary)]">
              <tr>
                <th className="p-4 font-extrabold">학교</th>
                <th className="p-4 font-extrabold">학년도</th>
                <th className="p-4 font-extrabold">기준 완성도</th>
                <th className="p-4 font-extrabold">질문 규칙</th>
                <th className="p-4 font-extrabold">최근 확인</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {schools.map(([name, short, value, year, rules], index) => (
                <tr key={name} className="border-t border-[var(--border)]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-[var(--radius-xs)] bg-[var(--brand-soft)] font-black text-[var(--brand)]">
                        {short.slice(0, 1)}
                      </span>
                      <div>
                        <strong>{name}</strong>
                        <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                          {short}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-bold">{year}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-24 rounded-full bg-[var(--surface-muted)]">
                        <div
                          className="h-full rounded-full bg-[var(--brand)]"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <span className="text-xs font-black">{value}%</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold">{rules}개</td>
                  <td className="p-4 text-xs text-[var(--text-secondary)]">
                    {index === 0 ? "오늘" : `${index + 1}일 전`}
                  </td>
                  <td className="p-4">
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Metrics() {
  const bars = [42, 58, 49, 72, 64, 82, 76];
  return (
    <div className="space-y-7 float-in">
      <PageHeader
        eyebrow="Product signals"
        title="학습 인사이트"
        description="완료율과 반복 훈련을 중심으로 수업의 흐름을 확인합니다. AI 사용량 자체를 성과로 보지 않습니다."
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={TrendingUp}
          label="질문 완료율"
          value="76%"
          change="+8.2%"
          tone="mint"
        />
        <Stat
          icon={Clock3}
          label="평균 연습 시간"
          value="24m"
          change="주간"
          tone="blue"
        />
        <Stat
          icon={UserRoundCheck}
          label="재훈련율"
          value="62%"
          change="+4.1%"
          tone="blue"
        />
        <Stat
          icon={FileCheck2}
          label="파이널 노트"
          value="48"
          change="완료"
          tone="coral"
        />
      </section>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black">최근 7일 훈련 세션</h2>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              질문 연습과 음성 모의면접 완료 합계
            </p>
          </div>
          <span className="rounded-full bg-[var(--mint-soft)] px-3 py-1 text-xs font-black text-[var(--success)]">
            +14.8%
          </span>
        </div>
        <div
          className="mt-10 flex h-64 items-end gap-3 sm:gap-6"
          aria-label="최근 7일 훈련 세션 막대 차트"
        >
          {bars.map((value, index) => (
            <div
              key={index}
              className="flex h-full flex-1 flex-col justify-end gap-2"
            >
              <div
                className="relative rounded-t-[var(--radius-xs)] bg-[var(--brand-soft)] transition-all hover:bg-[var(--brand)]"
                style={{ height: `${value}%` }}
                title={`${value} 세션`}
              />
              <span className="text-center text-[10px] font-bold text-[var(--text-tertiary)]">
                {["월", "화", "수", "목", "금", "토", "일"][index]}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
