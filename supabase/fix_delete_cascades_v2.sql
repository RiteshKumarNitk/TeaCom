-- FIX PRODUCT DELETION CASCADES (COMPLETE)
-- This script ensures that deleting a product doesn't fail due to foreign keys.
-- 1. Related variants/prices -> CASCADE (Delete them too)
-- 2. Order Items -> SET NULL (Keep order history, but unlink from deleted product)
-- 3. Wishlists -> CASCADE (Remove from wishlists)
-- 4. Inventory -> CASCADE (Handled via variants)

-- 1. Product Prices
ALTER TABLE product_prices
DROP CONSTRAINT IF EXISTS product_prices_product_id_fkey,
ADD CONSTRAINT product_prices_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;

-- 2. Product Variants (and Inventory)
-- First drop child dependencies of variants (Inventory)
ALTER TABLE inventory
DROP CONSTRAINT IF EXISTS inventory_product_variant_id_fkey,
ADD CONSTRAINT inventory_product_variant_id_fkey
FOREIGN KEY (product_variant_id)
REFERENCES product_variants(id)
ON DELETE CASCADE;

-- Then Variants itself
ALTER TABLE product_variants
DROP CONSTRAINT IF EXISTS product_variants_product_id_fkey,
ADD CONSTRAINT product_variants_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;

-- 3. Order Items (Critical: Preserve History)
-- If we delete a product, we don't want to delete the order history.
-- We set product_id to NULL. 
ALTER TABLE order_items
ALTER COLUMN product_id DROP NOT NULL;

ALTER TABLE order_items
DROP CONSTRAINT IF EXISTS order_items_product_id_fkey,
ADD CONSTRAINT order_items_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE SET NULL;

-- Also for variant_id in order_items
ALTER TABLE order_items
DROP CONSTRAINT IF EXISTS order_items_variant_id_fkey,
ADD CONSTRAINT order_items_variant_id_fkey
FOREIGN KEY (variant_id)
REFERENCES product_variants(id)
ON DELETE SET NULL;

-- 4. Wishlists (Cascade Delete)
-- If a product is gone, remove it from wishlists.
ALTER TABLE wishlists
DROP CONSTRAINT IF EXISTS wishlists_product_id_fkey,
ADD CONSTRAINT wishlists_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;

-- 5. Product Collections (Cascade Delete - already verified but reinforcing)
ALTER TABLE product_collections
DROP CONSTRAINT IF EXISTS product_collections_product_id_fkey,
ADD CONSTRAINT product_collections_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;
