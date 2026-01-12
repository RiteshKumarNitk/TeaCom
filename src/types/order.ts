import { Money } from "./product";

export interface ShippingAddress {
    fullName: string;
    email: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface OrderItem {
    id: string;
    productId: string;
    variantId?: string;
    name: string;
    quantity: number;
    price: Money;
}

export interface Order {
    id: string;
    createdAt: string;
    status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
    shippingAddress: ShippingAddress;
    items: OrderItem[];
    totalAmount: Money;
    paymentMethod: string;
    paymentStatus: string;
}
