-- Table pour gérer les logos technos / partenaires
CREATE TABLE IF NOT EXISTS tech_logos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE tech_logos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for tech_logos" ON tech_logos;
CREATE POLICY "Enable all for tech_logos" ON tech_logos FOR ALL USING (true) WITH CHECK (true);

-- Données par défaut (logos statiques actuels)
INSERT INTO tech_logos (name, image_url, sort_order) VALUES
  ('Technologie 1', '/assets/images/our-supported-company/company-logo-1.svg', 1),
  ('Technologie 2', '/assets/images/our-supported-company/company-logo-2.svg', 2),
  ('Technologie 3', '/assets/images/our-supported-company/company-logo-3.svg', 3),
  ('Technologie 4', '/assets/images/our-supported-company/company-logo-4.svg', 4),
  ('Technologie 5', '/assets/images/our-supported-company/company-logo-5.svg', 5),
  ('Technologie 6', '/assets/images/our-supported-company/company-logo-6.svg', 6),
  ('Technologie 7', '/assets/images/our-supported-company/company-logo-7.svg', 7),
  ('Technologie 8', '/assets/images/our-supported-company/company-logo-8.svg', 8)
WHERE NOT EXISTS (SELECT 1 FROM tech_logos LIMIT 1);
