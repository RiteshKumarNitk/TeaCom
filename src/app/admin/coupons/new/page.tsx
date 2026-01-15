"use client";

import { useActionState } from "react"; // Next.js 15 / React 19 equivalent of useFormState (or import from react-dom)
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCoupon } from "../actions";
import Link from "next/link";
import { ChevronLeft, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Coupon"}
        </Button>
    );
}

export default function NewCouponPage() {
    // Initial state for the form action
    const initialState = { error: "", message: "" };
    const [state, formAction] = useActionState(createCoupon, initialState);

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/coupons">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-serif">New Coupon</h1>
                    <p className="text-muted-foreground">Create a discount code for customers.</p>
                </div>
            </div>

            <form action={formAction} className="space-y-6 bg-card p-8 rounded-xl border border-border">
                {state?.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <Label htmlFor="code">Coupon Code</Label>
                    <Input id="code" name="code" placeholder="e.g. SUMMER25" className="uppercase font-mono" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input id="description" name="description" placeholder="Summer Sale Discount" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="discount_type">Type</Label>
                        <select
                            name="discount_type"
                            id="discount_type"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="fixed">Fixed Amount (Flat)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="discount_value">Value</Label>
                        <Input id="discount_value" name="discount_value" type="number" min="0" step="0.01" required placeholder="10" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="min_order_amount">Minimum Order Amount (Optional)</Label>
                    <Input id="min_order_amount" name="min_order_amount" type="number" min="0" placeholder="0" />
                </div>

                <div className="flex justify-end pt-4">
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
