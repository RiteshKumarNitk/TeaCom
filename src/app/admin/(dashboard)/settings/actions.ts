"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";
import { revalidatePath } from "next/cache";

export type SettingsState = {
    error?: string;
    success?: boolean;
};

export async function updateSettings(prevState: SettingsState, formData: FormData): Promise<SettingsState> {
    await requireAdmin("manage_settings");
    const supabase = await createClient();

    const storeName = formData.get("storeName") as string;
    const currency = formData.get("currency") as string;
    const maintenanceMode = formData.get("maintenanceMode") === "on";
    const contactEmail = formData.get("contactEmail") as string;
    const freeShippingThreshold = Number(formData.get("freeShippingThreshold") || 999);

    if (!storeName || !contactEmail) {
        return { error: "Store Name and Contact Email are required." };
    }

    // Attempt to update existing settings or insert if none exist
    // We assume there's only one record in platform_settings
    const { data: existing } = await (supabase.from("platform_settings") as any).select("id").single();

    let error;
    if (existing) {
        const { error: updateError } = await (supabase
            .from("platform_settings") as any)
            .update({
                store_name: storeName,
                currency,
                maintenance_mode: maintenanceMode,
                contact_email: contactEmail,
                free_shipping_threshold: freeShippingThreshold,
                updated_at: new Date().toISOString()
            })
            .eq("id", existing.id);
        error = updateError;
    } else {
        const { error: insertError } = await (supabase
            .from("platform_settings") as any)
            .insert({
                store_name: storeName,
                currency,
                maintenance_mode: maintenanceMode,
                contact_email: contactEmail,
                free_shipping_threshold: freeShippingThreshold
            });
        error = insertError;
    }

    if (error) {
        console.error("[SettingsActions] Error updating settings:", error);
        return { error: "Failed to save settings." };
    }

    revalidatePath("/admin/settings");
    return { success: true };
}
