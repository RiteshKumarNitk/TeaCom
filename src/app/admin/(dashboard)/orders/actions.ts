"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/lib/admin/audit";
import { requireAdmin } from "@/lib/admin/auth";

import { sendEmail } from "@/lib/email/sender";
import { OrderShippedEmail } from "@/components/emails/order-shipped";

export async function updateOrderStatus(orderId: string, newStatus: string) {
    // 1. Auth Check
    await requireAdmin("manage_orders");

    // 2. Get Old Status for Log using Admin Client
    const { data: oldOrder } = await (supabaseAdmin as any)
        .from("orders")
        .select("status, user_id, email, tracking_number, carrier")
        .eq("id", orderId)
        .single();


    // 3. Handle Inventory Restock (if cancelling)
    if (newStatus === 'cancelled' && oldOrder.status !== 'cancelled') {
        const { data: items } = await (supabaseAdmin as any)
            .from('order_items')
            .select('product_variant_id, quantity')
            .eq('order_id', orderId);

        if (items) {
            for (const item of items) {
                if (!item.product_variant_id) continue;

                // Fetch current stock to ensure accuracy
                const { data: inv } = await (supabaseAdmin as any)
                    .from('inventory')
                    .select('stock')
                    .eq('product_variant_id', item.product_variant_id)
                    .single();

                const currentStock = inv?.stock || 0;
                const newStock = currentStock + item.quantity;

                // Update Inventory
                await (supabaseAdmin as any)
                    .from('inventory')
                    .update({ stock: newStock })
                    .eq('product_variant_id', item.product_variant_id);

                // Log the change
                await (supabaseAdmin as any)
                    .from('inventory_logs')
                    .insert({
                        product_variant_id: item.product_variant_id,
                        change_amount: item.quantity,
                        previous_stock: currentStock,
                        new_stock: newStock,
                        reason: `Order #${orderId.slice(0, 8)} Cancelled`,
                        actor_id: null // System action or we could grab auth user if we had access here easily
                    });
            }
        }
    }

    // 4. Update Status
    const { error } = await (supabaseAdmin as any)
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

    if (error) {
        throw new Error("Failed to update status");
    }

    // 5. Send Notification to User
    if (oldOrder && oldOrder.user_id) {
        let title = "Order Update";
        let message = `Your order #${orderId.slice(0, 8)} status has been updated to ${newStatus}.`;

        if (newStatus === "shipped") {
            title = "Order Shipped!";
            message = `Good news! Your order #${orderId.slice(0, 8)} has been shipped.`;
        } else if (newStatus === "delivered") {
            title = "Order Delivered";
            message = `Your order #${orderId.slice(0, 8)} has been delivered. Enjoy!`;
        } else if (newStatus === "returned") {
            title = "Return Processed";
            message = `Your return for order #${orderId.slice(0, 8)} has been processed.`;
        } else if (newStatus === "refunded") {
            title = "Refund Issued";
            message = `A refund has been issued for order #${orderId.slice(0, 8)}.`;
        } else if (newStatus === "cancelled") {
            title = "Order Cancelled";
            message = `Your order #${orderId.slice(0, 8)} has been cancelled.`;
        }

        await (supabaseAdmin as any).from("notifications").insert({
            user_id: oldOrder.user_id,
            title,
            message,
            type: "order_update",
            metadata: { order_id: orderId }
        });

        // Email Notification
        if (newStatus === "shipped" && oldOrder.email) {
            await sendEmail({
                to: oldOrder.email,
                subject: `Your Order #${orderId.slice(0, 8)} has Shipped! 🚀`,
                // @ts-ignore
                react: OrderShippedEmail({
                    orderId: orderId,
                    trackingNumber: oldOrder.tracking_number,
                    carrier: oldOrder.carrier
                })
            });
        }
    }

    // 6. Audit Log
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
    const carrier = formData.get("carrier") as string;
    const notes = formData.get("notes") as string;

    const { error } = await (supabaseAdmin as any)
        .from("orders")
        .update({
            tracking_number: trackingNumber,
            carrier: carrier,
            notes: notes,
        })
        .eq("id", orderId);

    if (error) {
        throw new Error("Failed to update tracking");
    }

    await logAdminAction({
        action: "order.update_tracking",
        entityType: "order",
        entityId: orderId,
        newValue: { trackingNumber, carrier, notes }
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
