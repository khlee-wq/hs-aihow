"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import {
  BrandPalettePreview,
  BrandPaletteProvider,
} from "@/components/brand/brand-palette";
import { MotionRoot } from "@/components/motion/motion-root";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
          mutations: { retry: 0 },
        },
      }),
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <BrandPaletteProvider>
          <MotionRoot>{children}</MotionRoot>
          <BrandPalettePreview />
        </BrandPaletteProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
