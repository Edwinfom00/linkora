import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session token from cookies
  const sessionCookieName =
    process.env.NODE_ENV === "production"
      ? "__Secure-better-auth.session_token"
      : "better-auth.session_token";
  const sessionToken =
    request.cookies.get(sessionCookieName)?.value ||
    request.cookies.get("better-auth.session_token")?.value;

  // Protected routes
  const protectedRoutes = ["/dashboard", "/messages", "/admin", "/select-role"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Auth routes (redirect if already logged in)
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/messages/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/select-role",
  ],
};
