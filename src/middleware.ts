import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'
import { getSession } from '@/lib/session'

// 1. Specify protected and public routes
const protectedRoutes = ['/confirm-n-pay', '/profile', '/trips', '/invoice', '/customer-list', '/confirmation']
const publicRoutes = ['/login', '/register', '/p', '/explore', '/',]

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
  const url = req.nextUrl.clone();
  if (path !== '/' && !url.searchParams.has('ots')) {
    url.searchParams.set('ots', 'true');
    return NextResponse.redirect(url);
  }

  return NextResponse.next()

}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}