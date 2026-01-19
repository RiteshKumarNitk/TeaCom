"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { logAdminAction } from "@/lib/admin/audit";
import { sendEmail } from "@/lib/email/sender";

// We'll create a basic notification email later
// import { ReturnStatusEmail } from "@/components/emails/return-status";

export async function updateReturnStatus(returnId: string, status: string, notes: string = "") {
    await requireAdmin("manage_orders");

    // 1. Get Return Details for Email
    const { data: ret } = await (supabaseAdmin as any)
        .from("returns")
        .select(`*, user:users(email)`) // user is likely virtual relation if user_id linked to auth.users?
        // Actually auth.users is not queryable directly via simple join usually unless view.
        // But let's assume 'returns.user_id' -> 'profiles.id' if we have profile?
        // Or we just query user by ID.
        // Let's rely on standard join if exists, or just fetch manually.
        .eq("id", returnId)
        .single();

    if (!ret) throw new Error("Return not found");

    // Update Return
    const { error } = await (supabaseAdmin as any)
        .from("returns")
        .update({
            status,
            admin_notes: notes,
            updated_at: new Date().toISOString()
        })
        .eq("id", returnId);

    if (error) throw new Error(error.message);

    // If Approved, maybe auto-refund? For now just manual.

    // Log
    await logAdminAction({
        action: "return.update_status",
        entityType: "return",
        entityId: returnId,
        newValue: { status, notes }
    });

    // Notify User (DB)
    await (supabaseAdmin as any).from("notifications").insert({
        user_id: ret.user_id,
        title: `Return Request ${status === 'approved' ? 'Approved' : 'Updated'}`,
        message: `Your return request for order has been ${status}. Notes: ${notes}`,
        type: "return_update",
        metadata: { return_id: returnId }
    });

    // Email (TODO: Implement actual template)
    // const { data: userData } = await supabaseAdmin.auth.admin.getUserById(ret.user_id);
    // if (userData.user?.email) {
    //      await sendEmail(...)
    // }

    revalidatePath("/admin/returns");
}
