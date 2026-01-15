import { createClient } from "@/lib/supabase/client";

export interface DailyRevenue {
    date: string;
    revenue: number;
    orders: number;
}

export class AnalyticsService {
    private supabase = createClient();

    async getDailyRevenue(days = 30): Promise<DailyRevenue[]> {
        // In a real app, we'd potentially use a Postgres Function or a consolidated 'analytics' table.
        // For MVP, we'll fetch orders from the last N days and aggregate in JS.

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data: orders, error } = await this.supabase
            .from('orders')
            .select('created_at, total_amount, currency')
            .gte('created_at', startDate.toISOString())
            .neq('status', 'cancelled'); // Exclude cancelled

        if (error) {
            console.error("Error fetching analytics:", error);
            return [];
        }

        // Aggregate
        const acc: Record<string, { revenue: number, orders: number }> = {};

        // Init last 30 days with 0
        for (let i = 0; i < days; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            acc[key] = { revenue: 0, orders: 0 };
        }

        orders.forEach(order => {
            const date = new Date(order.created_at).toISOString().split('T')[0];
            if (acc[date]) {
                acc[date].orders += 1;
                // Simple currency handling: Assume Inr as base or just sum raw if single currency.
                // If mixed, we need conversion. For now, assuming primarily one currency or summing raw IDR/SAR.
                acc[date].revenue += order.total_amount;
            }
        });

        return Object.entries(acc)
            .map(([date, val]) => ({
                date,
                revenue: val.revenue,
                orders: val.orders
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }
}

export const analyticsService = new AnalyticsService();
