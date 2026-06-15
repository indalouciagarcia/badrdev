-- =========================================================================
-- SCRIPT DE MIGRATION POUR LES PARAMÈTRES DE LA SECTION SERVICES
-- Exécutez ce script dans l'éditeur SQL de votre tableau de bord Supabase
-- =========================================================================

INSERT INTO site_settings (key, value, label, description) VALUES
  ('services_subtitle', 'Derniers Services', 'Sous-titre de la section Services', 'Sous-titre affiché au-dessus du titre principal.'),
  ('services_title', 'Des Solutions Digitales Sur Mesure', 'Titre de la section Services', 'Titre principal de la section Services.'),
  ('services_desc', 'Je conçois et développe des applications web et mobiles innovantes, évolutives et sécurisées pour les entreprises, startups et organisations sportives.', 'Description de la section Services', 'Paragraphe de description de la section Services.'),
  ('services_image', 'https://vqxyygxyebtencjvvxba.supabase.co/storage/v1/object/public/profile/profile_6hp68ojlr.png', 'Image de la section Services', 'URL de l''image affichée à droite dans la section Services.')
ON CONFLICT (key) DO NOTHING;
