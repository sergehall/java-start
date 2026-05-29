import { NextResponse } from "next/server";

export function assertSameOriginRequest(request: Request) {
  if (isSameOriginRequest(request)) {
    return null;
  }

  return NextResponse.json({ message: "Cross-origin request rejected." }, { status: 403 });
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  try {
    const originHost = new URL(origin).host;
    const requestHost =
      request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? new URL(request.url).host;

    return originHost === requestHost;
  } catch {
    return false;
  }
}
