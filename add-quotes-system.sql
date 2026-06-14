-- Script pour ajouter le système de devis structuré (Lead Generation)

-- 1. Table des options configurables (Devises, Types de projets, etc.)
CREATE TABLE IF NOT EXISTS quote_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category VARCHAR(50) NOT NULL, -- 'currency' ou 'project_type'
  label VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer quelques options par défaut
INSERT INTO quote_options (category, label, value) VALUES
('currency', 'Euro (€)', 'EUR'),
('currency', 'Dollar ($)', 'USD'),
('currency', 'Dirham (MAD)', 'MAD'),
('project_type', 'Application Web', 'web_app'),
('project_type', 'Application Mobile', 'mobile_app'),
('project_type', 'Site E-commerce', 'ecommerce'),
('project_type', 'Consulting & Audit', 'consulting'),
('project_type', 'Autre', 'other');

-- 2. Table pour stocker les demandes de devis (Les leads)
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255) NOT NULL,
  project_type VARCHAR(255),
  budget VARCHAR(100),
  currency VARCHAR(10),
  message TEXT,
  status VARCHAR(50) DEFAULT 'Nouveau', -- Nouveau, En cours, Clôturé
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Sécurité RLS
ALTER TABLE quote_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Autoriser la lecture publique des options (pour le formulaire du site web)
CREATE POLICY "Enable read access for public to quote_options" ON quote_options FOR SELECT USING (true);
CREATE POLICY "Enable all for authenticated users to quote_options" ON quote_options FOR ALL USING (true) WITH CHECK (true);

-- Autoriser l'insertion publique des devis (pour que les visiteurs puissent soumettre le formulaire)
CREATE POLICY "Enable insert for public to quote_requests" ON quote_requests FOR INSERT WITH CHECK (true);
-- Autoriser les administrateurs (ou tout utilisateur authentifié) à lire/modifier/supprimer les devis
CREATE POLICY "Enable all for authenticated users to quote_requests" ON quote_requests FOR ALL USING (true) WITH CHECK (true);
