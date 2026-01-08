import { NextRequest, NextResponse } from "next/server";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

const matches = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

const isApiRequest = (pathname: string) => pathname.startsWith("/api");

const isAuthenticated = async (request: NextRequest) => {
  try {
    const response = await fetch(new URL("/api/auth/session", request.url), {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    if (!response.ok) return false;

    const text = await response.text();
    return Boolean(text);
  } catch (error) {
    console.error("Auth check failed", error);
    return false;
  }
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isApiRequest(pathname)) {
    return NextResponse.next();
  }

  const privateMatch = matches(pathname, privateRoutes);
  const authMatch = matches(pathname, authRoutes);

  if (!privateMatch && !authMatch) {
    return NextResponse.next();
  }

  const authenticated = await isAuthenticated(request);

  if (privateMatch && !authenticated) {
    const loginUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (authMatch && authenticated) {
    const profileUrl = new URL("/profile", request.url);
    return NextResponse.redirect(profileUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};