"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const postSchema = z.object({
    title: z.string().min(3, "Title is required"),
    slug: z.string().min(3, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    content: z.string().optional(),
    excerpt: z.string().optional(),
    cover_image: z.string().optional(),
    is_published: z.boolean(),
});

export async function createPost(prevState: any, formData: FormData) {
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

    const { error } = await (supabase as any).from("posts").insert(parsed.data as any);

    if (error) {
        if (error.code === "23505") return { error: "Slug already exists" };
        return { error: error.message };
    }

    revalidatePath("/admin/blog");
    redirect("/admin/blog");
}

export async function updatePost(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const id = formData.get("id") as string;

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
            published_at: parsed.data.is_published ? new Date().toISOString() : null, // Simple logic: update published_at on publish
            updated_at: new Date().toISOString()
        } as any)
        .eq("id", id);

    if (error) {
        if (error.code === "23505") return { error: "Slug already exists" };
        return { error: error.message };
    }

    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${parsed.data.slug}`);
    redirect("/admin/blog");
}

export async function deletePost(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get("id") as string;

    await (supabase as any).from("posts").delete().eq("id", id);
    revalidatePath("/admin/blog");
}
