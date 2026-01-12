"use client";

import { Product } from "@/types/product";
import { useCountry } from "@/context/country-context";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
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
    const [isHovered, setIsHovered] = useState(false);

    // Fallback logic
    const priceData = product.basePrice[country] || product.basePrice["in"];
    const currentPrice = priceData.amount;
    const comparePrice = priceData.compareAt;

    // Calculate off percentage
    const discount = comparePrice
        ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
        : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1);
    };

    return (
        <div
            className="group flex flex-col h-full bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Section */}
            <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {discount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">
                            -{discount}%
                        </span>
                    )}
                    {product.isBestseller && (
                        <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm">
                            BESTSELLER
                        </span>
                    )}
                </div>

                {/* Product Image */}
                {product.images && product.images[0] ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        No Image
                    </div>
                )}

                {/* Floating Action (Eye) */}
                <Link
                    href={`/product/${product.slug}`}
                    className={cn(
                        "absolute top-2 right-2 p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-primary transition-all duration-300",
                        isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                    )}
                >
                    <Eye className="w-4 h-4" />
                </Link>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-1 text-center items-center">
                {/* Title */}
                <Link href={`/product/${product.slug}`} className="block w-full">
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors my-1">
                        {product.name}
                    </h3>
                </Link>

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
                    <span className="text-sm font-bold text-red-500">
                        {currency === "INR" ? "₹" : "﷼"} {currentPrice}
                    </span>
                </div>

                {/* Add to Cart Button */}
                <Button
                    onClick={handleAddToCart}
                    className="w-full mt-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-xs rounded-full h-9 shadow-sm"
                >
                    <ShoppingCart className="w-3 h-3 mr-2" />
                    Add to cart
                </Button>
            </div>
        </div>
    );
}
