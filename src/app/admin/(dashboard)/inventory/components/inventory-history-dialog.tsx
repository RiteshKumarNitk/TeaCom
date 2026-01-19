"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getInventoryLogs } from "../actions";
import { format } from "date-fns";
import { Loader2, History } from "lucide-react";

interface InventoryHistoryDialogProps {
    variantId: string;
    productName: string;
    variantName: string;
}

export function InventoryHistoryDialog({ variantId, productName, variantName }: InventoryHistoryDialogProps) {
    const [open, setOpen] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenChange = async (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            setIsLoading(true);
            try {
                const data = await getInventoryLogs(variantId);
                setLogs(data || []);
            } catch (error) {
                console.error("Failed to load logs", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                    <History className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Inventory History</DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        History for <span className="font-medium text-foreground">{productName} - {variantName}</span>
                    </p>
                </DialogHeader>

                <div className="flex-1 overflow-auto min-h-[300px]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Change</TableHead>
                                    <TableHead>Stock (Before &rarr; After)</TableHead>
                                    <TableHead>Reason</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground h-24">
                                            No history recorded.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id} className="text-sm">
                                            <TableCell className="whitespace-nowrap">
                                                {format(new Date(log.created_at), "MMM d, yyyy HH:mm")}
                                            </TableCell>
                                            <TableCell className={log.change_amount > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                                {log.change_amount > 0 ? "+" : ""}{log.change_amount}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-muted-foreground">{log.previous_stock}</span>
                                                <span className="mx-2 text-muted-foreground">→</span>
                                                <span className="font-medium">{log.new_stock}</span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground truncate max-w-[200px]" title={log.reason}>
                                                {log.reason || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
