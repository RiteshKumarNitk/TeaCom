-- Content Management Schema

-- 1. Blog Posts
CREATE TABLE IF NOT EXISTS posts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    excerpt text,
    content text, -- Markdown or HTML
    cover_image text,
    author_id uuid REFERENCES auth.users(id),
    is_published boolean DEFAULT false,
    published_at timestamptz,
    tags text[], -- Array of strings
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. Recipes
CREATE TABLE IF NOT EXISTS recipes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    image text,
    ingredients jsonb, -- Array of strings or objects
    instructions jsonb, -- Array of steps
    prep_time text,
    difficulty text,
    servings integer,
    is_published boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 3. RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- 4. Policies

-- Public Read
CREATE POLICY "Public posts" ON posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public recipes" ON recipes FOR SELECT USING (is_published = true);

-- Admin Full Access
CREATE POLICY "Admins manage posts" ON posts FOR ALL USING (
  exists (select 1 from admin_roles where user_id = auth.uid() and role in ('super_admin', 'admin', 'content_manager'))
);

CREATE POLICY "Admins manage recipes" ON recipes FOR ALL USING (
  exists (select 1 from admin_roles where user_id = auth.uid() and role in ('super_admin', 'admin', 'content_manager'))
);
