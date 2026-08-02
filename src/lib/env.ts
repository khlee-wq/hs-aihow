import "server-only";

import { z } from "zod";

const envSchema = z.object({
  DATA_BACKEND: z.enum(["demo", "supabase"]).default("demo"),
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
});

let cached: z.infer<typeof envSchema> | undefined;

export function serverEnv() {
  cached ??= envSchema.parse(process.env);
  if (cached.DATA_BACKEND === "supabase") {
    if (!cached.NEXT_PUBLIC_SUPABASE_URL || !cached.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      throw new Error("DATA_BACKEND=supabase requires the Supabase URL and publishable key.");
    }
  }
  return cached;
}

export function requirePublicSupabaseEnv() {
  const env = serverEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Supabase public environment variables are not configured.");
  }
  return { url: env.NEXT_PUBLIC_SUPABASE_URL, publishableKey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY };
}
