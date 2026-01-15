"use client";

import { useTransition } from "react";
import { updateStaffRole, deleteStaff } from "./actions";
import { AdminRole } from "@/lib/admin/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";

export function StaffActions({ staffId, currentRole }: { staffId: string, currentRole: AdminRole }) {
    const [isPending, startTransition] = useTransition();

    const handleRoleChange = (newRole: AdminRole) => {
        startTransition(async () => {
            await updateStaffRole(staffId, newRole);
        });
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to remove this staff member? They will lose all access immediately.")) {
            startTransition(async () => {
                await deleteStaff(staffId);
            });
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Select defaultValue={currentRole} onValueChange={(val) => handleRoleChange(val as AdminRole)} disabled={isPending}>
                <SelectTrigger className="w-[160px] h-8 text-xs">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="content_manager">Content Manager</SelectItem>
                    <SelectItem value="support_agent">Support Agent</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
            </Select>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isPending}
            >
                {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
        </div>
    );
}
