"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { signout } from "@/app/(shop)/auth/actions";
import { useTransition } from "react";

export function UserMenu() {
    const [isPending, startTransition] = useTransition();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-muted rounded-full transition-colors hidden sm:flex text-foreground/70 hover:text-primary outline-none">
                    <User className="w-5 h-5" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile & Orders</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
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
