import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { Mail, ShoppingBag } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface CustomerMetric {
    email: string;
    fullName: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
    currency: string;
}

export default async function AdminCustomersPage() {
    const supabase = await createClient();

    // Fetch all orders to aggregate customer data
    // In a massive scale app, this should be a SQL View or RPC.
    // For now, in-memory aggregation is fine for < 10,000 orders.
    const { data: orders, error } = await (supabase as any)
        .from("orders")
        .select("email, total_amount, currency, created_at, shipping_address")
        .order("created_at", { ascending: false });

    if (error) {
        return <div className="p-8 text-red-500">Error loading customers: {error.message}</div>;
    }

    // Aggregate Data
    const customerMap = new Map<string, CustomerMetric>();

    orders?.forEach((order: any) => {
        const email = order.email.toLowerCase();

        if (!customerMap.has(email)) {
            customerMap.set(email, {
                email: order.email,
                fullName: order.shipping_address?.fullName || "Guest",
                totalOrders: 0,
                totalSpent: 0,
                lastOrderDate: order.created_at,
                currency: order.currency // Assumption: mainly one currency per user, or we take latest
            });
        }

        const customer = customerMap.get(email)!;
        customer.totalOrders += 1;
        // Simple addition ignoring currency conversion for MVP (or assume mostly one region per user)
        customer.totalSpent += Number(order.total_amount);
    });

    const customers = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold">Customers</h1>
                <div className="text-sm text-muted-foreground">
                    Total Unique: <span className="font-bold text-foreground">{customers.length}</span>
                </div>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4 text-center">Orders</th>
                                <th className="px-6 py-4">Total Spent (LTV)</th>
                                <th className="px-6 py-4">Last Active</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {customers.length > 0 ? (
                                customers.map((customer) => (
                                    <tr key={customer.email} className="hover:bg-muted/10 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-foreground">{customer.fullName}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> {customer.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                {customer.totalOrders}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-emerald-700">
                                            {customer.currency} {customer.totalSpent.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {format(new Date(customer.lastOrderDate), "MMM d, yyyy")}
                                        </td>
                                        <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/customers/${encodeURIComponent(customer.email)}`}
                                                className="text-primary hover:underline text-xs"
                                            >
                                                View History
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No customers found yet.
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
