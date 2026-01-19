"use server";

import { productService } from "@/services/product/product.service";

export async function search(query: string) {
    if (!query) return [];
    const products = await productService.searchProducts(query);
    // Serialize to plain objects if needed, but Product type is plain enough
    return products;
}
