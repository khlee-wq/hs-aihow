import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/auth-form";
import { safeInternalPath } from "@/lib/utils";

export const metadata: Metadata = { title: "로그인" };
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reason?: string }>;
}) {
  const query = await searchParams;
  return (
    <AuthForm
      mode="login"
      nextPath={
        query.next ? safeInternalPath(query.next, "/dashboard") : undefined
      }
      reason={query.reason === "session-expired" ? "session-expired" : undefined}
    />
  );
}
