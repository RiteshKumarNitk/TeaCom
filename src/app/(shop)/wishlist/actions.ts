"use server";

import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(productId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Login required" };
    }

    // Check if exists
    const { data } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single();

    const existing = data as Database["public"]["Tables"]["wishlists"]["Row"] | null;

    let isAdded = false;

    if (existing) {
        // Remove
        await (supabase as any).from("wishlists").delete().eq("id", existing.id);
        isAdded = false;
    } else {
        // Add
        await (supabase as any).from("wishlists").insert({
            user_id: user.id,
            product_id: productId
        });
        isAdded = true;
    }

    revalidatePath("/wishlist");
    revalidatePath("/shop");
    revalidatePath(`/product/[slug]`); // Revalidate product pages usually, though dynamic components handle it.

    return { success: true, isAdded };
}

export async function getWishlistItems() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await (supabase as any)
        .from("wishlists")
        .select("product_id")
        .eq("user_id", user.id);

    return data?.map((w: any) => w.product_id) || [];
}
