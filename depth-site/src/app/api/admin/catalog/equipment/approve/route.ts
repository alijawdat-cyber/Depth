import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as unknown as { role?: string }).role !== 'admin') {
      return NextResponse.json({ success: false, code: 'UNAUTHORIZED', requestId }, { status: 401 });
    }

    const { suggestionId } = await req.json();
    if (!suggestionId) return NextResponse.json({ success: false, code: 'MISSING_ID', requestId }, { status: 400 });

    const suggRef = adminDb.collection('equipment_suggestions').doc(String(suggestionId));
    const snap = await suggRef.get();
    if (!snap.exists) return NextResponse.json({ success: false, code: 'NOT_FOUND', requestId }, { status: 404 });
    const data = snap.data() as { category: string; name: string; model?: string | null; status: string };
    if (data.status !== 'pending') return NextResponse.json({ success: false, code: 'BAD_STATE', requestId }, { status: 400 });

    // upsert into catalog_equipment
    const eqId = `${data.category}:${data.name.toLowerCase().replace(/\s+/g, '-')}`;
    await adminDb.collection('catalog_equipment').doc(eqId).set({
      category: data.category,
      name: data.name,
      model: data.model || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      approvedBy: session.user.email,
    }, { merge: true });

    await suggRef.update({ status: 'approved', updatedAt: new Date(), approvedBy: session.user.email });

    return NextResponse.json({ success: true, requestId, equipmentId: eqId });
  } catch (error) {
    console.error('[admin.catalog.equipment.approve] error', { requestId, error });
    return NextResponse.json({ success: false, code: 'SERVER_ERROR', requestId }, { status: 500 });
  }
}


