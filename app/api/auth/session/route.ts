import { NextRequest } from "next/server";
import { proxyRequest } from "../../api";

export async function GET(request: NextRequest) {
  return proxyRequest(request, "/auth/session", {
    method: "GET",
  });
}