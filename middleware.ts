import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const url = request.nextUrl.clone();

  // Redirect if the host is opimpact.metricsgarden.xyz
  if (
    host.startsWith("opimpact.metricsgarden.xyz") &&
    url.pathname !== "/impact-framework"
  ) {
    url.pathname = "/impact-framework"; // redirect to /impact-framework
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
