import { supabaseAdmin } from "@/lib/supabase/admin";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { updateOrderStatus, updateOrderTracking } from "../actions"; // We'll adjust import path
import { Badge } from "@/components/ui/badge";
import { ExportActions } from "./export-actions";
import { AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // 1. Fetch Order (No Joins to avoid schema relationship errors)
    const { data: orderData, error: orderError } = await (supabaseAdmin as any)
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

    if (orderError || !orderData) {
        const error = orderError;
        // ... error UI (kept same) ...
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <div className="bg-destructive/10 p-4 rounded-full">
                    <AlertCircle className="w-12 h-12 text-destructive" />
                </div>
                <h2 className="text-xl font-bold">Failed to load order</h2>
                <div className="max-w-md text-center text-muted-foreground">
                    <p className="mb-2">We couldn't find order ID: <code className="bg-muted px-1 rounded text-xs">{id}</code></p>
                    <div className="bg-slate-900 text-slate-50 text-xs p-4 rounded text-left overflow-auto font-mono">
                        {error ? error.message : "No data returned"}
                    </div>
                </div>
                <div className="text-sm bg-yellow-50 text-yellow-800 p-4 rounded-md max-w-lg border border-yellow-200">
                    <strong>Troubleshooting:</strong> If you see "No data returned", it means the Admin Client lacks the Service Role Key.
                    Please ensure valid <code>SUPABASE_SERVICE_ROLE_KEY</code> is in your <code>.env</code> file.
                </div>
                <Button asChild variant="outline">
                    <a href="/admin/orders">Back to Orders</a>
                </Button>
            </div>
        );
    }

    // 2. Fetch Order Items Separately
    const { data: orderItems } = await (supabaseAdmin as any)
        .from("order_items")
        .select("*")
        .eq("order_id", orderData.id);

    // 3. Fetch Profile Separately
    let profile: any = null;
    if (orderData.user_id) {
        const { data: p } = await (supabaseAdmin as any)
            .from("profiles")
            .select("*")
            .eq("id", orderData.user_id)
            .single();
        profile = p;
    }

    // Combine data
    const order = {
        ...orderData,
        order_items: orderItems || []
    };

    const timeline = [
        { status: "pending", date: order.created_at, label: "Order Placed" },
        // We'd ideally query audit logs here to get real timestamps for other statuses
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
                            Order <span className="text-muted-foreground font-mono text-xl">#{order.id.slice(0, 8)}</span>
                        </h1>
                        <StatusBadge status={order.status} className="text-sm px-3 py-0.5" />
                    </div>
                    <p className="text-muted-foreground mt-1">
                        Placed on {format(new Date(order.created_at), "PPP p")}
                    </p>
                </div>
                <div className="flex gap-2">
                    <ExportActions order={order} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Items & Payment */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items Table */}
                    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
                            <h2 className="font-semibold text-lg text-gray-900">Items Ordered</h2>
                            <Badge variant="secondary" className="font-mono text-xs">{order.order_items.length} items</Badge>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50%]">Product Details</TableHead>
                                    <TableHead className="text-right">Unit Price</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.order_items.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex gap-3 items-start">
                                                {/* Placeholder for Product Image if available in future join */}
                                                <div className="w-10 h-10 bg-gray-100 rounded-md border flex-shrink-0" />
                                                <div>
                                                    <div className="font-medium text-gray-900">{item.product_name}</div>
                                                    {item.variant_id && (
                                                        <div className="text-xs text-muted-foreground font-mono mt-0.5">Variant: {item.variant_id.split('-')[0]}...</div>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-gray-600">
                                            {item.currency} {item.price_amount}
                                        </TableCell>
                                        <TableCell className="text-center text-gray-900 font-medium">{item.quantity}</TableCell>
                                        <TableCell className="text-right font-bold text-gray-900">
                                            {item.currency} {(item.price_amount * item.quantity).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Order Summary Footer */}
                        <div className="p-6 bg-gray-50/50 space-y-3 border-t">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>{order.currency} {order.total_amount}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <span className="font-bold text-gray-900">Total Paid</span>
                                <span className="text-2xl font-serif font-bold text-gray-900">{order.currency} {order.total_amount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer & Shipping Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Shipping Address Card */}
                        <div className="bg-white border rounded-xl shadow-sm flex flex-col">
                            <div className="p-5 border-b bg-gray-50/30">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <span>📍</span> Shipping Address
                                </h3>
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
                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Country</span>
                                            <span className="font-medium text-gray-900">{order.shipping_address.country}</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-muted-foreground italic py-4">No shipping address recorded.</div>
                                )}
                            </div>
                        </div>

                        {/* Customer Contact Card */}
                        <div className="bg-white border rounded-xl shadow-sm flex flex-col">
                            <div className="p-5 border-b bg-gray-50/30">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <span>👤</span> Customer Profile
                                </h3>
                            </div>
                            <div className="p-5 flex-1 space-y-4">
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Name</label>
                                    <div className="font-medium text-gray-900">
                                        {profile?.full_name || order.shipping_address?.fullName || "Guest"}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Email Address</label>
                                    <a href={`mailto:${order.email}`} className="text-primary hover:underline font-medium break-all">
                                        {order.email}
                                    </a>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">Phone Number</label>
                                    <div className="font-medium text-gray-900">
                                        {/* Use profile phone if available, else order phone, else - */}
                                        {profile?.phone || order.phone ? (
                                            <a href={`tel:${profile?.phone || order.phone}`} className="hover:text-primary">
                                                {profile?.phone || order.phone}
                                            </a>
                                        ) : (
                                            <span className="text-muted-foreground italic">Not provided</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1">User Status</label>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="capitalize">
                                            {order.user_id ? "Registered Member" : "Guest Checkout"}
                                        </Badge>
                                        {order.user_id && (
                                            <span className="text-xs text-muted-foreground font-mono" title={order.user_id}>
                                                ID: {order.user_id.slice(0, 8)}...
                                            </span>
                                        )}
                                    </div>
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
                        <div className="space-y-4">
                            <OrderWorkflowActions orderId={order.id} status={order.status} />
                        </div>
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
        delivered: [],
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
