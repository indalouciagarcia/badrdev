-- Table de paramètres généraux du site (clé/valeur)
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT,
  label VARCHAR(255),
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for site_settings" ON site_settings;
CREATE POLICY "Enable all for site_settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- Insérer les paramètres par défaut
INSERT INTO site_settings (key, value, label, description) VALUES
  ('ga_measurement_id', '', 'Google Analytics Measurement ID', 'Identifiant GA4 (ex: G-XXXXXXXXXX). Laissez vide pour désactiver.'),
  ('ga_enabled', 'false', 'Google Analytics activé', 'Active ou désactive le tracking Google Analytics.'),
  ('site_title', 'Badr Belabbes — Développeur Full Stack', 'Titre du site', 'Titre affiché dans l''onglet du navigateur.'),
  ('meta_description', 'Développeur Full Stack Senior — React, Node.js, Laravel, Mobile', 'Meta description', 'Description affichée dans les résultats Google.')
ON CONFLICT (key) DO NOTHING;
