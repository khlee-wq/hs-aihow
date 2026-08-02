"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = [
  { value: "light", label: "라이트" },
  { value: "dark", label: "다크" },
  { value: "system", label: "시스템" },
];

export function ThemeToggle({ expanded = false }: { expanded?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);
  if (!mounted)
    return (
      <div
        className="h-10 w-16 rounded-[var(--radius-sm)] bg-[var(--surface-muted)]"
        aria-hidden
      />
    );
  const currentTheme = theme ?? "system";

  if (expanded) {
    return (
      <div className="grid grid-cols-3 gap-2" aria-label="화면 테마">
        {themes.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`grid min-h-14 place-items-center rounded-[var(--radius-sm)] border p-3 text-xs font-bold ${currentTheme === value ? "border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]" : "border-[var(--border)] bg-[var(--surface)]"}`}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  const index = themes.findIndex((item) => item.value === currentTheme);
  const next = themes[(index + 1) % themes.length] ?? themes[0];
  return (
    <button
      type="button"
      onClick={() => setTheme(next.value)}
      className="inline-flex min-h-10 items-center rounded-[var(--radius-sm)] px-3 text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
      aria-label={`현재 ${themes[index]?.label ?? "시스템"} 테마. ${next.label}로 변경`}
    >
      {themes[index]?.label ?? "시스템"}
    </button>
  );
}
