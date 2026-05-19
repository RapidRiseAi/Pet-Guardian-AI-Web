import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { assertPublicEnv, env } from '@/lib/env';
import type { UserRole } from '@/types/roles';

const protectedPrefixes = ['/app'];
const onboardingPath = '/onboarding';

function roleHomeHref(role: UserRole | null) {
  if (role === 'sitter') return '/app/sitter';
  if (role === 'clinic') return '/app/clinic';
  if (role === 'admin') return '/app/admin';
  return '/app';
}

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function middleware(request: NextRequest) {
  assertPublicEnv();
  const response = NextResponse.next({ request });

  type CookieToSet = { name: string; value: string; options?: Parameters<typeof response.cookies.set>[2] };

  const supabase = createServerClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const pathname = request.nextUrl.pathname;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtectedPath(pathname) && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!user) return response;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, onboarding_completed_at')
    .eq('id', user.id)
    .maybeSingle();

  if (isProtectedPath(pathname) && !profile?.onboarding_completed_at) {
    const onboardingUrl = request.nextUrl.clone();
    onboardingUrl.pathname = onboardingPath;
    onboardingUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(onboardingUrl);
  }

  if (pathname === onboardingPath && profile?.onboarding_completed_at) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = roleHomeHref((profile.role as UserRole | null) ?? null);
    homeUrl.search = '';
    return NextResponse.redirect(homeUrl);
  }

  return response;
}

export const config = {
  matcher: ['/app/:path*', '/onboarding'],
};
