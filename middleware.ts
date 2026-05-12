/**
 * Edge middleware — auth gates for /admin/* and /members/*.
 *
 * /admin/*   → requires isAdmin flag in the JWT (ADMIN_EMAIL match).
 * /members/* → requires any valid session (any signed-in user).
 *
 * Both redirect to /login with a callbackUrl on failure.
 * The /login route itself is always public.
 *
 * Uses NextAuth's built-in middleware via `withAuth`, which reads the JWT
 * at the edge without hitting Node.js — no bcrypt or DB calls here.
 */

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // /admin/* — require isAdmin flag
    if (pathname.startsWith("/admin")) {
      if (!token?.isAdmin) {
        // Signed in but not admin → redirect to home (not login)
        if (token) {
          return NextResponse.redirect(new URL("/", req.url));
        }
        // Not signed in → redirect to login (withAuth handles this automatically
        // via the signIn page config, but explicit redirect keeps callbackUrl clean)
      }
    }

    // /members/* — any authenticated user passes (withAuth already checked for token)
    return NextResponse.next();
  },
  {
    callbacks: {
      // Return true (allow) only if there's a valid token.
      // withAuth redirects to the signIn page when this returns false.
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/members/:path*",
  ],
};
