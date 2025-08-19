import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import type { EquipmentCatalogItem, EquipmentPresetKit } from '@/types/creators';

// Public equipment catalog (read-only). Mirrors admin GET logic without auth.
const GetEquipmentQuerySchema = z.object({
  category: z.enum(['camera', 'lens', 'lighting', 'audio', 'accessory', 'special_setup']).optional(),
  brand: z.string().optional(),
  q: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
  includePresets: z.enum(['true', 'false']).default('false'),
  targetRole: z.enum(['photographer', 'videographer', 'designer', 'producer']).optional(),
});

export async function GET(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const { category, brand, q, limit, cursor, includePresets, targetRole } = GetEquipmentQuerySchema.parse(queryParams);

    let query = adminDb.collection('equipment_catalog').orderBy('brand').orderBy('model');
    if (category) query = query.where('category', '==', category);
    if (brand) query = query.where('brand', '==', brand);
    if (cursor) {
      const cursorDoc = await adminDb.collection('equipment_catalog').doc(cursor).get();
      if (cursorDoc.exists) query = query.startAfter(cursorDoc);
    }
    query = query.limit(limit);

    const snapshot = await query.get();
    let items: EquipmentCatalogItem[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EquipmentCatalogItem));

    if (q && q.trim()) {
      const searchTerm = q.toLowerCase().trim();
      items = items.filter(item =>
        item.brand.toLowerCase().includes(searchTerm) ||
        item.model.toLowerCase().includes(searchTerm) ||
        item.capabilities.some(cap => cap.toLowerCase().includes(searchTerm))
      );
    }

    const brands = [...new Set(items.map(i => i.brand))].sort();
    const categories = [...new Set(items.map(i => i.category))];
    const capabilities = [...new Set(items.flatMap(i => i.capabilities))].sort();

    let presets: EquipmentPresetKit[] = [];
    if (includePresets === 'true') {
      let presetsSnapshot;
      if (targetRole) {
        presetsSnapshot = await adminDb.collection('equipment_presets').where('targetRole', '==', targetRole).get();
      } else {
        presetsSnapshot = await adminDb.collection('equipment_presets').get();
      }
      presets = presetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EquipmentPresetKit));
    }

    const nextCursor = snapshot.docs.length === limit ? snapshot.docs[snapshot.docs.length - 1].id : null;

    return NextResponse.json({
      success: true,
      requestId,
      items,
      metadata: {
        total: items.length,
        brands,
        categories,
        capabilities,
        nextCursor,
        hasMore: !!nextCursor
      },
      presets: includePresets === 'true' ? presets : undefined
    });
  } catch (error) {
    console.error('[public.catalog.equipment] error', { requestId, error });
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, code: 'SERVER_ERROR', message, requestId }, { status: 500 });
  }
}
