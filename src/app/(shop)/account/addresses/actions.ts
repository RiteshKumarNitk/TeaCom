"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAddresses() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

    return data || [];
}

export async function addAddress(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Login required" };

    const address = {
        user_id: user.id,
        full_name: formData.get("fullName"),
        phone: formData.get("phone"),
        address_line1: formData.get("addressLine1"),
        city: formData.get("city"),
        state: formData.get("state"),
        postal_code: formData.get("postalCode"),
        country: "India", // Defaulting for now as per other forms, or could capture
        is_default: formData.get("isDefault") === "on",
    };

    if (address.is_default) {
        // Unset other defaults
        await (supabase as any)
            .from("addresses")
            .update({ is_default: false })
            .eq("user_id", user.id);
    }

    const { error } = await (supabase as any).from("addresses").insert(address);

    if (error) return { error: error.message };

    revalidatePath("/account/addresses");
    revalidatePath("/checkout"); // Update checkout address list
    return { success: true };
}

export async function deleteAddress(addressId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Login required" };

    await (supabase as any)
        .from("addresses")
        .delete()
        .eq("id", addressId)
        .eq("user_id", user.id);

    revalidatePath("/account/addresses");
}

export async function makeDefault(addressId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Login required" };

    // Batch updates: unset all, set one
    await (supabase as any).from("addresses").update({ is_default: false }).eq("user_id", user.id);
    await (supabase as any).from("addresses").update({ is_default: true }).eq("id", addressId).eq("user_id", user.id);

    revalidatePath("/account/addresses");
}
