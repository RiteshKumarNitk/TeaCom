
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
    const supabase = await createClient();

    // Fetch deep data for analytics
    const { data: orders, error } = await (supabase as any)
        .from("orders")
        .select(`
            *,
            order_items (
                quantity,
                price_amount,
                product:products(name, category, id)
            )
        `)
        .order("created_at", { ascending: false });

    if (error || !orders) {
        return <div>Error loading analytics</div>;
    }

    // Aggregations
    const countryStats: Record<string, number> = { "in": 0, "sa": 0 };
    const categoryStats: Record<string, number> = {};
    const productStats: Record<string, number> = {};

    orders.forEach((order: any) => {
        // Country
        const country = order.shipping_address?.country || "unknown";
        if (countryStats[country] !== undefined) {
            countryStats[country] += Number(order.total_amount); // Simplified currency mixing for MVP demo
        }

        // Categories & Products
        order.order_items?.forEach((item: any) => {
            // Category Revenue
            const cat = item.product?.category || "Uncategorized";
            categoryStats[cat] = (categoryStats[cat] || 0) + (item.quantity * item.price_amount);

            // Product Quantity
            const prodName = item.product?.name || "Unknown Product";
            productStats[prodName] = (productStats[prodName] || 0) + item.quantity;
        });
    });

    // Formatting for Charts
    const sortedCategories = Object.entries(categoryStats)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    const sortedProducts = Object.entries(productStats)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5

    const totalRevenue = Object.values(countryStats).reduce((a, b) => a + b, 0);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-serif font-bold">Detailed Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Revenue by Country (Donut/Pie-ish representation) */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-6">Revenue by Region</h2>
                    <div className="flex items-center gap-8">
                        <div className="relative w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center">
                            {/* Simple CSS Conic Gradient for Pie Chart */}
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: `conic-gradient(var(--color-primary) ${(countryStats['in'] / totalRevenue) * 100}%, #eab308 0)`
                                }}
                            />
                            <div className="absolute inset-2 bg-card rounded-full flex items-center justify-center z-10">
                                <span className="text-xs font-medium text-muted-foreground">Total</span>
                            </div>
                        </div>
                        <div className="space-y-4 flex-1">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-primary" />
                                    <span className="text-sm">India (INR)</span>
                                </div>
                                <span className="font-bold">{((countryStats['in'] / totalRevenue) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <span className="text-sm">Saudi Arabia (SAR)</span>
                                </div>
                                <span className="font-bold">{((countryStats['sa'] / totalRevenue) * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Revenue by Category (Horizontal Bar) */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold mb-6">Top Categories</h2>
                    <div className="space-y-4">
                        {sortedCategories.map((cat, idx) => (
                            <div key={cat.name} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>{cat.name}</span>
                                    <span className="text-muted-foreground">{((cat.value / totalRevenue) * 100).toFixed(1)}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary"
                                        style={{ width: `${(cat.value / sortedCategories[0].value) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products (List) */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm md:col-span-2">
                    <h2 className="text-lg font-bold mb-6">Top Selling Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                        {sortedProducts.map((prod, idx) => (
                            <div key={prod.name} className="bg-muted/20 p-4 rounded-lg border border-border flex flex-col items-center text-center">
                                <div className="text-2xl font-bold text-primary mb-1">{prod.value}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Units Sold</div>
                                <div className="font-medium text-sm line-clamp-2">{prod.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
