import { NextRequest } from "next/server";
import { proxyRequest } from "../../api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyRequest(request, `/notes/${params.id}`, {
    method: "GET",
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return proxyRequest(request, `/notes/${params.id}`, {
    method: "DELETE",
  });
}