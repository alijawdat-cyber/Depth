import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as unknown as { role?: string }).role !== 'admin') {
    return null;
  }
  return session;
}

// GET: list projects (optionally filter by clientEmail)
export async function GET(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const clientEmail = searchParams.get('clientEmail');

    let query = adminDb.collection('projects').orderBy('createdAt', 'desc');
    if (clientEmail) {
      query = query.where('clientEmail', '==', clientEmail);
    }

    const snap = await query.get();
    const projects = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error('Admin list projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST: create project
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, clientEmail, status = 'active', milestones = [], budget, progress, description } = body || {};
    if (!title || !clientEmail) {
      return NextResponse.json({ error: 'title and clientEmail are required' }, { status: 400 });
    }

    // Validate client exists and is approved
    const clientSnap = await adminDb
      .collection('clients')
      .where('email', '==', String(clientEmail).toLowerCase())
      .limit(1)
      .get();
    if (clientSnap.empty) {
      return NextResponse.json({ error: 'Client does not exist' }, { status: 400 });
    }
    const clientData = clientSnap.docs[0].data() as { status?: string };
    if (clientData.status !== 'approved') {
      return NextResponse.json({ error: 'Client is not approved' }, { status: 400 });
    }

    // Normalize to unified schema used by client UI
    const doc = {
      name: title,
      description: typeof description === 'string' ? description : '',
      budget: typeof budget === 'number' ? budget : 0,
      progress: typeof progress === 'number' ? progress : 0,
      clientEmail: String(clientEmail).toLowerCase(),
      status,
      milestones,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const ref = await adminDb.collection('projects').add(doc);
    return NextResponse.json({ success: true, projectId: ref.id });
  } catch (error) {
    console.error('Admin create project error:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}


