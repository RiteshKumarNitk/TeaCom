"use client";

import { useTransition } from "react";
import { deleteProduct } from "./actions";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
// import { toast } from "sonner"; // Removed

export function DeleteProductButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this product? This cannot be undone.");
        if (!confirmed) return;

        startTransition(async () => {
            const result = await deleteProduct(id);
            if (result?.error) {
                // toast.error(result.error);
                alert(`Error: ${result.error}`);
            } else {
                // toast.success("Product deleted successfully");
                // Optional: alert("Deleted");
            }
        });
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
    );
}
