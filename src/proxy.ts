import { NextResponse, type NextRequest } from "next/server";

/**
 * Locale routing:
 *   /about      -> English (internally rewritten to /en/about, URL stays /about)
 *   /hi/about   -> Hindi
 *   /gu/about   -> Gujarati
 *   /en/about   -> redirected to /about, so English has a single URL (no duplicate content)
 *
 * There is deliberately NO automatic redirect based on the browser's language:
 * search engines should be able to crawl every language version directly.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (first === "hi" || first === "gu") return NextResponse.next();

  const url = request.nextUrl.clone();

  if (first === "en") {
    url.pathname = pathname.replace(/^\/en/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next internals, API routes and anything with a file extension
  // (images, favicon, sitemap.xml, robots.txt ...).
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
