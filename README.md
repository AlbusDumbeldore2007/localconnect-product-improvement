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

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, React Router 7, Axios, Lucide Icons, Modern CSS.
- **Backend**: Node.js, Express 5, Prisma ORM, CORS, Dotenv.
- **Database**: PostgreSQL (compatible with hosted Neon / Supabase, with automatic local fallback).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v20+ recommended)
- npm

### 2. Backend Setup
```bash
cd server
npm install
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

## 📄 Documentation
See [`Changes.md`](./Changes.md) for detailed analysis of product-market fit, removed workplace features (Tasks, Leaderboard), newly added community features, and deployment links.
