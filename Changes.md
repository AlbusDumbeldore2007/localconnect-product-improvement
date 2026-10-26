# LocalConnect — Product Alignment & Feature Improvement Report

## Project Overview

**LocalConnect** is a neighborhood-focused digital platform created to help residents living in the same local community stay connected, coordinate everyday activities, and share information.

The core purpose of the application is:
> *Create a lightweight, intuitive, and welcoming digital space for neighbors to communicate and support one another.*

---

## 1. Analysis of Existing Features

During the initial codebase exploration, the system had five major functional areas:

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

## 5. Summary of Improvements & Impact

| Metric / Aspect | Before (Starter System) | After (Our Improvements) |
| :--- | :--- | :--- |
| **User Alignment** | Corporate task tracking and employee gamification | Authentic neighborhood collaboration and support |
| **Landing Experience** | Corporate KPI & activity score chart | Friendly community front porch with quick actions & previews |
| **Collaboration Model** | Top-down task assignment to neighbors | Bottom-up community event organizing & RSVPs |
| **Local Value** | No marketplace or service directory | Trusted local vendor & artisan recommendations directory |
| **Architecture** | Express + Prisma + React (hardcoded mock/seed) | Resilient Express + Prisma with PostgreSQL compatibility & in-memory fallback |

---

## 6. Deployment Links

* **Frontend Deployment Link**: [https://localconnect-product-improvement.vercel.app](https://localconnect-product-improvement.vercel.app)
* **Backend Deployment Link**: [https://localconnect-api.onrender.com](https://localconnect-api.onrender.com)
* **Hosted Database**: PostgreSQL (Neon / Supabase)

---

## 7. Video Explanation Submission Guide

* **Video Link**: *[Paste your shared Google Drive link here with "Anyone with the link can edit" permission]*
* **Recommended Talking Points**:
  1. *Introduction (30s)*: Overview of LocalConnect and the core user persona (neighborhood residents).
  2. *The Misalignment (1 min)*: Explaining why Task Assignment and Leaderboards were ill-suited for community life (resembling Jira/workplace productivity rather than neighborly trust).
  3. *The Improvements (1.5 min)*: Walkthrough of the new **Community Events** feature and **Local Recommendations** directory.
  4. *Live Demo (1 min)*: Demonstrating creating an announcement, hosting an event with RSVP, reporting an issue, and upvoting a local plumber recommendation.
