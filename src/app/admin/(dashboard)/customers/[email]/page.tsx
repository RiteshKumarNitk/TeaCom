
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { ArrowLeft, Box, Calendar, CreditCard, Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        email: string;
    }>;
}

export default async function CustomerDetailPage({ params }: PageProps) {
    const { email } = await params;

    // Decode email as it comes from URL
    const decodedEmail = decodeURIComponent(email);
    const supabase = await createClient();

    // Fetch all orders for this customer
    const { data: orders, error } = await (supabase as any)
        .from("orders")
        .select(`
            *,
            order_items (
                *,
                product:products(name, images)
            )
        `)
        .ilike("email", decodedEmail)
        .order("created_at", { ascending: false });

    if (error || !orders || orders.length === 0) {
        return notFound();
    }

    // Calculate Metrics
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum: number, order: any) => sum + Number(order.total_amount), 0);
    // Assuming mostly one currency for MVP display or just taking the most recent one
    const currency = orders[0]?.currency || "INR";
    const averageOrderValue = totalSpent / totalOrders;

    // Get latest shipping info (best effort user profile)
    const latestOrder = orders[0];
    const userProfile = {
        name: latestOrder.shipping_address?.fullName || "Guest",
        email: latestOrder.email,
        phone: latestOrder.phone || latestOrder.shipping_address?.phone || "N/A",
        address: latestOrder.shipping_address
            ? `${latestOrder.shipping_address.addressLine1}, ${latestOrder.shipping_address.city}, ${latestOrder.shipping_address.state}, ${latestOrder.shipping_address.country}`
            : "No address found"
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <Link
                href="/admin/customers"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Customers
            </Link>

            {/* Header Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                            {userProfile.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">{userProfile.name}</h1>
                            <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> {userProfile.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> {userProfile.phone}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> {userProfile.address}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="flex-1 md:flex-none bg-muted/30 rounded-lg p-4 border border-border">
                            <div className="text-sm text-muted-foreground mb-1">Total Spent</div>
                            <div className="text-2xl font-bold text-emerald-600">
                                {currency} {totalSpent.toFixed(2)}
                            </div>
                        </div>
                        <div className="flex-1 md:flex-none bg-muted/30 rounded-lg p-4 border border-border">
                            <div className="text-sm text-muted-foreground mb-1">Total Orders</div>
                            <div className="text-2xl font-bold text-blue-600">
                                {totalOrders}
                            </div>
                        </div>
                        <div className="flex-1 md:flex-none bg-muted/30 rounded-lg p-4 border border-border">
                            <div className="text-sm text-muted-foreground mb-1">Avg. Order Value</div>
                            <div className="text-2xl font-bold text-purple-600">
                                {currency} {averageOrderValue.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order History */}
            <div>
                <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-2">
                    <Box className="w-5 h-5" /> Order History
                </h2>
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Items</th>
                                <th className="px-6 py-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {orders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4 font-medium">
                                        <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                                            #{order.id.slice(0, 8)}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {format(new Date(order.created_at), "MMM d, yyyy")}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {order.order_items?.length || 0} items
                                        <div className="text-xs mt-1 truncate max-w-[200px]">
                                            {order.order_items?.map((i: any) => i.product_name).join(", ")}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium">
                                        {order.currency} {order.total_amount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        paid: "bg-blue-100 text-blue-800",
        shipped: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };

    return (
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${styles[status] || "bg-gray-100 text-gray-800"}`}>
            {status}
        </span>
    );
}
