import { adminDb } from '@/lib/firebase/admin';
import type { Subcategory, Vertical, RateCard } from '@/types/catalog';

export async function getSubcategories(categoryId?: string): Promise<Subcategory[]> {
  let query = adminDb.collection('catalog_subcategories') as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
  if (categoryId) query = query.where('categoryId', '==', categoryId);
  const snap = await query.get();
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, unknown>) })) as unknown as Subcategory[];
}

export async function getVerticals(): Promise<Vertical[]> {
  const snap = await adminDb.collection('catalog_verticals').get();
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Record<string, unknown>) })) as unknown as Vertical[];
}

export async function getActiveRateCard(): Promise<RateCard | null> {
  const snap = await adminDb
    .collection('pricing_rate_card')
    .where('status', '==', 'active')
    .limit(1)
    .get();
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { versionId: d.id, ...(d.data() as Record<string, unknown>) } as unknown as RateCard;
}


