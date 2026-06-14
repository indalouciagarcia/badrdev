# ============================================
# POLITIQUES RLS SÉCURISÉES — Supabase SQL Editor
# Exécuter APRÈS supabase-schema.sql
# ============================================

-- Supprimer les anciennes politiques ouvertes
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'hero','service_cards','counters','skills','latest_services',
      'education_cards','experiences','portfolio','my_skills',
      'blog_posts','contact_settings','supported_companies','section_headings','messages'
    ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Select all for %s" ON %I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Insert all for %s" ON %I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Update all for %s" ON %I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Delete all for %s" ON %I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Public read %s" ON %I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Admin read %s" ON %I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Admin insert %s" ON %I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Admin update %s" ON %I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Admin delete %s" ON %I', t, t);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "Anyone can insert messages" ON messages;
DROP POLICY IF EXISTS "Anyone can read messages" ON messages;
DROP POLICY IF EXISTS "Anyone can update messages" ON messages;
DROP POLICY IF EXISTS "Anyone can delete messages" ON messages;
DROP POLICY IF EXISTS "Public insert messages" ON messages;
DROP POLICY IF EXISTS "Admin read messages" ON messages;
DROP POLICY IF EXISTS "Admin update messages" ON messages;
DROP POLICY IF EXISTS "Admin delete messages" ON messages;

-- Lecture publique (site vitrine — lignes actives uniquement)
CREATE POLICY "Public read hero" ON hero FOR SELECT USING (is_active = true);
CREATE POLICY "Public read service_cards" ON service_cards FOR SELECT USING (is_active = true);
CREATE POLICY "Public read counters" ON counters FOR SELECT USING (is_active = true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (is_active = true);
CREATE POLICY "Public read latest_services" ON latest_services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read education_cards" ON education_cards FOR SELECT USING (is_active = true);
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (is_active = true);
CREATE POLICY "Public read portfolio" ON portfolio FOR SELECT USING (is_active = true);
CREATE POLICY "Public read my_skills" ON my_skills FOR SELECT USING (is_active = true);
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (is_active = true);
CREATE POLICY "Public read contact_settings" ON contact_settings FOR SELECT USING (is_active = true);
CREATE POLICY "Public read supported_companies" ON supported_companies FOR SELECT USING (is_active = true);
CREATE POLICY "Public read section_headings" ON section_headings FOR SELECT USING (is_active = true);

-- Lecture admin (dashboard — toutes les lignes)
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'hero','service_cards','counters','skills','latest_services',
      'education_cards','experiences','portfolio','my_skills',
      'blog_posts','contact_settings','supported_companies','section_headings'
    ])
  LOOP
    EXECUTE format(
      'CREATE POLICY "Admin read %s" ON %I FOR SELECT USING (auth.role() = ''authenticated'')',
      t, t
    );
    EXECUTE format(
      'CREATE POLICY "Admin insert %s" ON %I FOR INSERT WITH CHECK (auth.role() = ''authenticated'')',
      t, t
    );
    EXECUTE format(
      'CREATE POLICY "Admin update %s" ON %I FOR UPDATE USING (auth.role() = ''authenticated'')',
      t, t
    );
    EXECUTE format(
      'CREATE POLICY "Admin delete %s" ON %I FOR DELETE USING (auth.role() = ''authenticated'')',
      t, t
    );
  END LOOP;
END $$;

-- Messages : formulaire public + gestion admin
CREATE POLICY "Public insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read messages" ON messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update messages" ON messages FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete messages" ON messages FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- CRÉER UN COMPTE ADMIN :
-- Supabase Dashboard → Authentication → Users → Add user
-- ============================================
