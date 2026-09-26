import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_ROLE = "admin";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return response;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.app_metadata?.role === ADMIN_ROLE;
  if (isAdmin) return response;

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin";
  loginUrl.search = "";

  if (user) {
    loginUrl.searchParams.set("error", "not-authorized");
  } else {
    loginUrl.searchParams.set(
      "next",
      request.nextUrl.pathname + request.nextUrl.search,
    );
  }

  const redirectResponse = NextResponse.redirect(loginUrl);
  response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
  return redirectResponse;
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
