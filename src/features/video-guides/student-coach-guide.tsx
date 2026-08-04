"use client";

import { Check, ChevronDown, Play, Sparkles, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  defaultVideoGuides,
  loadVideoGuides,
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
            <Video className="size-3.5" /> COACH GUIDE
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
              소장님 가이드
            </span>
            <span className="text-xs text-[var(--text-tertiary)]">
              지금의 분석 결과에 연결됨
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
        <div className="border-t border-[var(--border)] bg-[var(--surface-muted)] px-5 py-5 sm:px-6">
          <p className="flex items-center gap-2 text-xs font-black text-[var(--brand)]">
            <Sparkles className="size-4" /> 보고 나서 이렇게 답해 보세요
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
            {guide.promptAnchor}
          </p>
          <p className="mt-4 flex items-center gap-2 text-xs font-bold text-[var(--success)]">
            <Check className="size-4" /> 게시된 영상은 이 자리에서 시청한 뒤
            다음 질문으로 이어집니다.
          </p>
        </div>
      ) : null}
    </Card>
  );
}
