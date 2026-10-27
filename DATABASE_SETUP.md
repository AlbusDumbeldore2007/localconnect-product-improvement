# Database Setup, Schema Migrations & Persistence Guide

This guide details how LocalConnect manages its database schema, executes migrations, seeds community data, and guarantees data persistence across environments (Neon, Supabase, local PostgreSQL, and persistent disk store).

---

## 1. Database Architecture & Models

The Prisma schema is defined in `server/prisma/schema.prisma` with four community-aligned models:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Post {
  id        Int      @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())
}

model Issue {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  status      String   @default("OPEN")
  createdAt   DateTime @default(now())
}

model Event {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  date        String
  location    String
  organizer   String
  category    String   @default("General")
  attendees   Int      @default(0)
  createdAt   DateTime @default(now())
}

model Recommendation {
  id            Int      @id @default(autoincrement())
  title         String
  category      String
  description   String
  contact       String
  recommendedBy String
  rating        Int      @default(5)
  likes         Int      @default(0)
  createdAt     DateTime @default(now())
}
```

---

## 2. Setting Up PostgreSQL (Hosted or Local)

### Option A: Free Hosted PostgreSQL (Neon / Supabase / Railway)
1. Sign up for a free PostgreSQL instance at [Neon](https://neon.tech) or [Supabase](https://supabase.com).
2. Copy the PostgreSQL connection string provided by the dashboard.
3. In `server/.env`, set:
   ```env
   DATABASE_URL="postgresql://username:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
   PORT=5000
   ```

### Option B: Local PostgreSQL (Docker or Postgres Service)
```bash
docker run --name localconnect-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=localconnect -p 5432:5432 -d postgres
```
Set `DATABASE_URL` in `server/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/localconnect"
```

---

## 3. Running Prisma Migrations

Prisma migration files are stored in `server/prisma/migrations/20261027000000_init_community_schema/migration.sql`.

To apply migrations against your database:
```bash
cd server

# For development environments:
npx prisma migrate dev --name init_community_schema

# For production / CI / deployed environments (Render, Railway):
npx prisma migrate deploy
```

To regenerate the Prisma Client after any schema update:
```bash
npx prisma generate
```

---

## 4. Seeding Initial Community Data

A seed script is provided at `server/prisma/seed.js` with realistic neighborhood announcements, issues, upcoming cleanups/block parties, and local service recommendations:

```bash
cd server
npm run seed
```

---

## 5. Verification of Persistence

Data persistence has been verified across two critical layers:
1. **PostgreSQL Layer**: When `DATABASE_URL` is configured, Prisma executes standard SQL transactions directly against PostgreSQL tables (`Post`, `Issue`, `Event`, `Recommendation`). Records persist permanently across container and service reboots.
2. **Local Development Layer**: When running offline without a live PostgreSQL server, `server/prismaClient.js` synchronizes all mutations directly to the local disk file `server/data/community_store.json`. All newly created posts, issues, events, RSVPs, and recommendations persist across server restarts.
