import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signout } from "../auth/actions";

export default async function AccountPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch Profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // Explicitly cast to avoid never inference
    const profileData = profile as any;

    // Fetch Recent Orders (Mock Orders if table fails, or real if schema matches)
    // Using simple query
    const { data: orders } = await (supabase as any)
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row gap-12">
                {/* Sidebar */}
                <aside className="w-full md:w-64 space-y-4">
                    <div className="bg-blue-50 p-6 rounded-xl text-center">
                        <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold font-serif mx-auto mb-4">
                            {profileData?.email?.[0].toUpperCase() || "U"}
                        </div>
                        <h2 className="font-bold truncate">{profileData?.email || user.email}</h2>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">{profileData?.role || "Customer"}</span>
                    </div>

                    <nav className="space-y-2">
                        <Button variant="ghost" className="w-full justify-start font-bold" asChild>
                            <Link href="/account">My Orders</Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/account/profile">Profile Settings</Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link href="/wishlist">Wishlist</Link>
                        </Button>
                        <form action={signout}>
                            <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                                Sign Out
                            </Button>
                        </form>
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold font-serif mb-6">Order History</h1>

                    <div className="space-y-4">
                        {orders && orders.length > 0 ? (
                            orders.map((order: any) => (
                                <div key={order.id} className="bg-white border rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900">Order #{order.id.slice(0, 8)}</span>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Placed on {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <span className="block text-xs text-muted-foreground">Total</span>
                                            <span className="font-bold">{order.currency} {order.total_amount}</span>
                                        </div>
                                        <Button size="sm" variant="outline" asChild>
                                            <Link href={`/track?id=${order.id}`}>Track</Link>
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-muted/30 rounded-xl">
                                <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                                <Button asChild className="bg-yellow-400 text-black hover:bg-yellow-500">
                                    <Link href="/shop">Start Shopping</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        paid: "bg-blue-100 text-blue-800",
        shipped: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${styles[status] || "bg-gray-100"}`}>
            {status}
        </span>
    );
}
