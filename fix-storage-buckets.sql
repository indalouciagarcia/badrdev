-- =========================================================================
-- SCRIPT DE FIXATION DES BUCKETS DE STOCKAGE SUPABASE
-- Exécutez ce script dans l'éditeur SQL de votre tableau de bord Supabase
-- pour configurer correctement les buckets et leurs politiques de sécurité (RLS).
-- =========================================================================

-- 1. Création des buckets s'ils n'existent pas
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('profile', 'profile', true),
  ('blog', 'blog', true),
  ('project', 'project', true),
  ('projet', 'projet', true),
  ('portfolio', 'portfolio', true),
  ('uploads', 'uploads', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Suppression des anciennes politiques restrictives pour éviter les conflits
DROP POLICY IF EXISTS "Public Read Objects" ON storage.objects;
DROP POLICY IF EXISTS "Public Insert Objects" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Objects" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Objects" ON storage.objects;

DROP POLICY IF EXISTS "Storage Read Policy" ON storage.objects;
DROP POLICY IF EXISTS "Storage Insert Policy" ON storage.objects;
DROP POLICY IF EXISTS "Storage Update Policy" ON storage.objects;
DROP POLICY IF EXISTS "Storage Delete Policy" ON storage.objects;

-- 3. Création des politiques universelles (Lecture, Insertion, Modification, Suppression)
-- pour tous les buckets requis
CREATE POLICY "Storage Read Policy" ON storage.objects
  FOR SELECT USING (bucket_id IN ('profile', 'blog', 'project', 'projet', 'portfolio', 'uploads'));

CREATE POLICY "Storage Insert Policy" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('profile', 'blog', 'project', 'projet', 'portfolio', 'uploads'));

CREATE POLICY "Storage Update Policy" ON storage.objects
  FOR UPDATE USING (bucket_id IN ('profile', 'blog', 'project', 'projet', 'portfolio', 'uploads'))
  WITH CHECK (bucket_id IN ('profile', 'blog', 'project', 'projet', 'portfolio', 'uploads'));

CREATE POLICY "Storage Delete Policy" ON storage.objects
  FOR DELETE USING (bucket_id IN ('profile', 'blog', 'project', 'projet', 'portfolio', 'uploads'));
