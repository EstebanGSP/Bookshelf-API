# BookShelf API

API NestJS pour une plateforme de lecture collaborative.

## Stack

- NestJS
- Prisma + PostgreSQL
- Better Auth
- class-validator / class-transformer
- Jest
- Docker Compose

## Fonctionnalites implementees

- Auth Better Auth branchee
- Schema Prisma BookShelf
- Clubs :
  - creation
  - liste publique paginee
  - detail
  - modification / suppression par OWNER
- Membres :
  - liste des membres
  - invitation
  - ajout direct si l'utilisateur existe
  - changement de role
  - retrait
  - protection du dernier OWNER
- Livres :
  - CRUD dans un club
  - droits OWNER / EDITOR / READER
  - filtres par titre, auteur et genre
  - pagination
- Front local de test sur `/app`

## Installation

```bash
npm install
cp .env.example .env
npm run db:generate
```

## Lancer avec Docker

```bash
docker compose up --build
```

Par defaut :

- API : http://localhost:3001
- Front de test : http://localhost:3001/app
- PostgreSQL local : localhost:4322

## Commandes utiles

```bash
npm run build
npm run format
npm run test
npm run test:cov
npm run db:generate
npm run db:push
```

## Variables d'environnement

Voir `.env.example`.

Ne jamais commit `.env`.

## Etat du projet

La structure complete est posee. Les prochaines briques prevues sont :

- progression de lecture
- avis et note moyenne
- administration
- imports CSV
- Swagger
- tests d'integration complets
