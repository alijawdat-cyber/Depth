// API لحفظ وجلب تقدم الـ Onboarding
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { 
  deriveWeeklyHours 
} from '@/lib/validation/onboarding.server';
import type { 
  SaveProgressRequest,
  OnboardingApiResponse,
  OnboardingProgress 
} from '@/types/onboarding';

// PUT /api/creators/onboarding/progress
// حفظ تقدم الـ Onboarding (Auto-save)
export async function PUT(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'غير مسموح - يتطلب تسجيل الدخول',
        requestId
      } as OnboardingApiResponse, { status: 401 });
    }

    const body: SaveProgressRequest = await req.json();
    const { step, data, autoSave } = body;
    const email = session.user.email.toLowerCase();
    const now = new Date().toISOString();

    // Phase 6: Soft validation للـ progress مع اشتقاق ساعات - permanently enabled
    let processedData = data;
    if (data.availability?.weeklyAvailability) {
      try {
        // فحص 30 دقيقة + اشتقاق ساعات
        const availability = data.availability.weeklyAvailability;
        for (const day of availability) {
          if (day.available && day.startTime && day.endTime) {
            // فحص خطوة 30 دقيقة
            const startMin = parseInt(day.startTime.split(':')[1]);
            const endMin = parseInt(day.endTime.split(':')[1]);
            if (startMin % 30 !== 0 || endMin % 30 !== 0) {
              console.warn('[PROGRESS] Non-30m step detected:', day);
              // تطبيع للدقيقة الأقرب
              const normalizeTime = (time: string) => {
                const [hours, minutes] = time.split(':');
                const normalizedMin = Math.round(parseInt(minutes) / 30) * 30;
                return `${hours.padStart(2, '0')}:${normalizedMin.toString().padStart(2, '0')}`;
              };
              day.startTime = normalizeTime(day.startTime);
              day.endTime = normalizeTime(day.endTime);
            }
          }
        }

        // اشتقاق weeklyHours
        const derivedHours = deriveWeeklyHours(availability);
        processedData = {
          ...data,
          availability: {
            ...data.availability,
            weeklyHours: derivedHours
            // تجاهل preferredWorkdays - لا نخزنها
          }
        };

        console.log('[PROGRESS] V2 soft validation applied, derived hours:', derivedHours);
      } catch (error) {
        console.warn('[PROGRESS] Soft validation warning:', error);
        // لا نرجع 400 - فقط تحذير
      }
    }

    // حفظ في collection مؤقت للتقدم
    const progressData = {
      userId: email,
      currentStep: step,
      formData: processedData, // استخدام البيانات المُعالجة
      autoSave: autoSave || false,
      updatedAt: now,
      sessionId: session.user.id || email
    };

    await adminDb
      .collection('onboarding_progress')
      .doc(email)
      .set(progressData, { merge: true });

    return NextResponse.json({
      success: true,
      message: autoSave ? 'تم الحفظ التلقائي' : 'تم حفظ التقدم',
      data: {
        step,
        lastSavedAt: now
      },
      requestId
    } as OnboardingApiResponse);

  } catch (error) {
    console.error('[onboarding.progress.put] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'فشل في حفظ التقدم',
      requestId
    } as OnboardingApiResponse, { status: 500 });
  }
}

// GET /api/creators/onboarding/progress
// جلب تقدم الـ Onboarding المحفوظ
export async function GET() {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'غير مسموح - يتطلب تسجيل الدخول',
        requestId
      } as OnboardingApiResponse, { status: 401 });
    }

    const email = session.user.email.toLowerCase();

    // البحث عن التقدم المحفوظ
    const progressDoc = await adminDb
      .collection('onboarding_progress')
      .doc(email)
      .get();

    if (!progressDoc.exists) {
      return NextResponse.json({
        success: true,
        message: 'لا يوجد تقدم محفوظ',
        data: undefined,
        requestId
      } as OnboardingApiResponse);
    }

    const progressData = progressDoc.data();

    // حساب معلومات التقدم
    const completedSteps = progressData?.formData?.completedSteps || [];
    const currentStep = progressData?.currentStep || 1;
    const totalSteps = 5;
    
    // Phase 6: تطبيع البيانات المُسترجعة - permanently enabled
    let returnedFormData = progressData?.formData;
    if (returnedFormData?.availability) {
      // لا نُرجع preferredWorkdays عند تفعيل V2
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { preferredWorkdays: _removed, ...cleanAvailability } = returnedFormData.availability;
      returnedFormData = {
        ...returnedFormData,
        availability: cleanAvailability
      };
      
      // تأكيد أن weeklyHours مشتق
      if (returnedFormData.availability.weeklyAvailability) {
        const derivedHours = deriveWeeklyHours(returnedFormData.availability.weeklyAvailability);
        returnedFormData.availability.weeklyHours = derivedHours;
      }
    }
    
    const progress: OnboardingProgress = {
      currentStep,
      completedSteps,
      completionPercentage: (completedSteps.length / totalSteps) * 100,
      estimatedTimeRemaining: Math.max(0, (totalSteps - completedSteps.length) * 5), // 5 دقائق لكل خطوة
      canSkipToEnd: completedSteps.length >= 3, // يمكن تخطي الخطوات الاختيارية
      lastSavedAt: progressData?.updatedAt
    };

    return NextResponse.json({
      success: true,
      message: 'تم جلب التقدم المحفوظ',
      data: {
        formData: returnedFormData,
        progress,
        autoSaved: progressData?.autoSave || false
      },
      requestId
    } as OnboardingApiResponse);

  } catch (error) {
    console.error('[onboarding.progress.get] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'فشل في جلب التقدم المحفوظ',
      requestId
    } as OnboardingApiResponse, { status: 500 });
  }
}

// DELETE /api/creators/onboarding/progress
// حذف التقدم المحفوظ (إعادة تعيين)
export async function DELETE() {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'غير مسموح - يتطلب تسجيل الدخول',
        requestId
      } as OnboardingApiResponse, { status: 401 });
    }

    const email = session.user.email.toLowerCase();

    // حذف التقدم المحفوظ
    await adminDb
      .collection('onboarding_progress')
      .doc(email)
      .delete();

    // تسجيل في audit log
    await adminDb.collection('audit_log').add({
      action: 'onboarding_progress_reset',
      entityType: 'onboarding_progress',
      entityId: email,
      userId: email,
      timestamp: new Date().toISOString(),
      requestId,
      details: {
        reason: 'user_requested_reset'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف التقدم المحفوظ وإعادة التعيين',
      requestId
    } as OnboardingApiResponse);

  } catch (error) {
    console.error('[onboarding.progress.delete] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'فشل في حذف التقدم المحفوظ',
      requestId
    } as OnboardingApiResponse, { status: 500 });
  }
}
