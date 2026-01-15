"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, LogOut, Settings, Users, Ticket, BookOpen, BarChart, Undo2, BoxSelect, Library, ClipboardList, AlertTriangle, Megaphone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { AdminRole, PERMISSIONS, ROUTE_PERMISSIONS } from "@/types/admin";

export function AdminSidebar({
    role,
    onSignOut
}: {
    role: AdminRole;
    onSignOut: () => Promise<void>
}) {
    const pathname = usePathname();

    const allNavItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
        { href: "/admin/returns", label: "Returns", icon: Undo2 },
        { href: "/admin/products", label: "Products", icon: Package },
        { href: "/admin/inventory", label: "Inventory", icon: AlertTriangle },
        { href: "/admin/categories", label: "Categories", icon: BoxSelect },
        { href: "/admin/collections", label: "Collections", icon: Library },
        { href: "/admin/coupons", label: "Coupons", icon: Ticket },
        { href: "/admin/customers", label: "Customers", icon: Users },
        { href: "/admin/staff", label: "Staff", icon: Shield },
        { href: "/admin/marketing", label: "Marketing", icon: Megaphone },
        { href: "/admin/settings", label: "Settings", icon: Settings },
        { href: "/admin/logs", label: "Audit Logs", icon: ClipboardList },
        { href: "/admin/analytics", label: "Analytics", icon: BarChart },
    ];

    // Filter items based on permissions
    const navItems = allNavItems.filter((item) => {
        const permission = ROUTE_PERMISSIONS[item.href];
        if (!permission) return true; // Show by default if no mapping

        const allowedRoles = PERMISSIONS[permission] as readonly string[];
        return allowedRoles.includes(role);
    });

    return (
        <aside className="w-64 bg-[#0B1C3E] text-white flex flex-col shadow-xl">
            <div className="p-6 border-b border-white/10">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded bg-[#FFD700] flex items-center justify-center text-[#0B1C3E] font-serif font-bold">
                        T
                    </div>
                    <span className="font-serif text-xl font-bold tracking-wide">
                        TeaCom <span className="text-[#FFD700] text-sm font-sans uppercase tracking-wider ml-1">Admin</span>
                    </span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4 pt-2">
                    Menu
                </div>
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-[#FFD700] text-[#0B1C3E] shadow-md"
                                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-[#0B1C3E]" : "text-gray-400")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10 bg-[#08142c]">
                <form action={onSignOut}>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-300 hover:text-red-200 hover:bg-red-500/10"
                        type="submit"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </form>
            </div>
        </aside>
    );
}
