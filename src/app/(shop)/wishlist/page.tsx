import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product/product-card";
import { Product, Money } from "@/types/product";
import Link from "next/link";
import { Heart } from "lucide-react";

export const dynamic = "force-dynamic";

// Helper to map joined data back to Product type (Reusing logic from service recommended, but inline for speed)
function mapProduct(row: any): Product {
    const basePrice: Record<string, Money> = {};
    if (row.product_prices && Array.isArray(row.product_prices)) {
        row.product_prices.forEach((p: any) => {
            if (p.currency === 'INR') {
                basePrice.in = { amount: Number(p.amount), currency: "INR" };
            } else if (p.currency === 'SAR') {
                basePrice.sa = { amount: Number(p.amount), currency: "SAR" };
            }
        });
    }
    // minimal defaults
    if (!basePrice.in) basePrice.in = { amount: 0, currency: "INR" };
    if (!basePrice.sa) basePrice.sa = { amount: 0, currency: "SAR" };

    return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description || "",
        images: row.images || [],
        category: row.category,
        tags: row.tags,
        benefits: row.benefits,
        ingredients: row.ingredients,
        isBestseller: row.is_bestseller,
        isNew: row.is_new,
        basePrice: basePrice as any,
        variants: []
    };
}

export default async function WishlistPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-3xl font-serif font-bold mb-4">Please Login</h1>
                <p className="text-muted-foreground mb-8">You need to be logged in to save your favorite teas.</p>
                <Link href="/login" className="text-primary font-bold hover:underline">Sign In / Sign Up</Link>
            </div>
        );
    }

    const { data: wishlistItems, error } = await supabase
        .from("wishlists")
        .select(`
            product:products (
                *,
                product_prices (currency, amount)
            )
        `)
        .eq("user_id", user.id);

    // Filter out any null products (if product was deleted but wishlist item remained)
    const products = wishlistItems
        ?.map((w: any) => w.product)
        .filter((p: any) => p)
        .map(mapProduct) || [];

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-serif font-bold mb-8 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 fill-current" />
                My Wishlist
            </h1>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                    <p className="text-lg text-muted-foreground mb-4">Your wishlist is empty.</p>
                    <Link href="/shop" className="text-primary hover:underline">Browse our collection</Link>
                </div>
            )}
        </div>
    );
}
