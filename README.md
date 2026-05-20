# BookShelf API

API NestJS pour une plateforme de lecture collaborative. Les utilisateurs creent des clubs de lecture, gerent une bibliotheque partagee, suivent leur progression personnelle et publient des avis sur les livres.

Le projet correspond au sujet **BookShelf : Plateforme de lecture collaborative**.

## Stack

- NestJS
- Prisma + PostgreSQL
- Better Auth
- class-validator / class-transformer
- Jest
- Swagger
- Docker Compose

## URLs locales

Avec Docker Compose :

- API : http://localhost:3001
- Swagger : http://localhost:3001/docs
- OpenAPI JSON : http://localhost:3001/docs-json
- Interface de test : http://localhost:3001/app
- PostgreSQL : localhost:4322

L'interface `/app` est un front simple de test pour manipuler les fonctionnalites sans Postman/Bruno. Le rendu attendu reste bien une API.

## Installation

```bash
cp .env.example .env
docker compose up --build
```

Docker lance automatiquement :

- PostgreSQL
- `prisma db push`
- l'API NestJS en mode watch

## Installation sans Docker

```bash
npm install
npm run db:generate
npm run db:push
npm run start:dev
```

Dans ce cas, il faut une base PostgreSQL accessible via `DATABASE_URL`.

## Variables d'environnement

Le fichier `.env.example` est fourni a la racine. Il ne contient pas de secret reel.

Variables principales :

```env
PORT=3000
NODE_ENV=development
POSTGRES_USER=bookshelf
POSTGRES_PASSWORD=bookshelf
POSTGRES_DB=bookshelf
DATABASE_URL=postgresql://bookshelf:bookshelf@localhost:4322/bookshelf
BETTER_AUTH_SECRET=change-me-with-a-strong-random-secret
BETTER_AUTH_URL=http://localhost:3001
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3001
```

Ne jamais commit le fichier `.env`.

## Commandes utiles

```bash
npm run build
npm run format
npm run test
npm run test:cov
npm run db:generate
npm run db:push
npm run db:studio
```

## Fonctionnalites

### Authentification et autorisation

- Inscription, connexion et deconnexion via Better Auth
- Roles globaux : `USER`, `ADMIN`
- Protection des routes par role global et droits locaux de club
- Roles de club : `OWNER`, `EDITOR`, `READER`
- Un `ADMIN` global peut administrer les clubs, livres et avis sans etre membre

### Clubs de lecture

- Creation de club
- Liste publique paginee
- Detail d'un club
- Modification et suppression par `OWNER` ou `ADMIN`
- Mode admin pour voir aussi les clubs prives

### Membres

- Liste des membres d'un club
- Invitation par email
- Ajout direct si l'utilisateur existe deja
- Attribution de role local
- Modification de role
- Retrait d'un membre
- Protection contre la suppression ou retrogradation du dernier `OWNER`
- Import CSV de membres

### Livres

- CRUD de livres rattaches a un club
- Creation, modification et suppression par `OWNER`, `EDITOR` ou `ADMIN`
- Consultation par membre du club ou `ADMIN`
- Filtres par titre, auteur et genre
- Pagination
- Nombre de pages obligatoire pour permettre le suivi de lecture
- Note moyenne exposee sur les livres

### Progression de lecture

- Chaque membre suit sa propre progression sur chaque livre
- Le nombre total de pages vient du livre, pas de la progression
- Le statut passe automatiquement a `READING` si `currentPage > 0`
- Le statut passe a `COMPLETED` quand la progression atteint 100%
- Consultation globale reservee a `OWNER`, `EDITOR` ou `ADMIN`

### Avis

- Creation d'un avis sur un livre
- Un seul avis par utilisateur et par livre
- Modification et suppression par l'auteur de l'avis ou `ADMIN`
- Liste des avis d'un livre
- Note moyenne calculee dynamiquement

### Administration

- Liste des utilisateurs
- Modification du role global
- Desactivation et reactivation d'un utilisateur
- Liste globale des clubs publics et prives
- Mode admin dans l'interface `/app`

### Imports et exports CSV

- Import CSV du catalogue de livres par `ADMIN`
- Import CSV de membres dans un club par `OWNER` ou `ADMIN`
- Validation ligne par ligne
- Rapport d'erreurs
- Import transactionnel : si une ligne est invalide, rien n'est importe
- Export CSV du catalogue de livres
- Export CSV de la bibliotheque d'un club
- Les exports ne contiennent pas d'informations sensibles

## Formats CSV

### Import catalogue de livres

Endpoint : `POST /admin/imports/catalog-books`

Colonnes :

```csv
isbn,title,author,genre,pageCount,description,publishedAt
9782070612758,Le Petit Prince,Antoine de Saint-Exupery,Conte,120,Un classique,1943-04-06
```

Champs obligatoires :

- `title`
- `author`

Champs optionnels :

- `isbn`
- `genre`
- `pageCount`
- `description`
- `publishedAt`

### Import membres dans un club

Endpoint : `POST /clubs/:clubId/imports/members`

Colonnes :

```csv
email,role
reader@test.com,READER
editor@test.com,EDITOR
```

Roles acceptes :

- `OWNER`
- `EDITOR`
- `READER`

Si l'utilisateur existe, il est ajoute directement au club. Sinon, une invitation en attente est creee.

### Exports CSV

Catalogue :

```http
GET /admin/exports/catalog-books
```

Bibliotheque d'un club :

```http
GET /clubs/:clubId/exports/books
```

Champs exportes uniquement non sensibles :

- `isbn`
- `title`
- `author`
- `genre`
- `pageCount`
- `description`
- `publishedAt` ou `createdAt`

Les emails, sessions, roles de membres, progressions personnelles et donnees d'authentification ne sont pas exportes.

## Documentation Swagger

Swagger est disponible sur :

```text
http://localhost:3001/docs
```

Les routes sont regroupees par modules :

- Clubs
- Membres
- Livres
- Progression
- Avis
- Administration
- Imports / Exports

L'authentification utilise le cookie Better Auth apres connexion via `/auth/sign-in/email`.

## Collection Bruno

Une collection Bruno est fournie dans le dossier `bruno/`.

Pour l'utiliser :

1. Ouvrir Bruno Desktop.
2. Cliquer sur `Open Collection`.
3. Selectionner le dossier `bruno`.
4. Choisir l'environnement `Development`.
5. Renseigner la variable secrete `adminPassword`.
6. Lancer `Auth / Sign in admin` ou `Auth / Sign up email`, puis les requetes dans l'ordre des dossiers.

Les variables `clubId`, `bookId`, `memberId`, `reviewId` et `userId` sont remplies automatiquement par certaines reponses pour faciliter les tests.

## Tests

```bash
npm run test
npm run test:cov
```

Les tests existants couvrent une partie de l'application. Des tests supplementaires peuvent etre ajoutes pour renforcer le coverage sur les services metier principaux.

## Git

Les commits utilisent une convention simple :

- `feat:` nouvelle fonctionnalite
- `fix:` correction
- `docs:` documentation
- `chore:` maintenance

## Livrables

- Depot GitHub
- README a la racine
- `.env.example` a la racine
- Swagger disponible sur `/docs`
- Interface locale de test disponible sur `/app`
