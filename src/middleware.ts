import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { getCountry, getLocale } from '@/lib/i18n'

export async function middleware(request: NextRequest) {
    // 1. Handle Supabase Session
    const sessionResponse = await updateSession(request)

    // 2. Handle Localization
    const country = getCountry(request)
    const locale = getLocale(request)

    // Ensure cookies are set if missing
    if (!request.cookies.has("country")) {
        sessionResponse.cookies.set("country", country)
    }
    if (!request.cookies.has("locale")) {
        sessionResponse.cookies.set("locale", locale)
    }

    // 3. Handle Admin Session (Custom JWT)
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow the login and signup pages
        if (request.nextUrl.pathname === '/admin/login' || request.nextUrl.pathname === '/admin/signup') {
            return sessionResponse;
        }

        const adminSession = request.cookies.get("admin_session")?.value;
        if (!adminSession) {
            const loginUrl = new URL("/admin/login", request.url);
            return NextResponse.redirect(loginUrl);
        }

        // We could verify the JWT here too for extra security in middleware,
        // but 'requireAdmin' in each page will do it anyway.
        // For strict protection, let's keep it simple: existence of cookie is enough for middleware,
        // actual validity/role is checked in RSC via requireAdmin.
    }

    return sessionResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
