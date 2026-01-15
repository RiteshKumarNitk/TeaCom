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
            addresses: {
                Row: {
                    id: string
                    user_id: string
                    full_name: string
                    address_line1: string
                    address_line2: string | null
                    city: string
                    state: string
                    postal_code: string
                    country: string
                    phone: string | null
                    is_default: boolean
                    created_at: string
                    deleted_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    full_name: string
                    address_line1: string
                    address_line2?: string | null
                    city: string
                    state: string
                    postal_code: string
                    country?: string
                    phone?: string | null
                    is_default?: boolean
                    created_at?: string
                    deleted_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    full_name?: string
                    address_line1?: string
                    address_line2?: string | null
                    city?: string
                    state?: string
                    postal_code?: string
                    country?: string
                    phone?: string | null
                    is_default?: boolean
                    created_at?: string
                    deleted_at?: string | null
                }
            },

            payments: {
                Row: {
                    id: string
                    order_id: string
                    provider: string
                    provider_payment_id: string | null
                    amount: number
                    currency: string
                    status: string
                    method_details: Json | null
                    metadata: Json | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    provider: string
                    provider_payment_id?: string | null
                    amount: number
                    currency?: string
                    status: string
                    method_details?: Json | null
                    metadata?: Json | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    provider?: string
                    provider_payment_id?: string | null
                    amount?: number
                    currency?: string
                    status?: string
                    method_details?: Json | null
                    metadata?: Json | null
                    created_at?: string
                }
            },
            admin_accounts: {
                Row: {
                    id: string
                    email: string
                    password_hash: string
                    role: "super_admin" | "admin" | "operations" | "content_manager" | "support_agent"
                    full_name: string | null
                    created_at: string
                    last_login: string | null
                }
                Insert: {
                    id?: string
                    email: string
                    password_hash: string
                    role?: "super_admin" | "admin" | "operations" | "content_manager" | "support_agent"
                    full_name?: string | null
                    created_at?: string
                    last_login?: string | null
                }
                Update: {
                    id?: string
                    email: string
                    password_hash: string
                    role?: "super_admin" | "admin" | "operations" | "content_manager" | "support_agent"
                    full_name?: string | null
                    created_at?: string
                    last_login?: string | null
                }
            }
            admin_roles: {
                Row: {
                    id: string
                    user_id: string
                    role: "super_admin" | "admin" | "operations" | "content_manager" | "support_agent"
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    role?: "super_admin" | "admin" | "operations" | "content_manager" | "support_agent"
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    role?: "super_admin" | "admin" | "operations" | "content_manager" | "support_agent"
                    created_at?: string
                    updated_at?: string
                }
            },
            audit_logs: {
                Row: {
                    id: string
                    actor_id: string | null
                    action: string
                    entity_type: string
                    entity_id: string
                    old_value: Json | null
                    new_value: Json | null
                    ip_address: string | null
                    user_agent: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    actor_id?: string | null
                    action: string
                    entity_type: string
                    entity_id: string
                    old_value?: Json | null
                    new_value?: Json | null
                    ip_address?: string | null
                    user_agent?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    actor_id?: string | null
                    action?: string
                    entity_type?: string
                    entity_id?: string
                    old_value?: Json | null
                    new_value?: Json | null
                    ip_address?: string | null
                    user_agent?: string | null
                    created_at?: string
                }
            },
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    image_url: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    image_url?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    image_url?: string | null
                    is_active?: boolean
                    created_at?: string
                }
            },
            collections: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    image_url: string | null
                    type: string
                    is_active: boolean
                    starts_at: string | null
                    ends_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    image_url?: string | null
                    type?: string
                    is_active?: boolean
                    starts_at?: string | null
                    ends_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    image_url?: string | null
                    type?: string
                    is_active?: boolean
                    starts_at?: string | null
                    ends_at?: string | null
                    created_at?: string
                }
            },
            product_collections: {
                Row: {
                    product_id: string
                    collection_id: string
                }
                Insert: {
                    product_id: string
                    collection_id: string
                }
                Update: {
                    product_id?: string
                    collection_id?: string
                }
            },
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
            },
            inventory: {
                Row: {
                    product_variant_id: string
                    stock: number
                    reserved: number
                    updated_at: string
                }
                Insert: {
                    product_variant_id: string
                    stock?: number
                    reserved?: number
                    updated_at?: string
                }
                Update: {
                    product_variant_id?: string
                    stock?: number
                    reserved?: number
                    updated_at?: string
                }
            },
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
                    status: "pending" | "paid" | "packed" | "shipped" | "delivered" | "returned" | "refunded" | "cancelled"
                    total_amount: number
                    user_id: string | null
                    tracking_number: string | null
                    courier_name: string | null
                    notes: string | null
                    coupon_code: string | null
                    discount_amount: number | null
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
                    status?: "pending" | "paid" | "packed" | "shipped" | "delivered" | "returned" | "refunded" | "cancelled"
                    total_amount: number
                    user_id?: string | null
                    tracking_number?: string | null
                    courier_name?: string | null
                    notes?: string | null
                    coupon_code?: string | null
                    discount_amount?: number | null
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
                    status?: "pending" | "paid" | "packed" | "shipped" | "delivered" | "returned" | "refunded" | "cancelled"
                    total_amount?: number
                    user_id?: string | null
                    tracking_number?: string | null
                    courier_name?: string | null
                    notes?: string | null
                    coupon_code?: string | null
                    discount_amount?: number | null
                }
            },
            returns: {
                Row: {
                    id: string
                    order_id: string
                    user_id: string | null
                    reason: string
                    status: "requested" | "approved" | "rejected" | "received" | "refunded"
                    admin_notes: string | null
                    refund_amount: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    user_id?: string | null
                    reason: string
                    status?: "requested" | "approved" | "rejected" | "received" | "refunded"
                    admin_notes?: string | null
                    refund_amount?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    user_id?: string | null
                    reason?: string
                    status?: "requested" | "approved" | "rejected" | "received" | "refunded"
                    admin_notes?: string | null
                    refund_amount?: number | null
                    created_at?: string
                    updated_at?: string
                }
            },
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
            },
            store_settings: {
                Row: {
                    id: string
                    store_name: string | null
                    support_email: string | null
                    shipping_fee_inr: number
                    shipping_fee_sar: number
                    free_shipping_threshold_inr: number
                    free_shipping_threshold_sar: number
                    tax_rate_inr: number
                    tax_rate_sar: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    store_name?: string | null
                    support_email?: string | null
                    shipping_fee_inr?: number
                    shipping_fee_sar?: number
                    free_shipping_threshold_inr?: number
                    free_shipping_threshold_sar?: number
                    tax_rate_inr?: number
                    tax_rate_sar?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    store_name?: string | null
                    support_email?: string | null
                    shipping_fee_inr?: number
                    shipping_fee_sar?: number
                    free_shipping_threshold_inr?: number
                    free_shipping_threshold_sar?: number
                    tax_rate_inr?: number
                    tax_rate_sar?: number
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Functions: {
            increment_coupon_usage: {
                Args: {
                    coupon_code: string
                }
                Returns: void
            },
            get_revenue_stats: {
                Args: {
                    days_lookback?: number
                }
                Returns: {
                    date_label: string
                    revenue: number
                    orders: number
                }[]
            },
            get_top_products: {
                Args: {
                    limit_count?: number
                }
                Returns: {
                    product_name: string
                    total_sold: number
                    revenue: number
                }[]
            }
        }
    }
}
