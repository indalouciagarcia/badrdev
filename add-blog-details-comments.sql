-- =========================================================================
-- SCRIPT DE MIGRATION POUR LE BLOG (COMMENTAIRES, TAGS & KEYWORDS)
-- Exécutez ce script dans l'éditeur SQL de votre tableau de bord Supabase
-- =========================================================================

-- 1. AJOUT DES COLONNES DE MÉTADONNÉES AU BLOG
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author VARCHAR(255) DEFAULT 'Badr Belabbes';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category VARCHAR(255) DEFAULT 'Web Design';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS keywords TEXT DEFAULT 'React, Web, Frontend';

-- 2. CRÉATION DE LA TABLE DES COMMENTAIRES DE BLOG
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS pour blog_comments
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read comments" ON blog_comments;
CREATE POLICY "Public read comments" ON blog_comments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert comments" ON blog_comments;
CREATE POLICY "Public insert comments" ON blog_comments
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin modify comments" ON blog_comments;
CREATE POLICY "Admin modify comments" ON blog_comments
  FOR ALL USING (true) WITH CHECK (true);
