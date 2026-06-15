-- =========================================================================
-- SCRIPT DE CRÉATION POUR LE SYSTÈME DE CANVA & MODÈLES DE DEVIS
-- =========================================================================

-- 1. Table des modèles de devis réutilisables (Canva)
CREATE TABLE IF NOT EXISTS quote_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  estimated_duration VARCHAR(100) DEFAULT '1 mois',
  items JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{description, unit_price, quantity}]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Table des devis réels générés (Canvas convertis en devis client)
CREATE TABLE IF NOT EXISTS quote_canvas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_number VARCHAR(100) NOT NULL UNIQUE,
  lead_id UUID REFERENCES quote_requests(id) ON DELETE SET NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_company VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{description, unit_price, quantity}]
  vat_rate NUMERIC DEFAULT 20.0,
  status VARCHAR(50) DEFAULT 'Brouillon', -- Brouillon, Envoyé, Accepté, Refusé
  validity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Activer la RLS
ALTER TABLE quote_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_canvas ENABLE ROW LEVEL SECURITY;

-- 4. Politiques RLS publiques pour simplifier
DROP POLICY IF EXISTS "Enable all for public to quote_templates" ON quote_templates;
CREATE POLICY "Enable all for public to quote_templates" ON quote_templates FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all for public to quote_canvas" ON quote_canvas;
CREATE POLICY "Enable all for public to quote_canvas" ON quote_canvas FOR ALL USING (true) WITH CHECK (true);

-- 5. Insertion de quelques templates de devis par défaut
INSERT INTO quote_templates (title, description, estimated_duration, items) VALUES
(
  'Application Mobile Standard (React Native / Flutter)',
  'Formule standard comprenant design UI/UX, développement mobile hybride, connexion à un back-end et mise en ligne sur les stores.',
  '2 à 3 mois',
  '[
    {"description": "Phase d''analyse et conception UX/UI (Maquettes Figma)", "unit_price": 2500, "quantity": 1},
    {"description": "Développement de l''application mobile (iOS et Android)", "unit_price": 8500, "quantity": 1},
    {"description": "Configuration du Back-office & API (Supabase/Firebase)", "unit_price": 3000, "quantity": 1},
    {"description": "Phase de tests QA, ajustements et publication Stores", "unit_price": 1500, "quantity": 1}
  ]'::jsonb
),
(
  'Application Web SaaS & Dashboard',
  'Plateforme web complète avec gestion des abonnements Stripe, profils utilisateurs et interface administrateur.',
  '2 mois',
  '[
    {"description": "Design UI/UX et spécifications fonctionnelles", "unit_price": 2000, "quantity": 1},
    {"description": "Développement Front-end (React.js / Next.js)", "unit_price": 6000, "quantity": 1},
    {"description": "Intégration API, base de données et authentification", "unit_price": 4000, "quantity": 1},
    {"description": "Intégration Stripe (Abonnements & facturation)", "unit_price": 1800, "quantity": 1}
  ]'::jsonb
),
(
  'Site Web Vitrine & Identité Visuelle',
  'Conception de logo, charte graphique et site vitrine optimisé pour le SEO.',
  '3 semaines',
  '[
    {"description": "Création du logo et charte graphique complète", "unit_price": 1200, "quantity": 1},
    {"description": "Intégration et développement du site vitrine dynamique", "unit_price": 2200, "quantity": 1},
    {"description": "Optimisation SEO, hébergement et mise en ligne", "unit_price": 600, "quantity": 1}
  ]'::jsonb
)
ON CONFLICT DO NOTHING;
