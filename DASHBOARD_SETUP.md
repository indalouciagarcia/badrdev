# Dashboard de Gestion de Services avec Supabase

Ce dashboard permet de gérer des projets et des services associés avec Supabase comme backend.

## 🚀 Configuration

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un compte ou connectez-vous
3. Créez un nouveau projet

### 2. Exécuter le schéma de base de données

1. Dans votre dashboard Supabase, allez dans l'éditeur SQL
2. Copiez et exécutez le contenu du fichier `supabase-schema.sql`
3. Cela créera les tables `projects` et `services`

### 3. Configurer les variables d'environnement

1. Dans votre dashboard Supabase, allez dans Settings > API
2. Copiez votre `Project URL` et `anon public key`
3. Créez un fichier `.env` à la racine du projet avec le contenu suivant:

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
```

Vous pouvez vous baser sur le fichier `.env.example` comme modèle.

### 4. Lancer l'application

```bash
npm run dev
```

Le dashboard sera accessible à l'URL: `http://localhost:5173/dashboard`

## 📋 Fonctionnalités

### Gestion des Projets
- **Créer** un nouveau projet avec nom et description
- **Visualiser** tous les projets existants
- **Supprimer** un projet (supprime aussi les services associés)

### Gestion des Services
- **Créer** un service lié à un projet
- **Définir** le titre, description, prix et statut
- **Visualiser** tous les services avec leur projet associé
- **Supprimer** un service individuellement

### Statuts des Services
- `active` - Service actif (vert)
- `inactive` - Service inactif (rouge)
- `pending` - En attente (jaune)

## 🎯 Structure de l'application

- `src/pages/Dashboard.jsx` - Composant principal du dashboard
- `src/pages/Dashboard.css` - Styles du dashboard
- `src/config/supabase.js` - Configuration du client Supabase
- `supabase-schema.sql` - Schéma de la base de données

## 🔧 Personnalisation

Vous pouvez modifier:
- Les couleurs dans `Dashboard.css`
- Les champs des formulaires dans `Dashboard.jsx`
- Les politiques RLS dans le schéma SQL pour plus de sécurité

## 📝 Notes importantes

- Assurez-vous d'avoir configuré correctement vos variables d'environnement
- Les politiques RLS actuelles permettent tout accès (pour le développement)
- Pour la production, ajustez les politiques RLS selon vos besoins de sécurité
