import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const authPaths = ["/", "/sign-in", "/signup", "/verify"];

  // Not logged in → redirect to sign-in
  if (!token && authPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Logged in → block auth pages
  if (
    token &&
    (pathname === "/" ||
      pathname === "/sign-in" ||
      pathname === "/signup")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/signup",
    "/verify/:path*",
    "/dashboard/:path*",
  ],
};