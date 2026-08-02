"use client";

import { useMutation } from "@tanstack/react-query";
import {
  Activity,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Eye,
  FileCheck2,
  MessageCircleQuestion,
  PencilLine,
  Play,
  Plus,
  Save,
  School,
  Search,
  Sparkles,
  TrendingUp,
  UserRoundCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/status-state";
import { inputClass, textareaClass } from "@/components/ui/field";
import { cn, sleep } from "@/lib/utils";
import { QuestionRulesPanel } from "./question-rules/question-rules-panel";

type AdminSection =
  | "home"
  | "reviews"
  | "questions"
  | "prompts"
  | "videos"
  | "schools"
  | "users"
  | "metrics";
const validSections = new Set<AdminSection>([
  "home",
  "reviews",
  "questions",
  "prompts",
  "videos",
  "schools",
  "users",
  "metrics",
]);

export function AdminConsole({ section }: { section: string }) {
  const normalized = validSections.has(section as AdminSection)
    ? (section as AdminSection)
    : "home";
  if (normalized === "home") return <AdminHome />;
  if (normalized === "reviews") return <Reviews />;
  if (normalized === "questions") return <QuestionRulesPanel />;
  if (normalized === "prompts") return <Prompts />;
  if (normalized === "videos") return <Videos />;
  if (normalized === "schools") return <Schools />;
  if (normalized === "users") return <UsersPanel />;
  return <Metrics />;
}

const reviewQueue = [
  {
    student: "김하우",
    school: "민사고",
    kind: "예상 질문",
    title: "지원 동기 질문 3건",
    priority: "긴급",
    time: "12분 전",
  },
  {
    student: "박서윤",
    school: "하나고",
    kind: "자소서",
    title: "소재·논리 분석 결과",
    priority: "높음",
    time: "28분 전",
  },
  {
    student: "이도현",
    school: "상산고",
    kind: "면접",
    title: "음성 답변 피드백",
    priority: "보통",
    time: "1시간 전",
  },
  {
    student: "최지우",
    school: "외대부고",
    kind: "예상 질문",
    title: "꼬리질문 분기 5건",
    priority: "보통",
    time: "2시간 전",
  },
];

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
        eyebrow="Operations overview"
        title="좋은 기준이, 좋은 질문을 만듭니다"
        description="학생에게 전달되기 전 검수할 결과와 학교별 기준의 최신 상태를 확인하세요."
        action={
          <Button>
            <Plus className="size-4" />새 기준 등록
          </Button>
        }
      />
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={FileCheck2}
          label="검수 대기"
          value="12"
          change="긴급 2건"
          tone="coral"
        />
        <Stat
          icon={MessageCircleQuestion}
          label="활성 질문 기준"
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
        <Stat
          icon={Users}
          label="훈련 중 학생"
          value="64"
          change="오늘 18명"
          tone="blue"
        />
      </section>
      <section className="grid gap-5 xl:grid-cols-[1.4fr_.8fr]">
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
            <div>
              <h2 className="font-black">우선 검수할 항목</h2>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                학생에게 전달되기 전 전문가 확인이 필요해요
              </p>
            </div>
            <Link
              href="/admin/reviews"
              className="text-xs font-extrabold text-[var(--brand)]"
            >
              전체 보기
            </Link>
          </div>
          <QueueList limit={4} />
        </Card>
        <div className="space-y-5">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="font-black">기준 최신도</h2>
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
              학교 기준 관리 <ChevronRight className="size-4" />
            </Link>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-[var(--radius-sm)] bg-[var(--mint-soft)] text-[var(--success)]">
                <Activity />
              </span>
              <div>
                <p className="text-xs font-bold text-[var(--text-secondary)]">
                  오늘의 시스템 상태
                </p>
                <p className="mt-1 text-sm font-black">모든 데모 모듈 정상</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[
                ["OCR", "정상"],
                ["질문", "정상"],
                ["음성", "데모"],
              ].map(([label, status]) => (
                <div
                  key={label}
                  className="rounded-[var(--radius-xs)] bg-[var(--surface-muted)] p-2"
                >
                  <p className="text-[10px] text-[var(--text-tertiary)]">
                    {label}
                  </p>
                  <p className="mt-1 text-[11px] font-black">{status}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  change,
  tone,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  change: string;
  tone: "blue" | "mint" | "coral";
}) {
  return (
    <Card>
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
function QueueList({ limit }: { limit?: number }) {
  return (
    <div>
      {reviewQueue.slice(0, limit).map((item) => (
        <button
          key={`${item.student}-${item.kind}`}
          className="flex w-full items-center gap-4 border-b border-[var(--border)] p-5 text-left last:border-0 hover:bg-[var(--surface-muted)]"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[var(--brand-soft)] text-sm font-black text-[var(--brand)]">
            {item.student.slice(0, 1)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <strong className="text-sm">{item.title}</strong>
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-[9px] font-black",
                  item.priority === "긴급"
                    ? "bg-[var(--coral-soft)] text-[var(--danger)]"
                    : "bg-[var(--surface-muted)] text-[var(--text-secondary)]",
                )}
              >
                {item.priority}
              </span>
            </span>
            <span className="mt-1 block text-xs text-[var(--text-secondary)]">
              {item.student} · {item.school} · {item.kind}
            </span>
          </span>
          <span className="hidden text-[10px] text-[var(--text-tertiary)] sm:block">
            {item.time}
          </span>
          <ChevronRight className="size-4 text-[var(--text-tertiary)]" />
        </button>
      ))}
    </div>
  );
}

function Reviews() {
  const [filter, setFilter] = useState("전체");
  const filtered =
    filter === "전체"
      ? reviewQueue
      : reviewQueue.filter((item) => item.kind === filter);
  return (
    <div className="space-y-7 float-in">
      <PageHeader
        eyebrow="Review queue"
        title="검수 큐"
        description="AI가 정리한 질문·코칭·피드백을 학생에게 전달하기 전에 근거와 기준을 확인합니다."
      />
      <Card className="p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
            <input
              className={cn(inputClass, "pl-10")}
              placeholder="학생, 학교, 검수 내용을 검색"
            />
          </div>
          <div className="flex gap-1 overflow-auto">
            {["전체", "예상 질문", "자소서", "면접"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={cn(
                  "min-h-10 shrink-0 rounded-[var(--radius-sm)] px-4 text-xs font-extrabold",
                  filter === item
                    ? "bg-[var(--brand)] text-white"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </Card>
      <Card className="p-0">
        {filtered.length ? (
          <QueueList />
        ) : (
          <EmptyState
            title="조건에 맞는 검수가 없어요"
            description="검색 조건을 바꾸거나 전체 검수 목록을 확인해 주세요."
          />
        )}
      </Card>
    </div>
  );
}

function Prompts() {
  const [prompt, setPrompt] = useState(
    "당신은 고입 면접 코치입니다. 학생의 자소서 근거와 승인된 전문가 기준만 사용해 질문을 생성하세요. 학생 대신 답변을 작성하지 말고, 생각을 구체화하는 한 가지 질문을 제시하세요.",
  );
  const [saved, setSaved] = useState(false);
  const save = useMutation({
    mutationFn: async () => {
      await sleep(600);
      return true;
    },
    onSuccess: () => setSaved(true),
  });
  return (
    <div className="space-y-7 float-in">
      <PageHeader
        eyebrow="Prompt workspace"
        title="코칭 프롬프트"
        description="학생 경험을 대필하지 않고, 승인된 기준 안에서 생각을 끌어내는 코칭 규칙을 관리합니다."
        action={
          <div className="flex gap-2">
            <Button variant="secondary">
              <Eye className="size-4" />
              미리보기
            </Button>
            <Button loading={save.isPending} onClick={() => save.mutate()}>
              <Save className="size-4" />
              임시 저장
            </Button>
          </div>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black">예상 질문 생성 · v12</p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                마지막 승인 v11 · 김소장
              </p>
            </div>
            <span className="rounded-full bg-[var(--warning-soft)] px-3 py-1.5 text-[10px] font-black text-[var(--warning)]">
              초안
            </span>
          </div>
          <label className="mt-6 block text-xs font-extrabold" htmlFor="prompt">
            시스템 지침
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
              setSaved(false);
            }}
            className={cn(textareaClass, "mt-2 min-h-80 font-mono text-xs")}
          />
          <div className="mt-3 flex items-center justify-between text-xs text-[var(--text-tertiary)]">
            <span>{prompt.length}자 · 자동 저장 준비</span>
            {saved ? (
              <span className="flex items-center gap-1 font-bold text-[var(--success)]">
                <Check className="size-3" />
                임시 저장됨
              </span>
            ) : null}
          </div>
        </Card>
        <aside className="space-y-5">
          <Card>
            <div className="flex items-center gap-2 font-black">
              <Sparkles className="size-5 text-[var(--brand)]" />
              구조화된 입력
            </div>
            <div className="mt-5 grid gap-2">
              {[
                "studentEssayEvidence",
                "schoolCriteria",
                "questionRule",
                "previousAnswers",
                "followUpDepth",
              ].map((item) => (
                <code
                  key={item}
                  className="rounded-[var(--radius-xs)] bg-[var(--surface-muted)] px-3 py-2 text-xs text-[var(--brand)]"
                >{`{{${item}}}`}</code>
              ))}
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-2 font-black">
              <CircleAlert className="size-5 text-[var(--warning)]" />
              출력 안전 규칙
            </div>
            <ul className="mt-4 grid gap-3 text-xs leading-6 text-[var(--text-secondary)]">
              <li>• 자소서 원문 전체를 출력하지 않음</li>
              <li>• 승인되지 않은 학교 지식을 단정하지 않음</li>
              <li>• 학생 대신 모범 답안을 완성하지 않음</li>
              <li>• 질문 근거와 규칙 ID를 함께 기록</li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}

const videos = [
  {
    title: "지원 동기를 학교와 연결하는 법",
    category: "자소서 코칭",
    duration: "04:18",
    views: 128,
    status: "게시",
  },
  {
    title: "꼬리질문을 끝까지 듣는 연습",
    category: "면접 기초",
    duration: "03:42",
    views: 94,
    status: "게시",
  },
  {
    title: "탐구 실패를 구체적으로 설명하기",
    category: "답변 구조",
    duration: "05:06",
    views: 71,
    status: "검토",
  },
];
function Videos() {
  return (
    <div className="space-y-7 float-in">
      <PageHeader
        eyebrow="Expert guides"
        title="영상 가이드"
        description="긴 강의가 아니라 학생이 막히는 코칭 지점에 바로 연결할 짧은 영상을 관리합니다."
        action={
          <Button>
            <Plus className="size-4" />
            영상 등록
          </Button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {videos.map((video, index) => (
          <Card key={video.title} className="p-0 overflow-hidden">
            <div
              className={cn(
                "relative grid aspect-video place-items-center",
                index === 0
                  ? "bg-[var(--brand-soft)]"
                  : index === 1
                    ? "bg-[var(--mint-soft)]"
                    : "bg-[var(--coral-soft)]",
              )}
            >
              <span className="grid size-12 place-items-center rounded-full bg-[var(--surface)] shadow-[var(--shadow-md)]">
                <Play className="size-5 fill-[var(--text-primary)]" />
              </span>
              <span className="absolute bottom-3 right-3 rounded bg-black/65 px-2 py-1 text-[10px] font-bold text-white">
                {video.duration}
              </span>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-[var(--brand)]">
                  {video.category}
                </span>
                <span className="text-[10px] text-[var(--text-tertiary)]">
                  재생 {video.views}
                </span>
              </div>
              <h2 className="mt-3 min-h-12 font-black leading-6">
                {video.title}
              </h2>
              <div className="mt-5 flex items-center justify-between">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[9px] font-black",
                    video.status === "게시"
                      ? "bg-[var(--mint-soft)] text-[var(--success)]"
                      : "bg-[var(--warning-soft)] text-[var(--warning)]",
                  )}
                >
                  {video.status}
                </span>
                <Button variant="ghost" size="sm">
                  <PencilLine className="size-4" />
                  편집
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const schools = [
  ["민족사관고등학교", "민사고", 94, "2027", 38],
  ["하나고등학교", "하나고", 82, "2027", 26],
  ["용인한국외국어대학교부설고", "외대부고", 67, "2026", 19],
  ["상산고등학교", "상산고", 76, "2027", 22],
] as const;
function Schools() {
  return (
    <div className="space-y-7 float-in">
      <PageHeader
        eyebrow="School knowledge"
        title="학교별 기준"
        description="학년도와 전형을 구분해 판단 기준·적용 조건·제외 조건·출처와 검수자를 관리합니다."
        action={
          <Button>
            <Plus className="size-4" />
            학교 추가
          </Button>
        }
      />
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="bg-[var(--surface-muted)] text-xs text-[var(--text-secondary)]">
              <tr>
                <th className="p-4 font-extrabold">학교</th>
                <th className="p-4 font-extrabold">학년도</th>
                <th className="p-4 font-extrabold">기준 완성도</th>
                <th className="p-4 font-extrabold">질문 규칙</th>
                <th className="p-4 font-extrabold">최근 검수</th>
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

function UsersPanel() {
  const [query, setQuery] = useState("");
  const users = useMemo(
    () =>
      ["김하우", "박서윤", "이도현", "최지우"].filter((name) =>
        name.includes(query),
      ),
    [query],
  );
  return (
    <div className="space-y-7 float-in">
      <PageHeader
        eyebrow="Learners"
        title="사용자"
        description="학생의 현재 준비 단계와 마지막 활동만 확인합니다. 자소서 원문은 기본 목록에 노출하지 않습니다."
      />
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className={cn(inputClass, "pl-10")}
            placeholder="이름으로 검색"
          />
        </div>
      </Card>
      <div className="grid gap-3">
        {users.length ? (
          users.map((name, index) => (
            <Card
              key={name}
              className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                <span className="grid size-11 place-items-center rounded-full bg-[var(--mint-soft)] font-black text-[var(--success)]">
                  {name.slice(0, 1)}
                </span>
                <div>
                  <h2 className="font-black">{name}</h2>
                  <p className="mt-1 text-xs text-[var(--text-secondary)]">
                    {schools[index][1]} · 통합 패키지
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <p className="text-xs font-black">
                    {[40, 60, 80, 20][index]}% 진행
                  </p>
                  <p className="mt-1 text-[10px] text-[var(--text-tertiary)]">
                    {index + 1}시간 전 활동
                  </p>
                </div>
                <Button variant="secondary" size="sm">
                  상세 보기
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState
            title="검색 결과가 없어요"
            description="이름을 다시 확인해 주세요. 원문이나 민감한 학생 정보로는 검색하지 않습니다."
          />
        )}
      </div>
    </div>
  );
}

function Metrics() {
  const bars = [42, 58, 49, 72, 64, 82, 76];
  return (
    <div className="space-y-7 float-in">
      <PageHeader
        eyebrow="Product signals"
        title="운영 지표"
        description="완료율과 반복 훈련을 중심으로 제품 흐름을 확인합니다. AI 사용량 자체를 성과로 보지 않습니다."
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
