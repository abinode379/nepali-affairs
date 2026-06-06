import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminEmail } from './lib/admin';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and anon key are required in middleware. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_URL and SUPABASE_ANON_KEY.');
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll: () =>
          cookieStore.getAll().map(cookie => ({
            name: cookie.name,
            value: cookie.value,
            options: {}
          })),
        setAll: cookieList => {
          cookieList.forEach(cookie => {
            res.cookies.set(cookie.name, cookie.value, cookie.options as any);
          });
        }
      }
    }
  );
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      if (user && isAdminEmail(user.email)) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
      return res;
    }

    if (!user || !isAdminEmail(user.email)) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
      if (user && !isAdminEmail(user.email)) {
        loginUrl.searchParams.set('unauthorized', '1');
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*']
};
