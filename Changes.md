# LocalConnect — Product Alignment, Database Setup & Feature Improvement Report

## Project Overview

**LocalConnect** is a neighborhood-focused digital platform created to help residents living in the same local community stay connected, coordinate everyday activities, and share information.

The core purpose of the application is:
> *Create a lightweight, intuitive, and welcoming digital space for neighbors to communicate and support one another.*

---

## 1. Analysis of Existing Features

During the initial codebase exploration, the system had five functional areas:

1. **Neighborhood Feed (`/feed`)**: A public forum where residents share community announcements, updates, and lost-and-found notices.
2. **Issue Reporting (`/issues`)**: An issue-tracking tool where residents report problems in the neighborhood (e.g., broken streetlights, potholes, garbage overflows).
3. **Task Assignment (`/tasks`)**: A tool for creating tasks, assigning them to individual residents, and marking them as `PENDING` or `COMPLETED`.
4. **Contributor Leaderboard (`/leaderboard`)**: A gamified leaderboard displaying points and rankings for residents based on activity.
5. **Community Metrics Dashboard (`/`, `/metrics`)**: An analytics page displaying "Project Status", "activity score" calculations (`totalPosts * 5 + totalIssues * 10 + tasksCompleted * 20`), and productivity metrics.

---

## 2. Identified Product-User Misalignments

While evaluating the features against the intended users (**neighborhood residents**), critical misalignments were identified:

### ❌ Misaligned Feature 1: Task Assignment (`/tasks`)
* **Why it does not align**: In a neighborhood, residents are volunteers, homeowners, and neighbors—not corporate subordinates or employees. A system where residents "assign tasks" to neighbors (e.g. *Task: "Clean park", Assigned to: "John Doe"*) mirrors corporate sprint backlogs (Jira/Asana). This creates social discomfort, hierarchy, and micromanagement rather than organic community cooperation.
* **Decision**: **Remove completely**.

### ❌ Misaligned Feature 2: Contributor Leaderboard (`/leaderboard`)
* **Why it does not align**: Neighborhood cohesion is built upon neighborliness, mutual trust, and goodwill. Competitive workplace gamification ranking neighbors (e.g., *#1 John Doe: 1,250 pts*) commodifies community service into a point-scoring contest. This alienates residents who prefer casual participation and encourages performative posting.
* **Decision**: **Remove completely**.

### ⚠️ Misaligned Feature 3: Corporate Productivity Dashboard (`Dashboard.jsx`, `/metrics`)
* **Why it does not align**: The original landing page resembled an enterprise executive KPI analytics panel. It focused on an arbitrary formulaic "Activity Score" and "Project Status". Residents do not visit their neighborhood hub to check velocity metrics; they visit to see what is happening right now—weekend events, urgent safety notices, and recommendations.
* **Decision**: **Redesign into a Neighborhood Hub / Community Overview**.

---

## 3. Features Removed & Modified

### Features Removed:
* **Frontend**:
  * Removed `Tasks.jsx` (`/tasks`) page.
  * Removed `TaskCard.jsx` component.
  * Removed `Leaderboard.jsx` (`/leaderboard`) page.
  * Removed Task-related API methods from `services/api.js`.
* **Backend**:
  * Removed `server/controllers/tasks.js`.
  * Removed `server/routes/tasks.js`.
  * Removed `Task` model from `schema.prisma`.
  * Removed task calculations from `server/controllers/metrics.js`.

### Features Modified:
* **Dashboard (`client/src/pages/Dashboard.jsx`)**:
  * Redesigned from a workplace KPI screen into a warm, community-centered **Neighborhood Hub**.
  * Replaced the corporate "Activity Score" with 4 key community metrics: Announcements Shared, Active Issues/Alerts, Upcoming Community Events, and Trusted Recommendations.
  * Added "Quick Action" buttons (*Post Update*, *Report Issue*, *Plan an Event*, *Recommend a Service*).
  * Added live preview widgets: "Happening Soon" (Upcoming Events) and "Latest Announcements" with direct RSVP and detail links.
* **Navigation (`Navbar.jsx`)**:
  * Replaced enterprise navigation with neighbor-friendly routes: **Overview**, **Feed**, **Issues**, **Events**, and **Recommendations**.
* **Metrics Controller (`server/controllers/metrics.js`)**:
  * Updated to aggregate community metrics: `totalPosts`, `totalIssues`, `openIssues`, `resolvedIssues`, `totalEvents`, `totalRecommendations`.

---

## 4. Two Meaningful Community Features Implemented

To replace the misaligned features and foster genuine neighborhood interaction, two new features were designed and implemented:

### 1️⃣ Community Events & Gatherings (`/events`)
* **Purpose**: Allows neighbors to discover, organize, and RSVP to local activities such as block parties, park cleanups, seasonal garage sales, HOA meetings, and sports activities.
* **Capabilities**:
  * **Event Discovery**: Filter events by category (*All*, *Cleanup*, *Social*, *Meeting*, *Sports*, *General*).
  * **Hosting / Creation**: Form allowing residents to publish event title, date & time, meeting location, organizer name, category, and details.
  * **Interactive RSVP**: Neighbors can RSVP to events with real-time attendee increment feedback.
* **Files Added**:
  * `client/src/pages/Events.jsx`
  * `client/src/components/EventCard.jsx`
  * `server/controllers/events.js`
  * `server/routes/events.js`
  * `Event` model in `schema.prisma`

### 2️⃣ Local Recommendations Directory (`/recommendations`)
* **Purpose**: Solves one of the most common real-world neighborhood interactions: asking neighbors for trusted local services, contractors, plumbers, electricians, tutors, and babysitters.
* **Capabilities**:
  * **Service Discovery**: Filter recommendations by category (*Plumbing*, *Electrical*, *Gardening*, *Babysitting*, *Home Repair*, *Auto Care*, *Other*).
  * **Recommendation Sharing**: Form to submit service name, category, star rating (1–5 stars), contact info, personal review, and recommender name.
  * **Community Upvoting**: Residents can upvote recommendations as "Helpful" to highlight top-rated local providers.
* **Files Added**:
  * `client/src/pages/Recommendations.jsx`
  * `client/src/components/RecommendationCard.jsx`
  * `server/controllers/recommendations.js`
  * `server/routes/recommendations.js`
  * `Recommendation` model in `schema.prisma`

---

## 5. Database Setup, Migrations & Persistence

### 1. Prisma Migration Files
Formal PostgreSQL migration scripts are committed in `server/prisma/migrations/20261027000000_init_community_schema/migration.sql` creating:
- `Post` (`id`, `content`, `createdAt`)
- `Issue` (`id`, `title`, `description`, `status`, `createdAt`)
- `Event` (`id`, `title`, `description`, `date`, `location`, `organizer`, `category`, `attendees`, `createdAt`)
- `Recommendation` (`id`, `title`, `category`, `description`, `contact`, `recommendedBy`, `rating`, `likes`, `createdAt`)

### 2. Running Migrations & Seeding
```bash
cd server

# Apply database migration
npx prisma migrate dev --name init_community_schema

# Seed realistic community data
npm run seed
```

### 3. Dual-Layer Data Persistence Guarantee
* **PostgreSQL Layer**: When `DATABASE_URL` is set, Prisma directly executes SQL transactions against PostgreSQL tables, preserving records across server reboots.
* **Local Development Layer**: When running offline without a live PostgreSQL server, `server/prismaClient.js` synchronizes all mutations directly to the local disk file `server/data/community_store.json`. Data created during local execution is saved to disk and never lost upon server restart.

---

## 6. Test & Run Evidence

An automated integration test suite (`server/tests/api.test.js`) verifies all API routes, database transitions, and persistence:

```
> server@1.0.0 test
> node --test tests/api.test.js

TAP version 13
# [Test Suite] Ephemeral test server running at http://localhost:58127
# Subtest: LocalConnect Community API & Integration Test Suite
    # Subtest: GET / - API health check responds with 200
    ok 1 - GET / - API health check responds with 200
      ---
      duration_ms: 58.2506
      ...
    # Subtest: POST /posts & GET /posts - Creates and retrieves announcements
    ok 2 - POST /posts & GET /posts - Creates and retrieves announcements
      ---
      duration_ms: 46.7824
      ...
    # Subtest: POST /issues, GET /issues & PATCH /issues/:id - Reports issue and transitions status
    ok 3 - POST /issues, GET /issues & PATCH /issues/:id - Reports issue and transitions status
      ---
      duration_ms: 72.2577
      ...
    # Subtest: POST /events, GET /events & POST /events/:id/rsvp - Creates event and persists RSVPs
    ok 4 - POST /events, GET /events & POST /events/:id/rsvp - Creates event and persists RSVPs
      ---
      duration_ms: 61.7019
      ...
    # Subtest: POST /recommendations, GET /recommendations & POST /recommendations/:id/like - Creates recommendation and upvotes
    ok 5 - POST /recommendations, GET /recommendations & POST /recommendations/:id/like - Creates recommendation and upvotes
      ---
      duration_ms: 58.0231
      ...
    # Subtest: GET /metrics - Calculates community metrics correctly
    ok 6 - GET /metrics - Calculates community metrics correctly
      ---
      duration_ms: 33.1696
      ...
    # Subtest: Persistence Verification - Data created persists across fresh queries
    ok 7 - Persistence Verification - Data created persists across fresh queries
      ---
      duration_ms: 38.1143
      ...
    1..7
ok 1 - LocalConnect Community API & Integration Test Suite
  ---
  duration_ms: 380.4039
  type: 'suite'
  ...
1..1
# tests 7
# suites 1
# pass 7
# fail 0
# duration_ms 650.3236
```

---

## 7. Deployment Links

* **GitHub Pull Request URL**: [https://github.com/AlbusDumbeldore2007/localconnect-product-improvement/pull/1](https://github.com/AlbusDumbeldore2007/localconnect-product-improvement/pull/1)
* **Frontend Deployment Link**: [https://localconnect-product-improvement.vercel.app](https://localconnect-product-improvement.vercel.app)
* **Backend Deployment Link**: [https://localconnect-api.onrender.com](https://localconnect-api.onrender.com)
* **Hosted Database**: PostgreSQL (Neon / Supabase)

---

## 8. Video Walkthrough Assessment Criteria Guide

A dedicated word-for-word script is provided in [`VIDEO_WALKTHROUGH_SCRIPT.md`](./VIDEO_WALKTHROUGH_SCRIPT.md) and an interactive presentation deck is available in [`walkthrough.html`](./walkthrough.html).

### 5 Rubric Criteria Covered:
1. **Existing Features**: Demonstrates and explains the starter system (Feed, Issues, Tasks, Leaderboard, Productivity Dashboard).
2. **Product & User Misalignment**: In-depth explanation of why Tasks, Leaderboards, and Enterprise KPIs miss neighborhood residents (peers vs employees, mutual trust vs competition).
3. **Improvements Implemented**: Detailed walkthrough of Community Events, Local Recommendations, and the redesigned Community Hub.
4. **Live Functional Demo**: Live execution showing creation and interactions across Feed, Issues status updates, Events RSVPs, and Recommendations upvotes.
5. **Technical Architecture & DB Persistence**: Explaining Prisma models, migration SQL, disk/PostgreSQL persistence, and running the 7/7 passing integration test suite.
