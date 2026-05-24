import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Ensure env variables exist before initiating client
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
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
    }
  );

  // Retrieve user (safer than getSession as it validates token against Supabase auth server)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // Root /admin route maps directly to /admin/dashboard
  if (url.pathname === "/admin") {
    url.pathname = user ? "/admin/dashboard" : "/admin/login";
    return NextResponse.redirect(url);
  }

  // Guard all sub routes of /admin/dashboard
  if (url.pathname.startsWith("/admin/dashboard")) {
    if (!user) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from the login page
  if (url.pathname === "/admin/login") {
    if (user) {
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
