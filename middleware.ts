import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  const url = request.nextUrl.clone();

  if (host.startsWith("opimpact.metricsgarden.xyz")) {
    url.pathname = `/impact-framework${url.pathname}`;

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}
