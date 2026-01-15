"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/lib/admin/audit";
import { requireAdmin } from "@/lib/admin/auth";

export async function updateOrderStatus(orderId: string, newStatus: string) {
    // 1. Auth Check
    await requireAdmin("manage_orders");

    // 2. Get Old Status for Log using Admin Client
    const { data: oldOrder } = await (supabaseAdmin as any)
        .from("orders")
        .select("status, user_id")
        .eq("id", orderId)
        .single();

    // 3. Update Status
    const { error } = await (supabaseAdmin as any)
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

    if (error) {
        throw new Error("Failed to update status");
    }

    // 4. Send Notification to User
    if (oldOrder && oldOrder.user_id) {
        let title = "Order Update";
        let message = `Your order #${orderId.slice(0, 8)} status has been updated to ${newStatus}.`;

        if (newStatus === "shipped") {
            title = "Order Shipped!";
            message = `Good news! Your order #${orderId.slice(0, 8)} has been shipped.`;
        } else if (newStatus === "delivered") {
            title = "Order Delivered";
            message = `Your order #${orderId.slice(0, 8)} has been delivered. Enjoy!`;
        }

        await (supabaseAdmin as any).from("notifications").insert({
            user_id: oldOrder.user_id,
            title,
            message,
            type: "order_update",
            metadata: { order_id: orderId }
        });
    }

    // 5. Audit Log
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

    const orderId = formData.get("orderId") as string;
    const trackingNumber = formData.get("trackingNumber") as string;
    const courierName = formData.get("courierName") as string;
    const notes = formData.get("notes") as string;

    const { error } = await (supabaseAdmin as any)
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

    const { data: newReturn, error } = await (supabaseAdmin as any)
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
