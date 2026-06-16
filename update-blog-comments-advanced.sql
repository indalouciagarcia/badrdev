-- =========================================================================
-- MIGRATION POUR LA GESTION AVANCÉE DES COMMENTAIRES, ABONNEMENTS ET BLACKLIST
-- =========================================================================

-- 1. Ajout de la colonne status à la table blog_comments (statuts: 'pending', 'diffused')
ALTER TABLE blog_comments ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';

-- 2. Création de la table des utilisateurs abonnés (pour autoriser le commentaire)
CREATE TABLE IF NOT EXISTS blog_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_blacklisted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Ajout de contrainte de clé étrangère optionnelle ou lien logique dans blog_comments
-- Nous lions le commentaire à un email d'abonné
ALTER TABLE blog_comments ADD COLUMN IF NOT EXISTS subscriber_id UUID REFERENCES blog_subscribers(id) ON DELETE SET NULL;

-- 4. Activer la RLS
ALTER TABLE blog_subscribers ENABLE ROW LEVEL SECURITY;

-- Politiques RLS publiques pour blog_subscribers
DROP POLICY IF EXISTS "Public select blog_subscribers" ON blog_subscribers;
CREATE POLICY "Public select blog_subscribers" ON blog_subscribers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert blog_subscribers" ON blog_subscribers;
CREATE POLICY "Public insert blog_subscribers" ON blog_subscribers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin all blog_subscribers" ON blog_subscribers;
CREATE POLICY "Admin all blog_subscribers" ON blog_subscribers FOR ALL USING (true) WITH CHECK (true);

-- Politiques RLS publiques pour blog_comments
DROP POLICY IF EXISTS "Public read comments" ON blog_comments;
CREATE POLICY "Public read comments" ON blog_comments FOR SELECT USING (status = 'diffused');

DROP POLICY IF EXISTS "Public insert comments" ON blog_comments;
CREATE POLICY "Public insert comments" ON blog_comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin modify comments" ON blog_comments;
CREATE POLICY "Admin modify comments" ON blog_comments FOR ALL USING (true) WITH CHECK (true);
