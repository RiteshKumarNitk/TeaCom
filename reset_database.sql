-- WARNING: This script will delete ALL data from your e-commerce tables. 
-- It does NOT delete your Auth Users in Supabase, but it clears their profiles and roles.

-- 1. Transactions & Orders (Dependents first)
DELETE FROM order_items;
DELETE FROM payments;
DELETE FROM returns;
DELETE FROM orders;

-- 2. Products & Inventory
DELETE FROM inventory;
DELETE FROM product_prices;
DELETE FROM product_collections;
DELETE FROM product_variants;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM collections;

-- 3. Marketing & Engagement
DELETE FROM coupons;
DELETE FROM wishlists;
DELETE FROM notifications;
DELETE FROM posts;

-- 4. Logs & Settings
DELETE FROM audit_logs;
-- DELETE FROM store_settings; -- Uncomment if you want to reset store name/fees too

-- 5. User Roles & Profiles
-- WARNING: Running these will remove your Admin access until you rerun the bootstrap SQL.
DELETE FROM admin_roles;
DELETE FROM profiles;

-- Note: In Supabase, 'profiles' is often triggered by 'auth.users'. 
-- If you delete from 'profiles', you might need to sign out and back in 
-- or manually re-insert your admin status.
