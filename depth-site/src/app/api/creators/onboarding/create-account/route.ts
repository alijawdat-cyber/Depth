// API لإنشاء حساب مبدع جديد - النظام الموحد
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import bcrypt from 'bcryptjs';
import type { AccountCreationData } from '@/types/onboarding';
import { checkRateLimit, extractClientIp } from '@/lib/rate-limit';
import type { UnifiedUser } from '@/types/unified-user';

// ضمان التنفيذ في بيئة Node (وليس Edge) لأن firebase-admin + bcryptjs لا يعملان على Edge
export const runtime = 'nodejs';

function log(label: string, data?: unknown) {
  console.log(`[create-account] ${label}`, data || '');
}

// تطبيع رقم الهاتف (إزالة الفراغات والرموز غير الرقمية عدا +) وتحويل 00 إلى +
function normalizePhone(raw: string): string {
  if (!raw) return '';
  let p = raw.trim().replace(/[^0-9+]/g, '');
  if (p.startsWith('00')) p = '+' + p.slice(2);
  // مثال: لو يبدأ بصفر محلي نحاول (اختياري)؛ نتركه كما هو الآن لتفادي أخطاء
  return p;
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  try {
    const accountData: AccountCreationData = await req.json();
    // Rate limit: 5 طلبات خلال 5 دقائق لكل IP + بريد
    const ip = extractClientIp(req.headers);
    const rateKey = `create_account:${ip}`;
    const rl = await checkRateLimit({ key: rateKey, limit: 5, windowMs: 5 * 60 * 1000 });
    if (!rl.allowed) {
      return NextResponse.json({ error: 'محاولات كثيرة، حاول لاحقاً' }, { status: 429 });
    }
  const { fullName, password, phone, agreeToTerms } = accountData;
    const email = String(accountData.email || '').toLowerCase().trim();
  const normalizedPhone = normalizePhone(phone || '');

  log('Incoming payload', { email, fullNameLength: fullName?.length, phoneMasked: normalizedPhone.slice(0,3)+'***', agreeToTerms });

    // Basic validation
  if (!fullName?.trim() || !email || !password || !normalizedPhone || !agreeToTerms) {
      return NextResponse.json({ error: 'جميع البيانات مطلوبة' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير صحيح' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }, { status: 400 });
    }

    // Check if user already exists in unified collection (faster than auth query for our needs)
    const existingUnifiedUser = await adminDb
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();
    if (!existingUnifiedUser.empty) {
      log('Email already exists in users collection');
      return NextResponse.json({ error: 'البريد الإلكتروني مستخدم مسبقاً' }, { status: 409 });
    }

    // Hash password first
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create Auth user (may throw)
    let userRecord;
    try {
      userRecord = await adminAuth.createUser({
        email,
        password,
        displayName: fullName,
        disabled: false
      });
      log('Auth user created', { uid: userRecord.uid });
    } catch (authError: unknown) {
      const errObj = authError as { code?: string; message?: string };
      log('Auth create error', { code: errObj?.code, message: errObj?.message });
      if (errObj?.code === 'auth/email-already-exists') {
        return NextResponse.json({ error: 'البريد الإلكتروني مستخدم مسبقاً' }, { status: 409 });
      }
      if (errObj?.code === 'auth/invalid-password') {
        return NextResponse.json({ error: 'كلمة المرور غير مقبولة' }, { status: 400 });
      }
      return NextResponse.json({ error: 'تعذر إنشاء حساب الدخول' }, { status: 500 });
    }

    // Build unified user data
    const nowIso = new Date().toISOString();
    const unifiedUserData: Omit<UnifiedUser, 'id'> = {
      email,
      name: fullName.trim(),
      role: 'creator',
      status: 'onboarding_started',
      emailVerified: false,
      twoFactorEnabled: false,
      phone: normalizedPhone,
      avatar: undefined,
      creatorProfile: {
        specialty: 'photographer',
        city: '',
        canTravel: false,
        experienceLevel: 'beginner',
        experienceYears: '0-1',
        skills: [],
        languages: ['ar'],
        primaryCategories: [],
        portfolio: { workSamples: [], socialMedia: {} },
        availability: {
          availability: 'flexible',
          weeklyHours: 20,
          preferredWorkdays: [],
          weeklyAvailability: [],
          timeZone: 'Asia/Baghdad',
          urgentWork: false
        },
        equipment: { cameras: [], lenses: [], lighting: [], audio: [], accessories: [], specialSetups: [] },
        onboardingStatus: 'in_progress',
        tier: 'starter',
        modifier: 1.0,
        bio: ''
      },
      createdAt: nowIso,
      updatedAt: nowIso,
      lastLoginAt: undefined,
      source: 'web',
      loginAttempts: 0,
      preferences: { language: 'ar', theme: 'light', notifications: true }
    };

    // Use auth uid as document id to simplify joins
    const userDocRef = adminDb.collection('users').doc(userRecord.uid);

    try {
      // Batch writes (atomic-ish)
      const batch = adminDb.batch();
      batch.set(userDocRef, unifiedUserData, { merge: false });
      batch.set(adminDb.collection('user_credentials').doc(userRecord.uid), {
        userId: userRecord.uid,
        email,
        hashedPassword,
        authUid: userRecord.uid,
        createdAt: nowIso,
        lastPasswordChange: nowIso
      });
      await batch.commit();
      log('Firestore user + credentials stored', { docId: userRecord.uid });
    } catch (firestoreError) {
      log('Firestore write failed, rolling back auth user', firestoreError);
      try { await adminAuth.deleteUser(userRecord.uid); } catch {}
      return NextResponse.json({ error: 'تعذر حفظ بيانات الحساب' }, { status: 500 });
    }

    const elapsed = Date.now() - startedAt;
    log('Account fully created', { email, uid: userRecord.uid, ms: elapsed });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح! يمكنك الآن الانتقال للمرحلة التالية',
      data: {
        userId: userRecord.uid,
        authUid: userRecord.uid,
        email,
        name: fullName.trim(),
        role: 'creator',
        status: 'onboarding_started',
        nextStep: 2
      }
    });
  } catch (error: unknown) {
    const errObj = error as { message?: string; stack?: string };
    log('Unhandled error', { message: errObj?.message, stack: errObj?.stack });
    return NextResponse.json({ error: 'حدث خطأ في إنشاء الحساب' }, { status: 500 });
  }
}
