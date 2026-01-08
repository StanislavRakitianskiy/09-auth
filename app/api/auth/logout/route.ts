import { NextRequest } from "next/server";
import { proxyRequest } from "../../api";

export async function POST(request: NextRequest) {
  return proxyRequest(request, "/auth/logout", {
    method: "POST",
  });
}