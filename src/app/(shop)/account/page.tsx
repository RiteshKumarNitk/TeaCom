
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package, User } from "lucide-react";

export default async function AccountPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-serif font-bold text-gray-900">Dashboard</h1>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Welcome back, {user?.email?.split("@")[0] || "Tea Lover"}!
                        </h2>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link href="/account/orders" className="block">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Package className="w-4 h-4 text-primary" />
                                    Recent Orders
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">View and track your tea shipments.</p>
                            </CardContent>
                        </Card>
                    </Link>
                    {/* Add more cards like Addresses, etc. */}
                </div>
            </div>
        </div>
    );
}
