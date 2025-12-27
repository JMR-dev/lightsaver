import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/auth/settings"];
const authRoutes = ["/auth/login", "/auth/registration"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get("lightsaver_session");

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!sessionCookie) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("return_to", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const kratosUrl =
        process.env.KRATOS_PUBLIC_URL || "http://localhost:4433";
      const response = await fetch(`${kratosUrl}/sessions/whoami`, {
        headers: {
          Cookie: `lightsaver_session=${sessionCookie.value}`,
        },
      });

      if (!response.ok) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("return_to", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.error("Session verification failed:", error);
      const loginUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (sessionCookie) {
      try {
        const kratosUrl =
          process.env.KRATOS_PUBLIC_URL || "http://localhost:4433";
        const response = await fetch(`${kratosUrl}/sessions/whoami`, {
          headers: {
            Cookie: `lightsaver_session=${sessionCookie.value}`,
          },
        });

        if (response.ok) {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch {
        // Session invalid, allow access to auth pages
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/settings/:path*",
    "/auth/login",
    "/auth/registration",
  ],
};
