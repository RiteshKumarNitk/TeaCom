"use client";

import { useActionState, useState } from "react";
import { createProduct } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ChevronLeft, Loader2, Plus, Trash2, X } from "lucide-react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full md:w-auto" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Product"}
        </Button>
    );
}

const initialState = {
    error: "",
};

export default function NewProductPage() {
    // @ts-ignore
    const [state, formAction] = useActionState(createProduct, initialState);

    // Variant State for Dynamic Fields
    const [variants, setVariants] = useState([{ id: 0, name: "Standard", stock: 100 }]);

    const addVariant = () => {
        setVariants([...variants, { id: variants.length, name: "", stock: 0 }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/products">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-serif">Add New Product</h1>
                    <p className="text-muted-foreground">Fill in the details to add a new tea blend.</p>
                </div>
            </div>

            <form action={formAction} className="space-y-8 bg-card p-8 rounded-xl border border-border">

                {/* 1. Basic Info */}
                <div className="space-y-6">
                    <h3 className="font-semibold text-xl border-b pb-2 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                        Basic Info
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input id="name" name="name" placeholder="e.g. Royal Blue Tea" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input id="category" name="category" placeholder="e.g. Wellness" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL Identifier)</Label>
                        <Input id="slug" name="slug" placeholder="e.g. royal-blue-tea" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" placeholder="Detailed product description..." className="h-32" required />
                    </div>
                </div>

                {/* 2. Media & Details */}
                <div className="space-y-6">
                    <h3 className="font-semibold text-xl border-b pb-2 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                        Media & Details
                    </h3>

                    <div className="space-y-2">
                        <Label htmlFor="images">Product Images</Label>
                        <Input id="images" name="images" type="file" multiple accept="image/*" className="cursor-pointer" />
                        <p className="text-xs text-muted-foreground">Select multiple images. First one will be the main image.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="ingredients">Ingredients (One per line)</Label>
                            <Textarea id="ingredients" name="ingredients" placeholder="Butterfly Pea Flower&#10;Lemon&#10;Ginger" className="h-24" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="benefits">Health Benefits (One per line)</Label>
                            <Textarea id="benefits" name="benefits" placeholder="Antioxidant Rich&#10;Stress Relief&#10;Skin Glow" className="h-24" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (Comma separated)</Label>
                        <Input id="tags" name="tags" placeholder="caffeine-free, herbal, organic" />
                    </div>
                </div>

                {/* 3. Pricing */}
                <div className="space-y-6">
                    <h3 className="font-semibold text-xl border-b pb-2 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                        Pricing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price_inr">Price (INR)</Label>
                            <Input id="price_inr" name="price_inr" type="number" step="0.01" placeholder="₹ 599" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price_sar">Price (SAR)</Label>
                            <Input id="price_sar" name="price_sar" type="number" step="0.01" placeholder="﷼ 29" required />
                        </div>
                    </div>
                </div>

                {/* 4. Variants */}
                <div className="space-y-6">
                    <h3 className="font-semibold text-xl border-b pb-2 flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                            Variants
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Variant
                        </Button>
                    </h3>

                    <div className="space-y-3">
                        {variants.map((variant, index) => (
                            <div key={variant.id} className="flex items-end gap-4 p-4 bg-muted/20 rounded-lg border">
                                <div className="flex-1 space-y-2">
                                    <Label className="text-xs">Variant Name</Label>
                                    <Input
                                        name={`variant_name_${index}`}
                                        placeholder="e.g. 50g Box"
                                        defaultValue={variant.name}
                                    />
                                </div>
                                <div className="w-32 space-y-2">
                                    <Label className="text-xs">Stock</Label>
                                    <Input
                                        name={`variant_stock_${index}`}
                                        type="number"
                                        placeholder="0"
                                        defaultValue={variant.stock}
                                    />
                                </div>
                                {variants.length > 1 && (
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeVariant(index)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Settings */}
                <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_bestseller" name="is_bestseller" className="w-4 h-4 rounded border-gray-300 accent-primary" />
                        <Label htmlFor="is_bestseller" className="cursor-pointer">Mark as Bestseller</Label>
                    </div>
                </div>

                {/* Error Banner */}
                {state?.error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md font-medium text-center border border-destructive/20">
                        {state.error}
                    </div>
                )}

                <div className="flex justify-end gap-4 pt-4">
                    <Button variant="outline" asChild>
                        <Link href="/admin/products">Cancel</Link>
                    </Button>
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}
