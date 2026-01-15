"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useTransition } from "react";
import { requestReturn } from "../actions";
import { Undo2 } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function ReturnRequestDialog({ orderId }: { orderId: string }) {
    const [open, setOpen] = useState(false);
    const [reasonType, setReasonType] = useState("");
    const [reasonDetail, setReasonDetail] = useState("");
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        startTransition(async () => {
            try {
                // Combine type and detail
                const fullReason = `${reasonType}: ${reasonDetail}`;
                await requestReturn({ orderId, reason: fullReason });
                setOpen(false);
                setReasonType("");
                setReasonDetail("");
                alert("Return request submitted successfully.");
            } catch (error: any) {
                alert("Failed to submit return request: " + error.message);
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                    <Undo2 className="w-4 h-4" />
                    Request Return
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request Order Return</DialogTitle>
                    <DialogDescription>
                        We're sorry you're not satisfied with your order. Please tell us why you'd like to return it.
                        Our team will review your request within 24-48 hours.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Reason for Return</Label>
                        <Select value={reasonType} onValueChange={setReasonType} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a reason" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Items Missing">Items Missing</SelectItem>
                                <SelectItem value="Defective or Damaged">Defective or Damaged Product</SelectItem>
                                <SelectItem value="Not Satisfied">Not Satisfied / Quality Issue</SelectItem>
                                <SelectItem value="Wrong Item Sent">Wrong Item Sent</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="reason">Additional Comments / Remarks</Label>
                        <Textarea
                            id="reason"
                            placeholder="Please provide more details about your issue..."
                            value={reasonDetail}
                            onChange={(e) => setReasonDetail(e.target.value)}
                            required
                            className="min-h-[100px]"
                        />
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>Cancel</Button>
                    <Button variant="destructive" onClick={handleSubmit} disabled={isPending || !reasonType || !reasonDetail.trim()}>
                        {isPending ? "Submitting..." : "Submit Return Request"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

