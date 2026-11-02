import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // FAST PATH: Public pages (Home, Courses, IMAT guide, Universities, Resources, News, About, Contact)
  // do not require blocking Supabase auth checks.
  const isPortalRoute = pathname.startsWith('/portal');
  const isAuthRoute = pathname === '/login' || pathname === '/register';

  if (!isPortalRoute && !isAuthRoute) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  // Check if any Supabase session cookies exist before making external network calls
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(
    (c) => c.name.startsWith('sb-') || c.name.includes('auth-token')
  );

  // If visiting /portal without any auth cookie, redirect immediately to /login (0ms latency)
  if (isPortalRoute && !hasAuthCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If visiting /login or /register without auth cookie, allow immediately (0ms latency)
  if (isAuthRoute && !hasAuthCookie) {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }

  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith('http')) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
        );
      },
    },
  });

  // Fetch the user safely
  let user: any = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user;
  } catch (err) {
    return supabaseResponse;
  }

  // If the user is accessing a protected route
  if (isPortalRoute) {
    if (!user) {
      // Redirect to login if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }

    // Check payment_approved status
    const { data: profile } = await supabase
      .from('profiles')
      .select('payment_approved')
      .eq('id', user.id)
      .single();

    if (!profile || !profile.payment_approved) {
      const url = request.nextUrl.clone();
      url.pathname = '/pending-payment';
      return NextResponse.redirect(url);
    }
  }

  // If going to login/register but already logged in and approved
  if (isAuthRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('payment_approved')
      .eq('id', user.id)
      .single();

    if (profile?.payment_approved) {
      const url = request.nextUrl.clone();
      url.pathname = '/portal/dashboard';
      return NextResponse.redirect(url);
    } else {
      const url = request.nextUrl.clone();
      url.pathname = '/pending-payment';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
