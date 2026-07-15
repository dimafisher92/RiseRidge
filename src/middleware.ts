import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { isSupabaseConfigured } from '@/lib/supabase/env';

// Gates the portal:
//  - unauthenticated users hitting /portal/* are sent to /login/
//  - authenticated users hitting /login/ are sent to /portal/dashboard/
//  - non-admins hitting /portal/admin/* are sent to /portal/dashboard/
// All redirect targets use a trailing slash to match next.config `trailingSlash: true`.
export async function middleware(request: NextRequest) {
  // Before Supabase is configured, don't gate — pages render a "not configured"
  // notice rather than redirect-looping.
  if (!isSupabaseConfigured()) return NextResponse.next();

  const { user, supabase, response } = await updateSession(request);
  const path = request.nextUrl.pathname;
  const isLogin = path === '/login' || path === '/login/';
  const isAdminArea = path.startsWith('/portal/admin');

  if (!user) {
    if (isLogin) return response;
    const url = request.nextUrl.clone();
    url.pathname = '/login/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/portal/dashboard/';
    return NextResponse.redirect(url);
  }

  if (isAdminArea) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/portal/dashboard/';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ['/portal/:path*', '/login', '/login/'],
};
