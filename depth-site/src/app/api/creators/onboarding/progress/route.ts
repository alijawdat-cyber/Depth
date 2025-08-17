// API لحفظ وجلب تقدم الـ Onboarding
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
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

    // حفظ في collection مؤقت للتقدم
    const progressData = {
      userId: email,
      currentStep: step,
      formData: data,
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
        formData: progressData?.formData,
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
