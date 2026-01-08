import { NextRequest } from "next/server";
import { proxyRequest } from "../../api";

export async function POST(request: NextRequest) {
  const body = await request.json();

  return proxyRequest(request, "/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}