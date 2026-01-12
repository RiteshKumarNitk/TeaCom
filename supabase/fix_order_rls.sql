-- FiX RLS for Orders (Admin Access)
-- Currently, admins cannot Update status or View all orders because there is no policy for it.

-- 1. ORDERS TABLE
-- Allow Admins to View All Orders
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
USING (
  auth.uid() IN ( SELECT id FROM profiles WHERE role = 'admin' )
);

-- Allow Admins to Update Orders (Status)
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders"
ON orders FOR UPDATE
USING (
  auth.uid() IN ( SELECT id FROM profiles WHERE role = 'admin' )
);

-- 2. ORDER ITEMS TABLE
-- Allow Admins to View All Items
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
CREATE POLICY "Admins can view all order items"
ON order_items FOR SELECT
USING (
  auth.uid() IN ( SELECT id FROM profiles WHERE role = 'admin' )
);
