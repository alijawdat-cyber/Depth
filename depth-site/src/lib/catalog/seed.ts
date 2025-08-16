import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
// Bundle seed data statically so it's available in serverless runtime
import taxonomyJson from '../../../docs/catalog/09-Seed/taxonomy.json';
import rateCardJson from '../../../docs/catalog/09-Seed/rate-card.json';

const TaxonomySchema = z.object({
  categories: z.array(z.object({ 
    id: z.string(), 
    nameAr: z.string(), 
    nameEn: z.string().optional(), 
    order: z.number().optional(),
    subcategories: z.array(z.any()).optional() // We'll process this separately
  })),
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
  })).optional(),
  verticals: z.array(z.object({ 
    id: z.string(), 
    nameAr: z.string(), 
    nameEn: z.string().optional(), 
    modifierPct: z.number().optional() 
  })),
  defaultsPerSubcategory: z.array(z.object({
    subcategory: z.string(),
    verticalsAllowed: z.array(z.string()).optional(),
    defaultProcessingLevels: z.array(z.string()).optional(),
    defaultRatios: z.array(z.string()).optional(),
    defaultFormats: z.array(z.string()).optional(),
    complianceTags: z.array(z.string()).optional(),
    priceRangeKey: z.string().optional(),
  })).optional(),
});

const RateCardSchema = z.object({
  versionId: z.string(),
  status: z.enum(['active','archived','draft']).default('active'),
  effectiveFrom: z.string().optional(),
  basePricesIQD: z.record(z.string(), z.number()).optional(),
  baseRangesIQD: z.record(z.string(), z.tuple([z.number(), z.number()])).optional(),
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
  verticalModifiers: z.record(z.string(), z.number()).optional(),
  locationZonesIQD: z.record(z.string(), z.number()).optional(),
  overrideCapPercent: z.number().optional(),
  guardrails: z.object({ minMarginDefault: z.number().optional(), minMarginHardStop: z.number().optional() }).partial().optional(),
  roundingIQD: z.number().optional(),
  fxPolicy: z.object({ mode: z.enum(['manual','source']).optional(), lastRate: z.number().nullable().optional(), lastDate: z.string().nullable().optional(), source: z.string().nullable().optional() }).partial().optional(),
});

export type SeedMode = 'full' | 'rate-card' | 'taxonomy';

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
    const rawTax = taxonomyJson as unknown;
    const tax = TaxonomySchema.parse(rawTax);
    
    // Process categories and extract subcategories from nested structure
    const allSubcategories: Array<{
      id: string;
      categoryId: string;
      nameAr: string;
      nameEn?: string;
      desc?: string;
      defaults: {
        ratios: string[];
        formats: string[];
        processingLevels: string[];
        verticalsAllowed: string[];
        complianceTags: string[];
      };
      priceRangeKey: string;
      [key: string]: unknown;
    }> = [];
    for (const c of tax.categories) {
      // Clean category object (remove nested subcategories)
      const { subcategories: nestedSubs, ...cleanCategory } = c;
      await upsertCollection('catalog_categories', c.id, { 
        ...cleanCategory, 
        order: cleanCategory.order || 0 
      });
      
      // Extract subcategories from nested structure
      if (nestedSubs && Array.isArray(nestedSubs)) {
        for (const sub of nestedSubs) {
          allSubcategories.push({
            ...sub,
            categoryId: c.id,
            defaults: {
              ratios: sub.ratios || [],
              formats: sub.formats || [],
              processingLevels: ['raw_only', 'raw_basic', 'full_retouch'],
              verticalsAllowed: sub.verticals || [],
              complianceTags: sub.verticals?.includes('beauty') ? ['clinics_policy'] : [],
            },
            priceRangeKey: sub.id,
          });
        }
      }
    }
    
    // Process extracted subcategories
    for (const s of allSubcategories) {
      await upsertCollection('catalog_subcategories', s.id, { ...s });
    }
    
    // Process standalone subcategories if they exist
    if (tax.subcategories && tax.subcategories.length > 0) {
      for (const s of tax.subcategories) {
        await upsertCollection('catalog_subcategories', s.id, { ...s });
      }
    }
    
    // Apply defaults from defaultsPerSubcategory
    if (tax.defaultsPerSubcategory && tax.defaultsPerSubcategory.length > 0) {
      for (const def of tax.defaultsPerSubcategory) {
        const existing = await adminDb.collection('catalog_subcategories').doc(def.subcategory).get();
        if (existing.exists) {
          await existing.ref.update({
            defaults: {
              ratios: def.defaultRatios || [],
              formats: def.defaultFormats || [],
              processingLevels: def.defaultProcessingLevels || ['raw_only', 'raw_basic', 'full_retouch'],
              verticalsAllowed: def.verticalsAllowed || [],
              complianceTags: def.complianceTags || [],
            },
            priceRangeKey: def.priceRangeKey || def.subcategory,
            updatedAt: new Date(),
          });
        }
      }
    }
    
    // verticals
    for (const v of tax.verticals) {
      await upsertCollection('catalog_verticals', v.id, { 
        ...v, 
        modifierPct: v.modifierPct || 0 
      });
    }
    
    summary.taxonomy = {
      categories: tax.categories.length,
      subcategories: allSubcategories.length + (tax.subcategories?.length || 0),
      verticals: tax.verticals.length,
    };
  }

  if (mode === 'full' || mode === 'rate-card') {
    const rawRc = rateCardJson as unknown;
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


