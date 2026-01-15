"use client";

import { useActionState, useState } from "react";
import { createStaff, StaffState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";

const ROLES = [
    { value: "admin", label: "Admin" },
    { value: "operations", label: "Operations" },
    { value: "content_manager", label: "Content Manager" },
    { value: "support_agent", label: "Support Agent" },
    { value: "super_admin", label: "Super Admin" },
];

export function StaffForm() {
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(createStaff, {});

    // Close dialog on success
    if (state.success && open) {
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> Add Staff Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Staff Member</DialogTitle>
                    <DialogDescription>
                        Create a new administrative account. They will be able to log in at /admin/login.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-4 py-4">
                    {state.error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
                            {state.error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" name="fullName" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Work Email</Label>
                        <Input id="email" name="email" type="email" placeholder="john@teacom.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Temporary Password</Label>
                        <Input id="password" name="password" type="password" required />
                        <p className="text-[10px] text-gray-500">Provide this to the staff member for their first login.</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Assigned Role</Label>
                        <Select name="role" required defaultValue="support_agent">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>
                                        {role.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Create Staff Account
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
