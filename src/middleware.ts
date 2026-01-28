import authConfig from "./auth.config";
import NextAuth from "next-auth";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isRootRoute = nextUrl.pathname === "/";

  // Redirect root to configured domain
  if (isRootRoute) {
    const redirectDomain = process.env.ROOT_REDIRECT_DOMAIN;
    if (redirectDomain) {
      return Response.redirect(new URL(redirectDomain));
    }
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Improved public route check
  const isStaticPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isDynamicDetailRoute = /^\/[^/]+\/detail$/.test(nextUrl.pathname);
  // Matches short URLs - minimum 3 characters, supports custom keys like tutorial-vclass
  const isShortUrlRoute = /^\/[-\w]{3,}$/.test(nextUrl.pathname);

  const isPublicRoute =
    isStaticPublicRoute || isDynamicDetailRoute || isShortUrlRoute;

  if (isApiAuthRoute) {
    return;
  }

  if (isPublicRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }
  return;
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
