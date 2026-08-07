import { NextRequest, NextResponse } from "next/server";
import { decodeSession, SESSION_COOKIE } from "@/lib/session-shared";
import { safeInternalPath } from "@/lib/utils";

const protectedRoutes = [
  "/dashboard",
  "/onboarding",
  "/applications",
  "/admin",
  "/settings",
];

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
  const isProtected = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );

  if (isProtected && !session) {
    const login = new URL("/login", request.url);
    login.searchParams.set(
      "next",
      safeInternalPath(`${path}${request.nextUrl.search}`, "/dashboard"),
    );
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
