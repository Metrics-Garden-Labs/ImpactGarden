import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();
  const { pathname } = url;

  const isAsset = pathname.match(/\.(.*)$/);
  const isInternal =
    pathname.startsWith("/_next") || pathname.startsWith("/api");

  if (
    host.startsWith("opimpact.metricsgarden.xyz") &&
    pathname === "/" &&
    !isAsset &&
    !isInternal
  ) {
    url.pathname = "/impact-framework/season7";
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
