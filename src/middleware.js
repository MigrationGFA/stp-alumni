import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req) {
  // 1. Check for token in cookies
  const token = req.cookies.get('token')?.value;
  const isDashboardRoute = req.nextUrl.pathname.includes('/dashboard');

  // 2. Protect dashboard routes
  if (isDashboardRoute && !token) {
    // Redirect to login. 
    // We construct an absolute URL via req.url 
    const loginUrl = new URL('/login', req.url);
    // Note: If the user visits /fr/dashboard, and we redirect to /login, 
    // the intl middleware will further redirect to /fr/login.
    return NextResponse.redirect(loginUrl);
  }

  // 3. Fallback to normal localization handling
  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};
