import { NextRequest } from "next/server";
import { proxyRequest } from "../../api";

export async function GET(request: NextRequest) {
  return proxyRequest(request, "/users/me", {
    method: "GET",
  });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();

  return proxyRequest(request, "/users/me", {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}