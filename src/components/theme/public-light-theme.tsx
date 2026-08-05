"use client";

import { useLayoutEffect } from "react";

const THEME_SCOPE_EVENT = "aihow:theme-scope-change";

export function PublicLightTheme({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.forceTheme = "light";
    root.classList.remove("dark");
    root.style.colorScheme = "light";
    root.dispatchEvent(new CustomEvent(THEME_SCOPE_EVENT));

    return () => {
      delete root.dataset.forceTheme;
      root.dispatchEvent(new CustomEvent(THEME_SCOPE_EVENT));
    };
  }, []);

  return <>{children}</>;
}

export { THEME_SCOPE_EVENT };
