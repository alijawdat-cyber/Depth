// API لإنشاء حساب مبدع جديد من خلال نظام الـ Onboarding
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import bcrypt from 'bcryptjs';
import type { AccountCreationData } from '@/types/onboarding';

export async function POST(req: NextRequest) {
  try {
    const accountData: AccountCreationData = await req.json();
    const { fullName, email, password, phone, agreeToTerms } = accountData;

    // التحقق من البيانات الأساسية
    if (!fullName?.trim() || !email?.trim() || !password || !phone?.trim() || !agreeToTerms) {
      return NextResponse.json(
        { error: 'جميع البيانات مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني غير صحيح' },
        { status: 400 }
      );
    }

    // التحقق من قوة كلمة المرور
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم مسبقاً
    try {
      const existingUser = await adminAuth.getUserByEmail(email);
      if (existingUser) {
        return NextResponse.json(
          { error: 'البريد الإلكتروني مستخدم مسبقاً' },
          { status: 409 }
        );
      }
    } catch (error: any) {
      // إذا لم يجد المستخدم، هذا جيد (نريد إنشاء حساب جديد)
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 12);

    // إنشاء المستخدم في Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: fullName,
      disabled: false
    });

    // إنشاء وثيقة المستخدم في Firestore
    const userData = {
      uid: userRecord.uid,
      email,
      fullName,
      phone,
      role: 'creator',
      status: 'onboarding_started',
      password: hashedPassword, // للتوافق مع credentials provider
      hashedPassword, // نسخة احتياطية
      onboardingStartedAt: new Date().toISOString(),
      agreeToTerms,
      agreeToTermsAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'onboarding_system',
      isActive: true
    };

    await adminDb.collection('users').doc(userRecord.uid).set(userData);

    // إنشاء وثيقة المبدع الأولية
    const creatorData = {
      uid: userRecord.uid,
      email,
      fullName,
      phone,
      role: 'photographer', // سيتم تحديثه في الخطوة التالية
      status: 'onboarding_started',
      password: hashedPassword, // للتوافق مع credentials provider
      hashedPassword, // نسخة احتياطية
      city: '',
      canTravel: false,
      onboardingProgress: {
        currentStep: 1,
        completedSteps: [],
        startedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await adminDb.collection('creators').doc(userRecord.uid).set(creatorData);

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      data: {
        uid: userRecord.uid,
        email,
        fullName
      }
    });

  } catch (error) {
    console.error('Account creation error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء الحساب' },
      { status: 500 }
    );
  }
}
