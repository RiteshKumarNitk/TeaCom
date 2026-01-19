import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus, Pencil } from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { DeleteProductButton } from "./product-actions";

export default async function AdminProductsPage() {
    await requireAdmin("manage_products");
    const supabase = await createClient();

    // Fetch products with their pricing and variants (joining inventory for accurate stock)
    const { data: products } = await supabase
        .from("products")
        .select(`
            *,
            prices:product_prices(amount, currency),
            variants:product_variants(
                name, 
                weight_value, 
                weight_unit, 
                stock,
                inventory(stock)
            )
        `)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-serif">Products</h1>
                    <p className="text-muted-foreground">Manage your tea catalog</p>
                </div>
                <Button asChild className="bg-primary text-white">
                    <Link href="/admin/products/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Link>
                </Button>
            </div>

            <div className="bg-card rounded-xl border shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                        <tr>
                            <th className="p-4 pl-6">Product Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Variants</th>
                            <th className="p-4">Price (INR)</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right pr-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {products?.map((product: any) => {
                            const inrPrice = product.prices?.find((p: any) => p.currency === "INR")?.amount;
                            return (
                                <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="p-4 pl-6 font-medium text-foreground">
                                        <div className="flex items-center gap-3">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-10 h-10 rounded object-cover border"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                                                    Img
                                                </div>
                                            )}
                                            {product.name}
                                        </div>
                                    </td>
                                    <td className="p-4 capitalize">{product.category || "-"}</td>
                                    <td className="p-4 text-xs">
                                        {product.variants?.length > 0 ? (
                                            <div className="space-y-1">
                                                {product.variants.map((v: any, idx: number) => {
                                                    // Prefer inventory table stock, fallback to variant column
                                                    const realStock = v.inventory?.stock ?? v.stock;
                                                    return (
                                                        <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                                                            <span className="font-medium text-foreground">{v.name}</span>
                                                            <span>
                                                                {v.weight_value > 0 ? `(${v.weight_value}${v.weight_unit || 'g'})` : ''}
                                                            </span>
                                                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${realStock > 10 ? 'bg-green-100 text-green-700' : realStock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                                                                {realStock} left
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground italic">No variants</span>
                                        )}
                                    </td>
                                    <td className="p-4 font-mono">
                                        ₹{inrPrice || "N/A"}
                                    </td>
                                    <td className="p-4">
                                        {product.is_bestseller && (
                                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full font-bold mr-2">
                                                Bestseller
                                            </span>
                                        )}
                                        {product.is_new && (
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-bold">
                                                New
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/products/${product.id}`}>
                                                    <Pencil className="w-4 h-4 text-gray-500" />
                                                </Link>
                                            </Button>
                                            <DeleteProductButton id={product.id} />
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        {(!products || products.length === 0) && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    No products found. Add your first tea blend!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
