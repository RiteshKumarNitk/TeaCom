"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/lib/admin/audit";
import { requireAdmin } from "@/lib/admin/auth";

export async function updateOrderStatus(orderId: string, newStatus: string) {
    // 1. Auth Check
    await requireAdmin("manage_orders");

    const supabase = await createClient();

    // 2. Get Old Status for Log
    const { data: oldOrder } = await (supabase as any)
        .from("orders")
        .select("status")
        .eq("id", orderId)
        .single();

    // 3. Update Status
    const { error } = await (supabase as any)
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

    if (error) {
        throw new Error("Failed to update status");
    }

    // 4. Audit Log
    await logAdminAction({
        action: "order.update_status",
        entityType: "order",
        entityId: orderId,
        oldValue: { status: oldOrder?.status },
        newValue: { status: newStatus }
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
}

export async function updateOrderTracking(formData: FormData) {
    await requireAdmin("manage_orders");

    const supabase = await createClient();
    const orderId = formData.get("orderId") as string;
    const trackingNumber = formData.get("trackingNumber") as string;
    const courierName = formData.get("courierName") as string;
    const notes = formData.get("notes") as string;

    const { error } = await (supabase as any)
        .from("orders")
        .update({
            tracking_number: trackingNumber,
            courier_name: courierName,
            notes: notes,
            // If adding tracking, implicitly mark as shipped if pending/paid? Maybe not automatically.
        })
        .eq("id", orderId);

    if (error) {
        throw new Error("Failed to update tracking");
    }

    await logAdminAction({
        action: "order.update_tracking",
        entityType: "order",
        entityId: orderId,
        newValue: { trackingNumber, courierName, notes }
    });

    revalidatePath(`/admin/orders/${orderId}`);
}

export async function createReturn(orderId: string, reason: string, refundAmount: number) {
    // Admin manually creating a return request
    await requireAdmin("manage_orders");
    const supabase = await createClient();

    const { data: newReturn, error } = await (supabase as any)
        .from("returns")
        .insert({
            order_id: orderId,
            reason: reason,
            refund_amount: refundAmount,
            status: "approved", // Admin created = auto approved usually
            admin_notes: "Created manually by admin"
        })
        .select()
        .single();

    if (error) throw new Error(error.message);

    // Update order status to 'returned' or 'refunded' depending on workflow?
    // Let's just log it for now.
    await updateOrderStatus(orderId, "returned");

    await logAdminAction({
        action: "return.create",
        entityType: "return",
        entityId: newReturn.id,
        newValue: { orderId, reason, refundAmount }
    });

    revalidatePath(`/admin/orders/${orderId}`);
}
