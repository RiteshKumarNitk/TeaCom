"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CartItem } from "@/context/cart-context"; // Note: accessing types from client-context file might need refactor if it has client code.
// Ideally CartItem type should be shared. For now, redefining input schema.

const shippingSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    addressLine1: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    postalCode: z.string().min(4, "Postal code is required"),
    country: z.string(), // "in" or "sa"
});

// Zod schema for the cart items passed from client
const cartItemSchema = z.object({
    id: z.string(),
    product: z.object({
        id: z.string(),
        name: z.string(),
    }),
    quantity: z.number().min(1),
    variantId: z.string().optional(),
    price: z.object({
        amount: z.number(),
        currency: z.enum(["INR", "SAR"]),
    }),
});

const placeOrderSchema = z.object({
    shipping: shippingSchema,
    items: z.array(cartItemSchema),
    currency: z.enum(["INR", "SAR"]),
    total: z.number(),
});

export type PlaceOrderState = {
    error?: string;
    orderId?: string;
};

export async function placeOrder(prevState: any, formData: FormData) {
    // 1. Extract JSON data from hidden input (since we are passing complex object structures)
    // OR strictly use formData fields. Using a hidden JSON input for 'cartItems' is common pattern for server actions 
    // without client-side fetches.

    const rawData = {
        shipping: {
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            addressLine1: formData.get("addressLine1"),
            city: formData.get("city"),
            state: formData.get("state"),
            postalCode: formData.get("postalCode"),
            country: formData.get("country"),
        },
        items: JSON.parse(formData.get("items") as string || "[]"),
        currency: formData.get("currency"),
        total: Number(formData.get("total")),
    };

    const parsed = placeOrderSchema.safeParse(rawData);

    if (!parsed.success) {
        console.error(parsed.error.flatten());
        return { error: "Invalid form data. Please check your entries." };
    }

    const { shipping, items, currency, total } = parsed.data;
    const supabase = await createClient();

    // 2. Get User (if logged in)
    const { data: { user } } = await supabase.auth.getUser();

    // 3. Insert Order
    const { data: order, error: orderError } = await (supabase as any)
        .from("orders")
        .insert({
            user_id: user?.id || null,
            status: "pending",
            email: shipping.email,
            phone: shipping.phone,
            shipping_address: shipping,
            currency: currency,
            total_amount: total,
            payment_method: "cod", // Mocking COD for now
            payment_status: "pending",
        })
        .select()
        .single();

    if (orderError || !order) {
        console.error("Order Insert Error:", orderError);
        return { error: "Failed to place order. Please try again." };
    }

    // 4. Insert Order Items
    const orderItemsData = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        variant_id: item.variantId || null,
        quantity: item.quantity,
        price_amount: item.price.amount,
        currency: item.price.currency,
        product_name: item.product.name,
    }));

    const { error: itemsError } = await (supabase as any)
        .from("order_items")
        .insert(orderItemsData);

    if (itemsError) {
        console.error("Order Items Insert Error:", itemsError);
        // In real app, we might want to revert the order here
        return { error: "Failed to save order items." };
    }

    // 5. Success Redirect
    redirect(`/checkout/success?orderId=${order.id}`);
}
