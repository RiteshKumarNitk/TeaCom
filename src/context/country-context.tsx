"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { type Country, type Locale } from "@/lib/i18n";
import { setCookie } from "cookies-next";

interface CountryContextType {
    country: Country;
    locale: Locale;
    setCountry: (country: Country) => void;
    setLocale: (locale: Locale) => void;
    currency: string;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({
    children,
    defaultCountry = "in",
    defaultLocale = "en",
}: {
    children: React.ReactNode;
    defaultCountry?: Country;
    defaultLocale?: Locale;
}) {
    const [country, setCountryState] = useState<Country>(defaultCountry);
    const [locale, setLocaleState] = useState<Locale>(defaultLocale);

    const setCountry = (c: Country) => {
        setCountryState(c);
        setCookie("country", c);
        // Refresh to apply middleware logic if needed, or just handle client-side
        window.location.reload();
    };

    const setLocale = (l: Locale) => {
        setLocaleState(l);
        setCookie("locale", l);
        window.location.reload();
    };

    const currency = country === "sa" ? "SAR" : "INR";

    useEffect(() => {
        // Sync RTL based on locale
        document.documentElement.dir = "ltr";
        document.documentElement.lang = locale;
    }, [locale]);

    return (
        <CountryContext.Provider
            value={{ country, locale, setCountry, setLocale, currency }}
        >
            {children}
        </CountryContext.Provider>
    );
}

export function useCountry() {
    const context = useContext(CountryContext);
    if (context === undefined) {
        throw new Error("useCountry must be used within a CountryProvider");
    }
    return context;
}
