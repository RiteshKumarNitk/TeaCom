"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addReview(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "You must be logged in to review." };
    }

    const productId = formData.get("productId") as string;
    const rating = Number(formData.get("rating"));
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!rating || rating < 1 || rating > 5) {
        return { error: "Please provide a valid rating (1-5)." };
    }
    if (!title || !content) {
        return { error: "Please provide both a title and review content." };
    }

    // Check if review already exists
    const { data: existing } = await supabase
        .from("reviews")
        .select("id")
        .eq("product_id", productId)
        .eq("user_id", user.id)
        .single();

    if (existing) {
        return { error: "You have already reviewed this product." };
    }

    // Insert Review
    const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user.id,
        rating,
        title,
        content
    });

    if (error) {
        console.error("Review Error:", error);
        return { error: "Failed to submit review. Please try again." };
    }

    revalidatePath(`/product/[slug]`); // Ideally revalidate specific path
    return { success: true };
}

export async function getReviews(productId: string) {
    const supabase = await createClient();

    // Join with Profiles to get user name
    const { data, error } = await supabase
        .from("reviews")
        .select(`
            *,
            user:profiles(full_name)
        `)
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

    if (error) return [];

    // Average Rating
    // We can calculate this on the fly or keep a counter on product table. 
    // For MVP, on the fly.

    return data || [];
}
