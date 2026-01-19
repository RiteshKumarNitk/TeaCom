import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/client';

// Since this is a build-time/server-side generation, we might need direct DB or fetch
// We'll use a simple fetch approach if possible or mock for now if DB access is tricky in build without exact env

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://teacom.com'; // Replace

    // Static Routes
    const routes = [
        '',
        '/shop',
        '/about',
        '/contact',
        '/blog',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
    }));

    // Dynamic Routes (Products)
    // Ideally fetch from DB. 
    // const products = await getProducts();
    // const productRoutes = products.map(p => ({
    //     url: `${baseUrl}/product/${p.slug}`,
    //     lastModified: p.updated_at
    // }));

    return [...routes];
}
