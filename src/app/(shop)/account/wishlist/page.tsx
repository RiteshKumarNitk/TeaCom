import { getWishlistItems } from "./actions";
import { ProductCard } from "@/components/product/product-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function WishlistPage() {
    const items = await getWishlistItems();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-serif mb-2">My Wishlist</h1>
                <p className="text-muted-foreground">Heart your favorite teas to save them for later.</p>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-6">Explore our collection and find something you love.</p>
                    <Button asChild>
                        <Link href="/shop">Browse Teas</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item: any) => (
                        <ProductCard key={item.id} product={item.product} />
                    ))}
                </div>
            )}
        </div>
    );
}
