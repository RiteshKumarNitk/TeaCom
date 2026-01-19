"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { z } from "zod";

const createCouponSchema = z.object({
    code: z.string().min(3).refine(s => /^[A-Z0-9_-]+$/.test(s), "Code must be uppercase alphanumeric"),
    discount_type: z.enum(["percentage", "fixed"]),
    discount_value: z.number().min(0),
    min_order_amount: z.number().min(0).optional(),
    usage_limit: z.number().min(1).optional(),
    expires_at: z.string().optional(), // Date string
});

export async function createCoupon(prevState: any, formData: FormData) {
    await requireAdmin("manage_marketing");

    const code = (formData.get("code") as string)?.toUpperCase();
    const discount_type = formData.get("discount_type") as "percentage" | "fixed";
    const discount_value = parseFloat(formData.get("discount_value") as string);
    const min_order_amount = formData.get("min_order_amount") ? parseFloat(formData.get("min_order_amount") as string) : 0;
    const usage_limit = formData.get("usage_limit") ? parseInt(formData.get("usage_limit") as string) : null;
    const expires_at = formData.get("expires_at") as string || null;

    try {
        const validated = createCouponSchema.parse({
            code, discount_type, discount_value, min_order_amount, usage_limit, expires_at
        });

        const { error } = await supabaseAdmin
            .from("coupons")
            .insert({
                code: validated.code,
                discount_type: validated.discount_type,
                discount_value: validated.discount_value,
                min_order_amount: validated.min_order_amount,
                usage_limit: validated.usage_limit,
                expires_at: validated.expires_at || null,
                is_active: true
            } as any);

        if (error) {
            return { error: `Failed to create coupon: ${error.message}` };
        }

        revalidatePath("/admin/coupons");
        redirect("/admin/coupons");
    } catch (e: any) {
        if (e instanceof z.ZodError) {
            return { error: e.issues[0].message };
        }
        if (e.message === "NEXT_REDIRECT") throw e;
        return { error: e.message };
    }
}
