import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

const matches = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

const isApiRequest = (pathname: string) => pathname.startsWith("/api");

const applyCookies = (
  response: AxiosResponse<{ success: boolean }>,
  next: NextResponse
) => {
  const setCookie = response.headers["set-cookie"];
  if (!setCookie) return;
  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
  cookies.forEach((cookie) => {
    next.headers.append("set-cookie", cookie);
  });
};

const isAuthorized = async (): Promise<{
  authenticated: boolean;
  sessionResponse?: AxiosResponse<{ success: boolean }>;
}> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Якщо немає жодного токена, користувач точно не авторизований
  if (!accessToken && !refreshToken) {
    return { authenticated: false };
  }

  // Якщо є accessToken, вважаємо користувача авторизованим без додаткового запиту
  if (accessToken) {
    return { authenticated: true };
  }

  // Якщо немає accessToken, але є refreshToken, перевіряємо сесію
  if (refreshToken) {
    try {
      const sessionResponse = await checkSession();
      const isAuthenticated = sessionResponse.data?.success ?? false;
      return {
        authenticated: isAuthenticated,
        sessionResponse,
      };
    } catch (error) {
      console.error("Session refresh failed", error);
      return { authenticated: false };
    }
  }

  return { authenticated: false };
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

  const { authenticated, sessionResponse } = await isAuthorized();

  if (privateMatch && !authenticated) {
    const loginUrl = new URL("/sign-in", request.url);
    const response = NextResponse.redirect(loginUrl);
    if (sessionResponse) {
      applyCookies(sessionResponse, response);
    }
    return response;
  }

  if (authMatch && authenticated) {
    const homeUrl = new URL("/", request.url);
    const response = NextResponse.redirect(homeUrl);
    if (sessionResponse) {
      applyCookies(sessionResponse, response);
    }
    return response;
  }

  const response = NextResponse.next();
  if (sessionResponse) {
    applyCookies(sessionResponse, response);
  }
  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
