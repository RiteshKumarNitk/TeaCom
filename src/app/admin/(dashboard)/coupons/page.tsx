import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin/auth";
import Link from "next/link";
import { Plus, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
    await requireAdmin("manage_marketing"); // Assuming marketing manages coupons
    const supabase = await createClient();

    const { data: coupons, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return <div className="p-8 text-red-500">Error loading coupons: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Coupons</h1>
                    <p className="text-muted-foreground">Manage discounts and promo codes.</p>
                </div>
                <Button asChild className="bg-primary text-white">
                    <Link href="/admin/coupons/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Coupon
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead>Code</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead>Expiry</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!coupons || coupons.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No coupons found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            coupons.map((coupon: any) => {
                                const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
                                const isActive = coupon.is_active && !isExpired;

                                return (
                                    <TableRow key={coupon.id} className="hover:bg-muted/20">
                                        <TableCell className="font-mono font-bold text-base flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-muted-foreground" />
                                            {coupon.code}
                                        </TableCell>
                                        <TableCell>
                                            {coupon.discount_type === 'percentage'
                                                ? `${coupon.discount_value}%`
                                                : `₹${coupon.discount_value}`
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {isActive ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                                                    {isExpired ? "Expired" : "Inactive"}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {coupon.usage_count} / {coupon.usage_limit || "∞"}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {coupon.expires_at ? format(new Date(coupon.expires_at), "MMM d, yyyy") : "No Expiry"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
