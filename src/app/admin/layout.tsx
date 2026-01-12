import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    // 1. Check Auth
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 2. Check Role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    // Explicitly cast to avoid 'never' inference issue
    const userProfile = profile as { role: string } | null;

    if (!userProfile || userProfile.role !== "admin") {
        redirect("/"); // Kick out non-admins
    }

    // 3. Admin Signout Action
    async function adminSignOut() {
        "use server";
        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect("/login");
    }

    return (
        <div className="flex h-screen bg-muted/20">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r border-border flex flex-col">
                <div className="p-6 border-b border-border">
                    <Link href="/admin" className="font-serif text-2xl font-bold">
                        TeaCom <span className="text-primary text-base font-sans">Admin</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        Orders
                    </Link>
                    <Link
                        href="/admin/products"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors"
                    >
                        <Package className="w-5 h-5" />
                        Products
                    </Link>
                </nav>

                <div className="p-4 border-t border-border">
                    <form action={adminSignOut}>
                        <Button variant="outline" className="w-full justify-start gap-3" type="submit">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="container mx-auto p-8 max-w-5xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
