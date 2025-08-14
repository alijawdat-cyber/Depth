// Admin Client Management API
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { resend } from '@/lib/email/resend';
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

    // Get all clients
    const clientsSnapshot = await adminDb
      .collection('clients')
      .orderBy('createdAt', 'desc')
      .get();

    const clients = clientsSnapshot.docs.map(doc => {
      const data = doc.data();
      // Normalize Firestore Timestamp/Date/string to ISO string safely
      let createdAtIso: string;
      try {
        if (data.createdAt?.toDate) {
          createdAtIso = data.createdAt.toDate().toISOString();
        } else if (data.createdAt instanceof Date) {
          createdAtIso = data.createdAt.toISOString();
        } else if (typeof data.createdAt === 'string') {
          createdAtIso = data.createdAt;
        } else {
          createdAtIso = new Date().toISOString();
        }
      } catch {
        createdAtIso = new Date().toISOString();
      }

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

    return NextResponse.json({
      success: true,
      clients,
    });

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

    if (action === 'create-demo-client') {
      // Create a demo client for testing
      const demoClient = {
        name: 'عميل تجريبي',
        email: 'demo@test.com',
        company: 'شركة تجريبية',
        phone: '+964 770 123 4567',
        status: 'pending',
        role: 'client',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const docRef = await adminDb.collection('clients').add(demoClient);

      return NextResponse.json({
        success: true,
        message: 'Demo client created successfully',
        clientId: docRef.id,
      });
    }

    if (action === 'invite') {
      if (!email) {
        return NextResponse.json({ error: 'email is required' }, { status: 400 });
      }
      await resend.emails.send({
        from: 'Depth <hello@depth-agency.com>',
        to: [email],
        subject: 'دعوة للانضمام إلى بوابة Depth',
        html: `<p>مرحباً،</p><p>اضغط هنا لتسجيل الدخول والبدء: <a href="${process.env.NEXTAUTH_URL}/portal/auth/signin">تسجيل الدخول</a></p>`
      });
      return NextResponse.json({ success: true, message: 'Invitation sent' });
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
