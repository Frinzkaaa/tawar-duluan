import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const customAdminToken = req.cookies.get("admin_token")?.value;
  const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAdminPath = req.nextUrl.pathname.startsWith("/admin");

  // Allow access if either token exists
  if (!customAdminToken && !nextAuthToken) {
    if (isAdminPath) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // 1. Check Custom Admin Token
  if (customAdminToken) {
    try {
      const { payload } = await jwtVerify(
        customAdminToken,
        new TextEncoder().encode(process.env.JWT_SECRET!)
      );
      if (isAdminPath && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      return NextResponse.next();
    } catch (err) {
      if (isAdminPath && !nextAuthToken) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }
  }

  // 2. Check NextAuth Token (Google)
  if (nextAuthToken) {
    if (isAdminPath && nextAuthToken.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // semua halaman admin terlindungi
};
