"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { addAddress } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Loader2 } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save Address
        </Button>
    )
}

export function AddAddressDialog() {
    const [open, setOpen] = useState(false);

    async function handleSubmit(formData: FormData) {
        const res = await addAddress(null, formData);
        if (res?.error) {
            alert(res.error);
        } else {
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Address
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" name="fullName" required placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" required placeholder="+91..." />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="addressLine1">Address</Label>
                        <Input id="addressLine1" name="addressLine1" required placeholder="Flat, Building, Street" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" name="state" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="postalCode">PIN Code</Label>
                            <Input id="postalCode" name="postalCode" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" name="country" value="India" disabled />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="isDefault" name="isDefault" />
                        <Label htmlFor="isDefault">Set as default address</Label>
                    </div>

                    <SubmitButton />
                </form>
            </DialogContent>
        </Dialog>
    );
}
