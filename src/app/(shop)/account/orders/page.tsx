import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageOpen } from "lucide-react";

export default async function OrdersPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: orders, error } = await supabase
        .from("orders")
        .select(`
            *,
            order_items (
                *,
                product:products(name, slug, images)
            )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) {
        // If RLS fails, this error will show
        return <div className="text-red-500 p-8">Error loading orders: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-serif font-bold text-gray-900">My Orders</h1>
                <Link href="/shop">
                    <Button variant="outline">Start Shopping</Button>
                </Link>
            </div>

            {!orders || orders.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border/60">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <PackageOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No orders yet</h3>
                    <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
                    <Link href="/shop">
                        <Button>Browse Products</Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order: any) => (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-gray-50/50 p-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center text-sm">
                                <div className="space-y-1">
                                    <div className="text-muted-foreground">Order Placed</div>
                                    <div className="font-medium text-gray-900">{format(new Date(order.created_at), "MMM d, yyyy")}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-muted-foreground">Total</div>
                                    <div className="font-medium text-gray-900">{order.currency} {order.total_amount}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-muted-foreground">Order #</div>
                                    <div className="font-mono text-gray-900">{order.id.slice(0, 8)}</div>
                                </div>
                                <div className="ml-auto flex gap-3 items-center">
                                    <StatusBadge status={order.status} />
                                    <Link href={`/account/orders/${order.id}`}>
                                        <Button variant="outline" size="sm">View Details</Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                {order.order_items.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-md border border-gray-200 overflow-hidden flex-shrink-0">
                                            {item.product?.images?.[0] && (
                                                <img src={item.product.images[0]} alt={item.product_name} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 truncate">{item.product_name}</h4>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            {item.currency} {item.price_amount}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
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
