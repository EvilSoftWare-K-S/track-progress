import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const pathname = request.nextUrl.pathname;

  const isDashboard = pathname.startsWith("/dashboard");

  const isAuthPage =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (isDashboard && !sessionCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const isHomePage = pathname === "/";

  if ((isAuthPage || isHomePage) && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/sign-in", "/sign-up"],
};
