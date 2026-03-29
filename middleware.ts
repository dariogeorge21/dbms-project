import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("aiims_token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't need auth
  const publicPaths = [
    "/",
    "/patient",
    "/patient/login",
    "/patient/signup",
    "/doctor/login",
    "/admin/login",
  ];

  const isPublic = publicPaths.some(
    (path) => pathname === path || pathname.startsWith("/api/auth")
  );

  // If no token and trying to access protected route
  if (!token && !isPublic && !pathname.startsWith("/api/")) {
    // Determine which login to redirect to
    if (pathname.startsWith("/patient")) {
      return NextResponse.redirect(new URL("/patient/login", request.url));
    }
    if (pathname.startsWith("/doctor")) {
      return NextResponse.redirect(new URL("/doctor/login", request.url));
    }
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
