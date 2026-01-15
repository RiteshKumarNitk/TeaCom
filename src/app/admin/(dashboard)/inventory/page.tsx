import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
    const supabase = await createClient();

    // Fetch from View
    const { data: alerts, error } = await (supabase as any)
        .from("low_stock_alerts")
        .select("*")
        .order("stock", { ascending: true });

    if (error) {
        return <div className="text-red-500">Failed to load inventory alerts: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Inventory Alerts</h1>
                    <p className="text-muted-foreground">Products with stock monitoring enabled (low stock).</p>
                </div>
                <Button variant="outline">Refresh</Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
                <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-2 text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                    <span className="font-semibold">Low Stock Items ({alerts?.length || 0})</span>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-white">
                            <TableHead>Product</TableHead>
                            <TableHead>Variant</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead className="text-right">Current Stock</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!alerts || alerts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    All stock levels are healthy.
                                </TableCell>
                            </TableRow>
                        ) : (
                            alerts.map((item: any) => (
                                <TableRow key={item.variant_id}>
                                    <TableCell className="font-medium">{item.product_name}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.variant_name}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">{item.sku || "-"}</TableCell>
                                    <TableCell className="text-right font-bold text-red-600">
                                        {item.stock}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {item.stock === 0 ?
                                            <Badge variant="destructive">Out of Stock</Badge> :
                                            <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">Low Stock</Badge>
                                        }
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="secondary" className="h-7">Restock</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
