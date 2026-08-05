"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { THEME_SCOPE_EVENT } from "./public-light-theme";

export type Theme = "light" | "dark" | "system";
type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void };

const STORAGE_KEY = "aihow-theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolvedTheme(theme: Theme) {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : "system";
  });

  const applyTheme = useCallback((nextTheme: Theme) => {
    const forcedTheme = document.documentElement.dataset.forceTheme;
    const resolved =
      forcedTheme === "light" ? "light" : resolvedTheme(nextTheme);
    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.style.colorScheme = resolved;
  }, []);

  useEffect(() => {
    applyTheme(theme);

    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemThemeChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };
    const onThemeScopeChange = () => applyTheme(theme);
    query.addEventListener("change", onSystemThemeChange);
    document.documentElement.addEventListener(
      THEME_SCOPE_EVENT,
      onThemeScopeChange,
    );
    return () => {
      query.removeEventListener("change", onSystemThemeChange);
      document.documentElement.removeEventListener(
        THEME_SCOPE_EVENT,
        onThemeScopeChange,
      );
    };
  }, [applyTheme, theme]);

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
      setThemeState(nextTheme);
      applyTheme(nextTheme);
    },
    [applyTheme],
  );

  const value = useMemo(() => ({ theme, setTheme }), [setTheme, theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useAppTheme must be used within AppThemeProvider");
  return context;
}
