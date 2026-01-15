"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const couponSchema = z.object({
    code: z.string().min(3).toUpperCase(),
    discount_percent: z.coerce.number().min(0).max(100),
    description: z.string().optional(),
    is_active: z.string().optional().transform(v => v === "on"),
});

export async function createCoupon(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const data = Object.fromEntries(formData);
    const parsed = couponSchema.safeParse(data);

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { error } = await (supabase as any).from("coupons").insert({
        code: parsed.data.code,
        discount_percent: parsed.data.discount_percent,
        description: parsed.data.description,
        is_active: parsed.data.is_active || false,
    });

    if (error) {
        if (error.code === '23505') { // Unique violation
            return { error: "Coupon code already exists." };
        }
        return { error: error.message };
    }

    revalidatePath("/admin/coupons");
    redirect("/admin/coupons");
}
