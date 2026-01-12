export type Currency = "INR" | "SAR";

export interface Money {
    amount: number;
    currency: Currency;
    compareAt?: number;
}

export interface ProductVariant {
    id: string;
    name: string; // e.g., "100g", "20 Tea Bags"
    pricing: Record<"in" | "sa", Money>;
    sku: string;
    stock: number;
}

export interface Product {
    id: string;
    slug: string;
    name: string;
    description: string;
    images: string[];
    category: string;
    tags: string[];

    // Base pricing for display (lowest variant or default)
    basePrice: Record<"in" | "sa", Money>;

    variants: ProductVariant[];

    // Metadata
    benefits: string[];
    ingredients: string[];

    isBestseller?: boolean;
    isNew?: boolean;
}
