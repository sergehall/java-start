import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/shared/api/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
