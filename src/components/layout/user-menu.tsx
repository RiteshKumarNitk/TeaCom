"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Package } from "lucide-react";
import Link from "next/link";
import { signout } from "@/app/(shop)/auth/actions";
import { createClient } from "@/lib/supabase/client";

export function UserMenu() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const supabase = createClient();

        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        }

        getUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Loading state (optional, can just show nothing or generic icon)
    if (loading) {
        return (
            <button className="p-2 hover:bg-muted rounded-full transition-colors hidden sm:flex text-foreground/70 outline-none">
                <User className="w-5 h-5 opacity-50" />
            </button>
        );
    }

    // Logged Out State
    if (!user) {
        return (
            <Link href="/login" className="p-2 hover:bg-muted rounded-full transition-colors hidden sm:flex text-foreground/70 hover:text-primary outline-none" title="Sign In">
                <User className="w-5 h-5" />
            </Link>
        );
    }

    // Logged In State
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-muted rounded-full transition-colors hidden sm:flex text-foreground/70 hover:text-primary outline-none">
                    <User className="w-5 h-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuLabel className="font-normal text-xs text-muted-foreground truncate">
                    {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/account/orders" className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        <span>Orders</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <form action={signout} className="w-full">
                        <button type="submit" className="flex w-full items-center text-red-600 focus:text-red-600 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sign Out</span>
                        </button>
                    </form>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
