import { NextRequest } from "next/server";

export const Locales = ["en"] as const;
export const Countries = ["in", "sa"] as const;

export type Locale = "en"; // Removed "ar" as per request
export type Country = (typeof Countries)[number];

export const defaultCountry: Country = "in";
export const defaultLocale: Locale = "en";

export function getCountry(request: NextRequest): Country {
    // 1. Check cookies
    const countryCookie = request.cookies.get("country");
    if (countryCookie?.value === "in" || countryCookie?.value === "sa") {
        return countryCookie.value as Country;
    }

    // 2. Fallback to GeoIP (Stub implementation - req.geo is experimental)
    // const geoCountry = (request as any).geo?.country?.toLowerCase();
    // if (geoCountry === "sa") return "sa";

    // Default to India
    return "in";
}

export function getLocale(request: NextRequest): Locale {
    // 1. Check cookies
    const localeCookie = request.cookies.get("locale");
    if (localeCookie?.value === "en") {
        return localeCookie.value as Locale;
    }

    // 2. Default fallback
    return defaultLocale;
}
