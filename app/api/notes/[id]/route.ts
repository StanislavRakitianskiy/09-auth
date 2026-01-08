import { NextRequest } from "next/server";
import { proxyRequest } from "../../api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyRequest(request, `/notes/${id}`, {
    method: "GET",
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyRequest(request, `/notes/${id}`, {
    method: "DELETE",
  });
}