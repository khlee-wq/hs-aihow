"use client";

import { Compass, Search, Sparkles, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { inputClass } from "@/components/ui/field";
import {
  findInterestSchools,
  type InterestSchool,
} from "./interest-school-directory";

export function InterestSchoolSearch({
  onChoose,
  autoFocus = false,
  dialogInitialFocus = false,
}: {
  onChoose: (school: InterestSchool) => void;
  autoFocus?: boolean;
  dialogInitialFocus?: boolean;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => findInterestSchools(query), [query]);
  const hasQuery = query.trim().length > 0;
  const clearQuery = () => {
    setQuery("");
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <>
      <label
        className="relative block"
        {...(dialogInitialFocus ? { "data-dialog-initial-focus": true } : {})}
      >
        <span className="sr-only">관심 고등학교 검색</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--brand)]" />
        <input
          ref={inputRef}
          autoFocus={autoFocus}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && query) {
              event.preventDefault();
              event.stopPropagation();
              clearQuery();
            }

            // 한글 조합을 확정하는 Enter는 자동완성으로 취급하지 않습니다.
            // 조합이 끝난 뒤 Enter를 누르면 첫 번째 추천 학교 이름만 검색창에
            // 채웁니다. 학교 선택과 화면 전환은 결과를 직접 눌렀을 때만 일어납니다.
            if (
              event.key === "Enter" &&
              !event.nativeEvent.isComposing &&
              hasQuery &&
              results[0]
            ) {
              event.preventDefault();
              setQuery(results[0].name);
            }
          }}
          className={`${inputClass} interest-school-search-input pr-11 pl-11 text-base placeholder:text-xs sm:text-sm sm:placeholder:text-sm`}
          placeholder="학교명을 입력해 보세요. 예: 민사고, 민족사관고"
          type="search"
        />
        {hasQuery ? (
          <button
            type="button"
            onClick={clearQuery}
            className="absolute right-1.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
            aria-label="검색어 지우기"
          >
            <X className="size-4" />
          </button>
        ) : null}
      </label>

      {hasQuery ? (
        <div className="mt-3 grid gap-2" aria-live="polite">
          {results.map((school) => (
            <button
              key={school.id}
              type="button"
              onClick={() => onChoose(school)}
              className="group flex min-h-20 items-center gap-4 rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-4 text-left transition-[transform,background,border-color] hover:-translate-y-0.5 hover:border-[var(--border-accent)] hover:bg-[var(--brand-soft)]"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--brand)_12%,transparent)] text-[var(--brand)]">
                <Compass className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{school.name}</span>
                <span className="mt-1 block text-xs text-[var(--text-secondary)]">
                  {school.category} · {school.latestAdmissions.year}학년도 모집
                  인원 {school.latestAdmissions.capacity}명
                </span>
              </span>
              <Sparkles className="size-4 shrink-0 text-[var(--brand)] opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
          {!results.length ? (
            <div className="rounded-[1rem] border border-dashed border-[var(--border)] px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
              입력한 이름과 가까운 학교를 찾지 못했어요. 학교 전체 이름으로 다시
              검색해 보세요.
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
