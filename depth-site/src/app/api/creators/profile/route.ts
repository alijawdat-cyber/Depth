import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// دالة تحديد دور المستخدم (نسخة محلية)
async function determineUserRole(email: string): Promise<string> {
  if (!email) return 'client';
  
  const emailLower = email.toLowerCase();
  
  try {
    // تحقق من قائمة الأدمن في متغيرات البيئة أولاً
    const adminList = (process.env.ADMIN_EMAILS || 'admin@depth-agency.com')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);
    if (adminList.includes(emailLower)) return 'admin';
    
    // افتراضي: client
    return 'client';
  } catch (error) {
    console.error('[determineUserRole] Error:', error);
    return 'client';
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // البحث في مجموعة users الموحدة أولاً
    let userDoc = null;
    let userId = null;

    const userSnap = await adminDb
      .collection('users')
      .where('email', '==', session.user.email)
      .limit(1)
      .get();

    if (!userSnap.empty) {
      userDoc = userSnap.docs[0];
      userId = userDoc.id;
      const userData = userDoc.data();
      
      // التأكد من أن المستخدم مبدع
      const userRole = await determineUserRole(session.user.email);
      if (userRole !== 'creator' && userData.role !== 'creator') {
        return NextResponse.json({ error: 'Access denied - creators only' }, { status: 403 });
      }
    } else {
      // احتياطي: البحث في مجموعة creators القديمة
      const creatorSnap = await adminDb
        .collection('creators')
        .where('email', '==', session.user.email)
        .limit(1)
        .get();

      if (!creatorSnap.empty) {
        const creatorDoc = creatorSnap.docs[0];
        const creatorData = creatorDoc.data();
        
        // نسخ البيانات إلى مجموعة users الموحدة
        const newUserRef = await adminDb.collection('users').add({
          email: session.user.email,
          name: creatorData.name || creatorData.fullName || session.user.name || '',
          role: 'creator',
          status: creatorData.status || 'pending',
          phone: creatorData.phone || creatorData.contact?.phone || null,
          city: creatorData.city || null,
          canTravel: creatorData.canTravel || false,
          skills: creatorData.skills || null,
          tier: creatorData.tier || null,
          modifier: creatorData.modifier || null,
          portfolio: creatorData.portfolio || null,
          emailVerified: creatorData.emailVerified || false,
          twoFactorEnabled: creatorData.twoFactorEnabled || false,
          createdAt: creatorData.createdAt || new Date(),
          updatedAt: new Date(),
          lastLoginAt: new Date(),
          // الاحتفاظ بمعرف المستند الأصلي للمرجعية
          originalId: creatorDoc.id,
          originalCollection: 'creators'
        });

        userId = newUserRef.id;
        userDoc = await newUserRef.get();
      } else {
        // إنشاء ملف تعريف مبدع جديد في مجموعة users الموحدة
        const userRole = await determineUserRole(session.user.email);
        if (userRole !== 'creator') {
          return NextResponse.json({ error: 'Access denied - creators only' }, { status: 403 });
        }

        const defaultProfile = {
          email: session.user.email,
          name: session.user.name || '',
          role: 'creator',
          status: 'pending',
          emailVerified: false,
          twoFactorEnabled: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastLoginAt: new Date(),
        };

        const ref = await adminDb.collection('users').add(defaultProfile);
        return NextResponse.json({ 
          success: true, 
          profile: { id: ref.id, ...defaultProfile } 
        });
      }
    }

    if (!userDoc) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const data = { id: userId, ...userDoc.data() } as Record<string, unknown>;
    delete data.createdAt; 
    delete data.updatedAt;
    
    return NextResponse.json({ success: true, profile: data });
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
    const updates = await req.json();
    // sanitize
    delete updates.email; delete updates.status; delete updates.role; delete updates.createdAt; delete updates.updatedAt;
    updates.updatedAt = new Date();
    const snap = await adminDb.collection('creators').where('email', '==', session.user.email).limit(1).get();
    if (snap.empty) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    const doc = snap.docs[0];
    await doc.ref.update(updates);
    return NextResponse.json({ success: true, message: 'تم الحفظ' });
  } catch (error) {
    console.error('Failed to update creator profile:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}