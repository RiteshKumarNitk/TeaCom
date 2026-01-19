"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { logAdminAction } from "@/lib/admin/audit";
import { requireAdmin } from "@/lib/admin/auth";

export async function toggleCouponStatus(couponId: string, currentStatus: boolean) {
    await requireAdmin("manage_marketing"); // Assume this permission, or use generic admin check

    const newStatus = !currentStatus;

    const { error } = await (supabaseAdmin as any)
        .from("coupons")
        .update({ is_active: newStatus })
        .eq("id", couponId);

    if (error) {
        throw new Error("Failed to update coupon status");
    }

    await logAdminAction({
        action: "coupon.update_status",
        entityType: "coupon",
        entityId: couponId,
        oldValue: { is_active: currentStatus },
        newValue: { is_active: newStatus }
    });

    revalidatePath("/admin/coupons");
}

export async function deleteCoupon(couponId: string) {
    await requireAdmin("manage_marketing");

    // Get old value for log before delete
    const { data: oldCoupon } = await (supabaseAdmin as any)
        .from("coupons")
        .select("*")
        .eq("id", couponId)
        .single();

    const { error } = await (supabaseAdmin as any)
        .from("coupons")
        .delete()
        .eq("id", couponId);

    if (error) {
        throw new Error("Failed to delete coupon");
    }

    await logAdminAction({
        action: "coupon.delete",
        entityType: "coupon",
        entityId: couponId,
        oldValue: oldCoupon,
        newValue: null
    });

    revalidatePath("/admin/coupons");
}
