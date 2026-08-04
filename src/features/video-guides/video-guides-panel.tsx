"use client";

import { Check, ExternalLink, Plus, Save, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { inputClass } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import {
  defaultVideoGuides,
  loadVideoGuides,
  saveVideoGuides,
  type VideoGuide,
  type VideoGuideStage,
  type VideoGuideStatus,
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

function embedUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    if (url.hostname === "youtu.be") return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
    if (url.hostname.includes("youtube.com")) {
      const videoId = url.searchParams.get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url.href;
    }
    if (url.hostname === "vimeo.com") return `https://player.vimeo.com/video${url.pathname}`;
    if (url.hostname === "player.vimeo.com") return url.href;
  } catch {
    return "";
  }
  return "";
}

function nextGuide(): VideoGuide {
  return {
    id: `guide-${Date.now()}`,
    title: "새 영상 가이드",
    stage: "analysis",
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
  const previewUrl = embedUrl(selected?.sourceUrl ?? "");

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
          <h1 className="heading-lg mt-3">영상은 주소만 연결하세요</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
            영상 편집은 익숙한 도구에서 마칩니다. YouTube 또는 Vimeo URL을 붙이면 학생이 필요한 준비 단계에서 바로 재생됩니다.
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
          ["01", "영상 URL 붙이기", "YouTube 또는 Vimeo 링크를 입력합니다."],
          ["02", "재생 화면 확인", "학생에게 보이는 iframe 화면을 바로 확인합니다."],
          ["03", "단계에 연결", "공개하면 선택한 준비 단계에만 노출됩니다."],
        ].map(([number, title, detail]) => <div key={number} className="border-b border-[var(--border)] p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"><p className="font-mono text-[10px] font-bold text-[var(--brand)]">{number}</p><p className="mt-2 text-sm font-black">{title}</p><p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">{detail}</p></div>)}
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,.9fr)_minmax(22rem,1.1fr)]">
        <Card className="space-y-5">
          <label className="block text-xs font-bold">연결할 영상
            <select className={cn(inputClass, "mt-2")} value={selected.id} onChange={(event) => { setSelectedId(event.target.value); setNotice(""); }}>
              {guides.map((guide) => <option key={guide.id} value={guide.id}>{guide.title || "제목 없는 영상"}</option>)}
            </select>
          </label>
          <label className="block text-xs font-bold">영상 제목
            <input className={cn(inputClass, "mt-2")} value={selected.title} onChange={(event) => updateSelected({ title: event.target.value })} />
          </label>
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
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-5"><div><p className="text-xs font-black text-[var(--brand)]">학생 화면 미리보기</p><h2 className="mt-1 text-lg font-black">{selected.title || "영상 제목"}</h2></div><Video className="size-5 text-[var(--brand)]" /></div>
          <div className="grid aspect-video place-items-center bg-[var(--surface-muted)]">
            {previewUrl ? <iframe className="size-full" src={previewUrl} title={`${selected.title} 영상 미리보기`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <div className="px-6 text-center"><Video className="mx-auto size-7 text-[var(--text-tertiary)]" /><p className="mt-3 text-sm font-bold">영상 URL을 입력하면 이곳에서 재생됩니다</p><p className="mt-1 text-xs text-[var(--text-secondary)]">YouTube와 Vimeo 링크를 지원합니다.</p></div>}
          </div>
          {selected.sourceUrl ? <a href={selected.sourceUrl} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 text-xs font-bold text-[var(--brand)]">원본 영상 열기 <ExternalLink className="size-4" /></a> : null}
        </Card>
      </section>
    </div>
  );
}
