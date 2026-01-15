"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
    full_name: z.string().min(2),
    phone: z.string().optional(),
});

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to update your profile." };
    }

    const data = Object.fromEntries(formData);
    const parsed = profileSchema.safeParse(data);

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { error } = await supabase
        .from("profiles")
        .update({
            full_name: parsed.data.full_name,
            phone: parsed.data.phone
        })
        .eq("id", user.id);

    if (error) {
        return { error: error.message };
    }

    // Also update auth metadata for consistency
    await supabase.auth.updateUser({
        data: {
            full_name: parsed.data.full_name,
            phone: parsed.data.phone
        }
    });

    revalidatePath("/account");
    revalidatePath("/account/profile");

    return { success: true };
}
