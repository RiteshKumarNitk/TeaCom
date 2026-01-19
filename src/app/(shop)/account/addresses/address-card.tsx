"use client";

import { Button } from "@/components/ui/button";
import { deleteAddress, makeDefault } from "./actions";
import { Trash2, CheckCircle, MapPin } from "lucide-react";
import { startTransition, useState } from "react";
import { cn } from "@/lib/utils";

export function AddressCard({ address }: { address: any }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        setIsDeleting(true);
        await deleteAddress(address.id);
        setIsDeleting(false); // Likely unmounted by now
    };

    const handleDefault = async () => {
        startTransition(() => {
            makeDefault(address.id);
        });
    };

    return (
        <div className={cn(
            "p-6 rounded-xl border relative transition-all group",
            address.is_default
                ? "bg-primary/5 border-primary shadow-sm"
                : "bg-white border-border hover:shadow-md hover:border-primary/50"
        )}>
            {/* Status Badge */}
            {address.is_default && (
                <div className="absolute top-4 right-4 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Default
                </div>
            )}

            <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-full text-gray-500">
                    <MapPin className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">{address.full_name}</h3>
                    <p className="text-sm text-gray-500">{address.phone}</p>
                </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1 mb-6">
                <p>{address.address_line1}</p>
                <p>{address.city}, {address.state} - {address.postal_code}</p>
                <p>{address.country}</p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                {!address.is_default && (
                    <Button variant="ghost" size="sm" onClick={handleDefault} className="text-xs h-8">
                        Set as Default
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-xs h-8 text-red-500 hover:text-red-600 hover:bg-red-50 ml-auto"
                >
                    <Trash2 className="w-3 h-3 mr-1" />
                    {isDeleting ? "Deleting..." : "Delete"}
                </Button>
            </div>
        </div>
    );
}
