import { getAddresses } from "./actions";
import { AddAddressDialog } from "./add-address-dialog";
import { AddressCard } from "./address-card";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
    const addresses = await getAddresses();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold font-serif mb-1">Address Book</h1>
                    <p className="text-muted-foreground text-sm">Manage your shipping addresses.</p>
                </div>
                <AddAddressDialog />
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500 mb-6">No saved addresses found.</p>
                    <AddAddressDialog />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address: any) => (
                        <AddressCard key={address.id} address={address} />
                    ))}
                </div>
            )}
        </div>
    );
}
