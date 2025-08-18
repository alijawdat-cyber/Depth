// Client Portal API - ملف شخصي للعميل
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, name, company, phone } = await req.json();

    // Validate required fields
    if (!email || !name || !company || !phone) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'تنسيق البريد الإلكتروني غير صحيح' },
        { status: 400 }
      );
    }

    // Check if client already exists
    const existingClient = await adminDb
      .collection('clients')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingClient.empty) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 409 }
      );
    }

    // Create client profile
    const clientData = {
      email,
      name,
      company,
      phone,
      status: 'pending', // Will be activated by admin
      role: 'client',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // حفظ في مجموعة clients المتخصصة
    const clientDocRef = await adminDb.collection('clients').add(clientData);

    // حفظ في مجموعة users الموحدة
    const userDocRef = await adminDb.collection('users').add({
      name,
      email,
      role: 'client',
      status: 'pending',
      profileId: clientDocRef.id, // ربط مع الملف الشخصي
      source: 'portal-client-registration',
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: false,
      twoFactorEnabled: false,
      company,
      phone,
    });

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح. في انتظار التفعيل من الإدارة',
      clientId: clientDocRef.id,
      userId: userDocRef.id,
    });

  } catch (error) {
    console.error('Client registration error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في التسجيل' },
      { status: 500 }
    );
  }
}

// GET: Fetch client profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get client profile
    const clientSnapshot = await adminDb
      .collection('clients')
      .where('email', '==', session.user.email)
      .limit(1)
      .get();

    if (clientSnapshot.empty) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const clientDoc = clientSnapshot.docs[0];
    const clientData = { id: clientDoc.id, ...clientDoc.data() };

    // Remove sensitive data
    if ('createdAt' in clientData) delete clientData.createdAt;
    if ('updatedAt' in clientData) delete clientData.updatedAt;

    return NextResponse.json({
      success: true,
      client: clientData,
    });

  } catch (error) {
    console.error('Get client error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch client data' },
      { status: 500 }
    );
  }
}

// PUT: Update client profile
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();

    // Remove sensitive fields from updates
    delete updates.email;
    delete updates.status;
    delete updates.role;
    delete updates.createdAt;

    // Add updated timestamp
    updates.updatedAt = new Date();

    // Find and update client
    const clientSnapshot = await adminDb
      .collection('clients')
      .where('email', '==', session.user.email)
      .limit(1)
      .get();

    if (clientSnapshot.empty) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const clientDoc = clientSnapshot.docs[0];
    await clientDoc.ref.update(updates);

    return NextResponse.json({
      success: true,
      message: 'تم تحديث البيانات بنجاح',
    });

  } catch (error) {
    console.error('Update client error:', error);
    return NextResponse.json(
      { error: 'Failed to update client data' },
      { status: 500 }
    );
  }
}
