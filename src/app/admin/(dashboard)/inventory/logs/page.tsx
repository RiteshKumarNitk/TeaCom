import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/admin/auth";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InventoryLogsPage() {
    await requireAdmin("manage_products");
    const supabase = await createClient();

    // Fetch logs with specific join syntax
    // Note: Joins in Supabase/PostgREST can be tricky with nested relations.
    // product_variants -> products
    const { data: logs, error } = await (supabase as any)
        .from("inventory_logs")
        .select(`
            *,
            variant:product_variants (
                name,
                products (
                    name
                )
            ),
            actor:actor_id (
                email
            )
        `)
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) {
        return <div className="p-8 text-red-500">Error loading logs: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/inventory" className="text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Inventory Logs</h1>
                    <p className="text-muted-foreground">Recent stock movements and adjustments.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead>Date</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Variant</TableHead>
                            <TableHead>Change</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Updated By</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!logs || logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No logs found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log: any) => {
                                const isPositive = log.change_amount > 0;
                                const isNegative = log.change_amount < 0;
                                return (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                            {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-900">
                                            {log.variant?.products?.name || "Unknown Product"}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {log.variant?.name || "Unknown Variant"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`
                                                    font-mono
                                                    ${isPositive ? "bg-green-50 text-green-700 border-green-200" : ""}
                                                    ${isNegative ? "bg-red-50 text-red-700 border-red-200" : ""}
                                                    ${!isPositive && !isNegative ? "bg-gray-50 text-gray-700" : ""}
                                                `}
                                            >
                                                {isPositive ? "+" : ""}{log.change_amount}
                                            </Badge>
                                            {/* Showing new total stock contextually if needed, e.g. -> {log.new_stock} */}
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate" title={log.reason}>
                                            {log.reason || "-"}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {log.actor?.email || "System/Unknown"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
