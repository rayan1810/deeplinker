import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rewrite /d/[slug] to /l/[slug] for shorter URLs
  if (pathname.startsWith("/d/")) {
    const slug = pathname.slice(3); // Remove '/d/' prefix
    const newUrl = new URL(`/l/${slug}`, request.url);

    // Preserve query parameters
    newUrl.search = request.nextUrl.search;

    return NextResponse.rewrite(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/d/:path*",
};
