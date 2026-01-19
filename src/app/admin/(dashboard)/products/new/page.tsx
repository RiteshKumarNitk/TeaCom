"use client";

import { useActionState, useState } from "react";
import { createProduct } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ChevronLeft, Loader2, Plus, Trash2, X, RefreshCw, Eraser } from "lucide-react";
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

const PREFIX_DATA = {
    name: "Premium Tea Blend",
    category: "Wellness",
    slug: "premium-tea-blend",
    description: "A meticulously crafted blend designed to soothe your senses and elevate your tea ritual. Sourced from the finest gardens.",
    ingredients: "Premium Tea Leaves\nNatural Herbs\nDried Flowers",
    benefits: "Rich in Antioxidants\nCalming Effect\nBoosts Immunity",
    tags: "premium, wellness, organic",
    price_inr: 599,
    price_sar: 29
};

const EMPTY_DATA = {
    name: "",
    category: "",
    slug: "",
    description: "",
    ingredients: "",
    benefits: "",
    tags: "",
    price_inr: "",
    price_sar: ""
};

export default function NewProductPage() {
    // @ts-ignore
    const [state, formAction] = useActionState(createProduct, initialState);

    // Form State with Prefix Data
    const [formData, setFormData] = useState<any>(PREFIX_DATA);

    // Variant State for Dynamic Fields
    const [variants, setVariants] = useState([{ id: 0, name: "Standard", stock: 100, weight_value: 50, weight_unit: 'g' }]);

    const addVariant = () => {
        setVariants([...variants, { id: variants.length, name: "", stock: 0, weight_value: 0, weight_unit: 'g' }]);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleClear = () => {
        setFormData(EMPTY_DATA);
        setVariants([{ id: 0, name: "", stock: 0, weight_value: 0, weight_unit: 'g' }]);
    };

    const handleLoadPrefix = () => {
        setFormData(PREFIX_DATA);
        setVariants([{ id: 0, name: "Standard", stock: 100, weight_value: 50, weight_unit: 'g' }]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
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
                <div className="ml-auto flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleLoadPrefix} title="Load Prefix Data">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Load Defaults
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleClear} title="Clear Form">
                        <Eraser className="w-4 h-4 mr-2" />
                        Clear Data
                    </Button>
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
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g. Royal Blue Tea"
                                required
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                name="category"
                                required
                                value={formData.category}
                                onChange={(e) => handleChange(e as any)}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="" disabled>Select a category</option>
                                <option value="Bestseller">Bestseller</option>
                                <option value="Sampler Pack">Sampler Pack</option>
                                <option value="Wellness">Wellness</option>
                                <option value="New Arrivals">New Arrivals</option>
                                <option value="Combo">Combo</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL Identifier)</Label>
                        <Input
                            id="slug"
                            name="slug"
                            placeholder="e.g. royal-blue-tea"
                            required
                            value={formData.slug}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Detailed product description..."
                            className="h-32"
                            required
                            value={formData.description}
                            onChange={handleChange}
                        />
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
                            <Textarea
                                id="ingredients"
                                name="ingredients"
                                placeholder="Butterfly Pea Flower&#10;Lemon&#10;Ginger"
                                className="h-24"
                                value={formData.ingredients}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="benefits">Health Benefits (One per line)</Label>
                            <Textarea
                                id="benefits"
                                name="benefits"
                                placeholder="Antioxidant Rich&#10;Stress Relief&#10;Skin Glow"
                                className="h-24"
                                value={formData.benefits}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (Comma separated)</Label>
                        <Input
                            id="tags"
                            name="tags"
                            placeholder="caffeine-free, herbal, organic"
                            value={formData.tags}
                            onChange={handleChange}
                        />
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
                            <Input
                                id="price_inr"
                                name="price_inr"
                                type="number"
                                step="0.01"
                                placeholder="₹ 599"
                                required
                                value={formData.price_inr}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price_sar">Price (SAR)</Label>
                            <Input
                                id="price_sar"
                                name="price_sar"
                                type="number"
                                step="0.01"
                                placeholder="﷼ 29"
                                required
                                value={formData.price_sar}
                                onChange={handleChange}
                            />
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
                            <div key={variant.id} className="flex items-end gap-4 p-4 bg-muted/20 rounded-lg border flex-wrap md:flex-nowrap">
                                <div className="flex-1 min-w-[200px] space-y-2">
                                    <Label className="text-xs">Variant Name</Label>
                                    <Input
                                        name={`variant_name_${index}`}
                                        placeholder="e.g. 50g Box"
                                        value={variant.name}
                                        onChange={(e) => {
                                            const newVariants = [...variants];
                                            newVariants[index].name = e.target.value;
                                            setVariants(newVariants);
                                        }}
                                    />
                                </div>
                                <div className="w-24 space-y-2">
                                    <Label className="text-xs">Weight</Label>
                                    <Input
                                        name={`variant_weight_value_${index}`}
                                        type="number"
                                        placeholder="50"
                                        value={variant.weight_value}
                                        onChange={(e) => {
                                            const newVariants = [...variants];
                                            newVariants[index].weight_value = parseFloat(e.target.value) || 0;
                                            setVariants(newVariants);
                                        }}
                                    />
                                </div>
                                <div className="w-24 space-y-2">
                                    <Label className="text-xs">Unit</Label>
                                    <select
                                        name={`variant_weight_unit_${index}`}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={variant.weight_unit}
                                        onChange={(e) => {
                                            const newVariants = [...variants];
                                            newVariants[index].weight_unit = e.target.value;
                                            setVariants(newVariants);
                                        }}
                                    >
                                        <option value="g">g</option>
                                        <option value="kg">kg</option>
                                        <option value="oz">oz</option>
                                        <option value="lb">lb</option>
                                    </select>
                                </div>
                                <div className="w-32 space-y-2">
                                    <Label className="text-xs">Stock</Label>
                                    <Input
                                        name={`variant_stock_${index}`}
                                        type="number"
                                        placeholder="0"
                                        value={variant.stock}
                                        onChange={(e) => {
                                            const newVariants = [...variants];
                                            newVariants[index].stock = parseInt(e.target.value) || 0;
                                            setVariants(newVariants);
                                        }}
                                    />
                                </div>
                                {variants.length > 1 && (
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive mb-0.5" onClick={() => removeVariant(index)}>
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
