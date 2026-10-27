# 🏡 LocalConnect — Neighborhood Community Platform

LocalConnect is a lightweight, intuitive digital hub designed to help people living in the same neighborhood stay connected, organize local activities, and support one another.

---

## 🌟 Key Features

1. **Neighborhood Overview Hub (`/`)**
   - Quick community metrics (announcements, active issues, upcoming events, trusted local services).
   - Instant action shortcuts for residents.
   - Previews of upcoming events and recent community notices.

2. **Neighborhood Feed (`/feed`)**
   - Public community bulletin for announcements, general updates, and lost-and-found notices.

3. **Local Issues & Alerts (`/issues`)**
   - Report neighborhood infrastructure issues (broken streetlights, potholes, garbage overflows).
   - Real-time status tracking (`OPEN`, `IN_PROGRESS`, `RESOLVED`).

4. **Community Events & Gatherings (`/events`) — *New Feature***
   - Organize and discover local cleanups, block parties, townhalls, and social gatherings.
   - Filter by event category (*Cleanup*, *Social*, *Meeting*, *Sports*, *General*).
   - Interactive RSVP with live attendee counts.

5. **Local Recommendations Directory (`/recommendations`) — *New Feature***
   - Word-of-mouth recommendations for trusted local plumbers, electricians, landscapers, babysitters, and handymen.
   - 5-star ratings, contact info, and "Helpful" upvoting.

---

## 🛠️ Tech Stack & Database Architecture

- **Frontend**: React 19, Vite, React Router 7, Axios, Lucide Icons, Modern CSS.
- **Backend**: Node.js, Express 5, Prisma ORM, CORS, Dotenv.
- **Database**: PostgreSQL (Neon / Supabase / local Docker) with official Prisma migrations (`server/prisma/migrations/`).
- **Data Persistence**: Guaranteed dual-layer persistence (PostgreSQL for cloud/production, local disk-sync file store `server/data/community_store.json` for development).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v20+ recommended)
- npm

### 2. Backend Setup & Migrations
```bash
cd server
npm install

# Run database migrations
npx prisma migrate dev --name init_community_schema

# Seed realistic neighborhood data
npm run seed

# Run automated integration test suite (7/7 pass)
npm test

# Start the backend server
node index.js
```
The server runs on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The client runs on `http://localhost:5173`.

---

## 🧪 Testing & Run Evidence
Run `npm test` inside `server/` to execute the integration test suite. Full run logs are documented in [`TESTING.md`](./TESTING.md).

## 🗄️ Database Setup & Migrations
See [`DATABASE_SETUP.md`](./DATABASE_SETUP.md) for full setup instructions across Neon, Supabase, Docker, and local PostgreSQL.

## 🎥 Video Walkthrough & Presentation
- **Verbatim Recording Script**: [`VIDEO_WALKTHROUGH_SCRIPT.md`](./VIDEO_WALKTHROUGH_SCRIPT.md)
- **Interactive Presentation Deck**: Open [`walkthrough.html`](./walkthrough.html) in your browser to present slides during your recording.

## 📄 Complete Changes Report
See [`Changes.md`](./Changes.md) for detailed analysis of product-market fit, removed workplace features (Tasks, Leaderboard), newly added community features, and deployment links.
