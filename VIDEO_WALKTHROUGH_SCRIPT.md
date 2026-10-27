# 🎥 3–5 Minute Video Walkthrough Script: LocalConnect Product Feature Alignment

Use this exact, verbatim script and walkthrough guide to record your 3–5 minute video.
Make sure your **face is visible** (webcam in corner or on camera) and your **screen is shared**.

---

## ⏱️ Video Structure & Assessment Criteria Checklist

- [x] **Criterion 1 (0:00 - 0:45)**: Introduction & Overview of Original Codebase Features
- [x] **Criterion 2 (0:45 - 1:45)**: Product Review Analysis — Why Features Missed Intended Users
- [x] **Criterion 3 (1:45 - 2:30)**: Solution Architecture — Removed Features & 2 New Community Features
- [x] **Criterion 4 (2:30 - 3:45)**: Live Functional Demo (Feed, Issues, Events + RSVP, Recommendations + Upvotes)
- [x] **Criterion 5 (3:45 - 4:30)**: Database Migrations, Schema Setup, Integration Tests & Persistence

---

## 🎙️ Verbatim Word-for-Word Recording Script

### [0:00 - 0:45] Criterion 1: Introduction & Original Features
*(Face on camera, show initial LocalConnect app or slide)*
> "Hello! My name is [Your Name], and this is my presentation for Challenge 3.5: When Products Miss Their Users on the LocalConnect neighborhood platform.
>
> LocalConnect was built with a simple goal: create a lightweight digital hub for people living in the same neighborhood to stay informed, report local issues, and support one another.
>
> However, when reviewing the starter codebase, I discovered that several features did not match real community residents. The app included a Neighborhood Feed and Issue Reporting, but it also contained a Task Assignment system, a Contributor Leaderboard with gamified points, and a Corporate Productivity Dashboard tracking 'Project Status' and an arbitrary 'Activity Score'."

---

### [0:45 - 1:45] Criterion 2: Product Review Analysis & Misalignments
*(Show code or comparison slide highlighting Tasks and Leaderboard)*
> "As an engineer evaluating product-market fit, I asked three key questions:
> 1. Who is the primary user? Local neighborhood residents.
> 2. What problem are they trying to solve? Everyday community coordination and local communication.
> 3. Does each feature help them achieve that goal?
>
> The answer for three features was a clear NO:
>
> First, **Task Assignment**: In a neighborhood, residents are equals and volunteers. Delegating tasks like 'Clean park assigned to John Doe' mirrors corporate Jira or Asana backlogs. It introduces top-down bureaucracy, hierarchy, and social friction.
>
> Second, **Contributor Leaderboards**: Neighborhood goodwill is built on trust and mutual assistance, not employee gamification. Ranking neighbors with points turns neighborliness into a competitive contest, alienating casual participants.
>
> Third, **Productivity Metrics**: Residents visit a neighborhood app to check what is happening this weekend or find a trusted plumber—not to review velocity charts or executive KPIs."

---

### [1:45 - 2:30] Criterion 3: Solution Architecture & New Features
*(Show code structure in editor)*
> "To align LocalConnect with its true users, I applied the engineering decision framework:
>
> I completely **removed** the Task Assignment module (`/tasks`, `TaskCard`, and backend routes) and the Leaderboard (`/leaderboard`).
>
> Then, I designed and implemented **two meaningful community features**:
> 1. **Community Events & Gatherings (`/events`)**: Enabling residents to organize and discover neighborhood cleanups, block parties, and townhall meetings, complete with category filters and an interactive RSVP system.
> 2. **Local Recommendations Directory (`/recommendations`)**: Enabling neighbors to share trusted local plumbers, electricians, landscapers, and babysitters, with 5-star ratings, contact info, and 'Helpful' upvoting.
>
> Finally, I redesigned the landing page from an enterprise KPI dashboard into a warm **Community Overview Hub** with quick resident actions and live previews."

---

### [2:30 - 3:45] Criterion 4: Live Functional Demonstration
*(Switch browser to live LocalConnect application)*
> "Now let's see the application in action:
>
> Here is our redesigned **Community Overview Hub**. At a glance, residents see active announcements, open alerts, upcoming events, and trusted recommendations, along with one-click quick actions.
>
> Let's go to **Events**. Here we see upcoming community activities like our Spring Clean-up and Block Party. I can filter by category—such as 'Cleanup' or 'Social'. Notice our 'RSVP / Join Event' button: when I click it, the attendee count increments immediately with instant confirmation feedback! Residents can also host new events using the host form.
>
> Next, let's open **Local Recommendations**. Word-of-mouth is how neighbors find reliable help. Here we have verified recommendations for plumbers and electricians. I can filter by category, submit a new review with star ratings and contact info, and click 'Helpful' to upvote trusted local services.
>
> On the **Issues** page, residents report infrastructure issues like broken streetlights, and can transition status between Open, In Progress, and Resolved."

---

### [3:45 - 4:30] Criterion 5: Database Schema, Migrations, Persistence & Tests
*(Show VS Code terminal / migration files)*
> "Behind the scenes:
> 1. We defined clean Prisma models for `Post`, `Issue`, `Event`, and `Recommendation` in `schema.prisma`.
> 2. We generated formal PostgreSQL migrations located in `server/prisma/migrations/20261027000000_init_community_schema/migration.sql`.
> 3. For persistence: when connected to PostgreSQL on Neon, Supabase, or Render, Prisma executes SQL transactions. For local development, mutations sync directly to disk in `server/data/community_store.json`, so no data is ever lost across server reboots.
>
> Let's run our automated test suite in the terminal:
> `npm test`
> As you can see, all 7 integration tests pass with 100% success—verifying healthcheck, posts, issues, event RSVPs, recommendation upvotes, metrics, and persistence!
>
> All changes are documented in `Changes.md`, `DATABASE_SETUP.md`, and `TESTING.md`, and submitted via Pull Request #1 on GitHub. Thank you!"

---

## 📤 How to Record and Submit

1. **Recording Tool**: Use **Loom** (free), **OBS Studio**, or press `Windows Key + Alt + R` to record your screen and microphone. Ensure your webcam is enabled.
2. **Upload**: Upload the MP4 video to your **Google Drive**.
3. **Sharing Permission (Crucial)**:
   - Right-click the video in Google Drive -> Click **Share**.
   - Under General access, select: **"Anyone with the link"** and set permission to **"Editor"** ("Anyone with the link can edit").
4. **Copy Link**: Paste this Google Drive URL into the submission field for **Video Explanation URL**.
