import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string })?.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const entityType = searchParams.get('entityType');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = adminDb.collection('audit_log').orderBy('timestamp', 'desc').limit(limit);

    if (entityType) {
      query = query.where('entityType', '==', entityType);
    }
    if (userId) {
      query = query.where('userId', '==', userId);
    }
    if (startDate) {
      query = query.where('timestamp', '>=', startDate);
    }
    if (endDate) {
      query = query.where('timestamp', '<=', endDate);
    }

    const snap = await query.get();
    const entries = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ entries, total: entries.length });
  } catch (error) {
    console.error('[governance/audit] error', error);
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}


