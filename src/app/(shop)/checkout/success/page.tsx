"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useCart } from "@/context/cart-context";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const { clearCart } = useCart();

    useEffect(() => {
        // Clear cart on successful order landing
        clearCart();
    }, [clearCart]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-md text-center bg-card p-12 rounded-2xl shadow-xl border border-border/50">
                <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                    Order Placed!
                </h2>
                <p className="text-muted-foreground mb-2 text-lg">
                    Thank you for your purchase.
                </p>
                <p className="text-sm text-muted-foreground mb-8 bg-muted inline-block px-3 py-1 rounded-full">
                    Order ID: <span className="font-mono text-foreground">{orderId}</span>
                </p>

                <div className="space-y-3">
                    <Button asChild className="w-full rounded-full" size="lg">
                        <Link href="/shop">Continue Shopping</Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full rounded-full">
                        <Link href="/account">View Order Status</Link>
                    </Button>
                </div>

            </div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    )
}
