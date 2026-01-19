"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Truck } from "lucide-react";
import { updateOrderTracking, updateOrderStatus } from "./actions"; // We'll link to parent actions
import { useFormStatus } from "react-dom";

// We need a client wrapper for the action if we want pending states
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Updating..." : "Update Fulfillment"}
        </Button>
    )
}

export function FulfillmentDialog({ order }: { order: any }) {
    const [open, setOpen] = useState(false);

    async function handleSubmit(formData: FormData) {
        // 1. Update Tracking
        await updateOrderTracking(formData);

        // 2. Auto-update status to shipped if provided
        const tracking = formData.get("trackingNumber");
        if (tracking && order.status !== 'shipped' && order.status !== 'delivered') {
            await updateOrderStatus(order.id, 'shipped');
        }

        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Truck className="w-4 h-4" />
                    Fulfillment
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Order Fulfillment</DialogTitle>
                    <DialogDescription>
                        Update tracking information for Order #{order.id.slice(0, 8)}.
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="space-y-4">
                    <input type="hidden" name="orderId" value={order.id} />

                    <div className="space-y-2">
                        <Label htmlFor="trackingNumber">Tracking Number</Label>
                        <Input
                            id="trackingNumber"
                            name="trackingNumber"
                            defaultValue={order.tracking_number}
                            placeholder="e.g. 1Z9999999999999999"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="carrier">Carrier / Courier</Label>
                        <Input
                            id="carrier"
                            name="carrier"
                            defaultValue={order.carrier}
                            placeholder="e.g. FedEx, BlueDart"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Admin Notes</Label>
                        <Textarea
                            id="notes"
                            name="notes"
                            defaultValue={order.notes}
                            placeholder="Internal notes about this shipment..."
                        />
                    </div>

                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
