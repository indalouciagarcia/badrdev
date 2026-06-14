-- Script complet pour le système de devis avancé (Création + Mise à jour)

-- 1. Création de la table des options
CREATE TABLE IF NOT EXISTS quote_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  label VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Création de la table des requêtes (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255) NOT NULL,
  project_type VARCHAR(255),
  budget VARCHAR(100),
  timeline VARCHAR(100),
  currency VARCHAR(10),
  message TEXT,
  status VARCHAR(50) DEFAULT 'Nouveau',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Ajout des colonnes si la table existait déjà (sans les colonnes avancées)
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS timeline VARCHAR(100);
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS quote_number VARCHAR(50);

-- 4. Options par défaut
INSERT INTO quote_options (category, label, value) VALUES
('currency', 'Euro (€)', 'EUR'),
('currency', 'Dollar ($)', 'USD'),
('currency', 'Dirham (MAD)', 'MAD'),
('project_type', 'Application Web', 'web_app'),
('project_type', 'Application Mobile', 'mobile_app'),
('project_type', 'Site E-commerce', 'ecommerce'),
('project_type', 'Consulting & Audit', 'consulting'),
('timeline', 'Urgent (< 2 semaines)', 'urgent'),
('timeline', 'Normal (1-2 mois)', 'normal'),
('timeline', 'Flexible (3 mois+)', 'flexible'),
('budget', 'Moins de 3000€', '<3000'),
('budget', '3000€ - 8000€', '3000-8000'),
('budget', '8000€ - 15000€', '8000-15000'),
('budget', '15000€ - 30000€', '15000-30000'),
('budget', '30000€+', '>30000');

-- 5. Sécurité RLS
ALTER TABLE quote_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Autoriser la lecture publique des options
DROP POLICY IF EXISTS "Enable read access for public to quote_options" ON quote_options;
CREATE POLICY "Enable read access for public to quote_options" ON quote_options FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable all for authenticated users to quote_options" ON quote_options;
CREATE POLICY "Enable all for authenticated users to quote_options" ON quote_options FOR ALL USING (true) WITH CHECK (true);

-- Autoriser l'insertion publique des devis
DROP POLICY IF EXISTS "Enable insert for public to quote_requests" ON quote_requests;
CREATE POLICY "Enable insert for public to quote_requests" ON quote_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for authenticated users to quote_requests" ON quote_requests;
CREATE POLICY "Enable all for authenticated users to quote_requests" ON quote_requests FOR ALL USING (true) WITH CHECK (true);
