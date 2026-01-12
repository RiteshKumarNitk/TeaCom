import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function TrackOrderPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
    const params = await searchParams;
    const orderId = params.id;
    let order = null;

    if (orderId) {
        const supabase = await createClient();
        // Use 'any' cast to avoid TS issues for now
        const { data } = await (supabase as any)
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .single();
        order = data;
    }

    async function trackOrder(formData: FormData) {
        "use server";
        const id = formData.get("order_id");
        redirect(`/track?id=${id}`);
    }

    return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center min-h-[60vh]">
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">Track Your Order</h1>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
                Enter your Order ID (found in your confirmation email) to see current status.
            </p>

            <form action={trackOrder} className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mb-12">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input name="order_id" placeholder="e.g. 550e8400..." className="pl-9" defaultValue={orderId} required />
                </div>
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
                    Track
                </Button>
            </form>

            {orderId && !order && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
                    Order not found. Please check the ID and try again.
                </div>
            )}

            {order && (
                <div className="w-full max-w-2xl bg-white border border-blue-50 rounded-2xl p-8 shadow-lg">
                    <div className="flex justify-between items-start border-b pb-6 mb-6">
                        <div>
                            <h2 className="text-xl font-bold">Order Found</h2>
                            <p className="text-xs font-mono text-muted-foreground mt-1">ID: {order.id}</p>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Order Date:</span>
                            <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Amount:</span>
                            <span className="font-bold">{order.currency} {order.total_amount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping To:</span>
                            <span className="font-medium text-right">{order.shipping_address?.fullName || "Customer"}</span>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t">
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Tracking History</h3>
                        {/* Mock Timeline */}
                        <Timeline status={order.status} />
                    </div>
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
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${className} capitalize`}>
            {status}
        </span>
    );
}

function Timeline({ status }: { status: string }) {
    const steps = ["pending", "shipped", "delivered"];
    const currentStep = steps.indexOf(status) === -1 ? 0 : steps.indexOf(status);

    return (
        <div className="flex justify-between relative">
            {/* Thread Line */}
            <div className="absolute top-2 left-0 right-0 h-0.5 bg-gray-100 -z-10" />

            <TimelineStep label="Order Placed" active={true} />
            <TimelineStep label="Shipped" active={currentStep >= 1} />
            <TimelineStep label="Delivered" active={currentStep >= 2} />
        </div>
    )
}

function TimelineStep({ label, active }: { label: string, active: boolean }) {
    return (
        <div className="flex flex-col items-center gap-2 bg-white px-2">
            <div className={`w-4 h-4 rounded-full border-2 ${active ? "bg-green-500 border-green-500" : "bg-white border-gray-300"}`} />
            <span className={`text-xs ${active ? "font-bold text-gray-900" : "text-gray-400"}`}>{label}</span>
        </div>
    )
}
