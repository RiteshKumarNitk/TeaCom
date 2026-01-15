import { Product, Money } from "@/types/product";
import { createClient } from "@/lib/supabase/client";

// Helper to map DB rows to Product type
function mapProduct(row: any): Product {
    const basePrice: Record<string, Money> = {};

    // Map prices
    if (row.product_prices && Array.isArray(row.product_prices)) {
        row.product_prices.forEach((p: any) => {
            if (p.currency === 'INR') {
                basePrice.in = { amount: Number(p.amount), currency: "INR" };
            } else if (p.currency === 'SAR') {
                basePrice.sa = { amount: Number(p.amount), currency: "SAR" };
            }
        });
    }

    // Default fallback if price missing (shouldn't happen with correct seed)
    if (!basePrice.in) basePrice.in = { amount: 0, currency: "INR" };
    if (!basePrice.sa) basePrice.sa = { amount: 0, currency: "SAR" };

    return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description || "",
        images: row.images || [],
        category: row.category || "General",
        tags: row.tags || [],
        benefits: row.benefits || [],
        ingredients: row.ingredients || [],
        isBestseller: row.is_bestseller,
        isNew: row.is_new,
        basePrice: basePrice as Record<"in" | "sa", Money>,
        variants: [] // Variants logic to be added if needed, currently assuming base products
    };
}

export interface ProductFilterOptions {
    category?: string;
    sort?: "price_asc" | "price_desc" | "newest";
}

export class ProductService {
    private supabase = createClient();

    async getProducts(filters?: ProductFilterOptions): Promise<Product[]> {
        let query = this.supabase
            .from('products')
            .select(`
                *,
                product_prices (
                    currency,
                    amount
                )
            `);

        if (filters?.category) {
            query = query.ilike('category', `%${filters.category}%`);
        }

        if (filters?.sort === 'newest') {
            query = query.order('created_at', { ascending: false });
        }
        // Note: Sort by price is complex in Supabase because price is in a joined table or JSONB. 
        // For MVP, we will sort in memory after fetching if price sort is requested.

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching products:", error);
            return [];
        }

        let products = data.map(mapProduct);

        // In-memory sort for price (since price structure is complex for direct DB sort without flattened view)
        if (filters?.sort === 'price_asc') {
            products.sort((a, b) => a.basePrice.in.amount - b.basePrice.in.amount);
        } else if (filters?.sort === 'price_desc') {
            products.sort((a, b) => b.basePrice.in.amount - a.basePrice.in.amount);
        }

        return products;
    }

    async getBestsellers(): Promise<Product[]> {
        const { data, error } = await this.supabase
            .from('products')
            .select(`
                *,
                product_prices (
                    currency,
                    amount
                )
            `)
            .eq('is_bestseller', true);

        if (error) {
            console.error("Error fetching bestsellers:", error);
            return [];
        }

        return data.map(mapProduct);
    }

    async getProductBySlug(slug: string): Promise<Product | undefined> {
        const { data, error } = await this.supabase
            .from('products')
            .select(`
                *,
                product_prices (
                    currency,
                    amount
                )
            `)
            .eq('slug', slug)
            .single();

        if (error || !data) {
            console.error("Error fetching product by slug:", error);
            return undefined;
        }

        return mapProduct(data);
    }
}

export const productService = new ProductService();
