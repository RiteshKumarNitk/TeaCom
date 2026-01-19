"use client";

import { useCart } from "@/context/cart-context";
import { useCountry } from "@/context/country-context";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";

export function CartDrawer() {
    const { items, isOpen, setIsOpen, removeItem, updateQuantity, cartTotal } = useCart();
    const { country, currency } = useCountry();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity animate-in fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div
                className={cn(
                    "fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-background shadow-2xl transition-transform duration-300 ease-in-out transform border-l border-border",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <h2 className="text-lg font-serif font-bold flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-primary" />
                            Shopping Cart
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-accent rounded-full text-muted-foreground transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                                    <ShoppingBag className="w-8 h-8" />
                                </div>
                                <p className="text-muted-foreground">Your cart is empty.</p>
                                <Button variant="outline" onClick={() => setIsOpen(false)}>
                                    Continue Shopping
                                </Button>
                            </div>
                        ) : (
                            items.map((item) => {
                                const currentPrice = item.product.basePrice[country] || item.product.basePrice["in"];
                                return (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="h-20 w-20 bg-muted rounded-lg relative overflow-hidden flex-shrink-0 border border-border">
                                            {item.product.images && item.product.images.length > 0 ? (
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs text-muted-foreground">
                                                    No Img
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-medium text-sm line-clamp-2">{item.product.name}</h3>
                                                {item.variantId && (
                                                    <span className="text-xs text-muted-foreground">{item.variantId}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2 border border-border rounded-md px-2 py-0.5">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-0.5 hover:text-primary"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-0.5 hover:text-primary"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-medium text-sm">
                                                        {currency === "INR" ? "₹" : "﷼"} {currentPrice.amount * item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="border-t border-border p-4 bg-muted/20 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="text-lg font-bold text-primary">
                                    {currency === "INR" ? "₹" : "﷼"} {cartTotal}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                                Shipping & taxes calculated at checkout.
                            </p>
                            <Link href="/checkout" className="w-full" onClick={() => setIsOpen(false)}>
                                <Button className="w-full rounded-full shadow-lg" size="lg">
                                    Checkout
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
