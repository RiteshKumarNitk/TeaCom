"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateReturnStatus } from "./actions";
import { Loader2 } from "lucide-react";

interface ReturnActionsProps {
    id: string;
    currentStatus: string;
}

export function ReturnActions({ id, currentStatus }: ReturnActionsProps) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleUpdate = async (status: "approved" | "rejected" | "received" | "refunded") => {
        setLoading(status);
        await updateReturnStatus(id, status);
        setLoading(null);
    };

    if (currentStatus === "refunded" || currentStatus === "rejected") {
        return <span className="text-muted-foreground text-sm">No actions available</span>;
    }

    return (
        <div className="flex gap-2 justify-end">
            {currentStatus === "requested" && (
                <>
                    <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleUpdate("approved")}
                        disabled={!!loading}
                    >
                        {loading === "approved" && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        Approve
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleUpdate("rejected")}
                        disabled={!!loading}
                    >
                        {loading === "rejected" && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        Reject
                    </Button>
                </>
            )}

            {currentStatus === "approved" && (
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdate("received")}
                    disabled={!!loading}
                >
                    {loading === "received" && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                    Mark Received
                </Button>
            )}

            {currentStatus === "received" && (
                <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleUpdate("refunded")}
                    disabled={!!loading}
                >
                    {loading === "refunded" && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                    Process Refund
                </Button>
            )}
        </div>
    );
}
