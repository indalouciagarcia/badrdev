-- Script pour ajouter les tables de gestion du contenu dynamique du site (Accueil, À Propos)

-- 1. Table des Témoignages
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  text TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer les témoignages par défaut
INSERT INTO testimonials (name, role, text, image_url)
SELECT 'Directeur Technique', 'Club de Football Professionnel', 'Travailler avec Badr a été une expérience exceptionnelle. Il a compris immédiatement notre vision et a livré une plateforme football bien au-delà de nos attentes.', '/assets/images/testimonial/bg-image-1png.png'
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE name = 'Directeur Technique');

INSERT INTO testimonials (name, role, text, image_url)
SELECT 'Responsable Digital', 'Startup E-commerce', 'Belabbes Badr est un développeur extrêmement talentueux et rigoureux. Il a pris le temps de comprendre notre activité et a créé une solution CRM unique, parfaitement adaptée à nos besoins.', '/assets/images/testimonial/bg-image-2.png'
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE name = 'Responsable Digital');

INSERT INTO testimonials (name, role, text, image_url)
SELECT 'CEO & Fondateur', 'Agence Digitale', 'Une expertise rare qui couvre à la fois le développement technique et le design UI/UX. Badr a su transformer notre idée en une application mobile performante et esthétique.', '/assets/images/testimonial/bg-image-1png.png'
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE name = 'CEO & Fondateur');

-- 2. Table des Compteurs
CREATE TABLE IF NOT EXISTS counters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  count INT NOT NULL,
  label VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer les compteurs par défaut
INSERT INTO counters (count, label)
SELECT 150, 'Projets Réalisés' WHERE NOT EXISTS (SELECT 1 FROM counters WHERE label = 'Projets Réalisés');
INSERT INTO counters (count, label)
SELECT 80, 'Clients Satisfaits' WHERE NOT EXISTS (SELECT 1 FROM counters WHERE label = 'Clients Satisfaits');
INSERT INTO counters (count, label)
SELECT 20, 'Technologies Maîtrisées' WHERE NOT EXISTS (SELECT 1 FROM counters WHERE label = 'Technologies Maîtrisées');
INSERT INTO counters (count, label)
SELECT 6, 'Domaines d''Expertise' WHERE NOT EXISTS (SELECT 1 FROM counters WHERE label = 'Domaines d''Expertise');

-- 3. Table des Expériences / Expertises / Cartes de Services
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'education', 'expertise', 'service_card'
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  icon VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insérer les cartes d'éducation (Domaines d'Expertise page About)
INSERT INTO experiences (type, title, subtitle, description)
SELECT 'education', 'Spécialisation', 'Technologies Football', 'Plateformes d’analyse de matchs, systèmes de statistiques football, applications de gestion d’équipes, plateformes de scouting et suivi des performances des joueurs.'
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE title = 'Spécialisation');

INSERT INTO experiences (type, title, subtitle, description)
SELECT 'education', 'ERP & CRM', 'Applications Métier', 'Systèmes ERP, plateformes CRM, gestion des stocks, tableaux de bord analytiques, e-commerce et automatisation des processus métier.'
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE title = 'ERP & CRM');

INSERT INTO experiences (type, title, subtitle, description)
SELECT 'education', 'Figma & Adobe XD', 'UI/UX Design', 'Conception d’interfaces utilisateur modernes, wireframing, prototypage, recherche utilisateur et création de systèmes de design cohérents.'
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE title = 'Figma & Adobe XD');

INSERT INTO experiences (type, title, subtitle, description)
SELECT 'education', 'MySQL / PostgreSQL', 'Architecture Base de Données', 'Modélisation et optimisation de bases de données relationnelles et NoSQL — MySQL, PostgreSQL, MongoDB, Firebase et Supabase.'
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE title = 'MySQL / PostgreSQL');

-- Insérer les expertises (mySkillItems)
INSERT INTO experiences (type, title, subtitle, description, icon)
SELECT 'expertise', 'Développement Full Stack', '60+ Projets', 'React.js, Vue.js, Node.js, PHP/Laravel, CodeIgniter 4 — je maîtrise l’ensemble de la chaîne de développement, du frontend à l’API backend.', 'fa-light fa-code'
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE title = 'Développement Full Stack');

INSERT INTO experiences (type, title, subtitle, description, icon)
SELECT 'expertise', 'Développement Mobile', '30+ Projets', 'Applications Android & iOS avec React Native et Flutter — des expériences mobiles performantes et intuitives pour atteindre vos utilisateurs partout.', 'fa-light fa-mobile-screen'
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE title = 'Développement Mobile');

INSERT INTO experiences (type, title, subtitle, description, icon)
SELECT 'expertise', 'Conception UI/UX', '40+ Projets', 'Figma, Adobe XD — conception d’interfaces modernes, wireframing et prototypage interactif pour des expériences utilisateur mémorables et efficaces.', 'fa-light fa-bezier-curve'
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE title = 'Conception UI/UX' AND type = 'expertise');

-- Insérer les petites cartes de services (serviceCards)
INSERT INTO experiences (type, title, description, icon)
SELECT 'service_card', 'Développement Web', '50+ Projets', 'fa-light fa-pen-ruler'
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE title = 'Développement Web');

INSERT INTO experiences (type, title, description, icon)
SELECT 'service_card', 'Conception UI/UX', '40+ Projets', 'fa-light fa-bezier-curve'
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE title = 'Conception UI/UX' AND type = 'service_card');

INSERT INTO experiences (type, title, description, icon)
SELECT 'service_card', 'Applications Mobiles', '30+ Projets', 'fa-light fa-mobile-screen'
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE title = 'Applications Mobiles' AND type = 'service_card');

INSERT INTO experiences (type, title, description, icon)
SELECT 'service_card', 'Consulting Technique', '20+ Projets', 'fa-light fa-lightbulb'
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE title = 'Consulting Technique');

INSERT INTO experiences (type, title, description, icon)
SELECT 'service_card', 'Automatisation de Process', '15+ Projets', 'fa-light fa-gears'
WHERE NOT EXISTS (SELECT 1 FROM experiences WHERE title = 'Automatisation de Process');

-- Sécurité RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for counters" ON counters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for experiences" ON experiences FOR ALL USING (true) WITH CHECK (true);
