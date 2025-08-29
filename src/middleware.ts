import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public pages
        const publicRoutes = ["/auth/login", "/auth/signup"];
        const isPublicPage = publicRoutes.some((route) =>
          pathname.startsWith(route)
        );

        // Public APIs
        const publicApis = ["/api/auth/signup", "/api/auth"];
        const isPublicApi = publicApis.some((route) =>
          pathname.startsWith(route)
        );

        if (isPublicPage || isPublicApi) {
          return true; // allow without login
        }

        // For all other routes, require login
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/login", // 👈 redirect here when not logged in
    },
  }
);

export const config = {
  matcher: [
    // Protect everything except:
    // 1. _next/static, favicon
    // 2. Public auth pages (login, signup)
    // 3. Public auth APIs
    "/((?!_next|static|favicon.ico|icons|images|auth/login|auth/signup|api/auth/signup|api/auth).*)",
  ],
};

