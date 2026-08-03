"use client";

import { Palette } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export const brandPalettes = {
  teal: { label: "Deep Teal", description: "차분한 신뢰와 집중" },
  iris: { label: "Iris", description: "선명한 디지털 교육" },
} as const;

export type BrandPalette = keyof typeof brandPalettes;

const storageKey = "aihow-brand-palette";
const BrandPaletteContext = createContext<{
  palette: BrandPalette;
  setPalette: (palette: BrandPalette) => void;
} | null>(null);

function isBrandPalette(value: string | null): value is BrandPalette {
  return value === "teal" || value === "iris";
}

export function BrandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [palette, setPaletteState] = useState<BrandPalette>("teal");

  const setPalette = useCallback((nextPalette: BrandPalette) => {
    document.documentElement.dataset.brandPalette = nextPalette;
    window.localStorage.setItem(storageKey, nextPalette);
    setPaletteState(nextPalette);

    const url = new URL(window.location.href);
    url.searchParams.set("palette", nextPalette);
    window.history.replaceState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`,
    );
  }, []);

  useEffect(() => {
    const queryPalette = new URLSearchParams(window.location.search).get(
      "palette",
    );
    const savedPalette = window.localStorage.getItem(storageKey);
    const initialPalette = isBrandPalette(queryPalette)
      ? queryPalette
      : isBrandPalette(savedPalette)
        ? savedPalette
        : "teal";

    const timer = window.setTimeout(() => {
      document.documentElement.dataset.brandPalette = initialPalette;
      setPaletteState(initialPalette);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <BrandPaletteContext.Provider value={{ palette, setPalette }}>
      {children}
    </BrandPaletteContext.Provider>
  );
}

export function useBrandPalette() {
  const context = useContext(BrandPaletteContext);
  if (!context)
    throw new Error("useBrandPalette must be used within BrandPaletteProvider");
  return context;
}

export function BrandPaletteToggle() {
  const { palette, setPalette } = useBrandPalette();

  return (
    <div className="grid grid-cols-2 gap-2" aria-label="브랜드 톤">
      {(
        Object.entries(brandPalettes) as [
          BrandPalette,
          (typeof brandPalettes)[BrandPalette],
        ][]
      ).map(([value, item]) => {
        const active = palette === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setPalette(value)}
            aria-pressed={active}
            className={cn(
              "grid min-h-16 content-center gap-1 rounded-[var(--radius-md)] border p-3 text-left transition-[background,border-color,color,box-shadow]",
              active
                ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)] shadow-[var(--shadow-sm)]"
                : "border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)]",
            )}
          >
            <span className="flex items-center gap-2 text-xs font-black">
              <Palette className="size-4" />
              {item.label}
            </span>
            <span className="text-[10px] font-semibold opacity-75">
              {item.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function BrandPalettePreview() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(
        new URLSearchParams(window.location.search).get("palettePreview") ===
          "1",
      );
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <aside
      className="fixed bottom-4 right-4 z-50"
      aria-label="회의용 브랜드 톤 전환"
      data-testid="brand-palette-preview"
    >
      {open ? (
        <div className="liquid-glass mb-2 w-[min(20rem,calc(100vw-2rem))] rounded-[var(--radius-lg)] p-3 shadow-[var(--shadow-md)]">
          <p className="mb-2 px-1 text-[10px] font-black uppercase tracking-[.14em] text-[var(--text-tertiary)]">
            Meeting palette preview
          </p>
          <BrandPaletteToggle />
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-label={`회의용 브랜드 톤 ${open ? "닫기" : "열기"}`}
        className="liquid-glass inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-xs font-black text-[var(--text-primary)] shadow-[var(--shadow-md)]"
      >
        <Palette className="size-4 text-[var(--brand)]" />톤 비교
      </button>
    </aside>
  );
}
