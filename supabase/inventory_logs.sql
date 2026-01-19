-- Create inventory_logs table
CREATE TABLE IF NOT EXISTS inventory_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    product_variant_id uuid REFERENCES product_variants(id) ON DELETE CASCADE,
    change_amount integer NOT NULL,
    previous_stock integer NOT NULL,
    new_stock integer NOT NULL,
    reason text,
    actor_id uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_inventory_logs_variant_id ON inventory_logs (product_variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_created_at ON inventory_logs (created_at);

-- RLS
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view inventory logs" ON inventory_logs
    FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin', 'operations'))
    );

CREATE POLICY "Admins can insert inventory logs" ON inventory_logs
    FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin', 'operations'))
    );

-- Also allow service role (for checkout actions etc) which bypasses RLS anyway, but good to be explicit if using standard client.
-- However, standard client for checkout might act as user. Users shouldn't write to inventory_logs directly.
-- The checkout action uses supabaseAdmin (service role) so it bypasses RLS.
