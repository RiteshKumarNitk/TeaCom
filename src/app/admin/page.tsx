import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // Fetch Stats (Using 'any' cast workaround)
    const { count: orderCount, data: orders } = await (supabase as any)
        .from("orders")
        .select("total_amount, currency", { count: "exact" });

    const { count: productCount } = await (supabase as any)
        .from("products")
        .select("id", { count: "exact", head: true });

    // Calculate Total Revenue (Simple sum, handling currency naively for demo)
    // In real app, we'd convert SAR to INR or separate them. 
    // Here we just sum numeric values for simplicity.
    let totalRevenue = 0;
    if (orders) {
        totalRevenue = orders.reduce((acc: number, order: any) => acc + (Number(order.total_amount) || 0), 0);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, Admin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                    <p className="text-2xl font-bold mt-2">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalRevenue)}
                        <span className="text-xs font-normal text-muted-foreground ml-2">(Mixed Currencies)</span>
                    </p>
                </div>
                <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Orders</h3>
                    <p className="text-2xl font-bold mt-2">{orderCount || 0}</p>
                </div>
                <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Active Products</h3>
                    <p className="text-2xl font-bold mt-2">{productCount || 0}</p>
                </div>
            </div>
        </div>
    );
}
