import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import fs from 'node:fs/promises';
import path from 'node:path';

const RootDir = process.cwd();
const DocsDir = path.join(RootDir, 'docs', 'catalog', '09-Seed');

const TaxonomySchema = z.object({
  categories: z.array(z.object({ id: z.string(), nameAr: z.string(), nameEn: z.string().optional(), order: z.number().optional() })),
  subcategories: z.array(z.object({
    id: z.string(),
    categoryId: z.string(),
    nameAr: z.string(),
    nameEn: z.string().optional(),
    desc: z.string().optional(),
    defaults: z.object({
      ratios: z.array(z.string()).optional(),
      formats: z.array(z.string()).optional(),
      processingLevels: z.array(z.enum(['raw_only','raw_basic','full_retouch'])).optional(),
      verticalsAllowed: z.array(z.string()).optional(),
      complianceTags: z.array(z.string()).optional(),
    }).partial().optional(),
    priceRangeKey: z.string().optional(),
  })),
  verticals: z.array(z.object({ id: z.string(), nameAr: z.string(), nameEn: z.string().optional(), modifierPct: z.number().optional() })),
});

const RateCardSchema = z.object({
  versionId: z.string(),
  status: z.enum(['active','archived','draft']).default('active'),
  effectiveFrom: z.string().optional(),
  basePricesIQD: z.record(z.number()).optional(),
  baseRangesIQD: z.record(z.tuple([z.number(), z.number()])).optional(),
  processingLevels: z.object({
    raw_only: z.number().optional(),
    raw_basic: z.number().optional(),
    full_retouch: z.union([z.tuple([z.number(), z.number()]), z.number()]).optional(),
  }).partial().optional(),
  modifiers: z.object({
    rushPct: z.number().optional(),
    creatorTierPct: z.object({ T1: z.number().optional(), T2: z.number().optional(), T3: z.number().optional() }).partial().optional(),
    rawPct: z.number().optional(),
    retouchMinPct: z.number().optional(),
    retouchMaxPct: z.number().optional(),
  }).partial().optional(),
  verticalModifiers: z.record(z.number()).optional(),
  locationZonesIQD: z.record(z.number()).optional(),
  overrideCapPercent: z.number().optional(),
  guardrails: z.object({ minMarginDefault: z.number().optional(), minMarginHardStop: z.number().optional() }).partial().optional(),
  roundingIQD: z.number().optional(),
  fxPolicy: z.object({ mode: z.enum(['manual','source']).optional(), lastRate: z.number().nullable().optional(), lastDate: z.string().nullable().optional(), source: z.string().nullable().optional() }).partial().optional(),
});

export type SeedMode = 'full' | 'rate-card' | 'taxonomy';

async function readJsonFile<T = unknown>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

async function upsertCollection(collection: string, id: string, data: Record<string, unknown>) {
  const ref = adminDb.collection(collection).doc(id);
  const snap = await ref.get();
  if (snap.exists) {
    await ref.set({ ...data, updatedAt: new Date() }, { merge: true });
  } else {
    await ref.set({ ...data, createdAt: new Date(), updatedAt: new Date() }, { merge: true });
  }
}

export async function seedCatalog(mode: SeedMode = 'full') {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  const summary: Record<string, unknown> = { requestId };

  if (mode === 'full' || mode === 'taxonomy') {
    const taxonomyPath = path.join(DocsDir, 'taxonomy.json');
    const rawTax = await readJsonFile(taxonomyPath).catch((e) => { throw new Error(`Failed to read taxonomy.json: ${String(e)}`); });
    const tax = TaxonomySchema.parse(rawTax);
    // categories
    for (const c of tax.categories) {
      await upsertCollection('catalog_categories', c.id, { ...c });
    }
    // subcategories
    for (const s of tax.subcategories) {
      await upsertCollection('catalog_subcategories', s.id, { ...s });
    }
    // verticals
    for (const v of tax.verticals) {
      await upsertCollection('catalog_verticals', v.id, { ...v });
    }
    summary.taxonomy = {
      categories: tax.categories.length,
      subcategories: tax.subcategories.length,
      verticals: tax.verticals.length,
    };
  }

  if (mode === 'full' || mode === 'rate-card') {
    const rateCardPath = path.join(DocsDir, 'rate-card.json');
    const rawRc = await readJsonFile(rateCardPath).catch((e) => { throw new Error(`Failed to read rate-card.json: ${String(e)}`); });
    const rc = RateCardSchema.parse(rawRc);

    // archive existing active if versionId differs
    const existingActive = await adminDb
      .collection('pricing_rate_card')
      .where('status', '==', 'active')
      .limit(1)
      .get();

    let replaced = false;
    if (!existingActive.empty) {
      const doc = existingActive.docs[0];
      const data = doc.data() as { versionId?: string };
      if (data.versionId !== rc.versionId) {
        await doc.ref.update({ status: 'archived', updatedAt: new Date() });
        replaced = true;
      }
    }

    // upsert new/active
    const id = rc.versionId;
    await upsertCollection('pricing_rate_card', id, { ...rc, status: 'active' });
    summary.rateCard = { versionId: rc.versionId, replacedActive: replaced };
  }

  return { success: true as const, ...summary };
}


