-- =========================================================================
-- MIGRATION AVANCÉE POUR LE SYSTÈME DE QUALIFICATION DE DEVIS
-- Exécutez ce script dans l'éditeur SQL de votre tableau de bord Supabase
-- pour structurer les colonnes de qualification client.
-- =========================================================================

ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS client_type VARCHAR(50) DEFAULT 'entreprise';
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS company_type VARCHAR(100);
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS company_size VARCHAR(100);
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS sector VARCHAR(100);
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS contact_role VARCHAR(255);
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS siret VARCHAR(100);
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS app_type VARCHAR(100);
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS features TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS has_design VARCHAR(100);
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS tech_requirements TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS deployment_need TEXT;
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS maintenance_need TEXT;
