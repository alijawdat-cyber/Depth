// API لإنشاء حساب مبدع جديد - النظام الموحد
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import bcrypt from 'bcryptjs';
import type { AccountCreationData } from '@/types/onboarding';
import type { UnifiedUser } from '@/types/unified-user';

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

    // التحقق من وجود المستخدم مسبقاً
    const existingUnifiedUser = await adminDb
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingUnifiedUser.empty) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم مسبقاً' },
        { status: 409 }
      );
    }

    // تشفير كلمة المرور للحفظ المنفصل
    const hashedPassword = await bcrypt.hash(password, 12);

    // إنشاء المستخدم في Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: fullName,
      disabled: false
    });

    // إنشاء المستخدم في النظام الموحد
    const unifiedUserData: Omit<UnifiedUser, 'id'> = {
      email,
      name: fullName,
      role: 'creator',
      status: 'onboarding_started',
      emailVerified: false,
      twoFactorEnabled: false,
      phone,
      avatar: undefined,
      
      // ملف المبدع الأولي
      creatorProfile: {
        specialty: 'photographer',
        city: '',
        canTravel: false,
        experienceLevel: 'beginner',
        experienceYears: '',
        skills: [],
        languages: ['ar'],
        primaryCategories: ['photo'],
        portfolio: {
          workSamples: [],
          socialMedia: {}
        },
        availability: {
          availability: 'flexible',
          weeklyHours: 40,
          preferredWorkdays: [],
          weeklyAvailability: [],
          timeZone: 'Asia/Riyadh',
          urgentWork: false
        },
        equipment: {
          cameras: [],
          lenses: [],
          lighting: [],
          audio: [],
          accessories: [],
          specialSetups: []
        },
        onboardingStatus: 'in_progress',
        tier: 'starter',
        modifier: 1.0,
        bio: ''
      },
      
      // التوقيتات والمتابعة
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: undefined,
      source: 'web',
      loginAttempts: 0,
      
      // الإعدادات البسيطة
      preferences: {
        language: 'ar',
        theme: 'light',
        notifications: true
      }
    };

    // حفظ في النظام الموحد
    const userDocRef = await adminDb.collection('users').add(unifiedUserData);

    // حفظ كلمة المرور المشفرة في مجموعة منفصلة للأمان
    await adminDb.collection('user_credentials').doc(userDocRef.id).set({
      userId: userDocRef.id,
      email,
      hashedPassword,
      authUid: userRecord.uid,
      createdAt: new Date().toISOString(),
      lastPasswordChange: new Date().toISOString()
    });

    console.log('✅ تم إنشاء حساب مبدع جديد في النظام الموحد:', email);
    
    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح! يمكنك الآن الانتقال للمرحلة التالية',
      data: {
        userId: userDocRef.id,
        authUid: userRecord.uid,
        email,
        name: fullName, // تم تصليحه من fullName
        role: 'creator',
        status: 'onboarding_started',
        nextStep: 2
      }
    });

  } catch (error) {
    console.error('❌ خطأ في إنشاء الحساب:', error);
    
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء الحساب' },
      { status: 500 }
    );
  }
}
