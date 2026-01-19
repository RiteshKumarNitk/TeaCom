-- Add Tracking Columns to Orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS tracking_number text,
ADD COLUMN IF NOT EXISTS carrier text,
ADD COLUMN IF NOT EXISTS notes text;

-- Add index for searching by tracking number
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON orders(tracking_number);
