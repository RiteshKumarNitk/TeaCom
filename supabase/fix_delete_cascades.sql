-- FIX PRODUCT DELETION CASCADES
-- We need to ensure that deleting a product also deletes its variants and prices.
-- And deleting variants deletes inventory.
-- AND VERY IMPORTANT: We must handle order_items. 
-- In a real e-commerce system, we would Soft Delete (is_archived).
-- But if the user wants hard delete, we must either Cascade or Set Null.
-- Typically for historical integrity, Set Null is better for order_items if we hard delete product.
-- Or we block deletion if orders exist.

-- Let's enable CASCADE for standard child tables (variants, prices)
-- And for Order Items, let's DROP the constraint and re-add it with ON DELETE SET NULL
-- so that orders remain but point to null product (preserving the snapshot name/price).

-- 1. Product Prices
ALTER TABLE product_prices
DROP CONSTRAINT IF EXISTS product_prices_product_id_fkey,
ADD CONSTRAINT product_prices_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;

-- 2. Product Variants
-- First drop child dependencies of variants
ALTER TABLE inventory
DROP CONSTRAINT IF EXISTS inventory_product_variant_id_fkey,
ADD CONSTRAINT inventory_product_variant_id_fkey
FOREIGN KEY (product_variant_id)
REFERENCES product_variants(id)
ON DELETE CASCADE;

ALTER TABLE product_variants
DROP CONSTRAINT IF EXISTS product_variants_product_id_fkey,
ADD CONSTRAINT product_variants_product_id_fkey
FOREIGN KEY (product_id)
REFERENCES products(id)
ON DELETE CASCADE;

-- 3. Order Items (Protect History)
-- If we delete a product, we don't want to delete the order history.
-- We should set product_id to NULL. But product_id is NOT NULL in schema.
-- So we must ALTER column to allow NULL, then set FK to Set Null.
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
