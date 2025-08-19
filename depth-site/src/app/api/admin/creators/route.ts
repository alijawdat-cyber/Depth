import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import type { UnifiedUser, CreatorProfile } from '@/types/unified-user';

// GET /api/admin/creators
// واجهة مبسطة لإرجاع قائمة المبدعين للاستخدام في صفحة إدارة المشاريع
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'غير مصرح' }, { status: 401 });
    }
    const role = (session.user as { role?: string }).role;
    if (role !== 'admin') {
      return NextResponse.json({ success: false, error: 'للمسؤول فقط' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const limitParam = parseInt(searchParams.get('limit') || '200', 10);
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const limit = Math.min(limitParam, 500);

    const snap = await adminDb
      .collection('users')
      .where('role', '==', 'creator')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const creators = snap.docs
      .map(doc => {
        const data = doc.data() as UnifiedUser;
        const cp: CreatorProfile | undefined = data.creatorProfile;
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          skills: (cp?.skills || []).map(s => s.subcategoryId),
            // tier/modifier افتراضات عند غياب القيم
          tier: cp?.tier || 'standard',
          modifier: cp?.modifier ?? 1
        };
      })
      .filter(c => {
        if (!search) return true;
        return (
          c.name?.toLowerCase().includes(search) ||
          c.email?.toLowerCase().includes(search) ||
          c.skills.some(s => s.toLowerCase().includes(search))
        );
      });

    return NextResponse.json({ success: true, creators, total: creators.length });
  } catch (error) {
    console.error('❌ [ADMIN][creators] error:', error);
    return NextResponse.json({ success: false, error: 'خطأ في الخادم' }, { status: 500 });
  }
}
