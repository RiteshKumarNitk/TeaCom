"use client";

import { useCart } from "@/context/cart-context";
import { useCountry } from "@/context/country-context";
import { placeOrder } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Place Order (Cash on Delivery)"}
        </Button>
    );
}

const initialState = {
    error: "",
};

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const { country, currency } = useCountry();
    const [state, formAction] = useActionState(placeOrder, initialState);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-serif font-bold mb-4">Your cart is empty</h1>
                <Link href="/shop" className="text-primary hover:underline">Continue Shopping</Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Shipping Form */}
                <div>
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        Shipping Details
                    </h2>

                    <form action={formAction} className="space-y-6 bg-card p-6 rounded-xl border border-border">
                        {/* Hidden fields to pass cart state to server action */}
                        <input type="hidden" name="items" value={JSON.stringify(items)} />
                        <input type="hidden" name="total" value={cartTotal} />
                        <input type="hidden" name="currency" value={currency} />
                        <input type="hidden" name="country" value={country} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input id="fullName" name="fullName" required placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" name="phone" required placeholder="+91 98765 43210" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="addressLine1">Address</Label>
                            <Input id="addressLine1" name="addressLine1" required placeholder="Street, Apartment, etc." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" name="city" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input id="state" name="state" required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input id="postalCode" name="postalCode" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="countryDisplay">Country</Label>
                                <Input id="countryDisplay" value={country === 'in' ? 'India' : 'Saudi Arabia'} disabled className="bg-muted" />
                            </div>
                        </div>

                        {state?.error && (
                            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                                {state.error}
                            </div>
                        )}

                        <div className="pt-4">
                            <SubmitButton />
                            <p className="text-xs text-muted-foreground text-center mt-4">
                                Secure checkout powered by Stripe (Mock)
                            </p>
                        </div>
                    </form>
                </div>

                {/* Right: Order Summary */}
                <div>
                    <div className="bg-muted/30 p-6 rounded-xl border border-border sticky top-24">
                        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 bg-white rounded-md border border-border flex-shrink-0 relative overflow-hidden">
                                        {/* Image Placeholder */}
                                        <div className="absolute inset-0 bg-gray-100" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                                        <div className="flex justify-between items-center mt-1 text-sm text-muted-foreground">
                                            <span>Qty: {item.quantity}</span>
                                            <span>{currency} {item.price.amount * item.quantity}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-border pt-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Subtotal</span>
                                <span>{currency} {cartTotal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t border-border pt-2 mt-2">
                                <span>Total</span>
                                <span>{currency} {cartTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
