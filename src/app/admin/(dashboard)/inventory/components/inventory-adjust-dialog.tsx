"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adjustInventory } from "../actions";
import { Loader2 } from "lucide-react";

interface InventoryAdjustDialogProps {
    variantId: string;
    productName: string;
    variantName: string;
    currentStock: number;
}

export function InventoryAdjustDialog({ variantId, productName, variantName, currentStock }: InventoryAdjustDialogProps) {
    const [open, setOpen] = useState(false);
    const [adjustmentType, setAdjustmentType] = useState<"add" | "remove" | "set">("add");
    const [amount, setAmount] = useState<string>("");
    const [reason, setReason] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const numAmount = parseInt(amount);
        if (isNaN(numAmount) || numAmount < 0) {
            alert("Please enter a valid positive number");
            setIsLoading(false);
            return;
        }

        let adjustment = 0;
        if (adjustmentType === "add") {
            adjustment = numAmount;
        } else if (adjustmentType === "remove") {
            adjustment = -numAmount;
        } else if (adjustmentType === "set") {
            adjustment = numAmount - currentStock;
        }

        if (adjustment === 0) {
            alert("No change in stock");
            setIsLoading(false);
            return;
        }

        const result = await adjustInventory(variantId, adjustment, reason || "Manual adjustment");

        if (result.error) {
            alert(result.error);
        } else {
            setOpen(false);
            setAmount("");
            setReason("");
        }
        setIsLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="secondary" className="h-7">Adjust</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adjust Inventory</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        <p>Product: <span className="font-medium text-foreground">{productName}</span></p>
                        <p>Variant: <span className="font-medium text-foreground">{variantName}</span></p>
                        <p>Current Stock: <span className="font-medium text-foreground">{currentStock}</span></p>
                    </div>

                    <div className="space-y-2">
                        <Label>Action</Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={adjustmentType === "add" ? "default" : "outline"}
                                onClick={() => setAdjustmentType("add")}
                                className="flex-1"
                            >
                                Add (+)
                            </Button>
                            <Button
                                type="button"
                                variant={adjustmentType === "remove" ? "default" : "outline"}
                                onClick={() => setAdjustmentType("remove")}
                                className="flex-1"
                            >
                                Remove (-)
                            </Button>
                            <Button
                                type="button"
                                variant={adjustmentType === "set" ? "default" : "outline"}
                                onClick={() => setAdjustmentType("set")}
                                className="flex-1"
                            >
                                Set To
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>
                            {adjustmentType === "set" ? "New Stock Level" : "Quantity"}
                        </Label>
                        <Input
                            type="number"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Reason (Optional)</Label>
                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Restock from supplier, Damaged goods, Audit correction"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm Adjustment
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
