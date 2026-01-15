-- PHASE 5: Final Schema Polish

-- 1. Soft Deletes for other entities
ALTER TABLE categories ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE addresses ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
-- (Orders and Products already have it from previous script)

-- 2. Payment Status Enum
-- User requested explicit enum for payment status.
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_type') THEN
        CREATE TYPE payment_status_type AS ENUM ('pending', 'completed', 'failed', 'refunded');
    END IF;
END $$;

-- Optional: Convert or ensuring consistency. 
-- Since 'payments' table is new and likely empty, we can cast it now.
-- But 'provider' status might be complex text (e.g. 'requires_action'). 
-- WE WILL KEEP 'status' as TEXT in DB for flexibility with Gateways, 
-- but application logic should map to these states.
-- OR if user strictly wants the column to be enum:
-- ALTER TABLE payments ALTER COLUMN status TYPE payment_status_type USING status::payment_status_type;

-- 3. Additional Indexes (Wishlists, etc)
CREATE TABLE IF NOT EXISTS wishlists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists (user_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories (slug);
