import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

type EquipmentCategory = 'cameras' | 'lenses' | 'lighting' | 'audio' | 'accessories' | 'specialSetups';

const DEFAULT_SEED: Record<EquipmentCategory, Array<{ id: string; name: string; model?: string }>> = {
  cameras: [
    { id: 'sony-a7-iv', name: 'Sony A7 IV', model: 'ILCE-7M4' },
    { id: 'canon-5d-mark-iv', name: 'Canon 5D Mark IV' },
    { id: 'sony-a7s-iii', name: 'Sony A7S III', model: 'ILCE-7SM3' },
  ],
  lenses: [
    { id: 'sigma-24-70-2-8', name: 'Sigma 24-70mm f/2.8' },
    { id: 'sony-85-1-8', name: 'Sony FE 85mm f/1.8' },
    { id: 'canon-50-1-8', name: 'Canon 50mm f/1.8' },
  ],
  lighting: [
    { id: 'godox-sl60w', name: 'Godox SL60W' },
    { id: 'aputure-120d', name: 'Aputure 120D' },
    { id: 'neewer-led-panel', name: 'Neewer LED Panel 660' },
  ],
  audio: [
    { id: 'rode-wireless-go-ii', name: 'RØDE Wireless GO II' },
    { id: 'zoom-h5', name: 'Zoom H5' },
    { id: 'rode-videomic-pro', name: 'RØDE VideoMic Pro' },
  ],
  accessories: [
    { id: 'manfrotto-tripod', name: 'Manfrotto Tripod' },
    { id: 'dji-rs3', name: 'DJI RS3 Gimbal' },
    { id: 'reflector-5in1', name: '5-in-1 Reflector' },
  ],
  specialSetups: [
    { id: 'product-light-tent', name: 'Light Tent (Product)' },
    { id: 'green-screen', name: 'Green Screen' },
    { id: 'motorized-turntable', name: 'Motorized Turntable' },
  ],
};

async function ensureSeeded() {
  const col = adminDb.collection('catalog_equipment');
  const any = await col.limit(1).get();
  if (!any.empty) return;
  const batch = adminDb.batch();
  (Object.keys(DEFAULT_SEED) as EquipmentCategory[]).forEach((cat) => {
    DEFAULT_SEED[cat].forEach((item) => {
      const id = `${cat}:${item.id}`;
      const ref = col.doc(id);
      batch.set(ref, { category: cat, ...item, createdAt: new Date(), updatedAt: new Date() });
    });
  });
  await batch.commit();
}

export async function GET(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    await ensureSeeded();
    const url = new URL(req.url);
    const category = url.searchParams.get('category') as EquipmentCategory | null;
    const snap = category
      ? await adminDb.collection('catalog_equipment').where('category', '==', category).orderBy('name').get()
      : await adminDb.collection('catalog_equipment').orderBy('category').orderBy('name').get();

    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }));
    const grouped: Record<string, Array<Record<string, unknown>>> = {};
    for (const it of items) {
      const cat = String((it as { category?: string }).category || 'unknown');
      grouped[cat] = grouped[cat] || [];
      grouped[cat].push(it);
    }
    return NextResponse.json({ success: true, requestId, items: grouped });
  } catch (error) {
    console.error('[catalog.equipment] error', { requestId, error });
    return NextResponse.json({ success: false, code: 'SERVER_ERROR', message: 'Failed to fetch equipment', requestId }, { status: 500 });
  }
}


