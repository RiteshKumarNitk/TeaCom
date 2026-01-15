import { supabaseAdmin } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
    const { data: coupons, error } = await (supabaseAdmin as any)
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
                <Link href="/admin/coupons/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Coupon
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Coupons</CardTitle>
                </CardHeader>
                <CardContent>
                    {!coupons || coupons.length === 0 ? (
                        <p className="text-muted-foreground">No coupons found. Create one to get started.</p>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Discount</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {coupons.map((coupon: any) => (
                                        <TableRow key={coupon.id}>
                                            <TableCell className="font-mono font-bold">{coupon.code}</TableCell>
                                            <TableCell>{coupon.discount_percent}%</TableCell>
                                            <TableCell className="text-muted-foreground">{coupon.description || "-"}</TableCell>
                                            <TableCell>
                                                {coupon.is_active ?
                                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge> :
                                                    <Badge variant="outline">Inactive</Badge>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
