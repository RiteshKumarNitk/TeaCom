"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const categorySchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only."),
    description: z.string().optional(),
    image_url: z.string().url().optional().or(z.literal("")),
    is_active: z.string().optional().transform(v => v === "on"),
});

export async function createCategory(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const data = Object.fromEntries(formData);
    const parsed = categorySchema.safeParse(data);

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { error } = await (supabase as any).from("categories").insert({
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description,
        image_url: parsed.data.image_url || null,
        is_active: parsed.data.is_active || false,
    });

    if (error) {
        if (error.code === '23505') {
            return { error: "Slug already exists." };
        }
        return { error: error.message };
    }

    revalidatePath("/admin/categories");
    redirect("/admin/categories");
}
