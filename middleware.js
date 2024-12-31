import { NextResponse } from "next/server";

export function middleware(request) {
  const userAgent = request.headers.get("user-agent") || "";
  const url = request.nextUrl.clone();

  // 웹뷰 감지
  const isWebView =
    /wv/.test(userAgent) || // Android WebView
    (/iPhone|iPod|iPad/.test(userAgent) && !/Safari/.test(userAgent)); // iOS WebView

  // 구글 OAuth 관련 경로에서 웹뷰 감지된 경우
  if (
    isWebView &&
    (url.pathname.startsWith("/api/auth/signin") ||
      url.pathname.startsWith("/api/auth/callback/google"))
  ) {
    // 시스템 브라우저로 열도록 리다이렉트
    const externalBrowserUrl = new URL(
      "/auth/external-browser",
      request.nextUrl.origin
    );
    return NextResponse.redirect(externalBrowserUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/signin", "/api/auth/callback/google"],
};
