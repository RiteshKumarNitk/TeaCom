import { supabaseAdmin } from "@/lib/supabase/admin";
import { format } from "date-fns";
import { updateOrderStatus } from "./actions";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
    await requireAdmin("manage_orders");

    // Fetch orders with explicit 'any' cast, using Admin Client (Bypasses RLS)
    const { data: orders, error } = await (supabaseAdmin as any)
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return <div className="p-8 text-red-500">Error loading orders: {error.message}</div>;
    }

    const { getAdminRole } = await import("@/lib/admin/auth");
    const role = await getAdminRole();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold">Orders</h1>
                <div className="text-xs text-muted-foreground">Admin: {role || "None"}</div>
            </div>

            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50 text-gray-500 font-medium uppercase text-xs border-b">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders && orders.length > 0 ? (
                                orders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-mono font-medium text-gray-900">#{order.id.slice(0, 8)}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{order.payment_method || "Card"}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{format(new Date(order.created_at), "MMM d, yyyy")}</div>
                                            <div className="text-xs text-gray-500">{format(new Date(order.created_at), "p")}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{order.shipping_address?.fullName || order.email}</div>
                                            <div className="text-xs text-gray-500">{order.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-900">{order.currency} {order.total_amount}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {/* We link to the detail page instead of inline actions for main view */}
                                                <Link href={`/admin/orders/${order.id}`}>
                                                    <Button variant="outline" size="sm" className="h-8">View Details</Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                                <span>📦</span>
                                            </div>
                                            <p className="text-lg font-medium text-gray-900">No orders found</p>
                                            <p className="text-sm">New orders will appear here automatically.</p>
                                        </div>
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
