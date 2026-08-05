"use client";

import { Check, ChevronDown, Play, Sparkles, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  defaultVideoGuides,
  loadVideoGuides,
  toVideoEmbedUrl,
  type VideoGuideStage,
} from "./video-guide-storage";

export function StudentCoachGuide({ stage }: { stage: VideoGuideStage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [guides, setGuides] = useState(defaultVideoGuides);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setGuides(loadVideoGuides());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const guide = useMemo(
    () =>
      guides.find(
        (item) => item.stage === stage && item.status === "published",
      ),
    [guides, stage],
  );
  if (!guide) return null;
  const previewUrl = toVideoEmbedUrl(guide.sourceUrl);

  return (
    <Card className="overflow-hidden border-[color-mix(in_srgb,var(--brand)_26%,var(--border))] p-0">
      <div className="grid gap-0 lg:grid-cols-[minmax(15rem,.72fr)_minmax(0,1fr)]">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          className="group relative grid min-h-52 place-items-center bg-[var(--brand-soft)] p-6 text-left"
        >
          <span className="absolute left-5 top-5 flex items-center gap-2 text-[10px] font-black tracking-[.12em] text-[var(--brand)]">
            <Video className="size-3.5" /> STEP VIDEO
          </span>
          <span className="grid size-14 place-items-center rounded-full bg-[var(--surface)] text-[var(--brand)] shadow-[var(--shadow-md)] transition-transform group-hover:scale-105">
            <Play className="ml-0.5 size-5 fill-current" />
          </span>
          <span className="absolute bottom-5 right-5 bg-[var(--surface)] px-2.5 py-1 text-[11px] font-bold text-[var(--text-secondary)]">
            {guide.duration}
          </span>
        </button>
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-[var(--brand)]">
              단계별 영상 가이드
            </span>
            <span className="text-xs text-[var(--text-tertiary)]">
              {guide.topic} · {guide.school}
            </span>
          </div>
          <h3 className="mt-3 text-xl font-black tracking-[-.035em]">
            {guide.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            {guide.takeaway}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 -ml-2"
            onClick={() => setIsOpen((current) => !current)}
            aria-expanded={isOpen}
          >
            {isOpen ? "영상 가이드 접기" : "영상 가이드 보기"}
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                isOpen && "rotate-180",
              )}
            />
          </Button>
        </div>
      </div>
      {isOpen ? (
        <div className="grid border-t border-[var(--border)] bg-[var(--surface-muted)] lg:grid-cols-[minmax(0,1fr)_minmax(18rem,.72fr)]">
          <div className="grid aspect-video place-items-center bg-[var(--surface-inverse)]">
            {previewUrl ? (
              <iframe className="size-full" src={previewUrl} title={guide.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            ) : (
              <div className="px-6 text-center text-[var(--text-on-contrast)]"><Play className="mx-auto size-7" /><p className="mt-3 text-sm font-bold">영상 연결 전 미리보기</p><p className="mt-1 text-xs opacity-60">현재는 핵심 메시지와 다음 행동을 먼저 확인할 수 있어요.</p></div>
            )}
          </div>
          <div className="px-5 py-5 sm:px-6">
            <p className="flex items-center gap-2 text-xs font-black text-[var(--brand)]">
              <Sparkles className="size-4" /> 보고 나서 이렇게 답해 보세요
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{guide.promptAnchor}</p>
            <p className="mt-5 flex items-center gap-2 border-t border-[var(--border)] pt-4 text-xs font-bold text-[var(--success)]">
              <Check className="size-4" /> 이 단계의 질문으로 바로 이어집니다.
            </p>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
