"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import { updateReturnStatus } from "./actions";

export function ApproveDialog({ returnId, refundAmount }: { returnId: string, refundAmount: number }) {
    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState("");
    const [isPending, setIsPending] = useState(false);

    async function handleApprove() {
        setIsPending(true);
        try {
            await updateReturnStatus(returnId, "approved", notes);
            setOpen(false);
        } catch (e) {
            alert("Error");
        }
        setIsPending(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 border-green-200 bg-green-50">
                    <Check className="w-4 h-4 mr-1" /> Approve
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Approve Return Request</DialogTitle>
                    <DialogDescription>
                        This will mark the return as approved. Please confirm if you want to initiate a refund of {refundAmount}.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-4">
                    <Label>Admin Notes</Label>
                    <Textarea
                        placeholder="Instructions for customer (e.g., shipping label sent)"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleApprove} disabled={isPending} className="bg-green-600 hover:bg-green-700">
                        {isPending ? "Approving..." : "Confirm Approval"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function RejectDialog({ returnId }: { returnId: string }) {
    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState("");
    const [isPending, setIsPending] = useState(false);

    async function handleReject() {
        if (!notes) return alert("Please provide a reason");
        setIsPending(true);
        try {
            await updateReturnStatus(returnId, "rejected", notes);
            setOpen(false);
        } catch (e) {
            alert("Error");
        }
        setIsPending(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 border-red-200 bg-red-50">
                    <X className="w-4 h-4 mr-1" /> Reject
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject Return Request</DialogTitle>
                    <DialogDescription>
                        Please provide a reason for rejection. This will be sent to the customer.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-4">
                    <Label>Reason for Rejection *</Label>
                    <Textarea
                        placeholder="Why is this return rejected?"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleReject} disabled={isPending || !notes}>
                        {isPending ? "Rejecting..." : "Confirm Rejection"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
