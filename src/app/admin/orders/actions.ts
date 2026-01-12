"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, newStatus: string) {
    const supabase = await createClient();

    // Explicit cast to 'any' to avoid TS inference issues with new tables
    const { error } = await (supabase as any)
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

    if (error) {
        console.error("Error updating order:", error);
        throw new Error("Failed to update status");
    }

    revalidatePath("/admin/orders");
}
