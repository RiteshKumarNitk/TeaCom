import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Trash2, Power } from "lucide-react";
import { deleteCoupon, toggleCouponStatus } from "./actions";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
    const supabase = await createClient();
    const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    const coupons = data as Database["public"]["Tables"]["coupons"]["Row"][] | null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold">Coupons</h1>
                <Button asChild>
                    <Link href="/admin/coupons/new">
                        <Plus className="w-4 h-4 mr-2" /> Create Coupon
                    </Link>
                </Button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Code</th>
                            <th className="px-6 py-4">Discount</th>
                            <th className="px-6 py-4">Usage</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {coupons && coupons.length > 0 ? (
                            coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-muted/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-mono font-bold text-base">{coupon.code}</div>
                                        <div className="text-xs text-muted-foreground">{coupon.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium">
                                            {coupon.discount_type === "percentage" ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                                        </span>
                                        {(coupon.min_order_amount ?? 0) > 0 && (
                                            <div className="text-xs text-muted-foreground">Min: ₹{coupon.min_order_amount}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {coupon.usage_count} uses
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {coupon.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <form action={toggleCouponStatus}>
                                            <input type="hidden" name="id" value={coupon.id} />
                                            <input type="hidden" name="current_status" value={String(coupon.is_active)} />
                                            <Button variant="ghost" size="icon" title="Toggle Status">
                                                <Power className={`w-4 h-4 ${coupon.is_active ? 'text-green-600' : 'text-gray-400'}`} />
                                            </Button>
                                        </form>
                                        <form action={deleteCoupon}>
                                            <input type="hidden" name="id" value={coupon.id} />
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </form>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                    No active coupons. Create one to get started!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
