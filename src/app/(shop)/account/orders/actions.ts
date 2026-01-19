"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function requestReturn({ orderId, reason }: { orderId: string, reason: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // 1. Verify order belongs to user
    const { data: order, error: orderError } = await (supabase as any)
        .from("orders")
        .select("id, status, total_amount")
        .eq("id", orderId)
        .eq("user_id", user.id)
        .single();

    if (orderError || !order) {
        throw new Error("Order not found or access denied");
    }

    if (order.status !== "delivered") {
        throw new Error("Only delivered orders can be returned");
    }

    // 2. Insert Return Request
    const { error: insertError } = await (supabase as any)
        .from("returns")
        .insert({
            order_id: orderId,
            user_id: user.id,
            reason: reason,
            status: "requested",
            refund_amount: order.total_amount
        });

    if (insertError) {
        throw new Error(insertError.message);
    }

    // 3. Update Order Status to indicate return requested?
    // Optional: maybe we don't change order status yet, or we change it to 'return_requested'
    // For now, let's just create the return record.

    revalidatePath(`/account/orders/${orderId}`);
}
