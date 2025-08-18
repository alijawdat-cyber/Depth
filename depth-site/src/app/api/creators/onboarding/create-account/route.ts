// API لإنشاء حساب مبدع جديد من خلال نظام الـ Onboarding
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import bcrypt from 'bcryptjs';
import type { AccountCreationData } from '@/types/onboarding';

export async function POST(req: NextRequest) {
  try {
    const accountData: AccountCreationData = await req.json();
    const { fullName, password, phone, agreeToTerms } = accountData;
    const email = String(accountData.email || '').toLowerCase();

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

    // التحقق من وجود المستخدم مسبقاً في Firebase Auth
    try {
      const existingUser = await adminAuth.getUserByEmail(email);
      if (existingUser) {
        return NextResponse.json(
          { error: 'البريد الإلكتروني مستخدم مسبقاً' },
          { status: 409 }
        );
      }
    } catch (error: unknown) {
      // إذا لم يجد المستخدم، هذا جيد (نريد إنشاء حساب جديد)
      const authError = error as { code?: string };
      if (authError.code !== 'auth/user-not-found') {
        console.error('Error checking existing user:', error);
        throw error;
      }
    }

    // التحقق من وجود المستخدم في Firestore أيضاً
    try {
      const existingCreator = await adminDb.collection('creators').where('email', '==', email).limit(1).get();
      if (!existingCreator.empty) {
        return NextResponse.json(
          { error: 'البريد الإلكتروني مستخدم مسبقاً' },
          { status: 409 }
        );
      }
      const existingUserDoc = await adminDb.collection('users').where('email', '==', email).limit(1).get();
      if (!existingUserDoc.empty) {
        return NextResponse.json(
          { error: 'البريد الإلكتروني مستخدم مسبقاً' },
          { status: 409 }
        );
      }
    } catch (error) {
      console.error('Error checking existing creator in Firestore:', error);
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
      contact: { email },
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

    // حفظ في مجموعة creators المتخصصة
    const creatorDocRef = await adminDb.collection('creators').add(creatorData);

    // حفظ في مجموعة users الموحدة
    const userDocRef = await adminDb.collection('users').add({
      name: fullName,
      email,
      role: 'creator',
      status: 'onboarding_started',
      profileId: creatorDocRef.id, // ربط مع الملف الشخصي
      source: 'creator-onboarding',
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: false,
      twoFactorEnabled: false,
      phone,
      uid: userRecord.uid
    });

    console.log('Account and creator profile created successfully for:', email);
    
    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح! يمكنك الآن الانتقال للمرحلة التالية',
      data: {
        uid: userRecord.uid,
        creatorId: creatorDocRef.id,
        userId: userDocRef.id,
        email,
        fullName,
        status: 'onboarding_started',
        nextStep: 2
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
