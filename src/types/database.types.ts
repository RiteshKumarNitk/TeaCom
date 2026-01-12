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
            products: {
                Row: {
                    id: string
                    created_at: string
                    slug: string
                    name: string
                    description: string | null
                    images: string[] | null
                    category: string | null
                    tags: string[] | null
                    benefits: string[] | null
                    ingredients: string[] | null
                    is_bestseller: boolean
                    is_new: boolean
                    metadata: Json | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    slug: string
                    name: string
                    description?: string | null
                    images?: string[] | null
                    category?: string | null
                    tags?: string[] | null
                    benefits?: string[] | null
                    ingredients?: string[] | null
                    is_bestseller?: boolean
                    is_new?: boolean
                    metadata?: Json | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    slug?: string
                    name?: string
                    description?: string | null
                    images?: string[] | null
                    category?: string | null
                    tags?: string[] | null
                    benefits?: string[] | null
                    ingredients?: string[] | null
                    is_bestseller?: boolean
                    is_new?: boolean
                    metadata?: Json | null
                }
            }
            product_variants: {
                Row: {
                    id: string
                    product_id: string
                    name: string
                    sku: string | null
                    stock: number
                    metadata: Json | null
                }
                Insert: {
                    id?: string
                    product_id: string
                    name: string
                    sku?: string | null
                    stock?: number
                    metadata?: Json | null
                }
                Update: {
                    id?: string
                    product_id?: string
                    name?: string
                    sku?: string | null
                    stock?: number
                    metadata?: Json | null
                }
            }
            product_prices: {
                Row: {
                    id: string
                    product_id: string
                    variant_id: string | null
                    currency: "INR" | "SAR"
                    amount: number
                    compare_at_amount: number | null
                }
                Insert: {
                    id?: string
                    product_id: string
                    variant_id?: string | null
                    currency: "INR" | "SAR"
                    amount: number
                    compare_at_amount?: number | null
                }
                Update: {
                    id?: string
                    product_id?: string
                    variant_id?: string | null
                    currency?: "INR" | "SAR"
                    amount?: number
                    compare_at_amount?: number | null
                }
            }
            orders: {
                Row: {
                    id: string
                    created_at: string
                    user_id: string | null
                    status: string
                    email: string
                    phone: string | null
                    shipping_address: Json
                    currency: "INR" | "SAR"
                    total_amount: number
                    payment_method: string
                    payment_status: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    user_id?: string | null
                    status?: string
                    email: string
                    phone?: string | null
                    shipping_address: Json
                    currency: "INR" | "SAR"
                    total_amount: number
                    payment_method: string
                    payment_status?: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    user_id?: string | null
                    status?: string
                    email?: string
                    phone?: string | null
                    shipping_address?: Json
                    currency?: "INR" | "SAR"
                    total_amount?: number
                    payment_method?: string
                    payment_status?: string
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string
                    variant_id: string | null
                    quantity: number
                    price_amount: number
                    currency: string
                    product_name: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    product_id: string
                    variant_id?: string | null
                    quantity: number
                    price_amount: number
                    currency: string
                    product_name: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    product_id?: string
                    variant_id?: string | null
                    quantity?: number
                    price_amount?: number
                    currency?: string
                    product_name?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    email: string | null
                    role: "admin" | "customer"
                    created_at: string
                }
                Insert: {
                    id: string
                    email?: string | null
                    role?: "admin" | "customer"
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    role?: "admin" | "customer"
                    created_at?: string
                }
            }
        }
    }
}
