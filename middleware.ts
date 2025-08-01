import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  
  const { pathname } = request.nextUrl;
  
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(authToken ? '/dashboard' : '/authentication/login', request.url)
    );
  }
  
  const isPublicRoute = 
    pathname === '/authentication/login' || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.');
    
  if (authToken && pathname === '/authentication/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!authToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/authentication/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/authentication/login',
    '/((?!_next/static|_next/image|favicon.ico|public|assets).*)',
  ],
};