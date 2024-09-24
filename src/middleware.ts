import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { publicRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT } from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  console.log("isLoggedIn: ", isLoggedIn);
  console.log("isApiAuthRoute: ", isApiAuthRoute);
  console.log("isAuthRoute: ", isAuthRoute);
  console.log("isPublicRoute: ", isPublicRoute);


  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl))
  }

  return null;
});
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};