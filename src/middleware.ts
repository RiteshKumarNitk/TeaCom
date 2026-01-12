import { type NextRequest } from 'next/server'
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

    // Apply headers for downstream components to access
    sessionResponse.headers.set("x-country", country)
    sessionResponse.headers.set("x-locale", locale)

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
