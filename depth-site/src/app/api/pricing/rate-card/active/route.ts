// API endpoint للحصول على جدول الأسعار النشط

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get active rate card
    const activeSnapshot = await adminDb
      .collection('rate_cards')
      .where('status', '==', 'active')
      // إزالة orderBy لتفادي الحاجة إلى فهرس مركّب؛ نفترض وجود وثيقة نشطة واحدة
      .limit(1)
      .get();

    let activeRateCard = null;
    if (!activeSnapshot.empty) {
      const doc = activeSnapshot.docs[0];
      activeRateCard = { id: doc.id, ...doc.data() };
    }

    // Get all versions for history
    const versionsSnapshot = await adminDb
      .collection('rate_cards')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get();

    const versions = versionsSnapshot.docs.map(doc => ({
      id: doc.id,
      version: doc.data().version,
      status: doc.data().status,
      createdAt: doc.data().createdAt,
      createdBy: doc.data().createdBy,
      itemsCount: doc.data().items?.length || 0
    }));

    return NextResponse.json({
      rateCard: activeRateCard,
      versions,
      hasActiveRateCard: !!activeRateCard
    });

  } catch (error) {
    console.error('Error fetching active rate card:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل جدول الأسعار النشط' }, 
      { status: 500 }
    );
  }
}