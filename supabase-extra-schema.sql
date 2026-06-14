-- Schéma de base de données supplémentaire pour les nouveaux menus du CMS

-- 1. Table de Profil / Hero
CREATE TABLE IF NOT EXISTS profile (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cv_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer une ligne initiale de profil par défaut si elle n'existe pas
INSERT INTO profile (name, title, description)
SELECT 'Badr Belabbes', 'Développeur Full Stack', 'Passionné de développement web et mobile.'
WHERE NOT EXISTS (SELECT 1 FROM profile);

-- 2. Table des Compétences
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  level INT DEFAULT 80, -- Pourcentage (ex: 85%)
  category VARCHAR(100) DEFAULT 'Frontend', -- Frontend, Backend, Mobile, Design, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer quelques compétences de test
INSERT INTO skills (name, level, category) VALUES
('React / Next.js', 90, 'Frontend'),
('Node.js / Express', 85, 'Backend'),
('Supabase / PostgreSQL', 80, 'Database'),
('Tailwind CSS', 95, 'Design');

-- 3. Table des Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer un message de test
INSERT INTO messages (name, email, subject, message) VALUES
('Jean Dupont', 'jean.dupont@example.com', 'Demande de devis', 'Bonjour, je souhaiterais travailler avec vous sur un projet React.');

-- 4. Table du Blog
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- draft, published
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer un article de blog de test
INSERT INTO blog_posts (title, content, status) VALUES
('Pourquoi utiliser Supabase avec React ?', 'Supabase est une excellente alternative open-source à Firebase...', 'published');

-- Activer la sécurité RLS sur les nouvelles tables
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Politiques d'accès ouvertes pour le développement local
CREATE POLICY "Enable all for profile" ON profile FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for skills" ON skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for messages" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for blog_posts" ON blog_posts FOR ALL USING (true) WITH CHECK (true);
