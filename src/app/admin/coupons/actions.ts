"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCoupon(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const code = formData.get("code") as string;
    const description = formData.get("description") as string;
    const discountType = formData.get("discount_type") as string;
    const discountValue = parseFloat(formData.get("discount_value") as string);
    const minOrderAmount = parseFloat(formData.get("min_order_amount") as string) || 0;

    // safe parsing
    if (!code || !discountValue) {
        return { error: "Code and Value are required" };
    }

    const { error } = await (supabase as any).from("coupons").insert({
        code: code.toUpperCase(), // Standardize codes
        description,
        discount_type: discountType,
        discount_value: discountValue,
        min_order_amount: minOrderAmount,
        is_active: true
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/admin/coupons");
    redirect("/admin/coupons");
}

export async function deleteCoupon(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get("id") as string;

    await (supabase as any).from("coupons").delete().eq("id", id);
    revalidatePath("/admin/coupons");
}

export async function toggleCouponStatus(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get("id") as string;
    const currentStatus = formData.get("current_status") === "true";

    await (supabase as any).from("coupons").update({ is_active: !currentStatus }).eq("id", id);
    revalidatePath("/admin/coupons");
}
