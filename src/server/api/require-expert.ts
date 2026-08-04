import "server-only";

import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function requireExpertApi() {
  const session = await getSession();
  if (!session) {
    return { session: null, response: NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 }) };
  }
  if (session.role !== "admin") {
    return { session: null, response: NextResponse.json({ message: "교사 권한이 필요합니다." }, { status: 403 }) };
  }
  return { session, response: null };
}
