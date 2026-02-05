import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const authPaths = ["/sign-in", "/sign-up", "/verify"];
  const isAuthPath =
    authPaths.includes(pathname) || pathname.startsWith("/verify/");
  const isDashboardPath = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  // Not logged in -> protect dashboard
  if (!token && isDashboardPath) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Logged in -> block auth pages
  if (
    token &&
    (pathname === "/" ||
      pathname === "/sign-in" ||
      pathname === "/sign-up" ||
      isAuthPath)
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
    "/dashboard/:path*",
  ],
};
