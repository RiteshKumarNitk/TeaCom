-- FIX RLS POLICIES for Product Management
-- The previous policies were too restrictive (likely service_role only).
-- This script updates them to allow "Authenticated Users with Admin Profile" to manage products.

-- 1. PRODUCTS TABLE
DROP POLICY IF EXISTS "Admins can insert products." ON products;
CREATE POLICY "Admins can insert products"
ON products FOR INSERT
WITH CHECK (
  auth.uid() IN ( SELECT id FROM profiles WHERE role = 'admin' )
);

DROP POLICY IF EXISTS "Admins can update products." ON products;
CREATE POLICY "Admins can update products"
ON products FOR UPDATE
USING (
  auth.uid() IN ( SELECT id FROM profiles WHERE role = 'admin' )
);

DROP POLICY IF EXISTS "Admins can delete products." ON products;
CREATE POLICY "Admins can delete products"
ON products FOR DELETE
USING (
  auth.uid() IN ( SELECT id FROM profiles WHERE role = 'admin' )
);

-- 2. PRODUCT VARIANTS TABLE
DROP POLICY IF EXISTS "Admins can insert variants." ON product_variants;
CREATE POLICY "Admins can insert variants"
ON product_variants FOR INSERT
WITH CHECK (
  auth.uid() IN ( SELECT id FROM profiles WHERE role = 'admin' )
);

DROP POLICY IF EXISTS "Admins can delete variants." ON product_variants;
CREATE POLICY "Admins can delete variants"
ON product_variants FOR DELETE
USING (
  auth.uid() IN ( SELECT id FROM profiles WHERE role = 'admin' )
);

-- 3. PRODUCT PRICES TABLE
DROP POLICY IF EXISTS "Admins can insert prices." ON product_prices;
CREATE POLICY "Admins can insert prices"
ON product_prices FOR INSERT
WITH CHECK (
  auth.uid() IN ( SELECT id FROM profiles WHERE role = 'admin' )
);

DROP POLICY IF EXISTS "Admins can delete prices." ON product_prices;
CREATE POLICY "Admins can delete prices"
ON product_prices FOR DELETE
USING (
  auth.uid() IN ( SELECT id FROM profiles WHERE role = 'admin' )
);
