-- Requêtes SQL supplémentaires pour Supabase

-- ============================================
-- INSÉRER DES DONNÉES DE TEST
-- ============================================

-- Insérer des projets de test
INSERT INTO projects (name, description) VALUES
('Site Web E-commerce', 'Développement d''un site e-commerce complet avec panier et paiement'),
('Application Mobile', 'Application iOS/Android pour la gestion de tâches'),
('Dashboard Analytics', 'Tableau de bord pour visualiser les données marketing'),
('Site Portfolio', 'Site personnel pour présenter mes travaux');

-- Insérer des services liés aux projets
INSERT INTO services (project_id, title, description, price, status) VALUES
-- Services pour Site Web E-commerce
((SELECT id FROM projects WHERE name = 'Site Web E-commerce'), 'Design UI/UX', 'Création de l''interface utilisateur et expérience', 1500.00, 'active'),
((SELECT id FROM projects WHERE name = 'Site Web E-commerce'), 'Développement Frontend', 'Implémentation React avec composants modernes', 2500.00, 'active'),
((SELECT id FROM projects WHERE name = 'Site Web E-commerce'), 'Backend API', 'API RESTful avec Node.js et Express', 2000.00, 'active'),
((SELECT id FROM projects WHERE name = 'Site Web E-commerce'), 'Intégration Paiement', 'Setup Stripe pour les paiements', 800.00, 'pending'),

-- Services pour Application Mobile
((SELECT id FROM projects WHERE name = 'Application Mobile'), 'Design Mobile', 'Interface mobile responsive', 1200.00, 'active'),
((SELECT id FROM projects WHERE name = 'Application Mobile'), 'Développement iOS', 'Application native iOS avec Swift', 3500.00, 'active'),
((SELECT id FROM projects WHERE name = 'Application Mobile'), 'Développement Android', 'Application native Android avec Kotlin', 3500.00, 'active'),

-- Services pour Dashboard Analytics
((SELECT id FROM projects WHERE name = 'Dashboard Analytics'), 'Collecte de données', 'Setup de la collecte de données', 1000.00, 'active'),
((SELECT id FROM projects WHERE name = 'Dashboard Analytics'), 'Visualisation', 'Graphiques et tableaux de bord interactifs', 1800.00, 'active'),
((SELECT id FROM projects WHERE name = 'Dashboard Analytics'), 'Export Reports', 'Fonctionnalité d''export PDF/Excel', 600.00, 'inactive'),

-- Services pour Site Portfolio
((SELECT id FROM projects WHERE name = 'Site Portfolio'), 'Création de contenu', 'Rédaction et organisation du contenu', 500.00, 'active'),
((SELECT id FROM projects WHERE name = 'Site Portfolio'), 'Hébergement', 'Setup et configuration de l''hébergement', 200.00, 'active');


-- ============================================
-- REQUÊTES DE SÉLECTION
-- ============================================

-- Sélectionner tous les projets
SELECT * FROM projects ORDER BY created_at DESC;

-- Sélectionner tous les services avec leur projet
SELECT 
  s.*,
  p.name as project_name,
  p.description as project_description
FROM services s
LEFT JOIN projects p ON s.project_id = p.id
ORDER BY s.created_at DESC;

-- Sélectionner les services actifs uniquement
SELECT * FROM services WHERE status = 'active';

-- Sélectionner les services d'un projet spécifique
SELECT * FROM services 
WHERE project_id = (SELECT id FROM projects WHERE name = 'Site Web E-commerce');

-- Compter le nombre de services par projet
SELECT 
  p.name,
  COUNT(s.id) as service_count,
  SUM(s.price) as total_value
FROM projects p
LEFT JOIN services s ON p.id = s.project_id
GROUP BY p.id, p.name
ORDER BY service_count DESC;


-- ============================================
-- REQUÊTES DE MISE À JOUR
-- ============================================

-- Mettre à jour le statut d'un service
UPDATE services SET status = 'completed' WHERE title = 'Design UI/UX';

-- Mettre à jour le prix d'un service
UPDATE services SET price = 2000.00 WHERE title = 'Design UI/UX';

-- Mettre à jour la description d'un projet
UPDATE projects SET description = 'Nouvelle description' WHERE name = 'Site Web E-commerce';


-- ============================================
-- REQUÊTES DE SUPPRESSION
-- ============================================

-- Supprimer un service spécifique
DELETE FROM services WHERE title = 'Service à supprimer';

-- Supprimer un projet (cela supprimera aussi les services liés grâce à ON DELETE CASCADE)
DELETE FROM projects WHERE name = 'Projet à supprimer';


-- ============================================
-- REQUÊTES DE RECHERCHE
-- ============================================

-- Rechercher des projets par nom
SELECT * FROM projects WHERE name ILIKE '%web%';

-- Rechercher des services par titre
SELECT * FROM services WHERE title ILIKE '%design%';

-- Rechercher des services dans une plage de prix
SELECT * FROM services WHERE price BETWEEN 1000 AND 2000;


-- ============================================
-- REQUÊTES D'AGRÉGATION
-- ============================================

-- Prix total de tous les services
SELECT SUM(price) as total_revenue FROM services WHERE status = 'active';

-- Prix moyen des services
SELECT AVG(price) as average_price FROM services;

-- Service le plus cher
SELECT * FROM services ORDER BY price DESC LIMIT 1;

-- Service le moins cher
SELECT * FROM services ORDER BY price ASC LIMIT 1;


-- ============================================
-- REQUÊTES AVEC FILTRES COMPLEXES
-- ============================================

-- Services actifs avec prix > 1000
SELECT * FROM services 
WHERE status = 'active' AND price > 1000
ORDER BY price DESC;

-- Projets avec plus de 3 services
SELECT p.*, COUNT(s.id) as service_count
FROM projects p
LEFT JOIN services s ON p.id = s.project_id
GROUP BY p.id
HAVING COUNT(s.id) > 3;


-- ============================================
-- NETTOYER LES DONNÉES DE TEST
-- ============================================

-- Supprimer toutes les données (attention: cela effacera tout!)
-- DELETE FROM services;
-- DELETE FROM projects;

-- Réinitialiser les séquences (si nécessaire)
-- ALTER SEQUENCE projects_id_seq RESTART WITH 1;
-- ALTER SEQUENCE services_id_seq RESTART WITH 1;
