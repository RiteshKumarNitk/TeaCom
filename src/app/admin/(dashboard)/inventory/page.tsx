import { supabaseAdmin } from "@/lib/supabase/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InventoryAdjustDialog } from "./components/inventory-adjust-dialog";
import { InventoryHistoryDialog } from "./components/inventory-history-dialog";
import Link from "next/link";
import { History } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
    // Fetch Full Inventory using Admin Client
    const { data: inventoryItems, error } = await (supabaseAdmin as any)
        .from("inventory")
        .select(`
            stock,
            product_variants (
                id,
                name,
                sku,
                products (
                    id,
                    name,
                    slug
                )
            )
        `)
        .order("stock", { ascending: true });

    if (error) {
        return <div className="text-red-500">Failed to load inventory: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-muted-foreground">Manage stock levels for all products.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/admin/inventory/logs">
                            <History className="w-4 h-4 mr-2" />
                            View Logs
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead>Product</TableHead>
                            <TableHead>Variant</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead className="text-right">Stock Level</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!inventoryItems || inventoryItems.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No inventory records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            inventoryItems.map((item: any) => {
                                const variant = item.product_variants;
                                const product = variant?.products;
                                return (
                                    <TableRow key={variant?.id}>
                                        <TableCell className="font-medium">{product?.name || "Unknown Product"}</TableCell>
                                        <TableCell className="text-muted-foreground">{variant?.name}</TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">{variant?.sku || "-"}</TableCell>
                                        <TableCell className="text-right font-bold">
                                            {item.stock}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {item.stock === 0 ?
                                                <Badge variant="destructive">Out of Stock</Badge> :
                                                item.stock < 10 ?
                                                    <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">Low Stock</Badge> :
                                                    <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">In Stock</Badge>
                                            }
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <InventoryAdjustDialog
                                                    variantId={variant?.id}
                                                    productName={product?.name || "Unknown Product"}
                                                    variantName={variant?.name || "Default"}
                                                    currentStock={item.stock}
                                                />
                                                <InventoryHistoryDialog
                                                    variantId={variant?.id}
                                                    productName={product?.name || "Unknown Product"}
                                                    variantName={variant?.name || "Default"}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
