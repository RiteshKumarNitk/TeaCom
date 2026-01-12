import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { CountryProvider } from "@/context/country-context";
import { CartProvider } from "@/context/cart-context"; // [NEW]
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

export const metadata: Metadata = {
  title: "TeaCom Premium",
  description: "Premium E-commerce Experience",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const country = (cookieStore.get("country")?.value as Country) || "in";
  const locale = (cookieStore.get("locale")?.value as Locale) || "en";

  return (
    <html lang={locale} dir="ltr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CountryProvider defaultCountry={country} defaultLocale={locale}>
          <CartProvider>
            <Providers>
              {children}
            </Providers>
          </CartProvider>
        </CountryProvider>
      </body>
    </html>
  );
}
