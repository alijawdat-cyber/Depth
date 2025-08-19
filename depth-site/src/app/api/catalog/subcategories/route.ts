import { NextRequest, NextResponse } from 'next/server';
import { getSubcategories } from '@/lib/catalog/read';

// Public (creator-facing) subcategories endpoint - read only
// Expected by SubcategorySelector: { success, items: [...] }
export async function GET(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const includeDefaults = searchParams.get('includeDefaults') === 'true';

    const items = await getSubcategories(categoryId || undefined);

    const enriched = includeDefaults ? items.map(item => ({
      ...item,
      categoryName: getCategoryName(item.categoryId)
    })) : items;

    return NextResponse.json({
      success: true,
      requestId,
      items: enriched,
      total: enriched.length,
      categoryFilter: categoryId || null
    });
  } catch (error) {
    console.error('[public.catalog.subcategories] error', { requestId, error });
    return NextResponse.json({ success: false, code: 'SERVER_ERROR', message: 'Failed to fetch subcategories', requestId }, { status: 500 });
  }
}

function getCategoryName(categoryId: string): string {
  const names: Record<string, string> = {
    photo: 'صورة',
    video: 'فيديو',
    design: 'تصميم',
    audio: 'صوت',
    interactive: 'تفاعلي',
    ai_automation: 'ذكاء اصطناعي'
  };
  return names[categoryId] || categoryId;
}
