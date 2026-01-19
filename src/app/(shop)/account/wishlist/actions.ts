"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Please login to manage wishlist" };
    }

    // Check if already in wishlist
    const { data: existing } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single();

    if (existing) {
        // Remove
        await supabase
            .from("wishlists")
            .delete()
            .eq("id", existing.id);

        revalidatePath("/account/wishlist");
        revalidatePath("/shop");
        return { isWishlisted: false };
    } else {
        // Add
        await supabase
            .from("wishlists")
            .insert({
                user_id: user.id,
                product_id: productId
            });

        revalidatePath("/account/wishlist");
        revalidatePath("/shop");
        return { isWishlisted: true };
    }
}

export async function getWishlistItems() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
        .from("wishlists")
        .select(`
            id,
            product:products (
                id,
                name,
                slug,
                description,
                images,
                product_variants (
                    price:product_prices(amount, currency)
                )
            )
        `)
        .order("created_at", { ascending: false });

    return data || [];
}
