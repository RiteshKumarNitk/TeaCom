-- Site Settings / Configuration Table
CREATE TABLE IF NOT EXISTS site_settings (
    key text PRIMARY KEY,
    value jsonb NOT NULL,
    updated_at timestamptz DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id)
);

-- RLS: Public Read, Admin Write
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Settings" ON site_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins Manage Settings" ON site_settings
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
    );

-- Partners Table for "Our Partners" section
CREATE TABLE IF NOT EXISTS partners (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    logo_url text NOT NULL,
    website_url text,
    is_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Partners" ON partners
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins Manage Partners" ON partners
    FOR ALL USING (
        EXISTS (SELECT 1 FROM admin_roles WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin'))
    );

-- Seed Default Settings if not exist
INSERT INTO site_settings (key, value)
VALUES 
    ('general', '{"whatsapp": "+919876543210", "support_email": "support@histormtea.com"}'::jsonb),
    ('home_sections', '{"partners_enabled": true, "featured_enabled": true, "categories_enabled": true, "hero_poster_url": ""}'::jsonb),
    ('footer', '{"about_text": "Experience the finest tea collection.", "copyright_text": "Hi Storm Tea. All rights reserved."}'::jsonb)
ON CONFLICT (key) DO NOTHING;
