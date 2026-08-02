"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { MotionRoot } from "@/components/motion/motion-root";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
      mutations: { retry: 0 },
    },
  }));

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}><MotionRoot>{children}</MotionRoot></QueryClientProvider>
    </ThemeProvider>
  );
}
