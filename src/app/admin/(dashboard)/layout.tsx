import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminFooter } from "@/components/admin/admin-footer";
import { requireAdmin } from "@/lib/admin/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Enforce Admin Access (RBAC)
    // This will redirect if not authorized
    const role = await requireAdmin("view_dashboard");

    // Admin Signout Action
    async function adminSignOut() {
        "use server";
        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar role={role} onSignOut={adminSignOut} />

            <div className="flex-1 flex flex-col min-h-screen">
                <AdminHeader />
                <main className="flex-1 p-6 md:p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
                <AdminFooter />
            </div>
        </div>
    );
}
