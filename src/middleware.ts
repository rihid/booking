import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = ['/confirm-n-pay', '/profile', '/trips', '/invoice', '/profile/rider-list', '/confirmation']
const publicRoutes = ['/login', '/register', '/p', '/explore', '/', '/forget', '/reset']
const routesWithGlobalParams = ['/explore', '/p', '/confirm-n-pay', '/confirmation', '/profile', '/trips', '/invoice',]
const routesInitialParams = ['/explore', '/profile']

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const path = url.pathname
  const referrer = req.headers.get('referer')

  // 2. Check if the current route is protected or public
  const isProtectedRoute = protectedRoutes.includes(path) || /^\/invoice\/[^/]+$/.test(path);
  const isPublicRoute = publicRoutes.includes(path)
  const isRouteWithGlobalParams = routesWithGlobalParams.some(route => path.startsWith(route)) && path !== '/'

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

  if (isRouteWithGlobalParams && referrer) {
    const referrerUrl = new URL(referrer)
    const hasOtsInRef = referrerUrl.searchParams.get('ots') === 'true'

    if (hasOtsInRef && !url.searchParams.has('ots')) {
      url.searchParams.set('ots', 'true')
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|public/images|.*\\..*).*)'],
}