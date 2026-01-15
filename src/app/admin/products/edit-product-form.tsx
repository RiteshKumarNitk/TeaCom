"use client";

import { useState } from "react";
import { updateProduct } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ChevronLeft, Loader2, Plus, Trash2, X } from "lucide-react";
import { useFormStatus } from "react-dom";

interface EditProductFormProps {
    product: any; // Using any for speed, ideally typed properly
    priceINR: number;
    priceSAR: number;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full md:w-auto" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
        </Button>
    );
}

export function EditProductForm({ product, priceINR, priceSAR }: EditProductFormProps) {
    const [variants, setVariants] = useState(product.variants || []);

    // Parse arrays for textarea display
    const ingredientsText = product?.ingredients?.join("\n") || "";
    const benefitsText = product?.benefits?.join("\n") || "";
    const tagsText = product?.tags?.join(", ") || "";

    const addVariant = () => {
        // Use negative ID for new items to distinguish
        setVariants([...variants, { id: `new-${Date.now()}`, name: "", stock: 0 }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_: any, i: number) => i !== index));
    };

    return (
        <form action={updateProduct} className="space-y-8 bg-card p-8 rounded-xl border border-border">
            <input type="hidden" name="id" value={product.id} />

            {/* 1. Basic Info */}
            <div className="space-y-6">
                <h3 className="font-semibold text-xl border-b pb-2 flex items-center gap-2">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                    Basic Info
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input id="name" name="name" defaultValue={product.name} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input id="category" name="category" defaultValue={product.category} required />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL Identifier)</Label>
                    <Input id="slug" name="slug" defaultValue={product.slug} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" defaultValue={product.description} className="h-32" required />
                </div>
            </div>

            {/* 2. Media & Details */}
            <div className="space-y-6">
                <h3 className="font-semibold text-xl border-b pb-2 flex items-center gap-2">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                    Media & Details
                </h3>

                <div className="space-y-2">
                    <Label>Current Images</Label>
                    <div className="flex gap-2 flex-wrap mb-4">
                        {product.images?.map((img: string, i: number) => (
                            <img key={i} src={img} className="w-20 h-20 object-cover rounded border" />
                        ))}
                    </div>
                    <Label htmlFor="images">Append Images</Label>
                    <Input id="images" name="images" type="file" multiple accept="image/*" className="cursor-pointer" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="ingredients">Ingredients (One per line)</Label>
                        <Textarea id="ingredients" name="ingredients" defaultValue={ingredientsText} className="h-24" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="benefits">Health Benefits (One per line)</Label>
                        <Textarea id="benefits" name="benefits" defaultValue={benefitsText} className="h-24" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tags">Tags (Comma separated)</Label>
                    <Input id="tags" name="tags" defaultValue={tagsText} />
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
                        <Input id="price_inr" name="price_inr" type="number" step="0.01" defaultValue={priceINR} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price_sar">Price (SAR)</Label>
                        <Input id="price_sar" name="price_sar" type="number" step="0.01" defaultValue={priceSAR} required />
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
                    {variants.map((variant: any, index: number) => (
                        <div key={variant.id} className="flex items-end gap-4 p-4 bg-muted/20 rounded-lg border">
                            <input type="hidden" name={`variant_id_${index}`} value={variant.id} />
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
                            <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeVariant(index)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                {/* Clean way to pass count to server */}
                <input type="hidden" name="variant_count" value={variants.length} />
            </div>

            {/* 5. Settings */}
            <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                    <input type="checkbox" id="is_bestseller" name="is_bestseller" defaultChecked={product.is_bestseller} className="w-4 h-4 rounded border-gray-300 accent-primary" />
                    <Label htmlFor="is_bestseller" className="cursor-pointer">Mark as Bestseller</Label>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" asChild>
                    <Link href="/admin/products">Cancel</Link>
                </Button>
                <SubmitButton />
            </div>
        </form>
    );
}
