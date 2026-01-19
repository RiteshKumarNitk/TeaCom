import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { AlertTriangle, ArrowRight } from "lucide-react";

export async function LowStockAlerts() {
    // Fetch low stock items
    // If the view low_stock_alerts is not accessible or types are missing, we can query manually or use the view with 'any'
    const { data: alerts, error } = await (supabaseAdmin as any)
        .from('low_stock_alerts')
        .select('*')
        .order('stock', { ascending: true })
        .limit(5);

    if (error) {
        console.error("Failed to fetch low stock alerts", error);
        return null;
    }

    if (!alerts || alerts.length === 0) {
        return (
            <Card className="h-full border-dashed">
                <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                        <AlertTriangle className="h-4 w-4" />
                        Low Stock Alerts
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[150px] text-muted-foreground text-sm">
                    All stock levels are healthy.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full border-orange-200 bg-orange-50/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-base font-semibold text-orange-900 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    Low Stock Alerts
                </CardTitle>
                <Link href="/admin/inventory" className="text-xs font-medium text-orange-600 hover:text-orange-800 flex items-center gap-1">
                    View All <ArrowRight className="h-3 w-3" />
                </Link>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {alerts.map((item: any) => (
                        <div key={item.variant_id} className="flex items-center justify-between">
                            <div className="flex-1 min-w-0 pr-4">
                                <p className="text-sm font-medium text-gray-900 truncate" title={item.product_name}>{item.product_name}</p>
                                <p className="text-xs text-muted-foreground truncate">{item.variant_name} • SKU: {item.sku || 'N/A'}</p>
                            </div>
                            <Badge variant="outline" className={`${item.stock === 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-orange-50 text-orange-700 border-orange-200'} whitespace-nowrap`}>
                                {item.stock === 0 ? 'Out of Stock' : `${item.stock} left`}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
