import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

// API للتسجيل الأولي البسيط للمبدعين
export async function POST(req: NextRequest) {
  try {
    // التحقق من المصادقة باستخدام session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const userId = session.user.email.toLowerCase();

    const basicData = await req.json();

    // هيكل البيانات البسيطة
    const basicIntakeData = {
      userId,
      email: session.user.email,
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

    // تحديث ملف المستخدم الأساسي (فقط إذا لم يكتمل المعقد)
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    // تحقق من أن المستخدم لم يكمل النموذج المعقد
    if (!userData?.onboardingStatus || userData.onboardingStatus !== 'complete_submitted') {
      await adminDb.collection('users').doc(userId).update({
        role: basicData.role,
        onboardingStatus: 'basic_completed',
        primaryCategories: basicData.primaryCategories,
        updatedAt: FieldValue.serverTimestamp()
      });
    } else {
      // إذا كان المعقد مكتمل، لا نعيد كتابة role
      console.log('[intake-basic] Skipping users update - complete form already submitted');
    }

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
    // التحقق من المصادقة باستخدام session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const userId = session.user.email.toLowerCase();

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
