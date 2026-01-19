// Define Role Type
export type AdminRole = "super_admin" | "admin" | "operations" | "content_manager" | "support_agent";

// Permission Map
export const PERMISSIONS = {
    "view_dashboard": ["super_admin", "admin", "operations", "content_manager", "support_agent"],
    "manage_products": ["super_admin", "admin", "content_manager", "operations"],
    "manage_orders": ["super_admin", "admin", "operations", "support_agent"],
    "manage_users": ["super_admin", "admin", "support_agent"],
    "manage_finance": ["super_admin", "admin"],
    "manage_marketing": ["super_admin", "admin", "content_manager"],
    "manage_staff": ["super_admin", "admin"],
    "manage_settings": ["super_admin"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export const ROUTE_PERMISSIONS: Record<string, Permission> = {
    "/admin": "view_dashboard",
    "/admin/orders": "manage_orders",
    "/admin/returns": "manage_orders",
    "/admin/products": "manage_products",
    "/admin/inventory": "manage_products",
    "/admin/categories": "manage_products",
    "/admin/collections": "manage_products",
    "/admin/coupons": "manage_marketing",
    "/admin/customers": "manage_users",
    "/admin/staff": "manage_staff",
    "/admin/content": "manage_marketing",
    "/admin/marketing": "manage_marketing",
    "/admin/settings": "manage_settings",
    "/admin/logs": "manage_staff",
    "/admin/analytics": "manage_finance",
};
