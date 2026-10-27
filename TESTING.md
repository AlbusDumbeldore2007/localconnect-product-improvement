# Integration Test & Run Evidence

This document provides formal evidence of test execution, API stability, status transitions, and data persistence for the LocalConnect Community Platform.

---

## 1. Test Suite Architecture

* **Runner**: Native Node.js test runner (`node:test`, `node:assert/strict`)
* **Test File**: `server/tests/api.test.js`
* **Command**: `npm test` inside `server/`
* **Coverage**: Healthcheck, Posts (Announcements), Issues (Reporting & Status transitions), Events (Creation & RSVP attendee counter), Recommendations (Creation & Helpful upvote), Metrics aggregation, and Data Persistence.

---

## 2. Test Execution Log (100% Pass)

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
# cancelled 0
# skipped 0
# todo 0
# duration_ms 650.3236
```

---

## 3. Frontend Production Build Evidence

Vite production build verification in `client/`:

```
> client@0.0.0 build
> vite build

vite v7.3.1 building client environment for production...
transforming...
✓ 1816 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.47 kB │ gzip:  0.30 kB
dist/assets/index-CwjWHMF0.css    8.54 kB │ gzip:  2.51 kB
dist/assets/index-m-u3Ghf6.js   297.49 kB │ gzip: 95.83 kB
✓ built in 2.27s
```

---

## 4. How to Reproduce

1. Backend Tests:
   ```bash
   cd server
   npm test
   ```
2. Frontend Build:
   ```bash
   cd client
   npm run build
   ```
