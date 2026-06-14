-- =========================================================================
-- SCRIPT DE MIGRATION CONSOLIDÉ POUR SUPABASE
-- Exécutez ce script dans l'éditeur SQL de votre tableau de bord Supabase
-- =========================================================================

-- 1. CRÉATION DE LA TABLE PROFILE (Règle le problème d'erreur 404)
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

-- Insérer une ligne initiale si vide
INSERT INTO profile (name, title, description)
SELECT 'Badr Belabbes', 'Développeur Full Stack', 'Passionné de développement web et mobile.'
WHERE NOT EXISTS (SELECT 1 FROM profile);

-- RLS pour profile
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for profile" ON profile;
CREATE POLICY "Enable all for profile" ON profile FOR ALL USING (true) WITH CHECK (true);


-- 2. AJOUT DES COLONNES DE DÉTAILS AUX PROJETS
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category VARCHAR(255) DEFAULT 'Développement Web';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '/assets/images/latest-portfolio/portfoli-img-1.jpg';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS client VARCHAR(255) DEFAULT 'Badr Belabbes';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_date VARCHAR(100) DEFAULT TO_CHAR(NOW(), 'DD Month YYYY');
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tags TEXT DEFAULT 'React, Node.js, Supabase';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS mini_title VARCHAR(255) DEFAULT 'Élever votre entreprise avec des solutions IT';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS sub_description TEXT DEFAULT 'Description supplémentaire détaillant l''architecture ou le contexte du projet.';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery_images TEXT DEFAULT '/assets/images/projects-details/project-detials-swiper-img-1.jpg,/assets/images/projects-details/project-detials-swiper-img-2.png';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS features TEXT DEFAULT 'Design UI/UX, Développement d''applications, Intégration de services';


-- 3. CONFIGURATION DU STOCKAGE DE FICHIERS (BUCKET POUR LES PHOTOS)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques d'accès pour le bucket de stockage 'portfolio'
DROP POLICY IF EXISTS "Public Read Objects" ON storage.objects;
CREATE POLICY "Public Read Objects" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio');

DROP POLICY IF EXISTS "Public Insert Objects" ON storage.objects;
CREATE POLICY "Public Insert Objects" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio');

DROP POLICY IF EXISTS "Public Update Objects" ON storage.objects;
CREATE POLICY "Public Update Objects" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portfolio');

DROP POLICY IF EXISTS "Public Delete Objects" ON storage.objects;
CREATE POLICY "Public Delete Objects" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio');
