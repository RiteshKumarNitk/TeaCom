import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminFooter } from "@/components/admin/admin-footer";

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
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar onSignOut={adminSignOut} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
                <AdminFooter />
            </div>
        </div>
    );
}
