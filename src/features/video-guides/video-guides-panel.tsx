"use client";

import { Check, ExternalLink, Plus, Save, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import {
  defaultVideoGuides,
  loadVideoGuides,
  saveVideoGuides,
  type VideoGuide,
  type VideoGuideStage,
  type VideoGuideStatus,
  toVideoEmbedUrl,
} from "./video-guide-storage";

const stageMeta: Record<VideoGuideStage, string> = {
  analysis: "핵심 분석 뒤",
  practice: "질문 연습 중",
  "mock-interview": "모의면접 전",
};

const statusMeta: Record<VideoGuideStatus, string> = {
  draft: "준비 중",
  review: "확인 중",
  published: "학생 공개",
};

function nextGuide(): VideoGuide {
  return {
    id: `guide-${Date.now()}`,
    title: "새 영상 가이드",
    stage: "analysis",
    topic: "핵심 준비",
    school: "공통",
    duration: "",
    status: "draft",
    takeaway: "",
    promptAnchor: "",
    sourceUrl: "",
    updatedAt: new Date().toISOString(),
  };
}

export function VideoGuidesPanel() {
  const [guides, setGuides] = useState(defaultVideoGuides);
  const [selectedId, setSelectedId] = useState(defaultVideoGuides[0].id);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setGuides(loadVideoGuides()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const selected = useMemo(
    () => guides.find((guide) => guide.id === selectedId) ?? guides[0],
    [guides, selectedId],
  );
  const previewUrl = toVideoEmbedUrl(selected?.sourceUrl ?? "");

  function updateSelected(patch: Partial<VideoGuide>) {
    setGuides((current) => current.map((guide) =>
      guide.id === selected.id
        ? { ...guide, ...patch, updatedAt: new Date().toISOString() }
        : guide,
    ));
    setNotice("");
  }

  function createGuide() {
    const guide = nextGuide();
    setGuides((current) => [guide, ...current]);
    setSelectedId(guide.id);
    setNotice("새 영상 연결을 준비했습니다.");
  }

  function saveGuides() {
    saveVideoGuides(guides);
    setNotice(selected.status === "published" ? "학생 화면에 연결할 영상을 저장했습니다." : "영상 연결을 저장했습니다.");
  }

  if (!selected) return null;

  return (
    <div className="space-y-7 float-in" data-testid="video-guides-panel">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="eyebrow">영상 연결</p>
          <h1 className="heading-lg mt-3">영상이 필요한 순간부터 정하세요</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            단계와 주제를 먼저 고르고 URL을 연결합니다. 학생은 긴 목록을 찾지 않고 지금 답해야 할 질문 바로 옆에서 영상을 봅니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={createGuide}><Plus className="size-4" /> 새 영상</Button>
          <Button onClick={saveGuides}><Save className="size-4" /> 저장</Button>
        </div>
      </header>

      {notice ? <p role="status" className="flex items-center gap-2 bg-[var(--mint-soft)] px-4 py-3 text-sm font-bold text-[var(--success)]"><Check className="size-4" /> {notice}</p> : null}

      <section className="grid overflow-hidden border-y border-[var(--border)] md:grid-cols-3">
        {[
          ["01", "보여줄 순간", "분석 뒤·질문 연습 중·모의면접 전 중 하나를 고릅니다."],
          ["02", "남길 메시지", "학생이 영상에서 기억할 한 문장과 다음 행동을 적습니다."],
          ["03", "학생 화면 확인", "공개 전 실제 단계에서 보일 순서와 재생 화면을 확인합니다."],
        ].map(([number, title, detail]) => <div key={number} className="border-b border-[var(--border)] p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"><p className="font-mono text-[10px] font-bold text-[var(--brand)]">{number}</p><p className="mt-2 text-sm font-black">{title}</p><p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">{detail}</p></div>)}
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,.9fr)_minmax(22rem,1.1fr)]">
        <section className="space-y-5 border-y border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <label className="block text-xs font-bold">연결할 영상
            <select className={cn(inputClass, "mt-2")} value={selected.id} onChange={(event) => { setSelectedId(event.target.value); setNotice(""); }}>
              {guides.map((guide) => <option key={guide.id} value={guide.id}>{guide.title || "제목 없는 영상"}</option>)}
            </select>
          </label>
          <label className="block text-xs font-bold">영상 제목
            <input className={cn(inputClass, "mt-2")} value={selected.title} onChange={(event) => updateSelected({ title: event.target.value })} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold">연결 주제
              <input className={cn(inputClass, "mt-2")} value={selected.topic} onChange={(event) => updateSelected({ topic: event.target.value })} placeholder="예: 지원 동기, 꼬리질문" />
            </label>
            <label className="block text-xs font-bold">적용 학교
              <input className={cn(inputClass, "mt-2")} value={selected.school} onChange={(event) => updateSelected({ school: event.target.value })} placeholder="공통 또는 학교명" />
            </label>
          </div>
          <label className="block text-xs font-bold">영상 URL
            <input className={cn(inputClass, "mt-2")} value={selected.sourceUrl ?? ""} onChange={(event) => updateSelected({ sourceUrl: event.target.value })} placeholder="https://www.youtube.com/watch?v=..." inputMode="url" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold">학생이 보는 시점
              <select className={cn(inputClass, "mt-2")} value={selected.stage} onChange={(event) => updateSelected({ stage: event.target.value as VideoGuideStage })}>
                {Object.entries(stageMeta).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
            <label className="block text-xs font-bold">공개 상태
              <select className={cn(inputClass, "mt-2")} value={selected.status} onChange={(event) => updateSelected({ status: event.target.value as VideoGuideStatus })}>
                {Object.entries(statusMeta).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </label>
          </div>
          <label className="block text-xs font-bold">학생에게 남길 한 문장
            <textarea className={cn(inputClass, "mt-2 min-h-24 resize-y py-3")} value={selected.takeaway} onChange={(event) => updateSelected({ takeaway: event.target.value })} placeholder="영상에서 반드시 기억할 핵심 메시지" />
          </label>
          <label className="block text-xs font-bold">보고 나서 할 행동
            <textarea className={cn(inputClass, "mt-2 min-h-24 resize-y py-3")} value={selected.promptAnchor} onChange={(event) => updateSelected({ promptAnchor: event.target.value })} placeholder="예: 변화 전후를 한 문장씩 설명하기" />
          </label>
        </section>

        <section className="overflow-hidden border-y border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-start justify-between border-b border-[var(--border)] p-5"><div><p className="text-xs font-black text-[var(--brand)]">학생 화면 미리보기</p><p className="mt-2 text-[11px] font-bold text-[var(--text-tertiary)]">{stageMeta[selected.stage]} / {selected.topic} / {selected.school}</p><h2 className="mt-2 text-lg font-black">{selected.title || "영상 제목"}</h2></div><Video className="size-5 text-[var(--brand)]" /></div>
          <div className="grid aspect-video place-items-center bg-[var(--surface-muted)]">
            {previewUrl ? <iframe className="size-full" src={previewUrl} title={`${selected.title} 영상 미리보기`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <div className="px-6 text-center"><Video className="mx-auto size-7 text-[var(--text-tertiary)]" /><p className="mt-3 text-sm font-bold">영상 URL을 입력하면 이곳에서 재생됩니다</p><p className="mt-1 text-xs text-[var(--text-secondary)]">YouTube와 Vimeo 링크를 지원합니다.</p></div>}
          </div>
          <div className="border-t border-[var(--border)] p-5">
            <p className="text-xs font-black">이 단계에서 보는 이유</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{selected.takeaway || "핵심 메시지를 입력하면 학생 화면에서 이곳에 표시됩니다."}</p>
            <p className="mt-4 text-xs font-black text-[var(--brand)]">다음 행동</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{selected.promptAnchor || "영상을 본 뒤 이어갈 행동을 입력해 주세요."}</p>
          </div>
          {selected.sourceUrl ? <a href={selected.sourceUrl} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 border-t border-[var(--border)] text-xs font-bold text-[var(--brand)]">원본 영상 열기 <ExternalLink className="size-4" /></a> : null}
        </section>
      </section>
    </div>
  );
}
