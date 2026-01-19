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
import { MoreHorizontal, Trash, Power } from "lucide-react";
import { toggleCouponStatus, deleteCoupon } from "./actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CouponActionsProps {
    id: string;
    isActive: boolean;
}

export function CouponActions({ id, isActive }: CouponActionsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        setIsLoading(true);
        try {
            await toggleCouponStatus(id, isActive);
        } catch (error) {
            console.error("Failed to toggle status", error);
            // Ideally show toast
        } finally {
            setIsLoading(false);
            router.refresh();
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) return;

        setIsLoading(true);
        try {
            await deleteCoupon(id);
        } catch (error) {
            console.error("Failed to delete coupon", error);
        } finally {
            setIsLoading(false);
            router.refresh();
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
                    <span className="sr-only">Open menu</span>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleToggle}>
                    <Power className={`mr-2 h-4 w-4 ${isActive ? "text-red-500" : "text-green-500"}`} />
                    {isActive ? "Deactivate" : "Activate"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
