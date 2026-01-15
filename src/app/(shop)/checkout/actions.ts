"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function validateCoupon(code: string) {
    const supabase = await createClient();

    const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", code)
        .eq("is_active", true)
        .single();

    if (error || !coupon) {
        return { error: "Invalid or expired coupon code" };
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return { error: "Coupon has expired" };
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
        return { error: "Coupon usage limit reached" };
    }

    return { coupon };
}

export async function placeOrder(prevState: any, formData: FormData) {
    const supabase = await createClient();

    // 1. Extract Data
    const itemsJson = formData.get("items") as string;
    const total = parseFloat(formData.get("total") as string);
    const currency = formData.get("currency") as "INR" | "SAR";
    const country = formData.get("country") as string;
    const couponCode = formData.get("couponCode") as string;

    // Shipping Details
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const addressLine1 = formData.get("addressLine1") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const postalCode = formData.get("postalCode") as string;
    const paymentMethod = formData.get("paymentMethod") as string;

    if (!itemsJson || !total || !email) {
        return { error: "Missing required order information" };
    }

    const items = JSON.parse(itemsJson);
    const shippingAddress = {
        fullName,
        addressLine1,
        city,
        state,
        postalCode,
        country: country === 'in' ? 'India' : 'Saudi Arabia'
    };

    // 2. Create Order
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
            email,
            phone,
            total_amount: total,
            currency,
            shipping_address: shippingAddress,
            payment_method: paymentMethod,
            payment_status: paymentMethod === 'cod' ? 'pending' : 'paid', // Mock card as paid
            status: "pending",
            coupon_code: couponCode || null,
            user_id: (await supabase.auth.getUser()).data.user?.id || null
        })
        .select()
        .single();

    if (orderError || !order) {
        console.error("Order Creation Error:", orderError);
        return { error: "Failed to place order. Please try again." };
    }

    // 3. Create Order Items
    const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price_amount: item.price.amount,
        currency: item.price.currency,
        variant_id: item.variant?.id || null
    }));

    const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

    if (itemsError) {
        console.error("Order Items Creation Error:", itemsError);
        // We should ideally rollback or handle this, but for now log it
    }

    // 4. Update Coupon Usage if applicable
    if (couponCode) {
        await supabase.rpc('increment_coupon_usage', { coupon_code: couponCode });
    }

    // 5. Success
    // We'll redirect to a success page. 
    // The client needs to catch this or the server action handles redirect.
    redirect(`/checkout/success?orderId=${order.id}`);
}
