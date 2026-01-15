export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            coupons: {
                Row: {
                    code: string
                    created_at: string
                    description: string | null
                    discount_type: "percentage" | "fixed"
                    discount_value: number
                    expires_at: string | null
                    id: string
                    is_active: boolean
                    max_discount_amount: number | null
                    min_order_amount: number | null
                    start_date: string | null
                    usage_count: number
                    usage_limit: number | null
                }
                Insert: {
                    code: string
                    created_at?: string
                    description?: string | null
                    discount_type: "percentage" | "fixed"
                    discount_value: number
                    expires_at?: string | null
                    id?: string
                    is_active?: boolean
                    max_discount_amount?: number | null
                    min_order_amount?: number | null
                    start_date?: string | null
                    usage_count?: number
                    usage_limit?: number | null
                }
                Update: {
                    code?: string
                    created_at?: string
                    description?: string | null
                    discount_type?: "percentage" | "fixed"
                    discount_value?: number
                    expires_at?: string | null
                    id?: string
                    is_active?: boolean
                    max_discount_amount?: number | null
                    min_order_amount?: number | null
                    start_date?: string | null
                    usage_count?: number
                    usage_limit?: number | null
                }
            }
            notifications: {
                Row: {
                    created_at: string
                    id: string
                    is_read: boolean
                    message: string
                    title: string
                    type: string
                    user_id: string | null
                }
                Insert: {
                    created_at?: string
                    id?: string
                    is_read?: boolean
                    message: string
                    title: string
                    type: string
                    user_id?: string | null
                }
                Update: {
                    created_at?: string
                    id?: string
                    is_read?: boolean
                    message?: string
                    title?: string
                    type?: string
                    user_id?: string | null
                }
            }
            order_items: {
                Row: {
                    currency: string
                    id: string
                    order_id: string
                    price_amount: number
                    product_id: string
                    product_name: string
                    quantity: number
                    variant_id: string | null
                }
                Insert: {
                    currency: string
                    id?: string
                    order_id: string
                    price_amount: number
                    product_id: string
                    product_name: string
                    quantity: number
                    variant_id?: string | null
                }
                Update: {
                    currency?: string
                    id?: string
                    order_id?: string
                    price_amount?: number
                    product_id?: string
                    product_name?: string
                    quantity?: number
                    variant_id?: string | null
                }
            }
            orders: {
                Row: {
                    created_at: string
                    currency: "INR" | "SAR"
                    email: string
                    id: string
                    payment_method: string
                    payment_status: string
                    phone: string | null
                    shipping_address: Json
                    status: string
                    total_amount: number
                    user_id: string | null
                }
                Insert: {
                    created_at?: string
                    currency: "INR" | "SAR"
                    email: string
                    id?: string
                    payment_method: string
                    payment_status?: string
                    phone?: string | null
                    shipping_address: Json
                    status?: string
                    total_amount: number
                    user_id?: string | null
                }
                Update: {
                    created_at?: string
                    currency?: "INR" | "SAR"
                    email?: string
                    id?: string
                    payment_method?: string
                    payment_status?: string
                    phone?: string | null
                    shipping_address?: Json
                    status?: string
                    total_amount?: number
                    user_id?: string | null
                }
            }
            posts: {
                Row: {
                    author: string | null
                    content: string | null
                    cover_image: string | null
                    created_at: string
                    excerpt: string | null
                    id: string
                    is_published: boolean
                    published_at: string | null
                    slug: string
                    title: string
                }
                Insert: {
                    author?: string | null
                    content?: string | null
                    cover_image?: string | null
                    created_at?: string
                    excerpt?: string | null
                    id?: string
                    is_published?: boolean
                    published_at?: string | null
                    slug: string
                    title: string
                }
                Update: {
                    author?: string | null
                    content?: string | null
                    cover_image?: string | null
                    created_at?: string
                    excerpt?: string | null
                    id?: string
                    is_published?: boolean
                    published_at?: string | null
                    slug?: string
                    title?: string
                }
            }
            product_prices: {
                Row: {
                    amount: number
                    compare_at_amount: number | null
                    currency: "INR" | "SAR"
                    id: string
                    product_id: string
                    variant_id: string | null
                }
                Insert: {
                    amount: number
                    compare_at_amount?: number | null
                    currency: "INR" | "SAR"
                    id?: string
                    product_id: string
                    variant_id?: string | null
                }
                Update: {
                    amount?: number
                    compare_at_amount?: number | null
                    currency?: "INR" | "SAR"
                    id?: string
                    product_id?: string
                    variant_id?: string | null
                }
            }
            product_variants: {
                Row: {
                    id: string
                    metadata: Json | null
                    name: string
                    product_id: string
                    sku: string | null
                    stock: number
                }
                Insert: {
                    id?: string
                    metadata?: Json | null
                    name: string
                    product_id: string
                    sku?: string | null
                    stock?: number
                }
                Update: {
                    id?: string
                    metadata?: Json | null
                    name?: string
                    product_id?: string
                    sku?: string | null
                    stock?: number
                }
            }
            products: {
                Row: {
                    benefits: string[] | null
                    category: string | null
                    created_at: string
                    description: string | null
                    id: string
                    images: string[] | null
                    ingredients: string[] | null
                    is_bestseller: boolean
                    is_new: boolean
                    metadata: Json | null
                    name: string
                    slug: string
                    tags: string[] | null
                }
                Insert: {
                    benefits?: string[] | null
                    category?: string | null
                    created_at?: string
                    description?: string | null
                    id?: string
                    images?: string[] | null
                    ingredients?: string[] | null
                    is_bestseller?: boolean
                    is_new?: boolean
                    metadata?: Json | null
                    name: string
                    slug: string
                    tags?: string[] | null
                }
                Update: {
                    benefits?: string[] | null
                    category?: string | null
                    created_at?: string
                    description?: string | null
                    id?: string
                    images?: string[] | null
                    ingredients?: string[] | null
                    is_bestseller?: boolean
                    is_new?: boolean
                    metadata?: Json | null
                    name?: string
                    slug?: string
                    tags?: string[] | null
                }
            }
            profiles: {
                Row: {
                    created_at: string
                    email: string | null
                    id: string
                    role: "admin" | "customer"
                }
                Insert: {
                    created_at?: string
                    email?: string | null
                    id: string
                    role?: "admin" | "customer"
                }
                Update: {
                    created_at?: string
                    email?: string | null
                    id?: string
                    role?: "admin" | "customer"
                }
            }
            wishlists: {
                Row: {
                    created_at: string
                    id: string
                    product_id: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    product_id: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    product_id?: string
                    user_id?: string
                }
            }
        }
        Functions: {
            increment_coupon_usage: {
                Args: {
                    coupon_code: string
                }
                Returns: void
            }
        }
    }
}
