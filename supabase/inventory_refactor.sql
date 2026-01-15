-- PHASE 5: Schema Refinements & Inventory Separation

-- 1. Add Missing Indexes (Performance)
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items (product_id);
CREATE INDEX IF NOT EXISTS idx_returns_user_id ON returns (user_id);
CREATE INDEX IF NOT EXISTS idx_returns_order_id ON returns (order_id);

-- 2. Create Inventory Table (Separation of concerns)
CREATE TABLE IF NOT EXISTS inventory (
  product_variant_id uuid PRIMARY KEY REFERENCES product_variants(id) ON DELETE CASCADE,
  stock integer NOT NULL DEFAULT 0,
  reserved integer NOT NULL DEFAULT 0, -- Useful for "cart hold" or "pending payment" later
  updated_at timestamptz DEFAULT now()
);

-- RLS for Inventory
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Admins manage inventory" ON inventory FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin', 'operations'))
);

-- 3. Migrate Data from product_variants to inventory
INSERT INTO inventory (product_variant_id, stock)
SELECT id, stock FROM product_variants
ON CONFLICT (product_variant_id) DO UPDATE SET stock = EXCLUDED.stock;

-- 4. Update Low Stock View to use Inventory table
CREATE OR REPLACE VIEW low_stock_alerts AS
SELECT 
  pv.id as variant_id,
  pv.name as variant_name,
  pv.sku,
  inv.stock,
  p.id as product_id,
  p.name as product_name,
  p.slug as product_slug
FROM product_variants pv
JOIN products p ON pv.product_id = p.id
JOIN inventory inv ON pv.id = inv.product_variant_id
WHERE inv.stock < 10;
