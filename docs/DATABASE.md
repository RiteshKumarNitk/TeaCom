# Database Schema Documentation

The application uses **Supabase (PostgreSQL)** as its database. Below is a detailed reference of the tables, their purpose, and key relationships.

## 📊 Core Tables

### `products`
The central catalog of items.
- **id**: UUID (Primary Key)
- **name, slug**: Identification and URL friendly names.
- **description, ingredients, benefits**: Rich text content.
- **images**: Array of image URLs.
- **category**: Product category.
- **is_bestseller, is_new**: Flags for UI highlighting.

### `product_variants`
Manages SKUs and stock levels for products (e.g., different sizes or packaging).
- **product_id**: Foreign key to `products`.
- **sku**: Stock Keeping Unit code.
- **stock**: Current inventory count.

### `product_prices`
Handles multi-currency pricing for each product variant.
- **product_id**: Foreign key to `products`.
- **variant_id**: Optional foreign key to `product_variants`.
- **currency**: Enum (`INR`, `SAR`).
- **amount**: Selling price.
- **compare_at_amount**: Original/Strike-through price.

### `inventory`
Tracks precise stock availability and reservations (e.g., items in cart).
- **product_variant_id**: Foreign key to variants.
- **stock**: Available quantity.
- **reserved**: Quantity currently held in active carts/checkout sessions.

---

## 🛍️ Order Management

### `orders`
Stores all transactional data.
- **id**: UUID.
- **user_id**: Link to `profiles` (nullable for guest checkout).
- **status**: `pending`, `paid`, `packed`, `shipped`, `delivered`, `returned`, `refunded`, `cancelled`.
- **currency**: `INR` or `SAR`.
- **total_amount**: Final charge.
- **payment_status**: Status of the payment transaction.
- **shipping_address**: JSON blob containing the destination.
- **coupon_code, discount_amount**: Discount tracking.

### `order_items`
Line items for each order.
- **order_id**: Link to parent order.
- **product_id, variant_id**: Links to catalog.
- **quantity, price_amount**: Snapshot of cost at time of purchase.

### `payments`
Records payment provider transactions.
- **order_id**: Link to `orders`.
- **provider**: e.g., 'stripe', 'cod'.
- **status**: Payment outcome.

### `returns`
Manages post-purchase return requests.
- **order_id**: Link to original order.
- **status**: `requested`, `approved`, `rejected`, etc.
- **reason**: Customer provided reason.
- **admin_notes**: Internal notes for support staff.

---

## 👤 User & Auth

### `profiles`
Extensions to the base Supabase `auth.users` table.
- **id**: Matches `auth.users` UUID.
- **role**: `admin` or `customer`.
- **email**: Contact email.

### `addresses`
Saved shipping addresses for users.
- **user_id**: Owner.
- **is_default**: Boolean flag to auto-select at checkout.

### `admin_accounts` & `admin_roles`
Granular access control for dashboard users.
- **role**: `super_admin`, `admin`, `operations`, `content_manager`, `support_agent`.

---

## 📢 Content & Marketing

### `coupons`
Discount codes logic.
- **code**: The string user types (e.g., "SUMMER20").
- **discount_type**: `percentage` or `fixed`.
- **usage_limit, usage_count**: Abuse prevention.
- **expires_at**: Time-based validity.

### `posts`
Blog content management.
- **title, slug, content**: Article data.
- **is_published**: Visibility toggle.

### `store_settings`
Global configuration for the storefront.
- **shipping_fee_inr/sar**: Base shipping costs.
- **free_shipping_threshold**: Amount to quality for free shipping.
- **tax_rate**: VAT/GST percentages.

---

## ⚡ Database Functions (RPC)

- **`increment_coupon_usage(coupon_code)`**: Atomic increment to prevent race conditions.
- **`get_revenue_stats(days_lookback)`**: Aggregates daily sales for charts.
- **`get_top_products(limit_count)`**: Returns best performers by quantity and revenue.
