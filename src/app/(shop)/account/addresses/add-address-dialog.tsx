"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useActionState, useEffect } from "react";
import { addAddress } from "./actions"; // Assuming actions.ts is in same folder
import { Plus } from "lucide-react";

export function AddAddressDialog() {
    const [open, setOpen] = useState(false);
    const [state, formAction, isPending] = useActionState(addAddress, null);

    // Close on success
    useEffect(() => {
        if (state?.success) {
            setOpen(false);
            // Optionally reset form if needed, but Dialog unmounts logic usually fine
            // Or we just rely on parent re-render
        }
    }, [state]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" /> Add New Address
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                    <DialogDescription>
                        Enter your delivery details below.
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" required placeholder="John Doe" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" required placeholder="+91..." />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="addressLine1">Address Line 1</Label>
                        <Input id="addressLine1" name="addressLine1" required placeholder="House No, Street, Building" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                        <Input id="addressLine2" name="addressLine2" placeholder="Landmark, Area, etc." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" name="state" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input id="postalCode" name="postalCode" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" name="country" defaultValue="India" readOnly className="bg-muted" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="isDefault" name="isDefault" />
                        <Label htmlFor="isDefault">Set as default address</Label>
                    </div>

                    {state?.error && (
                        <p className="text-sm text-red-500">{state.error}</p>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save Address"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
