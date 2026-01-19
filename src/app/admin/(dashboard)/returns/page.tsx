import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { updateReturnStatus } from "./actions"; // Need to create
import { Check, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default async function ReturnsPage() {
    const supabase = await createClient();

    const { data: returns, error } = await (supabase as any)
        .from("returns")
        .select(`
            *,
            order:orders(id, total_amount, currency, email) 
        `)
        .order("created_at", { ascending: false });

    if (error) {
        return <div className="p-4 text-red-500">Error: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">Return Requests</h1>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Requested On</TableHead>
                            <TableHead>Order Info</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!returns || returns.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No return requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            returns.map((ret: any) => (
                                <TableRow key={ret.id}>
                                    <TableCell>
                                        <div className="font-medium text-sm">
                                            {format(new Date(ret.created_at), "MMM d, yyyy")}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {format(new Date(ret.created_at), "HH:mm")}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-mono text-sm">#{ret.order?.id?.slice(0, 8)}</div>
                                        <div className="text-xs text-muted-foreground">{ret.order?.email}</div>
                                        <div className="text-xs font-medium text-green-700">
                                            Refund: {ret.order?.currency} {ret.refund_amount}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-medium line-clamp-1">{ret.reason.split(':')[0]}</div>
                                        <div className="text-xs text-muted-foreground line-clamp-1">
                                            {ret.reason.split(':')[1]?.trim() || ret.reason}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <ReturnStatusBadge status={ret.status} />
                                    </TableCell>
                                    <TableCell>
                                        {ret.status === "requested" && (
                                            <div className="flex gap-2">
                                                <ApproveDialog returnId={ret.id} refundAmount={ret.refund_amount} />
                                                <RejectDialog returnId={ret.id} />
                                            </div>
                                        )}
                                        {ret.status !== "requested" && (
                                            <span className="text-xs text-muted-foreground">Processed</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function ReturnStatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        requested: "bg-yellow-100 text-yellow-800",
        approved: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
        refunded: "bg-purple-100 text-purple-800",
    };
    return <Badge className={`${styles[status] || "bg-gray-100"} hover:bg-opacity-80`}>{status}</Badge>;
}

// Client Components for Actions
import { ApproveDialog, RejectDialog } from "./dialogs";
