import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/auth-form";
import { safeInternalPath } from "@/lib/utils";

export const metadata: Metadata = { title: "회원가입" };
export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string; plan?: string }> }) { const query = await searchParams; return <AuthForm mode="signup" nextPath={safeInternalPath(query.next, "/dashboard")} plan={query.plan} />; }
