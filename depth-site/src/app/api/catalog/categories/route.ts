import { NextResponse } from 'next/server';
import { getSubcategories } from '@/lib/catalog/read';

// API للحصول على الفئات الرئيسية مع إحصائيات
export async function GET() {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    // الحصول على الفئات الفرعية لاستخراج الفئات الرئيسية
    const subcategories = await getSubcategories();
    
    // استخراج الفئات الرئيسية الفريدة
    const categoryStats: Record<string, { id: string; nameAr: string; nameEn: string; subcategoryCount: number }> = {};
    
    // أسماء الفئات الرئيسية
    const categoryNames: Record<string, { nameAr: string; nameEn: string }> = {
      photo: { nameAr: 'صورة', nameEn: 'Photo' },
      video: { nameAr: 'فيديو', nameEn: 'Video' },
      design: { nameAr: 'تصميم', nameEn: 'Design' }
    };
    
    // حساب عدد الفئات الفرعية لكل فئة رئيسية
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
    
    const categories = Object.values(categoryStats);
    
    return NextResponse.json({ 
      success: true, 
      requestId, 
      items: categories,
      total: categories.length,
      metadata: {
        totalSubcategories: subcategories.length,
        lastUpdated: new Date().toISOString(),
        source: 'derived_from_subcategories'
      }
    });
  } catch (error) {
    console.error('[catalog.categories] error', { requestId, error });
    return NextResponse.json({ 
      success: false, 
      code: 'SERVER_ERROR', 
      message: 'Failed to fetch categories', 
      requestId 
    }, { status: 500 });
  }
}
