"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/lib/admin/audit";
import { requireAdmin } from "@/lib/admin/auth";

export async function updateReturnStatus(
    returnId: string,
    newStatus: "approved" | "rejected" | "received" | "refunded",
    adminNotes?: string
) {
    // 1. Auth Check
    const admin = await requireAdmin("manage_orders");
    const supabase = await createClient();

    // 2. Get current state for logging
    const { data: oldReturn, error: fetchError } = await (supabase as any)
        .from("returns")
        .select("status, order_id")
        .eq("id", returnId)
        .single();

    if (fetchError || !oldReturn) {
        return { error: "Return request not found" };
    }

    // 3. Update Return
    const { error: updateError } = await (supabase as any)
        .from("returns")
        .update({
            status: newStatus,
            admin_notes: adminNotes,
            updated_at: new Date().toISOString()
        })
        .eq("id", returnId);

    if (updateError) {
        return { error: `Failed to update return: ${updateError.message}` };
    }

    // 4. If Refunded, we might want to update Order Status OR Inventory
    // For now, let's just Log and Audit.
    // Logic: If status is 'received', maybe restock? (Leaving manual for now as per requirements)

    // 5. Audit Log
    await logAdminAction({
        action: "return.update_status",
        entityType: "return",
        entityId: returnId,
        oldValue: { status: oldReturn.status },
        newValue: { status: newStatus, notes: adminNotes }
    });

    revalidatePath("/admin/returns");
    revalidatePath(`/admin/orders/${oldReturn.order_id}`);

    return { success: true };
}
