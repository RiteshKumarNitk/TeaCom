import { createClient } from "@/lib/supabase/server";
import { analyticsService } from "@/services/analytics/analytics.service";
import { SalesChart } from "@/components/admin/sales-chart";
import { SendNotificationDialog } from "@/components/admin/notification-dialog";

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

    // Fetch Analytics
    const salesData = await analyticsService.getDailyRevenue(30);

    // Calculate Total Revenue from orders (or from salesData if preferable, but let's stick to original orders fetch for now)
    let totalRevenue = 0;
    if (orders) {
        totalRevenue = orders.reduce((acc: number, order: any) => acc + (Number(order.total_amount) || 0), 0);
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, Admin.</p>
                </div>
                <SendNotificationDialog />
            </div>

            {/* Stats Grid */}
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

            {/* Sales Chart */}
            <div className="p-6 bg-card border border-border rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-6">Revenue Trend (Last 30 Days)</h3>
                <SalesChart data={salesData} />
            </div>
        </div>
    );
}
