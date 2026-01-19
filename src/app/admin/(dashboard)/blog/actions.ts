"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { logAdminAction } from "@/lib/admin/audit";

const postSchema = z.object({
    title: z.string().min(3, "Title is required"),
    slug: z.string().min(3, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    content: z.string().optional(),
    excerpt: z.string().optional(),
    cover_image: z.string().optional(),
    is_published: z.boolean(),
});

export async function createPost(prevState: any, formData: FormData) {
    await requireAdmin("manage_marketing");

    const supabase = await createClient();

    const rawData = {
        title: formData.get("title"),
        slug: formData.get("slug"),
        content: formData.get("content"),
        excerpt: formData.get("excerpt"),
        cover_image: formData.get("cover_image"),
        is_published: formData.get("is_published") === "on",
    };

    const parsed = postSchema.safeParse(rawData);

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { data, error } = await (supabase as any).from("posts").insert(parsed.data as any).select().single();

    if (error) {
        if (error.code === "23505") return { error: "Slug already exists" };
        return { error: error.message };
    }

    await logAdminAction({
        action: "blog.create",
        entityType: "post",
        entityId: data.id,
        newValue: parsed.data
    });

    revalidatePath("/admin/blog");
    redirect("/admin/blog");
}

export async function updatePost(prevState: any, formData: FormData) {
    await requireAdmin("manage_marketing");

    const supabase = await createClient();
    const id = formData.get("id") as string;

    // Fetch old data for logging
    const { data: oldPost } = await (supabase as any).from("posts").select("*").eq("id", id).single();

    const rawData = {
        title: formData.get("title"),
        slug: formData.get("slug"),
        content: formData.get("content"),
        excerpt: formData.get("excerpt"),
        cover_image: formData.get("cover_image"),
        is_published: formData.get("is_published") === "on",
    };

    const parsed = postSchema.safeParse(rawData);

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { error } = await (supabase as any)
        .from("posts")
        .update({
            ...parsed.data,
            published_at: parsed.data.is_published && !oldPost.is_published ? new Date().toISOString() : oldPost.published_at,
            updated_at: new Date().toISOString()
        } as any)
        .eq("id", id);

    if (error) {
        if (error.code === "23505") return { error: "Slug already exists" };
        return { error: error.message };
    }

    await logAdminAction({
        action: "blog.update",
        entityType: "post",
        entityId: id,
        oldValue: oldPost,
        newValue: parsed.data
    });

    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${parsed.data.slug}`);
    redirect("/admin/blog");
}

export async function deletePost(id: string) {
    await requireAdmin("manage_marketing");

    const supabase = await createClient();

    // Fetch old data for logging
    const { data: oldPost } = await (supabase as any).from("posts").select("*").eq("id", id).single();

    const { error } = await (supabase as any).from("posts").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    await logAdminAction({
        action: "blog.delete",
        entityType: "post",
        entityId: id,
        oldValue: oldPost
    });

    revalidatePath("/admin/blog");
}
