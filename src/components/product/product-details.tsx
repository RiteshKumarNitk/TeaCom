"use client";

import { Product } from "@/types/product";
import { useCountry } from "@/context/country-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

import { useCart } from "@/context/cart-context"; // [NEW]

interface ProductDetailsProps {
    product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
    const { country } = useCountry();
    const { addItem } = useCart(); // [NEW]
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Pricing Logic (Select variant or base)
    const price = product.basePrice[country] || product.basePrice["in"];
    const currencySymbol = price.currency === "INR" ? "₹" : "﷼";

    const handleAddToCart = () => {
        addItem(product, quantity);
    };

    return (
        <div className="container mx-auto px-4 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Gallery Section */}
                <div className="space-y-4">
                    <div className="aspect-[4/5] bg-muted relative rounded-2xl overflow-hidden shadow-lg border border-border/50 group">
                        {product.images && product.images.length > 0 ? (
                            <img
                                src={selectedImage || product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-muted-foreground/20 text-6xl font-serif">
                                {product.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    {/* Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(img)}
                                    className={cn(
                                        "w-20 h-20 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all",
                                        (selectedImage || product.images[0]) === img
                                            ? "border-primary ring-2 ring-primary/20"
                                            : "border-transparent hover:border-gray-300"
                                    )}
                                >
                                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="mb-6 border-b border-border pb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold tracking-wider uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                {product.category}
                            </span>
                            {product.isBestseller && (
                                <span className="text-xs font-bold tracking-wider uppercase text-white bg-gold-500 px-2 py-0.5 rounded-full">
                                    Bestseller
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">
                            {product.name}
                        </h1>
                        <div className="flex items-end gap-2 mb-4">
                            <span className="text-3xl font-bold text-primary">
                                {currencySymbol} {price.amount}
                            </span>
                            <span className="text-muted-foreground text-sm mb-1">
                                / 100g (Approx. 50 cups)
                            </span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            {product.description}
                        </p>
                    </div>

                    {/* Ingredients & Benefits */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Leaf className="w-4 h-4 text-emerald-500" /> Ingredients
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                {product.ingredients.map(i => <li key={i}>• {i}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-gold-500" /> Benefits
                            </h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                                {product.benefits.map(b => <li key={b}>• {b}</li>)}
                            </ul>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Quantity</span>
                            <div className="flex items-center gap-3 bg-white border border-border rounded-full px-3 py-1">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-1 hover:text-primary transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-4 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-1 hover:text-primary transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <Button size="lg" className="w-full rounded-full gap-2 text-md shadow-xl hover:shadow-primary/20" onClick={handleAddToCart}>
                            <ShoppingBag className="w-5 h-5" /> Add to Cart — {currencySymbol} {price.amount * quantity}
                        </Button>

                        <div className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
                            <Truck className="w-3 h-3" />
                            {country === "in" ? "Free shipping across India on orders above ₹999" : "Duty-paid shipping to Saudi Arabia. Arrives in 5-7 days."}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
