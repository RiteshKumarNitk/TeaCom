"use client";

import { cn } from "@/lib/utils";
import { DailyRevenue } from "@/services/analytics/analytics.service";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface SalesChartProps {
    data: DailyRevenue[];
    className?: string;
}

export function SalesChart({ data, className }: SalesChartProps) {
    if (!data.length) return <div className="text-muted-foreground text-sm">No data available</div>;

    // Filter data to remove trailing zeroes if needed, or keep to show activity gaps
    // For visual clarity, we might format the date
    const formattedData = data.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));

    return (
        <div className={cn("w-full h-80", className)}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload as any;
                                return (
                                    <div className="bg-popover border border-border rounded-lg shadow-sm p-3 text-sm">
                                        <div className="font-semibold mb-1">{data.date}</div>
                                        <div className="flex justify-between gap-4">
                                            <span className="text-muted-foreground">Revenue:</span>
                                            <span className="font-medium text-emerald-600">
                                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data.revenue)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <span className="text-muted-foreground">Orders:</span>
                                            <span className="font-medium">{data.orders}</span>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar
                        dataKey="revenue"
                        fill="currentColor"
                        radius={[4, 4, 0, 0]}
                        className="fill-primary"
                        maxBarSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
