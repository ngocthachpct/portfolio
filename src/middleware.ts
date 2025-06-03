import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define paths that are considered admin routes
  const isAdminRoute = path.startsWith('/admin') && !path.startsWith('/admin/login')

  // Get the admin session cookie
  const adminSession = request.cookies.get('admin_session')?.value

  // If the user is not authenticated and is trying to access an admin route
  if (isAdminRoute && !adminSession) {
    // Redirect to the login page
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

// Configure the middleware to run only on admin routes
export const config = {
  matcher: ['/admin/:path*'],
}