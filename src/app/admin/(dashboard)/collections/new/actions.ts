"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin/auth";
import { logAdminAction } from "@/lib/admin/audit";

const collectionSchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only."),
    type: z.string(),
    description: z.string().optional(),
    starts_at: z.string().optional().or(z.literal("")),
    ends_at: z.string().optional().or(z.literal("")),
    is_active: z.string().optional().transform(v => v === "on"),
});

export async function createCollection(prevState: any, formData: FormData) {
    await requireAdmin("manage_marketing");

    const data = Object.fromEntries(formData);
    const parsed = collectionSchema.safeParse(data);

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { data: newCollection, error } = await (supabaseAdmin as any).from("collections").insert({
        name: parsed.data.name,
        slug: parsed.data.slug,
        type: parsed.data.type,
        description: parsed.data.description,
        starts_at: parsed.data.starts_at || null,
        ends_at: parsed.data.ends_at || null,
        is_active: parsed.data.is_active || false,
    }).select().single();

    if (!error && newCollection) {
        await logAdminAction({
            action: "collection.create",
            entityType: "collection",
            entityId: newCollection.id,
            newValue: parsed.data
        });
    }

    if (error) {
        if (error.code === '23505') {
            return { error: "Slug already exists." };
        }
        return { error: error.message };
    }

    revalidatePath("/admin/collections");
    redirect("/admin/collections");
}
