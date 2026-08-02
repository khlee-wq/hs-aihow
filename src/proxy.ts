import { NextRequest, NextResponse } from "next/server";
import { decodeSession, SESSION_COOKIE } from "@/lib/session-shared";
import { safeInternalPath } from "@/lib/utils";

const studentRoutes = ["/dashboard", "/applications"];
const expertRoutes = ["/admin"];
const protectedRoutes = [...studentRoutes, ...expertRoutes, "/settings"];

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
  const isProtected = protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`));

  if (isProtected && !session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", safeInternalPath(`${path}${request.nextUrl.search}`, "/dashboard"));
    return NextResponse.redirect(login);
  }

  if (session?.role === "student" && expertRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (session?.role === "expert" && studentRoutes.some((route) => path.startsWith(route))) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
