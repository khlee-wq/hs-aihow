import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requirePublicSupabaseEnv } from "@/lib/env";
import type { Database } from "./database.types";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const env = requirePublicSupabaseEnv();
  return createServerClient<Database>(env.url, env.publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (items) => {
        try {
          items.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies. The auth proxy owns refresh writes.
        }
      },
    },
  });
}
