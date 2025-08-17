import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// API للتسجيل الأولي البسيط للمبدعين
export async function POST(req: NextRequest) {
  try {
    // التحقق من المصادقة
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const basicData = await req.json();

    // هيكل البيانات البسيطة
    const basicIntakeData = {
      userId,
      email: decodedToken.email,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      status: 'basic_completed', // مؤشر على اكتمال التسجيل البسيط
      
      // البيانات الأساسية
      role: basicData.role,
      primaryCategories: basicData.primaryCategories || [],
      city: basicData.city,
      canTravel: basicData.canTravel || false,
      
      // الخبرة الأساسية
      experienceLevel: basicData.experienceLevel,
      experienceYears: basicData.experienceYears,
      
      // المعرض البسيط
      portfolioUrl: basicData.portfolioUrl || null,
      workSamples: basicData.workSamples || [],
      
      // التوفر الأساسي
      availability: basicData.availability,
      
      // معلومات التواصل الإضافية
      contact: {
        whatsapp: basicData.whatsapp || null,
        instagram: basicData.instagram || null
      },
      
      // إعدادات المرحلة التالية
      nextStep: 'professional_intake', // يحدد المرحلة التالية
      completedSteps: ['basic'] // تتبع المراحل المكتملة
    };

    // حفظ البيانات الأساسية
    await adminDb.collection('creators_basic').doc(userId).set(basicIntakeData);

    // تحديث ملف المستخدم الأساسي
    await adminDb.collection('users').doc(userId).update({
      role: basicData.role,
      onboardingStatus: 'basic_completed',
      primaryCategories: basicData.primaryCategories,
      updatedAt: FieldValue.serverTimestamp()
    });

    // إنشاء سجل في audit log
    await adminDb.collection('audit_log').add({
      userId,
      action: 'basic_intake_completed',
      timestamp: FieldValue.serverTimestamp(),
      details: {
        role: basicData.role,
        categories: basicData.primaryCategories,
        experienceLevel: basicData.experienceLevel
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'تم حفظ البيانات الأساسية بنجاح',
      nextStep: '/creators/intake-complete?step=professional'
    });

  } catch (error) {
    console.error('Basic intake API error:', error);
    return NextResponse.json(
      { error: 'خطأ في حفظ البيانات' },
      { status: 500 }
    );
  }
}

// API للحصول على البيانات الأساسية المحفوظة
export async function GET(req: NextRequest) {
  try {
    // التحقق من المصادقة
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // جلب البيانات الأساسية
    const basicDoc = await adminDb.collection('creators_basic').doc(userId).get();
    
    if (!basicDoc.exists) {
      return NextResponse.json({ 
        exists: false,
        message: 'لم يتم العثور على بيانات أساسية'
      });
    }

    const data = basicDoc.data();
    
    return NextResponse.json({
      exists: true,
      data: {
        ...data,
        createdAt: data?.createdAt?.toDate?.()?.toISOString() || null,
        updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || null
      }
    });

  } catch (error) {
    console.error('Get basic intake API error:', error);
    return NextResponse.json(
      { error: 'خطأ في جلب البيانات' },
      { status: 500 }
    );
  }
}
