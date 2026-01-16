import { createClient } from "@/lib/supabase/server";
import { AddAddressDialog } from "./add-address-dialog";
import { AddressCard } from "./address-card";
import { redirect } from "next/navigation";
import { MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: addresses } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false }) // Default first
        .order("created_at", { ascending: false });

    return (
        <div className="max-w-4xl mx-auto py-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
                        My Addresses
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your shipping addresses for faster checkout.
                    </p>
                </div>
                <AddAddressDialog />
            </div>

            {(!addresses || addresses.length === 0) ? (
                <div className="text-center py-16 bg-muted/20 border-2 border-dashed rounded-xl">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No addresses found</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        You haven't added any shipping addresses yet. Add one now to speed up your checkout.
                    </p>
                    <AddAddressDialog />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr: any) => (
                        <AddressCard key={addr.id} address={addr} />
                    ))}
                </div>
            )}
        </div>
    );
}
