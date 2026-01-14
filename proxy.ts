import { NextRequest, NextResponse } from "next/server";
import type { AxiosResponse } from "axios";
import { checkSession } from "./lib/api/serverApi";
import type { User } from "./types/user";

const privateRoutes = ["/profile", "/notes"];
const authRoutes = ["/sign-in", "/sign-up"];

const matches = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

const isApiRequest = (pathname: string) => pathname.startsWith("/api");

const getToken = (request: NextRequest, name: string) =>
  request.cookies.get(name)?.value;

const applyCookies = (
  response: AxiosResponse<User | null>,
  next: NextResponse
) => {
  const setCookie = response.headers["set-cookie"];
  if (!setCookie) return;
  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
  cookies.forEach((cookie) => {
    next.headers.append("set-cookie", cookie);
  });
};

const isAuthorized = async (
  request: NextRequest
): Promise<{
  authenticated: boolean;
  sessionResponse?: AxiosResponse<User | null>;
}> => {
  const accessToken = getToken(request, "accessToken");
  const refreshToken = getToken(request, "refreshToken");

  // Якщо немає жодного токена, користувач точно не авторизований
  if (!accessToken && !refreshToken) {
    return { authenticated: false };
  }

  // Перевіряємо сесію через API, щоб переконатися, що токени дійсні
  try {
    const sessionResponse = await checkSession();
    const isAuthenticated = Boolean(sessionResponse.data);
    return {
      authenticated: isAuthenticated,
      sessionResponse,
    };
  } catch (error) {
    console.error("Session refresh failed", error);
    return { authenticated: false };
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

  const { authenticated, sessionResponse } = await isAuthorized(request);

  if (privateMatch && !authenticated) {
    const loginUrl = new URL("/sign-in", request.url);
    const response = NextResponse.redirect(loginUrl);
    if (sessionResponse) {
      applyCookies(sessionResponse, response);
    }
    return response;
  }

  if (authMatch && authenticated) {
    const profileUrl = new URL("/profile", request.url);
    const response = NextResponse.redirect(profileUrl);
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
