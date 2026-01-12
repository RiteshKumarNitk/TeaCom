-- Seed Data for TeaCom (Updated with Valid UUIDs)

-- 1. Insert Products
INSERT INTO products (id, slug, name, description, category, images, tags, benefits, is_bestseller)
VALUES 
-- 1. New Year Wellness Resolution Pack
(
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'new-year-wellness-pack',
  'New Year Wellness Resolution Pack - Pack of 3',
  'Start your year with holistic wellness. Includes 3 premium blends for skin health and calmness.',
  'Wellness',
  ARRAY['/placeholder-tea-1.jpg'],
  ARRAY['Pack of 3', 'Gift Set'],
  ARRAY['Skin Health', 'Calmness'],
  true
),
-- 2. Butterfly Pea Flower Herbal Tea - 200 Teabags
(
  'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
  'butterfly-pea-200',
  'Butterfly Pea Flower Herbal Tea - 200 Teabags',
  'Rich in antioxidants, this herbal tea supports fitness and metabolic health.',
  'Herbal Tea',
  ARRAY['/placeholder-tea-2.jpg'],
  ARRAY['200 Teabags', 'Herbal'],
  ARRAY['Supports Fitness', 'Boosts Energy'],
  true
),
-- 3. Belly Fat Monthly Pack
(
  'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
  'belly-fat-monthly-pack',
  'Belly Fat Monthly Pack - 120 Tea Bags',
  'A curated monthly pack designed to support metabolism and immunity.',
  'Wellness',
  ARRAY['/placeholder-tea-3.jpg'],
  ARRAY['Weight Management', 'Monthly Pack'],
  ARRAY['Metabolic Support', 'Boosts Immunity'],
  true
),
-- 4. Hibiscus Classic Herbal Tea - 120 Teabags
(
  'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14',
  'hibiscus-classic-120',
  'Hibiscus Classic Herbal Tea - 120 Teabags',
  'Tangy and refreshing hibiscus tea known for its skin brightening properties.',
  'Herbal Tea',
  ARRAY['/placeholder-tea-4.jpg'],
  ARRAY['120 Teabags', 'Skin Care'],
  ARRAY['Brightens Skin', 'Improves Immunity'],
  false
),
-- 5. Gut Cleanse Herbal Tea
(
  'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15',
  'gut-cleanse-60',
  'Gut Cleanse Herbal Tea - 60 Tea Bags',
  'Gentle herbal blend to support digestive health and relieve bloating.',
  'Wellness',
  ARRAY['/placeholder-tea-1.jpg'],
  ARRAY['Digestion', 'Detox'],
  ARRAY['Improve Gut Health', 'Digestive Tea', 'Bloating Relief'],
  false
),
-- 6. Butterfly Pea Flower Herbal Tea - 100 Teabags
(
  'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16',
  'butterfly-pea-100',
  'Butterfly Pea Flower Herbal Tea - 100 Teabags',
  'A smaller pack of our popular fitness tea.',
  'Herbal Tea',
  ARRAY['/placeholder-tea-2.jpg'],
  ARRAY['100 Teabags', 'Herbal'],
  ARRAY['Supports Fitness', 'Boosts Energy'],
  false
),
-- 7. Liver Cleanse Herbal Tea - 60
(
  'a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17',
  'liver-cleanse-60',
  'Liver Cleanse Herbal Tea - 60 Tea Bags',
  'Supports liver detoxification and boosts metabolism.',
  'Wellness',
  ARRAY['/placeholder-tea-3.jpg'],
  ARRAY['Detox', 'Liver Health'],
  ARRAY['Boosts Metabolism', 'Fatty Liver Detox'],
  false
),
-- 8. Slim Herbal Tea
(
  'b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18',
  'slim-herbal-120',
  'Slim Herbal Tea - 120 Tea Bags',
  'Formulated to reduce bloating and keep you energetic.',
  'Wellness',
  ARRAY['/placeholder-tea-4.jpg'],
  ARRAY['Slimming', 'Energy'],
  ARRAY['Reduces Bloating', 'Boosts Energy'],
  false
),
-- 9. She Balance Herbal Tea
(
  'c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a19',
  'she-balance-60',
  'She Balance Herbal Tea - 60 Tea Bags',
  'A soothing blend for women''s health.',
  'Wellness',
  ARRAY['/placeholder-tea-1.jpg'],
  ARRAY['Women Health', 'Balance'],
  ARRAY['Balances Hormones', 'Relieves Cramps'],
  false
),
-- 10. Hibiscus Classic Herbal Tea - 200 Teabags
(
  'd9eebc99-9c0b-4ef8-bb6d-6bb9bd380a20',
  'hibiscus-classic-200',
  'Hibiscus Classic Herbal Tea - 200 Teabags',
  'Family pack of our skin-brightening hibiscus tea.',
  'Herbal Tea',
  ARRAY['/placeholder-tea-4.jpg'],
  ARRAY['200 Teabags', 'Family Pack'],
  ARRAY['Brightens Skin', 'Improves Immunity'],
  false
),
-- 11. Liver Cleanse Herbal Tea - 120
(
  'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21',
  'liver-cleanse-120',
  'Liver Cleanse Herbal Tea - 120 Tea Bags',
  'Extended detox pack for liver health.',
  'Wellness',
  ARRAY['/placeholder-tea-3.jpg'],
  ARRAY['Detox', 'Value Pack'],
  ARRAY['Boosts Metabolism', 'Fatty Liver Detox'],
  false
);

-- 2. Insert Prices (Multi-Currency)

INSERT INTO product_prices (product_id, currency, amount, compare_at_amount) VALUES 
-- 1. New Year Pack (a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11)
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'INR', 1999, 2999),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SAR', 90, 135),

-- 2. Butterfly Pea 200 (b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12)
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'INR', 1399, 2599),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'SAR', 63, 118),

-- 3. Belly Fat Pack (c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13)
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'INR', 1399, 1999),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'SAR', 63, 90),

-- 4. Hibiscus 120 (d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14)
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'INR', 999, 1996),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'SAR', 45, 90),

-- 5. Gut Cleanse 60 (e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15)
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'INR', 799, 999),
('e4eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'SAR', 36, 45),

-- 6. Butterfly Pea 100 (f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16)
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'INR', 899, 1299),
('f5eebc99-9c0b-4ef8-bb6d-6bb9bd380a16', 'SAR', 40, 59),

-- 7. Liver Cleanse 60 (a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17)
('a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'INR', 749, 799),
('a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a17', 'SAR', 34, 36),

-- 8. Slim 120 (b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18)
('b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'INR', 1299, 1599),
('b7eebc99-9c0b-4ef8-bb6d-6bb9bd380a18', 'SAR', 59, 72),

-- 9. She Balance 60 (c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a19)
('c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'INR', 699, 999),
('c8eebc99-9c0b-4ef8-bb6d-6bb9bd380a19', 'SAR', 31, 45),

-- 10. Hibiscus 200 (d9eebc99-9c0b-4ef8-bb6d-6bb9bd380a20)
('d9eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'INR', 1448, NULL),
('d9eebc99-9c0b-4ef8-bb6d-6bb9bd380a20', 'SAR', 65, NULL),

-- 11. Liver Cleanse 120 (e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21)
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'INR', 1399, 1699),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'SAR', 63, 77);
