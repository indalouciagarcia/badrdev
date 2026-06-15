-- =========================================================================
-- SCRIPT D'AJOUT DES PARAMÈTRES DE LOGO DANS SITE_SETTINGS
-- Exécutez ce script dans l'éditeur SQL de votre tableau de bord Supabase
-- =========================================================================

INSERT INTO site_settings (key, value, label, description) VALUES
  ('header_logo_text', 'Badr Belabbes', 'Texte du logo (Header)', 'Texte affiché à gauche du header si aucun logo image n''est défini.'),
  ('header_logo_dark', '', 'URL Logo Sombre (Header)', 'URL de l''image du logo sombre utilisée pour les fonds clairs (ex: header collant).'),
  ('header_logo_white', '', 'URL Logo Blanc (Header)', 'URL de l''image du logo blanc/lumineux utilisée pour les fonds sombres.'),
  ('footer_logo', '', 'URL Logo (Footer)', 'URL de l''image du logo affiché dans le pied de page.')
ON CONFLICT (key) DO NOTHING;
