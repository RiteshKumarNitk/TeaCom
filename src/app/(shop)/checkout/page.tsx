"use client";

import { useCart } from "@/context/cart-context";
import { useCountry } from "@/context/country-context";
import { placeOrder, getUserAddresses } from "./actions"; // Added getUserAddresses
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
// ... imports

// ... SubmitButton ...

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const { country, currency } = useCountry();
    const [state, formAction] = useActionState(placeOrder, initialState);
    const [mounted, setMounted] = useState(false);

    // Address Management
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>("new");

    // Form State (Controlled to allow pre-filling)
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        addressLine1: "",
        city: "",
        state: "",
        postalCode: "",
    });

    useEffect(() => {
        // Fetch saved addresses
        getUserAddresses().then((data) => {
            setSavedAddresses(data);
            // Auto-select default if exists
            const defaultAddr = data.find((a: any) => a.is_default);
            if (defaultAddr) {
                selectAddress(defaultAddr);
            } else if (data.length > 0) {
                selectAddress(data[0]);
            }
        });
    }, []);

    const selectAddress = (addr: any) => {
        setSelectedAddressId(addr.id);
        setFormData({
            fullName: addr.full_name,
            phone: addr.phone || "",
            email: formData.email, // Keep email if typed, or fetch from profile? Assuming user might type. 
            // Better: Don't overwrite email if it's already there? or fetch user email separately.
            // For now, let's leave email as is or user types it.
            addressLine1: addr.address_line1,
            city: addr.city,
            state: addr.state,
            postalCode: addr.postal_code,
        });
    };

    const handleAddressSelection = (id: string) => {
        if (id === "new") {
            setSelectedAddressId("new");
            setFormData(prev => ({ ...prev, fullName: "", phone: "", addressLine1: "", city: "", state: "", postalCode: "" })); // Clear
        } else {
            const addr = savedAddresses.find(a => a.id === id);
            if (addr) selectAddress(addr);
        }
    };

    // Update form data on change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ... Coupon State ...

    // ... Effect for mount ...

    // ... Return ...

    // Within Render:
    // ...
    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
        Shipping Details
    </h2>

    {/* Address Selector */ }
    {
        savedAddresses.length > 0 && (
            <div className="mb-6 grid gap-3">
                <Label>Select Delivery Address</Label>
                <div className="grid grid-cols-1 gap-2">
                    <label className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition-all ${selectedAddressId === 'new' ? 'border-primary bg-primary/5' : 'hover:border-primary/30'}`}>
                        <input
                            type="radio"
                            name="addressSelect"
                            value="new"
                            checked={selectedAddressId === "new"}
                            onChange={() => handleAddressSelection("new")}
                            className="mt-1"
                        />
                        <span className="font-medium text-sm">Add New Address</span>
                    </label>
                    {savedAddresses.map(addr => (
                        <label key={addr.id} className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'hover:border-primary/30'}`}>
                            <input
                                type="radio"
                                name="addressSelect"
                                value={addr.id}
                                checked={selectedAddressId === addr.id}
                                onChange={() => handleAddressSelection(addr.id)}
                                className="mt-1"
                            />
                            <div className="text-sm">
                                <span className="font-bold block">{addr.full_name} {addr.is_default && <span className="text-xs font-normal text-muted-foreground">(Default)</span>}</span>
                                <span className="text-muted-foreground text-xs line-clamp-1">
                                    {addr.address_line1}, {addr.city}, {addr.postal_code}
                                </span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        )
    }

    <form action={formAction} className="space-y-6 bg-card p-6 rounded-xl border border-border">
        {/* Hidden fields ... */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" required placeholder="John Doe" value={formData.fullName} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" required placeholder="+91 98765 43210" value={formData.phone} onChange={handleInputChange} />
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="john@example.com" value={formData.email} onChange={handleInputChange} />
        </div>

        <div className="space-y-2">
            <Label htmlFor="addressLine1">Address</Label>
            <Input id="addressLine1" name="addressLine1" required placeholder="Street, Apartment, etc." value={formData.addressLine1} onChange={handleInputChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" required value={formData.city} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" required value={formData.state} onChange={handleInputChange} />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" name="postalCode" required value={formData.postalCode} onChange={handleInputChange} />
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
                </div >

        {/* Right: Order Summary */ }
        < div >
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
                </div >
            </div >
        </div >
    );
}
