"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addressSchema = z.object({
    full_name: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "Valid phone is required"),
    address_line1: z.string().min(5, "Address is required"),
    address_line2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    postal_code: z.string().min(4, "Postal Code is required"),
    country: z.string().default("India"),
    is_default: z.boolean().default(false),
});

export async function addAddress(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to add an address." };
    }

    // Parse Data
    const rawData = {
        full_name: formData.get("fullName"),
        phone: formData.get("phone"),
        address_line1: formData.get("addressLine1"),
        address_line2: formData.get("addressLine2"),
        city: formData.get("city"),
        state: formData.get("state"),
        postal_code: formData.get("postalCode"),
        country: formData.get("country") || "India",
        is_default: formData.get("isDefault") === "on",
    };

    const validated = addressSchema.safeParse(rawData);

    if (!validated.success) {
        return { error: validated.error.errors[0].message };
    }

    // Logic for Default Address: If this is the first address, or marked default, unmark others?
    // Doing strict "If marked default, update others" within a transaction ideally, or sequential update.

    if (validated.data.is_default) {
        await supabase
            .from("addresses")
            .update({ is_default: false })
            .eq("user_id", user.id);
    }

    const { error } = await supabase.from("addresses").insert({
        user_id: user.id,
        ...validated.data
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
    return { success: true };
}


export async function deleteAddress(addressId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("addresses").delete().eq("id", addressId);
    if (error) return { error: error.message };
    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
}

export async function setDefaultAddress(addressId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Unset all
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);

    // 2. Set new default
    const { error } = await supabase.from("addresses").update({ is_default: true }).eq("id", addressId);

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
}
