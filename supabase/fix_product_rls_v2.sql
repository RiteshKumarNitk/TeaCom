-- FIX PRODUCT RLS AND ADD WEIGHT UNITS

-- 1. Add Weight Columns to Product Variants
ALTER TABLE product_variants 
ADD COLUMN IF NOT EXISTS weight_value numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS weight_unit text DEFAULT 'g';

-- 2. RESET RLS POLICIES FOR PRODUCTS
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;

-- Create helper function for admin check if not exists
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin', 'operations', 'content_manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Products Policies
DROP POLICY IF EXISTS "Public can view products" ON products;
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert products" ON products;
CREATE POLICY "Admins can insert products" ON products FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update products" ON products;
CREATE POLICY "Admins can update products" ON products FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete products" ON products;
CREATE POLICY "Admins can delete products" ON products FOR DELETE USING (public.is_admin());

-- Product Variants Policies
DROP POLICY IF EXISTS "Public can view variants" ON product_variants;
CREATE POLICY "Public can view variants" ON product_variants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert variants" ON product_variants;
CREATE POLICY "Admins can insert variants" ON product_variants FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update variants" ON product_variants;
CREATE POLICY "Admins can update variants" ON product_variants FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete variants" ON product_variants;
CREATE POLICY "Admins can delete variants" ON product_variants FOR DELETE USING (public.is_admin());

-- Product Prices Policies
DROP POLICY IF EXISTS "Public can view prices" ON product_prices;
CREATE POLICY "Public can view prices" ON product_prices FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert prices" ON product_prices;
CREATE POLICY "Admins can insert prices" ON product_prices FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can update prices" ON product_prices;
CREATE POLICY "Admins can update prices" ON product_prices FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete prices" ON product_prices;
CREATE POLICY "Admins can delete prices" ON product_prices FOR DELETE USING (public.is_admin());
