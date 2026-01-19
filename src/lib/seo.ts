import { Metadata, ResolvingMetadata } from 'next';

// This is a dynamic sitemap generator
// In Next.js App Router, we use `sitemap.ts` (not .xml directly for dynamic generation usually, or route.ts)
// For simplicity, we'll create specific route handlers if needed, but Next.js standard is `app/sitemap.ts`

// I will create `src/app/sitemap.ts` instead of a folder. 
// But first, let's setup SEO utilities.

export function constructMetadata({
    title = "TeaCom - Premium Organic Tea",
    description = "Experience the finest organic tea collection from India and Nepal.",
    image = "/images/og-default.jpg",
    icons = "/favicon.ico",
    noIndex = false
}: {
    title?: string;
    description?: string;
    image?: string;
    icons?: string;
    noIndex?: boolean;
} = {}): Metadata {
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: image
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
            creator: "@teacom"
        },
        icons,
        metadataBase: new URL("https://teacom.com"), // Replace with actual domain
        ...(noIndex && {
            robots: {
                index: false,
                follow: false
            }
        })
    };
}
