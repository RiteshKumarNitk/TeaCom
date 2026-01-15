import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { updateOrderStatus, updateOrderTracking } from "../actions"; // We'll adjust import path
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Fetch Order with Items & Profile
    // We cast to 'any' for the join to avoid complex TS mapping of generic joins
    const { data: order, error } = await (supabase as any)
        .from("orders")
        .select(`
            *,
            order_items (*),
            profiles:user_id (*)
        `)
        .eq("id", id)
        .single();

    if (error || !order) {
        notFound();
    }

    // 2. Compute timeline mock (later we can fetch audit logs for this order specifically)
    const timeline = [
        { status: "pending", date: order.created_at, label: "Order Placed" },
        // We'd ideally query audit logs here to get real timestamps for other statuses
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
                        Order <span className="text-muted-foreground font-mono text-xl">#{order.id.slice(0, 8)}</span>
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Placed on {format(new Date(order.created_at), "PPP p")}
                    </p>
                </div>
                <StatusBadge status={order.status} className="text-lg px-4 py-1" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Items & Payment */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items Table */}
                    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b bg-gray-50/50">
                            <h2 className="font-semibold text-lg">Order Items ({order.order_items.length})</h2>
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
                                            <div className="font-medium">{item.product_name}</div>
                                            {item.variant_id && (
                                                <div className="text-xs text-muted-foreground">Variant ID: {item.variant_id}</div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {item.currency} {item.price_amount}
                                        </TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {item.currency} {item.price_amount * item.quantity}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="p-6 bg-gray-50/50 flex justify-end gap-3 items-center">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span className="text-2xl font-bold">{order.currency} {order.total_amount}</span>
                        </div>
                    </div>

                    {/* Customer & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                📦 Shipping Address
                            </h3>
                            <div className="text-sm space-y-1 text-gray-600">
                                <p className="font-medium text-gray-900">{order.shipping_address?.fullName}</p>
                                <p>{order.shipping_address?.addressLine1}</p>
                                <p>{order.shipping_address?.city}, {order.shipping_address?.state}</p>
                                <p>{order.shipping_address?.postalCode}</p>
                                <p className="uppercase text-xs font-bold text-gray-400 mt-2">{order.shipping_address?.country}</p>
                            </div>
                        </div>

                        <div className="bg-white border rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                👤 Customer Profile
                            </h3>
                            <div className="text-sm space-y-2">
                                <div className="grid grid-cols-[80px_1fr]">
                                    <span className="text-muted-foreground">Name:</span>
                                    <span className="font-medium">{order.shipping_address?.fullName}</span>
                                </div>
                                <div className="grid grid-cols-[80px_1fr]">
                                    <span className="text-muted-foreground">Email:</span>
                                    <span>{order.email}</span>
                                </div>
                                <div className="grid grid-cols-[80px_1fr]">
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span>{order.phone || "-"}</span>
                                </div>
                                <div className="grid grid-cols-[80px_1fr]">
                                    <span className="text-muted-foreground">User ID:</span>
                                    <span className="font-mono text-xs truncate" title={order.user_id || "Guest"}>
                                        {order.user_id ? order.user_id.slice(0, 8) + '...' : 'Guest'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-8">
                    {/* Status Card */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm ring-1 ring-black/5">
                        <h3 className="font-semibold mb-4">Update Status</h3>
                        <form action={async () => {
                            "use server";
                            // We need a JS handler to capture the select value if we use a native select
                            // or better, distinct buttons for workflow steps
                        }} className="space-y-4">
                            <OrderWorkflowActions orderId={order.id} status={order.status} />
                        </form>
                    </div>

                    {/* Fulfillment Card */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm ring-1 ring-black/5">
                        <h3 className="font-semibold mb-4">Fulfillment Details</h3>
                        <form action={updateOrderTracking} className="space-y-4">
                            <input type="hidden" name="orderId" value={order.id} />

                            <div className="space-y-2">
                                <Label htmlFor="courierName">Courier Name</Label>
                                <Input
                                    id="courierName"
                                    name="courierName"
                                    defaultValue={order.courier_name || ""}
                                    placeholder="e.g. FedEx, BlueDart"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="trackingNumber">Tracking Number</Label>
                                <Input
                                    id="trackingNumber"
                                    name="trackingNumber"
                                    defaultValue={order.tracking_number || ""}
                                    placeholder="Order tracking ID"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Admin Notes</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    defaultValue={order.notes || ""}
                                    placeholder="Internal notes about this order..."
                                    className="min-h-[100px]"
                                />
                            </div>

                            <Button type="submit" className="w-full">Save Tracking Info</Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Client Component for Status Actions could be extracted, but here's a helper for now
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

// Simple workflow buttons based on current status
function OrderWorkflowActions({ orderId, status }: { orderId: string, status: string }) {
    const nextSteps: Record<string, { label: string, status: string, variant?: "default" | "secondary" | "destructive" | "outline" }[]> = {
        pending: [
            { label: "Mark as Paid", status: "paid" },
            { label: "Cancel Order", status: "cancelled", variant: "destructive" }
        ],
        paid: [
            { label: "Mark Packed", status: "packed" },
            { label: "Cancel Order", status: "cancelled", variant: "destructive" }
        ],
        packed: [
            { label: "Mark Shipped", status: "shipped" }
        ],
        shipped: [
            { label: "Mark Delivered", status: "delivered" }
        ],
        delivered: [
            { label: "Process Return", status: "returned", variant: "secondary" }
        ],
        returned: [
            { label: "Refund Order", status: "refunded", variant: "outline" }
        ],
        cancelled: [],
        refunded: []
    };

    const steps = nextSteps[status] || [];

    if (steps.length === 0) return <div className="text-sm text-muted-foreground">No further actions available.</div>;

    return (
        <div className="flex flex-col gap-2">
            {steps.map((step) => (
                <form key={step.status} action={async () => {
                    "use server";
                    await updateOrderStatus(orderId, step.status);
                }}>
                    <Button
                        type="submit"
                        variant={step.variant || "default"}
                        className="w-full"
                    >
                        {step.label}
                    </Button>
                </form>
            ))}
        </div>
    );
}
