import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { EditProductForm } from "../edit-product-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    // Fetch Product with Prices and Variants
    const { data } = await supabase
        .from("products")
        .select(`
            *,
            prices:product_prices(amount, currency),
            variants:product_variants(*)
        `)
        .eq("id", id)
        .single();

    const product = data as any;

    if (!product) {
        redirect("/admin/products");
    }

    // Extract prices
    const priceINR = (product as any).prices?.find((p: any) => p.currency === "INR")?.amount || 0;
    const priceSAR = (product as any).prices?.find((p: any) => p.currency === "SAR")?.amount || 0;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/products">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-serif">Edit Product</h1>
                    <p className="text-muted-foreground">Update details for {product.name}</p>
                </div>
            </div>

            <EditProductForm
                product={product}
                priceINR={priceINR}
                priceSAR={priceSAR}
            />
        </div>
    );
}
