"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Trash2, CheckCircle2 } from "lucide-react";
import { deleteAddress, setDefaultAddress } from "./actions";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

interface AddressCardProps {
    address: any;
}

export function AddressCard({ address }: AddressCardProps) {
    const [isPending, startTransition] = useTransition();

    function handleDelete() {
        if (confirm("Are you sure you want to delete this address?")) {
            startTransition(async () => {
                await deleteAddress(address.id);
            });
        }
    }

    function handleSetDefault() {
        startTransition(async () => {
            await setDefaultAddress(address.id);
        });
    }

    return (
        <Card className={cn("relative overflow-hidden transition-all", address.is_default ? "border-primary ring-1 ring-primary/20 bg-primary/5" : "hover:border-primary/50")}>
            {address.is_default && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Default
                </div>
            )}

            <CardHeader className="pb-3">
                <div className="font-bold text-lg">{address.full_name}</div>
            </CardHeader>
            <CardContent className="text-sm space-y-3 pb-3">
                <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="leading-relaxed">
                        {address.address_line1}
                        {address.address_line2 && <><br />{address.address_line2}</>}
                        <br />
                        {address.city}, {address.state} - {address.postal_code}
                        <br />
                        {address.country}
                    </p>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <p>{address.phone}</p>
                </div>
            </CardContent>
            <CardFooter className="pt-3 border-t bg-muted/20 flex justify-between gap-2">
                {!address.is_default && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSetDefault}
                        disabled={isPending}
                        className="text-muted-foreground hover:text-primary"
                    >
                        Set as Default
                    </Button>
                )}
                {/* Spacer if default */}
                {address.is_default && <span className="text-xs text-primary font-medium px-3">Primary Delivery Address</span>}

                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 -mr-2"
                    onClick={handleDelete}
                    disabled={isPending}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
