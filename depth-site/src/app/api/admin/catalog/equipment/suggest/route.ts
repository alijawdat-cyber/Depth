import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ success: false, code: 'UNAUTHORIZED', requestId }, { status: 401 });

    const body = await req.json();
    const { category, name, model } = body || {};
    const allowed = ['cameras', 'lenses', 'lighting', 'audio', 'accessories', 'specialSetups'];
    if (!allowed.includes(category)) return NextResponse.json({ success: false, code: 'BAD_CATEGORY', requestId }, { status: 400 });
    if (!name || typeof name !== 'string') return NextResponse.json({ success: false, code: 'BAD_NAME', requestId }, { status: 400 });

    const doc = await adminDb.collection('equipment_suggestions').add({
      category,
      name: String(name),
      model: model ? String(model) : null,
      status: 'pending',
      createdBy: session.user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ success: true, requestId, suggestionId: doc.id });
  } catch (error) {
    console.error('[catalog.equipment.suggest] error', { requestId, error });
    return NextResponse.json({ success: false, code: 'SERVER_ERROR', requestId }, { status: 500 });
  }
}


