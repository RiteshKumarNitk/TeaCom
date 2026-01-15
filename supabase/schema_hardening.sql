-- SCHEMA HARDENING & PAYMENTS SETUP (Phase 5 Foundation)

-- 1. Ensure Enums Exist (Idempotent)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_type') THEN
        CREATE TYPE order_status_type AS ENUM ('pending', 'paid', 'packed', 'shipped', 'delivered', 'returned', 'refunded', 'cancelled');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'return_status_type') THEN
        CREATE TYPE return_status_type AS ENUM ('requested', 'approved', 'rejected', 'received', 'refunded');
    END IF;
END $$;

-- 2. Hardening Foreign Keys (Cascade & Set Null)
-- Dropping constraints first to avoid "already exists" errors during re-runs
DO $$ BEGIN
  -- Order Items
  ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;
  ALTER TABLE order_items ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

  ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
  ALTER TABLE order_items ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

  ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_variant_id_fkey;
  ALTER TABLE order_items ADD CONSTRAINT order_items_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL;

  -- Returns
  ALTER TABLE returns DROP CONSTRAINT IF EXISTS returns_order_id_fkey;
  ALTER TABLE returns ADD CONSTRAINT returns_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

  ALTER TABLE returns DROP CONSTRAINT IF EXISTS returns_user_id_fkey;
  ALTER TABLE returns ADD CONSTRAINT returns_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
END $$;

-- 3. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at);
CREATE INDEX IF NOT EXISTS idx_returns_status ON returns (status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants (product_id);

-- 4. User Addresses (Saved Addresses)
-- Note: We do NOT replace orders.shipping_address (JSON) yet, to preserve historical data snapshot accuracy.
CREATE TABLE IF NOT EXISTS addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  phone text,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- RLS for Addresses
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own addresses" ON addresses FOR ALL USING (auth.uid() = user_id);


-- 5. Payments Table (New for Phase 5)
CREATE TABLE IF NOT EXISTS payments (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  
  -- Provider details
  provider text not null, -- 'stripe', 'razorpay', 'cod'
  provider_payment_id text, -- e.g. pi_12345 or pay_Order123
  
  amount numeric not null,
  currency text not null default 'INR',
  status text not null, -- 'pending', 'succeeded', 'failed', 'refunded'
  
  method_details jsonb, -- e.g. { brand: 'visa', last4: '4242' }
  metadata jsonb,
  
  created_at timestamptz default now()
);

-- RLS for Payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
-- Users can view their own payments via order
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid())
);
-- Admins can manage all
CREATE POLICY "Admins manage all payments" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin', 'operations', 'support_agent'))
);


-- 6. Soft Deletes (Adding Columns)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE products ADD COLUMN IF NOT EXISTS deleted_at timestamptz;


-- 7. Email Validation Constraint
DO $$ BEGIN
  ALTER TABLE orders ADD CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
EXCEPTION
  WHEN duplicate_object THEN NULL; -- Constraint already exists
END $$;
