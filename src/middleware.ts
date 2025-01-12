import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = ['/confirm-n-pay', '/profile', '/trips', '/invoice', '/customer-list', '/confirmation']
const publicRoutes = ['/login', '/register', '/p', '/explore', '/', '/forget', '/reset']
const routesWithGlobalParams = ['/p', '/explore', '/confirm-n-pay', '/profile', '/trips', '/invoice',]
const routesInitialParams = ['/explore', '/profile']

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path) || /^\/invoice\/[^/]+$/.test(path);
  const isPublicRoute = publicRoutes.includes(path)

  // 3. get session
  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie as string)

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 5. Redirect to /explore if the user is authenticated
  if (
    isPublicRoute &&
    session &&
    !req.nextUrl.pathname.startsWith('/explore') &&
    !req.nextUrl.pathname.startsWith('/')
  ) {
    return NextResponse.redirect(new URL('/explore', req.nextUrl))
  }

  // create global query params
  // const url = req.nextUrl.clone();
  // if (routesWithGlobalParams.includes(path) && path !== '/' && !url.searchParams.has('ots')) {
  //   url.searchParams.set('ots', 'true');
  //   return NextResponse.redirect(url);
  // }

  const url = req.nextUrl.clone();

  const isRouteWithGlobalParams = routesWithGlobalParams.some(route => path.startsWith(route)) && path !== '/';

  const isExplore = path === '/explore';
  const isRoutesInitialParams = routesInitialParams.some(route => path.startsWith(route))

  const hasOts = req.nextUrl.searchParams.has('ots');

  const otsCookie = req.cookies.get('ots');

  if (isRouteWithGlobalParams) {
    const response = NextResponse.next();
    if (hasOts) {
      response.cookies.set('ots', 'true');
      return response;
    }

    if (otsCookie && !hasOts) {
      url.searchParams.set('ots', 'true');
      return NextResponse.redirect(url);
    } else if (!otsCookie && hasOts) {
      url.searchParams.delete('ots');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|public/images|.*\\..*).*)'],
}