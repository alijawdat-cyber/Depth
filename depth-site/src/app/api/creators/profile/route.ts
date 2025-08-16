import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const snap = await adminDb.collection('creators').where('email', '==', session.user.email).limit(1).get();
    if (snap.empty) {
      // create a lightweight default profile for first-time users
      const defaultProfile = {
        email: session.user.email,
        name: session.user.name || '',
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const ref = await adminDb.collection('creators').add(defaultProfile);
      return NextResponse.json({ success: true, profile: { id: ref.id, ...defaultProfile } });
    }
    const doc = snap.docs[0];
    const data = { id: doc.id, ...doc.data() } as Record<string, unknown>;
    delete data.createdAt; delete data.updatedAt;
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