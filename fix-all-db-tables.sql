-- =========================================================================
-- SCRIPT DE CORRECTION DES TABLES & COLONNES DE BASE DE DONNÉES SUPABASE
-- Exécutez ce script dans l'éditeur SQL de votre tableau de bord Supabase
-- pour installer les tables et les colonnes manquantes.
-- =========================================================================

-- 1. Ajout des colonnes de métadonnées au blog (si manquantes)
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author VARCHAR(255) DEFAULT 'Badr Belabbes';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS keywords TEXT DEFAULT 'React, Web, Frontend';

-- 2. Création de la table des commentaires de blog
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Sécurité Row-Level Security (RLS) pour blog_comments
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- 4. Politiques d'accès pour les commentaires
DROP POLICY IF EXISTS "Public read comments" ON blog_comments;
CREATE POLICY "Public read comments" ON blog_comments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert comments" ON blog_comments;
CREATE POLICY "Public insert comments" ON blog_comments
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin modify comments" ON blog_comments;
CREATE POLICY "Admin modify comments" ON blog_comments
  FOR ALL USING (true) WITH CHECK (true);
