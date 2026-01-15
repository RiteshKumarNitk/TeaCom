import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { CountryProvider } from "@/context/country-context";
import { CartProvider } from "@/context/cart-context";
import { cookies } from "next/headers";
import { Country, Locale } from "@/lib/i18n";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

// Using Montserrat for body/headings as a pairing for premium feel
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hi Storm Tea | Premium Tea Experience",
  description: "Discover the finest teas with Hi Storm Tea.",
};

import { getSiteSettings } from "@/lib/site-settings";
import { WhatsAppWidget } from "@/components/common/whatsapp-widget";
//...

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const country = (cookieStore.get("country")?.value as Country) || "in";
  const locale = (cookieStore.get("locale")?.value as Locale) || "en";
  const settings = await getSiteSettings();

  return (
    <html lang={locale} dir="ltr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} ${montserrat.variable} antialiased font-sans`}
      >
        <CountryProvider defaultCountry={country} defaultLocale={locale}>
          <CartProvider>
            <Providers>
              {children}
              <WhatsAppWidget phoneNumber={settings.general?.whatsapp} />
            </Providers>
          </CartProvider>
        </CountryProvider>
      </body>
    </html>
  );
}
