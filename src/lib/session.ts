import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeSession, SESSION_COOKIE, type UserRole } from "./session-shared";

export async function getSession() {
  return decodeSession((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function requireSession(role?: UserRole) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (role && session.role !== role) redirect(session.role === "expert" ? "/admin" : "/dashboard");
  return session;
}
