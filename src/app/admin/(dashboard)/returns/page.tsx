import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ReturnActions } from "./return-actions";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function ReturnsPage() {
    await requireAdmin("manage_orders");
    const supabase = await createClient();

    // Fetch returns with order details
    // Note: Using 'any' cast because TS types for joined text tables (orders) might be tricky without full generation
    const { data: returns, error } = await (supabase as any)
        .from("returns")
        .select(`
            *,
            orders (
                id,
                total_amount,
                currency,
                email
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        return <div className="text-red-500">Failed to load returns: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Returns Management</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead>Date</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Refund Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!returns || returns.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No return requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            returns.map((req: any) => (
                                <TableRow key={req.id}>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {format(new Date(req.created_at), "MMM d, yyyy")}
                                    </TableCell>
                                    <TableCell>
                                        <Link href={`/admin/orders/${req.order_id}`} className="text-blue-600 hover:underline font-mono text-sm">
                                            #{req.order_id.slice(0, 8)}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {req.orders?.email || "Guest"}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={req.reason}>
                                        {req.reason}
                                    </TableCell>
                                    <TableCell>
                                        <ReturnStatusBadge status={req.status} />
                                    </TableCell>
                                    <TableCell>
                                        {req.refund_amount ? (
                                            <span className="font-mono text-sm">
                                                {req.orders?.currency} {req.refund_amount}
                                            </span>
                                        ) : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ReturnActions id={req.id} currentStatus={req.status} />
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

function ReturnStatusBadge({ status }: { status: string }) {
    switch (status) {
        case "requested":
            return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Requested</Badge>;
        case "approved":
            return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Approved</Badge>;
        case "rejected":
            return <Badge variant="destructive">Rejected</Badge>;
        case "received":
            return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Received</Badge>;
        case "refunded":
            return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Refunded</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}
