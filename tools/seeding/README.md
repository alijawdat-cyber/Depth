# 🌱 Depth Seeding Script

Seeding (زرع البيانات) is performed via a Node.js script that writes seed data to Firestore directly. No admin UI is used.

## Features
- Idempotent upsert for categories and subcategories (with basePrice inside subcategories)
- Validation before write (missing fields, duplicate IDs, broken references)
- Batch writes with chunking to respect Firestore limits
- Audit log entry (SEEDS_APPLIED) with counts and checksum

## Prerequisites
- Node.js 18+
- Firebase Service Account with Firestore access
- Environment variables:
  - `GOOGLE_APPLICATION_CREDENTIALS` → path to service account json
  - `FIREBASE_PROJECT_ID` → target project id

## Usage
1. Put your seeds file at `tools/seeding/sample-seeds.json` (or any path).
2. Install deps:
```bash
npm run seed:install
```
3. Run the script:
```bash
npm run seed -- tools/seeding/sample-seeds.json
```

## Notes
- The script is safe to re-run; it updates existing docs and inserts missing ones.
- No separate `basePrices` collection; use `basePrice` field in each `subcategory`.
- For local development, point to the Firestore emulator by setting `FIRESTORE_EMULATOR_HOST=127.0.0.1:8080`.
- Keep identifiers stable across environments.
