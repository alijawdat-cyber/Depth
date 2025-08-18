// API موحد لنظام الـ Onboarding - نسخة مؤقتة للاختبار
import { NextRequest, NextResponse } from 'next/server';
import type { 
  SubmitOnboardingRequest,
  OnboardingApiResponse 
} from '@/types/onboarding';

// POST /api/creators/onboarding
// إرسال نموذج الـ Onboarding الكامل - نسخة اختبار
export async function POST(req: NextRequest) {
  const requestId = `test-${Date.now()}`;
  
  console.log('[ONBOARDING-TEST] Starting POST request', { requestId });
  
  try {
    console.log('[ONBOARDING-TEST] Parsing request body...');
    const body: SubmitOnboardingRequest = await req.json();
    const { formData, skipOptionalSteps } = body;
    
    console.log('[ONBOARDING-TEST] Request data received', {
      requestId,
      hasFormData: !!formData,
      currentStep: formData?.currentStep,
      fullName: formData?.account?.fullName,
      email: formData?.account?.email,
      skipOptionalSteps
    });

    // التحقق من البيانات الأساسية
    console.log('[ONBOARDING-TEST] Validating basic data...');
    if (!formData.account.fullName?.trim()) {
      console.log('[ONBOARDING-TEST] Validation failed: fullName missing');
      return NextResponse.json({
        success: false,
        error: 'الاسم الكامل مطلوب',
        requestId
      } as OnboardingApiResponse, { status: 400 });
    }

    if (!formData.account.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.account.email)) {
      console.log('[ONBOARDING-TEST] Validation failed: email invalid');
      return NextResponse.json({
        success: false,
        error: 'البريد الإلكتروني غير صحيح',
        requestId
      } as OnboardingApiResponse, { status: 400 });
    }

    // محاكاة العملية بنجاح
    console.log('[ONBOARDING-TEST] Simulating success...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // محاكاة وقت المعالجة

    console.log('[ONBOARDING-TEST] Success response');
    return NextResponse.json({
      success: true,
      message: 'تم إرسال طلبك بنجاح! (اختبار) سيتم مراجعته خلال 24-48 ساعة.',
      data: {
        creatorId: `test-creator-${Date.now()}`,
        nextStep: 5,
        completionPercentage: 100
      },
      requestId
    } as OnboardingApiResponse, { status: 201 });

  } catch (error) {
    console.error('[ONBOARDING-TEST] Critical error:', {
      requestId,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({
      success: false,
      error: 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى.',
      requestId
    } as OnboardingApiResponse, { status: 500 });
  }
}

// GET - نسخة مبسطة للاختبار
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'لم يتم العثور على بيانات سابقة (اختبار)',
    data: {
      hasExistingData: false,
      formData: null,
      completionPercentage: 0
    }
  } as OnboardingApiResponse);
}
