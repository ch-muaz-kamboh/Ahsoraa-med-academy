import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Fetch the user
  const { data: { user } } = await supabase.auth.getUser();

  // If the user is accessing a protected route
  if (request.nextUrl.pathname.startsWith('/portal')) {
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
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('payment_approved')
      .eq('id', user.id)
      .single();

    if (profile?.payment_approved) {
      const url = request.nextUrl.clone();
      url.pathname = '/portal';
      return NextResponse.redirect(url);
    } else {
      const url = request.nextUrl.clone();
      url.pathname = '/pending-payment';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
