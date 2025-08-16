import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// POST /api/creators/intake
// إرسال نموذج التفاصيل المهنية للمبدع
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - يتطلب تسجيل الدخول' 
      }, { status: 401 });
    }

    if (session.user.role !== 'creator') {
      return NextResponse.json({ 
        success: false, 
        error: 'غير مسموح - مخصص للمبدعين فقط' 
      }, { status: 403 });
    }

    const body = await req.json();
    const {
      bio,
      experience,
      equipment,
      skills,
      portfolio,
      hourlyRate,
      dayRate,
      travelRate,
      availability,
      workingHours,
      languages,
      specializations
    } = body;

    // Validation
    if (!bio?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'النبذة الشخصية مطلوبة' 
      }, { status: 400 });
    }

    if (!experience) {
      return NextResponse.json({ 
        success: false, 
        error: 'سنوات الخبرة مطلوبة' 
      }, { status: 400 });
    }

    const email = session.user.email.toLowerCase();

    // البحث عن المبدع
    const creatorQuery = await adminDb
      .collection('creators')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (creatorQuery.empty) {
      return NextResponse.json({ 
        success: false, 
        error: 'لم يتم العثور على بيانات المبدع' 
      }, { status: 404 });
    }

    const creatorDoc = creatorQuery.docs[0];
    const now = new Date().toISOString();

    // تحديث بيانات المبدع مع معلومات الـ intake
    const intakeData = {
      // المعلومات الأساسية
      bio: bio.trim(),
      experience,
      portfolio: portfolio?.trim() || '',
      
      // المهارات والمعدات
      equipment: equipment || [],
      skills: skills || [],
      
      // التسعير
      pricing: {
        hourlyRate: hourlyRate || 0,
        dayRate: dayRate || 0,
        travelRate: travelRate || 0
      },
      
      // التوفر
      availability: availability || '',
      workingHours: workingHours || '',
      
      // معلومات إضافية
      languages: languages || ['العربية'],
      specializations: specializations || [],
      
      // حالة النموذج
      intakeFormCompleted: true,
      intakeSubmittedAt: now,
      status: 'intake_submitted',
      updatedAt: now
    };

    // تحديث المبدع في قاعدة البيانات
    await creatorDoc.ref.update(intakeData);

    // تسجيل العملية في audit log
    await adminDb.collection('audit_log').add({
      action: 'creator_intake_submitted',
      entityType: 'creator',
      entityId: creatorDoc.id,
      userId: session.user.email,
      timestamp: now,
      details: {
        experience,
        skillsCount: skills?.length || 0,
        equipmentCount: equipment?.length || 0,
        hasPortfolio: !!portfolio
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم إرسال نموذج التفاصيل المهنية بنجاح',
      creatorId: creatorDoc.id
    });

  } catch (error) {
    console.error('[creator.intake] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم'
    }, { status: 500 });
  }
}
