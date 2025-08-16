import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSubcategories } from '@/lib/catalog/read';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

// Schema للتحقق من صحة بيانات الفئة الفرعية
const SubcategoryCreateSchema = z.object({
  id: z.string().min(1, 'معرف الفئة الفرعية مطلوب'),
  categoryId: z.enum(['photo', 'video', 'design']),
  nameAr: z.string().min(1, 'الاسم العربي مطلوب'),
  nameEn: z.string().optional(),
  desc: z.string().optional(),
  priceRangeKey: z.string().optional()
});

export async function GET(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const includeDefaults = searchParams.get('includeDefaults') === 'true';
    
    const items = await getSubcategories(categoryId);
    
    // إضافة معلومات إضافية إذا طُلبت
    const enrichedItems = includeDefaults ? items.map(item => ({
      ...item,
      // يمكن إضافة تفاصيل أكثر هنا لاحقاً من taxonomy.json
      categoryName: getCategoryName(item.categoryId)
    })) : items;
    
    return NextResponse.json({ 
      success: true, 
      requestId, 
      items: enrichedItems,
      total: enrichedItems.length,
      categoryFilter: categoryId || null
    });
  } catch (error) {
    console.error('[catalog.subcategories] error', { requestId, error });
    return NextResponse.json({ success: false, code: 'SERVER_ERROR', message: 'Failed to fetch subcategories', requestId }, { status: 500 });
  }
}

// إنشاء فئة فرعية جديدة
export async function POST(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    // التحقق من الصلاحيات
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        code: 'UNAUTHORIZED', 
        message: 'Admin access required', 
        requestId 
      }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = SubcategoryCreateSchema.parse(body);

    // التحقق من عدم وجود معرف مكرر
    const existingDoc = await adminDb.collection('catalog_subcategories').doc(validatedData.id).get();
    if (existingDoc.exists) {
      return NextResponse.json({ 
        success: false, 
        code: 'DUPLICATE_ID', 
        message: 'معرف الفئة الفرعية موجود مسبقاً', 
        requestId 
      }, { status: 400 });
    }

    // إنشاء الفئة الفرعية
    const subcategoryData = {
      ...validatedData,
      createdAt: new Date().toISOString(),
      createdBy: session.user.email,
      updatedAt: new Date().toISOString()
    };

    await adminDb.collection('catalog_subcategories').doc(validatedData.id).set(subcategoryData);

    return NextResponse.json({ 
      success: true, 
      requestId, 
      subcategory: { ...subcategoryData },
      message: 'تم إنشاء الفئة الفرعية بنجاح'
    });

  } catch (error) {
    console.error('[catalog.subcategories.create] error', { requestId, error });
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        code: 'VALIDATION_ERROR', 
        message: 'بيانات غير صحيحة',
        errors: error.issues.map((issue) => issue.message),
        requestId 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: false, 
      code: 'SERVER_ERROR', 
      message: 'Failed to create subcategory', 
      requestId 
    }, { status: 500 });
  }
}

// دالة مساعدة للحصول على اسم الفئة
function getCategoryName(categoryId: string): string {
  const categoryNames: Record<string, string> = {
    photo: 'صورة',
    video: 'فيديو', 
    design: 'تصميم'
  };
  return categoryNames[categoryId] || categoryId;
}


