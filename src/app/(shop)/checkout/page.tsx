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
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Place Order"}
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

    // Coupon State
    const [couponCode, setCouponCode] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [couponMessage, setCouponMessage] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

    // Calculate Discount
    let discountAmount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.discount_type === "percentage") {
            discountAmount = (cartTotal * appliedCoupon.discount_value) / 100;
        } else {
            discountAmount = appliedCoupon.discount_value;
        }
    }
    const finalTotal = Math.max(0, cartTotal - discountAmount);

    async function handleApplyCoupon() {
        if (!couponCode) return;
        setIsValidating(true);
        setCouponMessage("");

        try {
            // Dynamically import to call server action from client handler if needed, 
            // or better, standard import. 'validateCoupon' needs to be imported.
            const { validateCoupon } = await import("./actions");
            const result = await validateCoupon(couponCode);

            if (result.error) {
                setCouponMessage(result.error);
                setAppliedCoupon(null);
            } else {
                setAppliedCoupon(result.coupon);
                setCouponMessage("Coupon applied successfully!");
            }
        } catch (e) {
            setCouponMessage("Failed to validate coupon");
        } finally {
            setIsValidating(false);
        }
    }

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
                        {/* Hidden fields to pass cart state to server action */}
                        <input type="hidden" name="items" value={JSON.stringify(items)} />
                        <input type="hidden" name="total" value={finalTotal} />
                        <input type="hidden" name="currency" value={currency} />
                        <input type="hidden" name="country" value={country} />
                        <input type="hidden" name="couponCode" value={appliedCoupon?.code || ""} />

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

                        {/* Payment Method */}
                        <div className="space-y-3">
                            <Label>Payment Method</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                                    <input type="radio" name="paymentMethod" value="cod" defaultChecked className="w-4 h-4 text-primary" />
                                    <span className="font-medium">Cash on Delivery</span>
                                </label>
                                <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                                    <input type="radio" name="paymentMethod" value="card" className="w-4 h-4 text-primary" />
                                    <div className="flex flex-col">
                                        <span className="font-medium">Credit Card</span>
                                        <span className="text-xs text-muted-foreground">Mock Payment</span>
                                    </div>
                                </label>
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
                                        {item.product.images?.[0] ? (
                                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gray-100" />
                                        )}
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

                        {/* Coupon Input */}
                        <div className="mb-6">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Discount Code"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    disabled={!!appliedCoupon}
                                />
                                {appliedCoupon ? (
                                    <Button variant="outline" onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}>
                                        Remove
                                    </Button>
                                ) : (
                                    <Button variant="secondary" onClick={handleApplyCoupon} disabled={isValidating || !couponCode}>
                                        {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                                    </Button>
                                )}
                            </div>
                            {couponMessage && (
                                <p className={`text-xs mt-2 ${appliedCoupon ? "text-green-600" : "text-red-500"}`}>
                                    {couponMessage}
                                </p>
                            )}
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

                            {appliedCoupon && (
                                <div className="flex justify-between text-sm text-green-600 font-medium">
                                    <span>Discount ({appliedCoupon.code})</span>
                                    <span>- {currency} {discountAmount.toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-lg font-bold border-t border-border pt-2 mt-2">
                                <span>Total</span>
                                <span>{currency} {finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
