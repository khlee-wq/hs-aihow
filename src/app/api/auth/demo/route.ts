import { NextResponse } from "next/server";
import { z } from "zod";
import { encodeSession, SESSION_COOKIE } from "@/lib/session-shared";
import { safeInternalPath } from "@/lib/utils";

const payloadSchema = z.object({ name: z.string().trim().min(2), email: z.email(), password: z.string().min(4), role: z.enum(["student", "expert"]), next: z.string().optional() });

export async function POST(request: Request) {
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ message: "입력 내용을 확인해 주세요." }, { status: 400 });
  const { name, email, role, next } = parsed.data;
  const fallback = role === "expert" ? "/admin" : "/dashboard";
  const candidate = safeInternalPath(next, fallback);
  const redirect = role === "expert" && (candidate.startsWith("/dashboard") || candidate.startsWith("/applications")) ? "/admin" : role === "student" && candidate.startsWith("/admin") ? "/dashboard" : candidate;
  const response = NextResponse.json({ redirect });
  response.cookies.set(SESSION_COOKIE, encodeSession({ name, email, role }), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" && process.env.ALLOW_INSECURE_DEMO_COOKIE !== "1", maxAge: 60 * 60 * 24 * 7, path: "/" });
  return response;
}
