// Admin Client Management API
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { resend } from '@/lib/email/resend';
import { render } from '@react-email/render';
import ClientInvite, { renderClientInviteText } from '@/emails/ClientInvite';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as unknown as { role?: string }).role !== 'admin') {
    return null;
  }
  return session;
}

// GET: Fetch all clients for admin
export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Try ordered query first
    let clients: Array<{ id: string; name: string; email: string; company: string; phone: string; status: string; createdAt: string }> = [];
    try {
      const ordered = await adminDb
        .collection('clients')
        .orderBy('createdAt', 'desc')
        .get();
      clients = ordered.docs.map(doc => {
        const data = doc.data();
        let createdAtIso: string;
        try {
          if (data.createdAt?.toDate) createdAtIso = data.createdAt.toDate().toISOString();
          else if (data.createdAt instanceof Date) createdAtIso = data.createdAt.toISOString();
          else if (typeof data.createdAt === 'string') createdAtIso = data.createdAt;
          else createdAtIso = new Date().toISOString();
        } catch { createdAtIso = new Date().toISOString(); }
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          company: data.company,
          phone: data.phone,
          status: data.status,
          createdAt: createdAtIso,
        };
      });
      console.log('[admin/clients] orderedCount=', clients.length);
    } catch (e) {
      console.warn('[admin/clients] ordered query failed', e);
      clients = [];
    }

    // Merge-in any docs missing createdAt or excluded from ordered query
    const scan = await adminDb.collection('clients').get();
    const byId = new Map(clients.map(c => [c.id, true] as const));
    let merged = 0;
    scan.docs.forEach(doc => {
      if (byId.has(doc.id)) return;
      const data = doc.data();
      let createdAtIso: string | undefined;
      try {
        if (data.createdAt?.toDate) createdAtIso = data.createdAt.toDate().toISOString();
        else if (data.createdAt instanceof Date) createdAtIso = data.createdAt.toISOString();
        else if (typeof data.createdAt === 'string') createdAtIso = data.createdAt;
      } catch { createdAtIso = undefined; }
      clients.push({
        id: doc.id,
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        status: data.status || 'pending',
        createdAt: createdAtIso || new Date(0).toISOString(),
      });
      merged++;
    });
    if (merged) {
      clients.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    }
    console.log('[admin/clients] mergedAdded=', merged, 'total=', clients.length);

    return new NextResponse(
      JSON.stringify({ success: true, clients }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'Surrogate-Control': 'no-store',
        },
      },
    );

  } catch (error) {
    console.error('Admin get clients error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

// PUT: Update client status
export async function PUT(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { clientId, status } = await req.json();

    if (!clientId || !status) {
      return NextResponse.json(
        { error: 'Client ID and status are required' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update client status
    await adminDb.collection('clients').doc(clientId).update({
      status,
      updatedAt: new Date(),
    });

    // If approved, could trigger welcome email or other actions here
    if (status === 'approved') {
      // TODO: Send welcome email
      // TODO: Create initial project setup
    }

    return NextResponse.json({
      success: true,
      message: `Client ${status} successfully`,
    });

  } catch (error) {
    console.error('Admin update client error:', error);
    return NextResponse.json(
      { error: 'Failed to update client status' },
      { status: 500 }
    );
  }
}

// POST: Create demo client (for testing)
export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { action, email } = await req.json();

    // Production: لا نسمح بإنشاء عميل تجريبي عبر الـ API

    if (action === 'invite') {
      if (!email) {
        return NextResponse.json({ error: 'email is required' }, { status: 400 });
      }
      const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://depth-agency.com';
      const signinUrl = `${baseUrl.replace(/\/$/, '')}/auth/signin`;
      const html = await render(ClientInvite({ recipientName: email.split('@')[0], inviteUrl: signinUrl, brandUrl: baseUrl }));
      const text = renderClientInviteText({ recipientName: email.split('@')[0], inviteUrl: signinUrl });
      await resend.emails.send({
        from: 'Depth <hello@depth-agency.com>',
        to: [email],
        subject: 'دعوة للانضمام إلى بوابة Depth',
        html,
        text,
      });
    return new NextResponse(
      JSON.stringify({ success: true, message: 'Invitation sent' }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    );
    }

    if (action === 'backfill-createdAt') {
      // Fallback migration: add createdAt to clients missing it
      const snap = await adminDb.collection('clients').get();
      let updated = 0;
      for (const doc of snap.docs) {
        const data = doc.data();
        const hasField = !!data.createdAt;
        if (!hasField) {
          await doc.ref.update({ createdAt: new Date(), updatedAt: new Date() });
          updated++;
        }
      }
      return new NextResponse(
        JSON.stringify({ success: true, updated }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Admin create demo client error:', error);
    return NextResponse.json(
      { error: 'Failed to create demo client' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
