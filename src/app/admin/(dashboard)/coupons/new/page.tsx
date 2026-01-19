"use client";

import { useFormStatus } from "react-dom";
import { createCoupon } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full md:w-auto">
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Coupon"}
        </Button>
    )
}

export default function NewCouponPage() {
    const [state, action] = useActionState(createCoupon, null);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/coupons" className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">New Coupon</h1>
                    <p className="text-muted-foreground">Create a new discount code.</p>
                </div>
            </div>

            <form action={action} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-6">

                {state?.error && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm border border-destructive/20">
                        {state.error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="code">Coupon Code</Label>
                    <Input id="code" name="code" placeholder="e.g. SUMMER2026" className="uppercase font-mono" required />
                    <p className="text-xs text-muted-foreground">Uppercase, numbers, underscores only.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="discount_type">Discount Type</Label>
                        <select
                            id="discount_type"
                            name="discount_type"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            required
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount (₹)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="discount_value">Value</Label>
                        <Input id="discount_value" name="discount_value" type="number" min="0" step="0.01" required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="min_order_amount">Minimum Order Amount (₹)</Label>
                    <Input id="min_order_amount" name="min_order_amount" type="number" min="0" placeholder="0" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="usage_limit">Usage Limit (Optional)</Label>
                        <Input id="usage_limit" name="usage_limit" type="number" min="1" placeholder="Unlimited" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
                        <Input id="expires_at" name="expires_at" type="datetime-local" />
                    </div>
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                    <Button variant="outline" asChild>
                        <Link href="/admin/coupons">Cancel</Link>
                    </Button>
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
