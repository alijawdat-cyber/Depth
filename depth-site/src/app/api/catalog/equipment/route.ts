import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import { EquipmentCatalogItem, EquipmentPresetKit } from '@/types/creators';

// Schema للتحقق من الاستعلام
const GetEquipmentQuerySchema = z.object({
  category: z.enum(['camera', 'lens', 'lighting', 'audio', 'accessory', 'special_setup']).optional(),
  brand: z.string().optional(),
  q: z.string().optional(), // بحث عام
  limit: z.coerce.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
  includePresets: z.enum(['true', 'false']).default('false'),
  targetRole: z.enum(['photographer', 'videographer', 'designer', 'producer']).optional(),
});

// GET /api/catalog/equipment
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const { category, brand, q, limit, cursor, includePresets, targetRole } = GetEquipmentQuerySchema.parse(queryParams);

    // بناء الاستعلام
    let query = adminDb.collection('equipment_catalog').orderBy('brand').orderBy('model');

    // تطبيق الفلاتر
    if (category) {
      query = query.where('category', '==', category);
    }
    if (brand) {
      query = query.where('brand', '==', brand);
    }

    // التصفح (pagination)
    if (cursor) {
      const cursorDoc = await adminDb.collection('equipment_catalog').doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    query = query.limit(limit);

    const snapshot = await query.get();
    let items: EquipmentCatalogItem[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as EquipmentCatalogItem));

    // البحث النصي (إذا مطلوب)
    if (q && q.trim()) {
      const searchTerm = q.toLowerCase().trim();
      items = items.filter(item => 
        item.brand.toLowerCase().includes(searchTerm) ||
        item.model.toLowerCase().includes(searchTerm) ||
        item.capabilities.some(cap => cap.toLowerCase().includes(searchTerm))
      );
    }

    // تجميع البرندات والفئات للفلترة
    const brands = [...new Set(items.map(item => item.brand))].sort();
    const categories = [...new Set(items.map(item => item.category))];
    const capabilities = [...new Set(items.flatMap(item => item.capabilities))].sort();

    // جلب المجموعات الجاهزة (إذا مطلوبة)
    let presets: EquipmentPresetKit[] = [];
    if (includePresets === 'true') {
      let presetsQuery = adminDb.collection('equipment_presets');
      if (targetRole) {
        presetsQuery = presetsQuery.where('targetRole', '==', targetRole);
      }
      const presetsSnapshot = await presetsQuery.get();
      presets = presetsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EquipmentPresetKit));
    }

    // معلومات التصفح التالي
    const nextCursor = snapshot.docs.length === limit ? snapshot.docs[snapshot.docs.length - 1].id : null;

    return NextResponse.json({
      success: true,
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
    console.error('[GET /api/catalog/equipment] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// POST /api/catalog/equipment - للإدمن لسيّد المعدات
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as unknown as { role?: string })?.role;
    
    if (!session?.user || role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { mode = 'equipment', force = false } = body;

    // استدعاء دالة السيّد
    const seedModule = await import('@/lib/catalog/seed');
    const result = await seedModule.seedCatalog(mode);

    return NextResponse.json({
      success: true,
      message: `Equipment catalog seeded successfully`,
      result
    });

  } catch (error) {
    console.error('[POST /api/catalog/equipment] Error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}