-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title text,
    content text,
    is_verified_purchase boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(product_id, user_id) -- One review per product per user
);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Reviews are public" ON reviews;
DROP POLICY IF EXISTS "Users can write reviews" ON reviews;
DROP POLICY IF EXISTS "Users can edit own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;

-- Public read access
CREATE POLICY "Reviews are public" ON reviews FOR SELECT USING (true);

-- Authenticated users can insert
CREATE POLICY "Users can write reviews" ON reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update/delete their own
CREATE POLICY "Users can edit own reviews" ON reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON reviews FOR DELETE
USING (auth.uid() = user_id);

-- Admin management (if needed, usually admins can delete offensive reviews)
-- Assume admin uses service role or has policy
