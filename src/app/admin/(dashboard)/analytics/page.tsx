import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import AnalyticsDashboard from "./analytics-dashboard";
import { BarChart as BarChartIcon } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
    await requireAdmin("manage_finance");
    const supabase = await createClient();

    // 1. Fetch Revenue Stats (RPC)
    // Cast to any to bypass strict RPC arg matching if type definition is slightly off
    const { data: revenueData } = await (supabase.rpc as any)("get_revenue_stats", { days_lookback: 30 });

    // 2. Fetch Top Products (RPC)
    const { data: topProductsData } = await (supabase.rpc as any)("get_top_products", { limit_count: 5 });

    const revenueStats = revenueData || [];
    const topProducts = topProductsData || [];

    // 3. Calculate Summary
    // Explicitly handle potential nulls from RPC
    const totalRevenue = revenueStats.reduce((acc: number, curr: any) => acc + (Number(curr.revenue) || 0), 0);
    const totalOrders = revenueStats.reduce((acc: number, curr: any) => acc + (Number(curr.orders) || 0), 0);
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const summary = {
        totalRevenue,
        totalOrders,
        aov
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
                    <BarChartIcon className="w-8 h-8" />
                    Business Analytics
                </h1>
                <div className="text-sm text-muted-foreground">
                    Last 30 Days Performance
                </div>
            </div>

            <AnalyticsDashboard
                revenueStats={revenueStats as any}
                topProducts={topProducts as any}
                summary={summary}
            />
        </div>
    );
}
