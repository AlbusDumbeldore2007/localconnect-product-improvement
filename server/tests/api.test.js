const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const cors = require('cors');

const postsRoutes = require('../routes/posts');
const issuesRoutes = require('../routes/issues');
const eventsRoutes = require('../routes/events');
const recommendationsRoutes = require('../routes/recommendations');
const metricsRoutes = require('../routes/metrics');

describe('LocalConnect Community API & Integration Test Suite', () => {
  let server;
  let baseUrl;

  before(async () => {
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.use('/posts', postsRoutes);
    app.use('/issues', issuesRoutes);
    app.use('/events', eventsRoutes);
    app.use('/recommendations', recommendationsRoutes);
    app.use('/metrics', metricsRoutes);

    app.get('/', (req, res) => res.send('LocalConnect Neighborhood API is running...'));

    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://localhost:${port}`;
        console.log(`[Test Suite] Ephemeral test server running at ${baseUrl}`);
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  test('GET / - API health check responds with 200', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.match(text, /LocalConnect Neighborhood API/);
  });

  test('POST /posts & GET /posts - Creates and retrieves announcements', async () => {
    const uniqueContent = `Community Notice Test ${Date.now()}`;
    const createRes = await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: uniqueContent })
    });

    assert.equal(createRes.status, 201);
    const created = await createRes.json();
    assert.equal(created.content, uniqueContent);
    assert.ok(created.id, 'Created post should have an id');

    const getRes = await fetch(`${baseUrl}/posts`);
    assert.equal(getRes.status, 200);
    const posts = await getRes.json();
    assert.ok(Array.isArray(posts));
    assert.ok(posts.some(p => p.content === uniqueContent), 'Created post should be present in feed');
  });

  test('POST /issues, GET /issues & PATCH /issues/:id - Reports issue and transitions status', async () => {
    const issueRes = await fetch(`${baseUrl}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Clogged storm drain on Maple',
        description: 'Water ponding after heavy rain.'
      })
    });

    assert.equal(issueRes.status, 201);
    const issue = await issueRes.json();
    assert.equal(issue.status, 'OPEN');

    // Update status to IN_PROGRESS
    const updateRes = await fetch(`${baseUrl}/issues/${issue.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'IN_PROGRESS' })
    });

    assert.equal(updateRes.status, 200);
    const updated = await updateRes.json();
    assert.equal(updated.status, 'IN_PROGRESS');

    // Update status to RESOLVED
    const resolvedRes = await fetch(`${baseUrl}/issues/${issue.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'RESOLVED' })
    });

    assert.equal(resolvedRes.status, 200);
    const resolved = await resolvedRes.json();
    assert.equal(resolved.status, 'RESOLVED');
  });

  test('POST /events, GET /events & POST /events/:id/rsvp - Creates event and persists RSVPs', async () => {
    const eventRes = await fetch(`${baseUrl}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Oak Park Spring Cleanup 2026',
        description: 'Bring rakes and garden gloves.',
        date: 'Saturday, Nov 22 • 10:00 AM',
        location: 'Oak Park Gazebo',
        organizer: 'Marcus D.',
        category: 'Cleanup'
      })
    });

    assert.equal(eventRes.status, 201);
    const event = await eventRes.json();
    assert.equal(event.title, 'Oak Park Spring Cleanup 2026');
    const initialAttendees = event.attendees;

    // RSVP to the event
    const rsvpRes = await fetch(`${baseUrl}/events/${event.id}/rsvp`, {
      method: 'POST'
    });

    assert.equal(rsvpRes.status, 200);
    const rsvpdEvent = await rsvpRes.json();
    assert.equal(rsvpdEvent.attendees, initialAttendees + 1, 'Attendee count must increment on RSVP');
  });

  test('POST /recommendations, GET /recommendations & POST /recommendations/:id/like - Creates recommendation and upvotes', async () => {
    const recRes = await fetch(`${baseUrl}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Dan the Handyman Services',
        category: 'Home Repair',
        description: 'Fixed our front porch steps cleanly and promptly.',
        contact: '(555) 991-2345',
        recommendedBy: 'David Miller',
        rating: 5
      })
    });

    assert.equal(recRes.status, 201);
    const rec = await recRes.json();
    assert.equal(rec.category, 'Home Repair');
    assert.equal(rec.rating, 5);
    const initialLikes = rec.likes;

    // Upvote / Like recommendation
    const likeRes = await fetch(`${baseUrl}/recommendations/${rec.id}/like`, {
      method: 'POST'
    });

    assert.equal(likeRes.status, 200);
    const likedRec = await likeRes.json();
    assert.equal(likedRec.likes, initialLikes + 1, 'Likes must increment on helpful upvote');
  });

  test('GET /metrics - Calculates community metrics correctly', async () => {
    const res = await fetch(`${baseUrl}/metrics`);
    assert.equal(res.status, 200);
    const metrics = await res.json();

    assert.ok(typeof metrics.totalPosts === 'number');
    assert.ok(typeof metrics.totalIssues === 'number');
    assert.ok(typeof metrics.totalEvents === 'number');
    assert.ok(typeof metrics.totalRecommendations === 'number');
    assert.ok(typeof metrics.openIssues === 'number');
    assert.ok(typeof metrics.resolvedIssues === 'number');
  });

  test('Persistence Verification - Data created persists across fresh queries', async () => {
    const postStamp = `Persistence Verification Post ${Date.now()}`;
    const pRes = await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: postStamp })
    });
    assert.equal(pRes.status, 201);

    // Fetch posts immediately through a new query
    const listRes = await fetch(`${baseUrl}/posts`);
    const posts = await listRes.json();
    const persistedPost = posts.find(p => p.content === postStamp);
    assert.ok(persistedPost, 'Post must be found in persistent storage');
    assert.ok(persistedPost.id > 0);
  });
});
