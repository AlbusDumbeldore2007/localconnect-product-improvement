const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dataDir = path.join(__dirname, 'data');
const storePath = path.join(dataDir, 'community_store.json');

// Initial seed data template
const initialData = {
  posts: [
    { id: 1, content: 'Garage sale announcement - This Saturday at 123 Maple St!', createdAt: new Date(Date.now() - 3600000 * 4).toISOString() },
    { id: 2, content: 'Lost dog notice - Golden Retriever named "Buddy" last seen near Oak Park. Please call (555) 0192 if spotted!', createdAt: new Date(Date.now() - 3600000 * 12).toISOString() },
    { id: 3, content: 'Community block cleanup - Meet at the community center this Sunday at 9 AM. Gloves and bags provided!', createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
  ],
  issues: [
    { id: 1, title: 'Broken Streetlight', description: 'Corner of 4th and Oak is pitch black at night, making walking unsafe.', status: 'OPEN', createdAt: new Date(Date.now() - 3600000 * 48).toISOString() },
    { id: 2, title: 'Park Trash Bins Overflowing', description: 'Maplewood Park bins have not been emptied since weekend soccer games.', status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 3600000 * 24).toISOString() },
    { id: 3, title: 'Deep Pothole on Elm Street', description: 'Large pothole near school crosswalk causing cars to swerve into bike lane.', status: 'RESOLVED', createdAt: new Date(Date.now() - 3600000 * 72).toISOString() },
  ],
  events: [
    { id: 1, title: 'Neighborhood Spring Clean-Up & Tree Planting', description: 'Join fellow neighbors to pick up litter along Oak Creek and plant 15 shade saplings. Coffee and donuts provided by Maplewood Bakery!', date: 'Saturday, Nov 15 • 9:00 AM', location: 'Maplewood Community Park Pavilion', organizer: 'Elena Rostova', category: 'Cleanup', attendees: 16, createdAt: new Date(Date.now() - 3600000 * 18).toISOString() },
    { id: 2, title: 'Annual Elm Street Block Party & Potluck', description: 'Bring a dish or dessert! We will have live acoustic music, face painting for kids, and a grilling station.', date: 'Sunday, Nov 23 • 4:00 PM', location: 'Elm Street Cul-de-sac', organizer: 'Marcus Davis', category: 'Social', attendees: 32, createdAt: new Date(Date.now() - 3600000 * 10).toISOString() },
    { id: 3, title: 'Neighborhood Watch & Traffic Safety Townhall', description: 'Meet with local safety liaisons to discuss speed humps on 4th Ave and neighborhood watch coordination.', date: 'Thursday, Dec 4 • 7:00 PM', location: 'Local Public Library Meeting Room B', organizer: 'Community Council', category: 'Meeting', attendees: 21, createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
  ],
  recommendations: [
    { id: 1, title: "Apex Plumbing & Drain Solutions", category: "Plumbing", description: "Fixed a ruptured kitchen pipe on a Sunday morning within 30 minutes. Clear upfront pricing, polite, and spotless cleanup.", contact: "(555) 234-8891 • apexplumb@gmail.com", recommendedBy: "Sarah Jenkins", rating: 5, likes: 14, createdAt: new Date(Date.now() - 3600000 * 30).toISOString() },
    { id: 2, title: "BrightSpark Electrical Services", category: "Electrical", description: "Installed our Level 2 EV home charger and added outdoor surge protection. Fully licensed and handled city permits seamlessly.", contact: "(555) 782-3401", recommendedBy: "David Chen", rating: 5, likes: 11, createdAt: new Date(Date.now() - 3600000 * 20).toISOString() },
    { id: 3, title: "GreenThumb Lawn & Tree Care", category: "Gardening", description: "Family-run local yard service. They do spring aeration, tree trimming, and garden bed mulching at very reasonable neighbor rates.", contact: "greenthumb@localmail.com", recommendedBy: "Rachel Patel", rating: 5, likes: 9, createdAt: new Date(Date.now() - 3600000 * 15).toISOString() },
  ]
};

// Disk persistence manager for local development to ensure data is never lost across server restarts
function loadPersistedData() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (fs.existsSync(storePath)) {
      const raw = fs.readFileSync(storePath, 'utf8');
      return JSON.parse(raw);
    }
    fs.writeFileSync(storePath, JSON.stringify(initialData, null, 2), 'utf8');
    return JSON.parse(JSON.stringify(initialData));
  } catch (err) {
    console.error('[Persistence] Error loading local store, using default memory:', err);
    return JSON.parse(JSON.stringify(initialData));
  }
}

function savePersistedData(data) {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[Persistence] Error saving to disk:', err);
  }
}

let persistedDb = loadPersistedData();
let realPrisma = null;
let useDatabase = false;

if (process.env.DATABASE_URL) {
  try {
    realPrisma = new PrismaClient();
    useDatabase = true;
    console.log('[Database] Connecting to PostgreSQL via Prisma Client...');
  } catch (err) {
    console.warn('[Database] Prisma initialization error:', err.message);
  }
} else {
  console.log('[Database] No DATABASE_URL set in environment.');
  console.log('[Database] Using disk-persisted local store (`server/data/community_store.json`).');
  console.log('[Database] To connect PostgreSQL, set DATABASE_URL in .env and run `npx prisma migrate dev`.');
}

const modelDefaults = {
  posts: {},
  issues: { status: 'OPEN' },
  events: { category: 'General', attendees: 0 },
  recommendations: { rating: 5, likes: 0 }
};

const createModelHandler = (collectionName) => ({
  findMany: async (args = {}) => {
    if (useDatabase && realPrisma) {
      try {
        return await realPrisma[collectionName].findMany(args);
      } catch (err) {
        console.warn(`[Prisma Query Failed] ${collectionName}.findMany: ${err.message}. Falling back to disk store.`);
      }
    }
    persistedDb = loadPersistedData();
    let items = [...persistedDb[collectionName]];
    if (args.orderBy?.createdAt === 'desc') {
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return items;
  },
  create: async (args = {}) => {
    if (useDatabase && realPrisma) {
      try {
        return await realPrisma[collectionName].create(args);
      } catch (err) {
        console.warn(`[Prisma Create Failed] ${collectionName}.create: ${err.message}. Falling back to disk store.`);
      }
    }
    persistedDb = loadPersistedData();
    const id = persistedDb[collectionName].length > 0
      ? Math.max(...persistedDb[collectionName].map(i => i.id)) + 1
      : 1;
    const defaults = modelDefaults[collectionName] || {};
    const newItem = { id, ...defaults, ...args.data, createdAt: new Date().toISOString() };
    persistedDb[collectionName].unshift(newItem);
    savePersistedData(persistedDb);
    return newItem;
  },
  update: async (args = {}) => {
    if (useDatabase && realPrisma) {
      try {
        return await realPrisma[collectionName].update(args);
      } catch (err) {
        console.warn(`[Prisma Update Failed] ${collectionName}.update: ${err.message}. Falling back to disk store.`);
      }
    }
    persistedDb = loadPersistedData();
    const targetId = args.where?.id;
    const item = persistedDb[collectionName].find(i => i.id === targetId);
    if (!item) throw new Error(`${collectionName} with id ${targetId} not found`);

    for (const [key, val] of Object.entries(args.data || {})) {
      if (val && typeof val === 'object' && 'increment' in val) {
        item[key] = (item[key] || 0) + val.increment;
      } else {
        item[key] = val;
      }
    }
    savePersistedData(persistedDb);
    return item;
  },
  count: async (args = {}) => {
    if (useDatabase && realPrisma) {
      try {
        return await realPrisma[collectionName].count(args);
      } catch (err) {
        console.warn(`[Prisma Count Failed] ${collectionName}.count: ${err.message}. Falling back to disk store.`);
      }
    }
    persistedDb = loadPersistedData();
    if (args.where?.status) {
      return persistedDb[collectionName].filter(i => i.status === args.where.status).length;
    }
    return persistedDb[collectionName].length;
  }
});

const prisma = {
  post: createModelHandler('posts'),
  issue: createModelHandler('issues'),
  event: createModelHandler('events'),
  recommendation: createModelHandler('recommendations'),
  $disconnect: async () => {
    if (realPrisma) await realPrisma.$disconnect();
  }
};

module.exports = prisma;
