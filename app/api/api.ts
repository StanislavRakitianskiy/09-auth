import { NextResponse, type NextRequest } from "next/server";

const BACKEND_BASE_URL = "https://notehub-api.goit.study";

const buildUrl = (endpoint: string) => `${BACKEND_BASE_URL}${endpoint}`;

const appendSetCookies = (response: Response, target: NextResponse) => {
  const getSetCookie = (response as unknown as { headers: { getSetCookie?: () => string[] } }).headers
    .getSetCookie;

  const cookies =
    typeof getSetCookie === "function"
      ? getSetCookie()
      : (() => {
          const header = response.headers.get("set-cookie");
          return header ? [header] : [];
        })();

  cookies.forEach((cookie) => target.headers.append("set-cookie", cookie));
};

const copyHeaders = (response: Response, target: NextResponse) => {
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return;
    target.headers.set(key, value);
  });

  appendSetCookies(response, target);
};

const getCookieHeader = (request: NextRequest) =>
  request.headers.get("cookie") ?? undefined;

export const proxyRequest = async (
  request: NextRequest,
  endpoint: string,
  init?: RequestInit
) => {
  const url = buildUrl(endpoint);
  const cookie = getCookieHeader(request);

  const method = init?.method ?? request.method;
  const headers = new Headers(init?.headers);

  if (method !== "GET" && method !== "HEAD" && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  if (!headers.has("accept")) {
    headers.set("accept", "application/json");
  }

  if (cookie) {
    headers.set("cookie", cookie);
  }

  const response = await fetch(url, {
    method,
    headers,
    body: init?.body,
    redirect: "manual",
    cache: "no-store",
  });

  const text = await response.text().catch(() => "");
  const nextResponse = new NextResponse(text || null, {
    status: response.status,
  });

  copyHeaders(response, nextResponse);

  return nextResponse;
};