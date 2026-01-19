"use client";

import { Product } from "@/types/product";
import { useCountry } from "@/context/country-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { country, currency } = useCountry();
    const { addItem } = useCart();
    const [isWishlisted, setIsWishlisted] = useState(false); // Optimistic state
    const [isLoading, setIsLoading] = useState(false);

    // Fallback logic
    const priceData = product.basePrice[country] || product.basePrice["in"];
    const currentPrice = priceData.amount;
    const comparePrice = priceData.compareAt;

    // Calculate off percentage
    const discount = comparePrice
        ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
        : 0;

    // Calculate Inventory
    const totalStock = product.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) ?? 0;
    const isOutOfStock = totalStock === 0;
    const isLowStock = totalStock > 0 && totalStock < 10;
    const defaultVariant = product.variants?.[0];

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isOutOfStock) return;

        // Add the first variant (default) to cart
        // Ideally we should prompt for variant selection if multiple exist, 
        // but for Quick Add, default is acceptable.
        addItem(product, 1, defaultVariant?.id, defaultVariant?.name);
    };

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLoading(true);
        try {
            // Import dynamically to avoid build issues if mixed env
            const { toggleWishlist } = await import("@/app/(shop)/account/wishlist/actions");
            const result = await toggleWishlist(product.id);

            if (result.isWishlisted !== undefined) {
                setIsWishlisted(result.isWishlisted);
            } else if (result.error) {
                // If login needed
                if (result.error.includes("login")) {
                    window.location.href = "/login";
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="group relative flex flex-col h-full bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
            {/* Clickable Card Overlay */}
            <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0">
                <span className="sr-only">View {product.name}</span>
            </Link>

            {/* Image Section */}
            <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden z-10 pointer-events-none">
                {/* Pointer events none ensures clicks go to the Link behind, BUT buttons need pointer-events-auto */}
                <div // Wrapper for interactive elements on top of image
                    className="absolute inset-0 pointer-events-none"
                >
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
                        {isOutOfStock ? (
                            <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
                                OUT OF STOCK
                            </span>
                        ) : (
                            <>
                                {discount > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
                                        -{discount}%
                                    </span>
                                )}
                                {product.isBestseller && (
                                    <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
                                        BESTSELLER
                                    </span>
                                )}
                                {isLowStock && (
                                    <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
                                        LOW STOCK
                                    </span>
                                )}
                            </>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={handleToggleWishlist}
                        disabled={isLoading}
                        className={cn(
                            "absolute top-2 right-2 p-2 rounded-full shadow-md transition-all duration-300 z-20 pointer-events-auto",
                            isWishlisted ? "bg-red-50 text-red-500" : "bg-white text-gray-400 hover:text-red-500 hover:bg-red-50"
                        )}
                    >
                        <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
                    </button>

                    {/* OOS Overlay */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10">
                            {/* Optional: Add visual cue like centered text or icon */}
                        </div>
                    )}
                </div>

                {/* Product Image */}
                {product.images && product.images[0] ? (
                    <img
                        src={product.images[0].startsWith("http") || product.images[0].startsWith("/") ? product.images[0] : `/${product.images[0]}`}
                        alt={product.name}
                        className={cn(
                            "w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out",
                            isOutOfStock && "grayscale opacity-60"
                        )}
                        onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/400x500/e2e8f0/64748b?text=Tea+Image";
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        No Image
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-1 text-center items-center z-10 pointer-events-none">
                {/* Title */}
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors my-1">
                    {product.name}
                </h3>

                {/* Rating (Static Mock) */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex text-yellow-400 text-xs">★★★★☆</div>
                    <span className="text-[10px] text-gray-400">(45)</span>
                </div>

                {/* Price Display */}
                <div className="flex items-center gap-2 mb-4">
                    {comparePrice && (
                        <span className="text-xs text-gray-400 line-through">
                            {currency === "INR" ? "₹" : "﷼"} {comparePrice}
                        </span>
                    )}
                    <span className={cn("text-sm font-bold", isOutOfStock ? "text-gray-400" : "text-red-500")}>
                        {currency === "INR" ? "₹" : "﷼"} {currentPrice}
                    </span>
                </div>

                {/* Add to Cart Button */}
                <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={cn(
                        "w-full mt-auto font-semibold text-xs rounded-full h-9 shadow-sm pointer-events-auto relative z-20",
                        isOutOfStock
                            ? "bg-gray-200 text-gray-500 hover:bg-gray-200 cursor-not-allowed"
                            : "bg-yellow-400 hover:bg-yellow-500 text-black"
                    )}
                >
                    {isOutOfStock ? "Out of Stock" : (
                        <>
                            <ShoppingCart className="w-3 h-3 mr-2" />
                            Add to cart
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
