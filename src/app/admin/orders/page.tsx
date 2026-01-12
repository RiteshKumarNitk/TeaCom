import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { updateOrderStatus } from "./actions";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    const supabase = await createClient();

    // Fetch orders with explicit 'any' cast
    const { data: orders, error } = await (supabase as any)
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return <div className="p-8 text-red-500">Error loading orders: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold">Orders</h1>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {orders && orders.length > 0 ? (
                                orders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                                        <td className="px-6 py-4">
                                            {format(new Date(order.created_at), "MMM d, yyyy")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{order.email}</div>
                                            <div className="text-xs text-muted-foreground">{order.shipping_address?.fullName}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {order.currency} {order.total_amount}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <form action={async () => {
                                                "use server";
                                                // Simple toggle logic for demo: Pending -> Shipped -> Delivered
                                                let nextStatus = "shipped";
                                                if (order.status === "shipped") nextStatus = "delivered";
                                                await updateOrderStatus(order.id, nextStatus);
                                            }}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={order.status === "delivered" || order.status === "cancelled"}
                                                >
                                                    {order.status === "pending" && "Mark Shipped"}
                                                    {order.status === "shipped" && "Mark Delivered"}
                                                    {order.status === "delivered" && "Completed"}
                                                </Button>
                                            </form>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        paid: "bg-blue-100 text-blue-800 border-blue-200",
        shipped: "bg-purple-100 text-purple-800 border-purple-200",
        delivered: "bg-green-100 text-green-800 border-green-200",
        cancelled: "bg-red-100 text-red-800 border-red-200",
    };

    const className = styles[status] || "bg-gray-100 text-gray-800 border-gray-200";

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${className} capitalize`}>
            {status}
        </span>
    );
}
