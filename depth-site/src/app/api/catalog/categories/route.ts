import { NextResponse } from 'next/server';
import { getSubcategories } from '@/lib/catalog/read';

// Public (creator-facing) categories endpoint derived from subcategories
// Shape expected by onboarding CategorySelector: { success, items: [{ id, nameAr, nameEn, subcategoryCount }], total }
export async function GET() {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const subcategories = await getSubcategories();

    const categoryNames: Record<string, { nameAr: string; nameEn: string }> = {
      photo: { nameAr: 'صورة', nameEn: 'Photo' },
      video: { nameAr: 'فيديو', nameEn: 'Video' },
      design: { nameAr: 'تصميم', nameEn: 'Design' },
      audio: { nameAr: 'صوت', nameEn: 'Audio' },
      interactive: { nameAr: 'تفاعلي', nameEn: 'Interactive' },
      ai_automation: { nameAr: 'ذكاء اصطناعي', nameEn: 'AI & Automation' }
    };

    const categoryStats: Record<string, { id: string; nameAr: string; nameEn: string; subcategoryCount: number }> = {};
    subcategories.forEach(sub => {
      if (!categoryStats[sub.categoryId]) {
        categoryStats[sub.categoryId] = {
          id: sub.categoryId,
          nameAr: categoryNames[sub.categoryId]?.nameAr || sub.categoryId,
          nameEn: categoryNames[sub.categoryId]?.nameEn || sub.categoryId,
          subcategoryCount: 0
        };
      }
      categoryStats[sub.categoryId].subcategoryCount++;
    });

    const items = Object.values(categoryStats);
    return NextResponse.json({
      success: true,
      requestId,
      items,
      total: items.length,
      metadata: {
        totalSubcategories: subcategories.length,
        lastUpdated: new Date().toISOString(),
        source: 'derived_from_subcategories'
      }
    });
  } catch (error) {
    console.error('[public.catalog.categories] error', { requestId, error });
    return NextResponse.json({ success: false, code: 'SERVER_ERROR', message: 'Failed to fetch categories', requestId }, { status: 500 });
  }
}
