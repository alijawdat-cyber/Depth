#!/usr/bin/env node
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import process from 'node:process';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function checksum(obj) {
  const json = JSON.stringify(obj);
  return crypto.createHash('sha256').update(json).digest('hex');
}

function parseArgs() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node tools/seeding/index.mjs <path-to-seeds.json>');
    process.exit(1);
  }
  return { file };
}

function getApp() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error('FIREBASE_PROJECT_ID is required');
  const app = initializeApp({
    credential: process.env.GOOGLE_APPLICATION_CREDENTIALS ? applicationDefault() : undefined,
    projectId,
  });
  return app;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function validateSeeds(seeds) {
  const errors = [];
  if (!Array.isArray(seeds.categories)) errors.push('categories must be an array');
  if (!Array.isArray(seeds.subcategories)) errors.push('subcategories must be an array');
  // basePrices ألغيت كمجموعة منفصلة: السعر الأساسي يكتب داخل subcategories
  const catIds = new Set((seeds.categories || []).map(c => c.id));
  const subIds = new Set();
  for (const s of (seeds.subcategories || [])) {
    if (!catIds.has(s.categoryId)) errors.push(`subcategory.categoryId not found: ${s.id} → ${s.categoryId}`);
    if (subIds.has(s.id)) errors.push(`duplicate subcategory id: ${s.id}`);
    subIds.add(s.id);
  }
  for (const s of (seeds.subcategories || [])) {
    if (typeof s.basePrice !== 'number') errors.push(`subcategory.basePrice must be number for ${s.id}`);
  }
  return errors;
}

async function upsertCollection(db, collection, items, idField = 'id') {
  if (!items?.length) return 0;
  const chunks = chunk(items, 400);
  let count = 0;
  for (const part of chunks) {
    const batch = db.batch();
    for (const item of part) {
      const id = item[idField];
      if (!id) throw new Error(`Missing ${idField} in ${collection}`);
      const ref = db.collection(collection).doc(id);
      batch.set(ref, item, { merge: true });
      count += 1;
    }
    await batch.commit();
  }
  return count;
}

async function writeAudit(db, summary) {
  const ref = db.collection('auditLogs').doc();
  await ref.set({
    id: ref.id,
    type: 'SEEDS_APPLIED',
    actor: 'system:seeding-script',
    createdAt: new Date().toISOString(),
    details: summary,
  });
}

async function main() {
  const { file } = parseArgs();
  const raw = await fs.readFile(file, 'utf-8');
  const seeds = JSON.parse(raw);
  const errors = await validateSeeds(seeds);
  if (errors.length) {
    console.error('Validation failed:\n- ' + errors.join('\n- '));
    process.exit(1);
  }

  const app = getApp();
  const db = getFirestore(app);

  const result = { counts: {}, checksum: checksum(seeds), file };
  result.counts.categories = await upsertCollection(db, 'categories', seeds.categories);
  result.counts.subcategories = await upsertCollection(db, 'subcategories', seeds.subcategories);
  // no separate basePrices collection anymore

  await writeAudit(db, result);
  console.log('SEEDS_APPLIED', JSON.stringify(result, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
