"use client";

import { cn } from "@/lib/utils";
import { DailyRevenue } from "@/services/analytics/analytics.service";

interface SalesChartProps {
    data: DailyRevenue[];
    className?: string;
}

export function SalesChart({ data, className }: SalesChartProps) {
    if (!data.length) return <div className="text-muted-foreground text-sm">No data available</div>;

    const maxRevenue = Math.max(...data.map(d => d.revenue));

    return (
        <div className={cn("w-full h-64 flex items-end gap-1 pt-6", className)}>
            {data.map((day) => {
                // Calculate height percentage (min 10% to show bar)
                const heightPercent = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;

                return (
                    <div
                        key={day.date}
                        className="flex-1 flex flex-col items-center group relative min-w-[20px]"
                    >
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs rounded-md shadow-md p-2 border z-10 whitespace-nowrap pointer-events-none">
                            <div className="font-semibold">{day.date}</div>
                            <div>Revenue: {day.revenue}</div>
                            <div>Orders: {day.orders}</div>
                        </div>

                        {/* Bar */}
                        <div
                            className="w-full bg-primary/20 hover:bg-primary rounded-t-md transition-all duration-300 relative"
                            style={{ height: `${Math.max(heightPercent, 2)}%` }} // Min height 2%
                        >
                            {/* Top Line Indicator */}
                            {heightPercent > 0 && (
                                <div className="w-full h-1 bg-primary absolute top-0 left-0 rounded-t-md opacity-50" />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
