import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import type { UnifiedUser, CreatorSpecialty } from '@/types/unified-user';

// النظام الموحد: الاعتماد على وثيقة المستخدم نفسها بدلاً من التخمين البيئي

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userSnap = await adminDb.collection('users').where('email', '==', session.user.email.toLowerCase()).limit(1).get();
    if (userSnap.empty) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    const userDoc = userSnap.docs[0];
    const userData = userDoc.data() as UnifiedUser;
    if (userData.role !== 'creator') {
      return NextResponse.json({ error: 'Access denied - creators only' }, { status: 403 });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _ignoredId, ...rest } = userData as UnifiedUser;
    const flat = {
      id: userDoc.id,
      ...rest,
      specialty: userData.creatorProfile?.specialty,
      portfolioUrl: userData.creatorProfile?.portfolio?.portfolioUrl,
    };
    return NextResponse.json({ success: true, profile: flat });
  } catch (error) {
    console.error('Failed to fetch creator profile:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const raw = await req.json();
    // منع تعديل حقول حساسة مباشرة
    const disallowed = ['email','role','status','createdAt','updatedAt','id','password'];
    disallowed.forEach(k => delete raw[k]);

    const userSnap = await adminDb.collection('users').where('email','==',session.user.email.toLowerCase()).limit(1).get();
    if (userSnap.empty) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    const userDoc = userSnap.docs[0];
    const currentData = userDoc.data() as UnifiedUser;
    if (currentData.role !== 'creator') {
      return NextResponse.json({ error: 'Access denied - creators only' }, { status: 403 });
    }

    const updatePayload: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    const profileFields = ['city','canTravel','bio','preferredVerticals'];
    profileFields.forEach(f => {
      if (f in raw) updatePayload[`creatorProfile.${f}`] = raw[f];
    });
    if (raw.skills) updatePayload['creatorProfile.skills'] = raw.skills;
    if (raw.languages) updatePayload['creatorProfile.languages'] = raw.languages;
    if (raw.primaryCategories) updatePayload['creatorProfile.primaryCategories'] = raw.primaryCategories;
    if (raw.availability) updatePayload['creatorProfile.availability'] = raw.availability;
    if (raw.equipment) updatePayload['creatorProfile.equipment'] = raw.equipment;
    if (raw.portfolio) updatePayload['creatorProfile.portfolio'] = raw.portfolio;
    if (raw.experienceLevel) updatePayload['creatorProfile.experienceLevel'] = raw.experienceLevel;

    // الحقول المسطحة القادمة من الواجهة الحالية
    if (typeof raw.name === 'string' && raw.name.trim()) {
      updatePayload.name = raw.name.trim();
    }
    if (typeof raw.phone === 'string' && raw.phone.trim()) {
      updatePayload.phone = raw.phone.trim();
    }
    if (typeof raw.specialty === 'string') {
      const allowed: CreatorSpecialty[] = ['photographer','videographer','designer','producer'];
      if (allowed.includes(raw.specialty as CreatorSpecialty)) {
        updatePayload['creatorProfile.specialty'] = raw.specialty;
      }
    }
    if (typeof raw.portfolioUrl === 'string') {
      updatePayload['creatorProfile.portfolio.portfolioUrl'] = raw.portfolioUrl.trim();
    }

    await userDoc.ref.update(updatePayload);
    return NextResponse.json({ success: true, message: 'تم الحفظ' });
  } catch (error) {
    console.error('Failed to update creator profile:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}