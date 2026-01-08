import { NextRequest } from "next/server";
import { proxyRequest } from "../api";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.search || "";

  return proxyRequest(request, `/notes${search}`, {
    method: "GET",
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  return proxyRequest(request, "/notes", {
    method: "POST",
    body: JSON.stringify(body),
  });
}