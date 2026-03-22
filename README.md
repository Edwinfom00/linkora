# BizConnect Cameroun 🇨🇲

**BizConnect Cameroun** est une plateforme web moderne de mise en relation entre clients et entreprises de services, taillée sur mesure pour l'écosystème entrepreneurial camerounais (inspirée du cas réel de VOLCANO Sarl à Douala).

L'application offre une identité visuelle "Afro-Digital Luxury" : minimaliste, professionnelle et performante, avec des fonctionnalités de recherche d'entreprises, de gestion de profils, et de système d'avis complet.

---

## Technologies Utilisées

*   **Framework Frontend & Backend** : [Next.js 15](https://nextjs.org/) (App Router, React 19)
*   **Langage** : [TypeScript](https://www.typescriptlang.org/)
*   **Design & UI** : [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/), Framer Motion (Animations), Lucide React (Icônes)
*   **Base de Données** : [PostgreSQL](https://www.postgresql.org/) hébergée sur [Neon.tech](https://neon.tech/)
*   **ORM** : [Drizzle ORM](https://orm.drizzle.team/)
*   **Authentification** : [Better-Auth](https://better-auth.com/) (Email/Mot de passe, Google OAuth)
*   **Stockage de Fichiers** : [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (Logos & Couvertures d'entreprise)
*   **Validation des données** : [Zod](https://zod.dev/), React Hook Form

---

## Prérequis

Avant de lancer le projet, assurez-vous d'avoir installé :
*   Node.js (v18.17 ou supérieure)
*   npm ou yarn ou pnpm

---

## Installation et Démarrage Local

1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd linkora
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration des variables d'environnement**
   Créez un fichier `.env` à la racine du projet et ajoutez les variables suivantes :
   ```env
   # Base de données (Neon)
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

   # Authentification (Better Auth)
   BETTER_AUTH_SECRET="votre_secret_aleatoire"
   BETTER_AUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Google OAuth (Optionnel)
   GOOGLE_CLIENT_ID="votre_google_client_id"
   GOOGLE_CLIENT_SECRET="votre_google_client_secret"

   # Vercel Blob (Pour les images)
   BLOB_READ_WRITE_TOKEN="votre_token_vercel_blob"
   ```

4. **Initialiser la base de données (Drizzle)**
   ```bash
   npm run db:push
   # ou
   npx drizzle-kit push
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

---

## Architecture du Projet (Feature-Sliced Design)

Le code est organisé par modules métier pour une meilleure maintenabilité :

```text
src/
├── app/               # Routes App Router de Next.js (pages, layouts, api)
│   ├── (auth)/        # Routes liées à l'authentification (login, register)
│   ├── (main)/        # Page d'accueil, dashboard, liste des entreprises
│   └── api/           # API Routes (upload, better-auth)
├── components/        # Composants visuels partagés
├── lib/               # Code utilitaire (BDD, validations, auth client)
│   ├── db/            # Configuration Drizzle et Schémas SQL
│   └── validations.ts # Schémas Zod pour les formulaires
└── modules/           # Architecture orientée fonctionnalités
    ├── auth/          # Logique d'authentification (formulaire, actions)
    ├── entreprises/   # Gestion, listing et affichage des entreprises
    ├── avis/          # Système de notation et de commentaires
    └── dashboard/     # Vues spécifiques à l'espace membre
```

---

## Flux Fonctionnels Principaux

1. **Inscription / Connexion** : Un utilisateur peut créer un compte en tant que *Client* ou *Entreprise*. L'authentification passe par un système sécurisé basé sur des sessions en base de données gérées par Better-Auth.
2. **Profil Entreprise** : Une entreprise peut personnaliser son profil (Logo, couverture, description, catégorie) depuis son tableau de bord sécurisé. L'enregistrement des images passe par l'API Vercel Blob.
3. **Recherche / Annuaire** : Les visiteurs (même non connectés) peuvent parcourir la liste des entreprises, filtrer par catégorie et consulter le profil complet d'un prestataire.
4. **Système d'Avis** : Les clients peuvent laisser des notes et commentaires sur les profils des entreprises.

---

## Licence et Mentions

Réalisé dans le cadre d'un projet académique ciblant des étudiants de niveau universitaire (Niveau 2).
Conçu et optimisé par Antigravity.
