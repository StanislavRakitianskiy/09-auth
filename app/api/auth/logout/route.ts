import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import api from "../../api";

const applyCookies = (
  response: { headers?: { "set-cookie"?: string[] | string } },
  next: NextResponse
) => {
  const setCookie = response.headers?.["set-cookie"];
  if (!setCookie) return;
  const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
  cookies.forEach((cookie) => {
    next.headers.append("set-cookie", cookie);
  });
  };

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const data = error.response?.data ?? { message: error.message };
    return NextResponse.json(data, { status });
  }
  return NextResponse.json({ message: "Internal server error" }, { status: 500 });
};

export async function POST(request: NextRequest) {
  try {
    const response = await api.post(
      "/auth/logout",
      {},
      {
        headers: {
          Cookie: request.headers.get("cookie") ?? "",
        },
      }
    );
    const nextResponse = NextResponse.json(response.data ?? null, {
      status: response.status,
    });
    applyCookies(response, nextResponse);
    return nextResponse;
  } catch (error) {
    return handleError(error);
  }
}