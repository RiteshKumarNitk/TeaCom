import { createClient } from "@/lib/supabase/server";
import { format, differenceInDays } from "date-fns";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, ArrowLeft, PackageCheck } from "lucide-react";
import Link from "next/link";
import { ReturnRequestDialog } from "./return-dialog";
import { ExportActions } from "@/app/admin/(dashboard)/orders/[id]/export-actions";

export const dynamic = "force-dynamic";

export default async function CustomerOrderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // 1. Fetch Order
    const { data: order, error } = await supabase
        .from("orders")
        .select(`
            *,
            order_items (*)
        `)
        .eq("id", id)
        .eq("user_id", user.id)
        .single() as any;

    if (error || !order) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 text-center">
                <div className="bg-red-50 p-4 rounded-full inline-block mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
                <p className="text-gray-600 mb-6">We couldn't find the order you are looking for.</p>
                <Link href="/account/orders">
                    <Button variant="outline">Back to My Orders</Button>
                </Link>
            </div>
        );
    }

    // Check if return exists
    const { data: existingReturn } = await supabase
        .from("returns")
        .select("status")
        .eq("order_id", order.id)
        .single() as any;

    // Check return window (3 days from created_at or better, from a 'delivered_at' field if we had it)
    const deliveredDate = new Date(order.created_at);
    const daysSinceOrder = differenceInDays(new Date(), deliveredDate);
    const isReturnExpired = daysSinceOrder > 10;

    return (
        <div className="max-w-4xl mx-auto py-8 space-y-8">
            {/* Header */}
            <div>
                <Link href="/account/orders" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Orders
                </Link>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
                            Order <span className="text-muted-foreground font-mono text-xl">#{order.id.slice(0, 8)}</span>
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            Placed on {format(new Date(order.created_at), "PPP p")}
                        </p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <ExportActions order={order} />

                        {order.status === "delivered" && !existingReturn && !isReturnExpired && (
                            <ReturnRequestDialog orderId={order.id} />
                        )}
                        {existingReturn && (
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                                Return {existingReturn.status}
                            </Badge>
                        )}
                        <StatusBadge status={order.status} className="text-lg px-4 py-1" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Items */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b bg-gray-50/50">
                            <h2 className="font-semibold text-lg text-gray-900">Items Ordered</h2>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-center">Qty</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.order_items.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="font-medium text-gray-900">{item.product_name}</div>
                                            {item.variant_id && (
                                                <div className="text-xs text-muted-foreground font-mono">Variant: {item.variant_id.split('-')[0]}...</div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {item.currency} {item.price_amount}
                                        </TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-right font-medium">
                                            {item.currency} {(item.price_amount * item.quantity).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="p-6 bg-gray-50/50 space-y-3 border-t">
                            <div className="flex justify-between items-center pt-2">
                                <span className="font-bold text-gray-900">Total</span>
                                <span className="text-xl font-serif font-bold text-gray-900">{order.currency} {order.total_amount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Activity / Tracking Info */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <PackageCheck className="w-5 h-5 text-gray-500" />
                            Order Status & Tracking
                        </h3>
                        {order.tracking_number ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-lg border">
                                        <div className="text-xs text-uppercase text-gray-500 font-semibold mb-1">Courier</div>
                                        <div className="font-medium">{order.courier_name || "Standard Shipping"}</div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg border">
                                        <div className="text-xs text-uppercase text-gray-500 font-semibold mb-1">Tracking Number</div>
                                        <div className="font-mono font-medium">{order.tracking_number}</div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">
                                    <p>Track your package on the {order.courier_name} website using the tracking number above.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-muted-foreground text-sm italic">
                                Tracking information will be available once your order is shipped.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Address */}
                <div className="space-y-6">
                    <div className="bg-white border rounded-xl shadow-sm flex flex-col">
                        <div className="p-5 border-b bg-gray-50/30">
                            <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                        </div>
                        <div className="p-5 flex-1 text-sm text-gray-600 space-y-1">
                            {order.shipping_address ? (
                                <>
                                    <div className="font-bold text-lg text-gray-900 mb-2">{order.shipping_address.fullName}</div>
                                    <div className="leading-relaxed">
                                        {order.shipping_address.addressLine1}
                                        <br />
                                        {order.shipping_address.city}, {order.shipping_address.state}
                                        <br />
                                        {order.shipping_address.postalCode}
                                    </div>
                                    <div className="mt-3 pt-3 border-t flex items-center gap-2">
                                        <span className="font-medium text-gray-900">{order.shipping_address.country}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-muted-foreground italic">No address provided.</div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white border rounded-xl shadow-sm flex flex-col p-5">
                        <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                        <p className="text-sm text-gray-600 mb-4">If you have any issues with your order, please contact our support team.</p>
                        <Button variant="outline" className="w-full" asChild>
                            <a href="/contact">Contact Support</a>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status, className }: { status: string, className?: string }) {
    const styles: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        paid: "bg-blue-100 text-blue-800 border-blue-200",
        packed: "bg-indigo-100 text-indigo-800 border-indigo-200",
        shipped: "bg-purple-100 text-purple-800 border-purple-200",
        delivered: "bg-green-100 text-green-800 border-green-200",
        returned: "bg-orange-100 text-orange-800 border-orange-200",
        refunded: "bg-pink-100 text-pink-800 border-pink-200",
        cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return (
        <Badge variant="outline" className={`${styles[status] || "bg-gray-100"} capitalize ${className}`}>
            {status}
        </Badge>
    );
}
