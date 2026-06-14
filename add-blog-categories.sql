-- Script pour ajouter la gestion des catégories de blog

-- 1. Création de la table des catégories
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer quelques catégories par défaut
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

-- 2. Ajouter la colonne category_id à la table blog_posts existante
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL;

-- (Optionnel) Assigner la première catégorie par défaut aux articles existants s'ils n'en ont pas
UPDATE blog_posts 
SET category_id = (SELECT id FROM blog_categories LIMIT 1)
WHERE category_id IS NULL;

-- 3. Sécurité RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all for blog_categories" ON blog_categories FOR ALL USING (true) WITH CHECK (true);
