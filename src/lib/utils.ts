import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function safeInternalPath(value: string | null | undefined, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes(":")) return fallback;
  return value;
}
