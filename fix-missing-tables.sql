-- ============================================================
-- SCRIPT DE CONFIGURATION COMPLÈTE DES TABLES MANQUANTES
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. TABLE PROFILE
-- ============================================================
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cv_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO profile (name, title, description)
SELECT 
  'Badr Belabbes', 
  'Développeur Full Stack Senior', 
  'Passionné de développement web et mobile depuis 13 ans. Spécialisé React, Node.js, Laravel et développement mobile.'
WHERE NOT EXISTS (SELECT 1 FROM profile);

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for profile" ON profile;
CREATE POLICY "Enable all for profile" ON profile FOR ALL USING (true) WITH CHECK (true);


-- 2. TABLE SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  level INT DEFAULT 80,
  category VARCHAR(100) DEFAULT 'Frontend',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO skills (name, level, category) 
SELECT * FROM (VALUES
  ('React / Next.js', 95, 'Frontend'),
  ('Vue.js', 85, 'Frontend'),
  ('TypeScript', 88, 'Frontend'),
  ('Node.js / Express', 90, 'Backend'),
  ('PHP / Laravel', 88, 'Backend'),
  ('Supabase / PostgreSQL', 85, 'Database'),
  ('MongoDB', 80, 'Database'),
  ('React Native', 82, 'Mobile'),
  ('Flutter', 75, 'Mobile'),
  ('UI/UX Design', 85, 'Design'),
  ('Figma', 80, 'Design'),
  ('Docker', 78, 'DevOps')
) AS v(name, level, category)
WHERE NOT EXISTS (SELECT 1 FROM skills LIMIT 1);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for skills" ON skills;
CREATE POLICY "Enable all for skills" ON skills FOR ALL USING (true) WITH CHECK (true);


-- 3. TABLE BLOG_CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO blog_categories (name, slug)
SELECT 'Développement Web', 'developpement-web'
WHERE NOT EXISTS (SELECT 1 FROM blog_categories WHERE slug = 'developpement-web');

INSERT INTO blog_categories (name, slug)
SELECT 'UI/UX Design', 'ui-ux-design'
WHERE NOT EXISTS (SELECT 1 FROM blog_categories WHERE slug = 'ui-ux-design');

INSERT INTO blog_categories (name, slug)
SELECT 'Tutoriels', 'tutoriels'
WHERE NOT EXISTS (SELECT 1 FROM blog_categories WHERE slug = 'tutoriels');

INSERT INTO blog_categories (name, slug)
SELECT 'Actualités', 'actualites'
WHERE NOT EXISTS (SELECT 1 FROM blog_categories WHERE slug = 'actualites');

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for blog_categories" ON blog_categories;
CREATE POLICY "Enable all for blog_categories" ON blog_categories FOR ALL USING (true) WITH CHECK (true);


-- 4. TABLE BLOG_POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter les colonnes manquantes si la table existe déjà
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL;

-- Insérer un article de test
INSERT INTO blog_posts (title, slug, content, excerpt, status)
SELECT 
  'Pourquoi utiliser Supabase avec React ?',
  'supabase-avec-react',
  'Supabase est une excellente alternative open-source à Firebase. Avec son API REST auto-générée et ses fonctionnalités en temps réel, il simplifie énormément le développement full-stack...',
  'Découvrez pourquoi Supabase est devenu mon backend préféré pour les projets React.',
  'published'
WHERE NOT EXISTS (SELECT 1 FROM blog_posts LIMIT 1);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for blog_posts" ON blog_posts;
CREATE POLICY "Enable all for blog_posts" ON blog_posts FOR ALL USING (true) WITH CHECK (true);


-- 5. TABLE MESSAGES (si pas encore créée)
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for messages" ON messages;
CREATE POLICY "Enable all for messages" ON messages FOR ALL USING (true) WITH CHECK (true);


-- ============================================================
-- VÉRIFICATION FINALE
-- ============================================================
SELECT 
  table_name,
  (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as nb_colonnes
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('profile', 'skills', 'blog_posts', 'blog_categories', 'messages', 'quote_requests', 'quote_options')
ORDER BY table_name;
