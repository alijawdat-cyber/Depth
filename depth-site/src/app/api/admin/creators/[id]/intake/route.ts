// API endpoint لإدارة نموذج إدخال مبدع محدد
// متوافق مع docs/catalog/03-Creator-Intake-Form.md

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

interface IntakeForm {
  personalInfo?: {
    fullName: string;
    email: string;
    phone: string;
    whatsapp?: string;
    instagram?: string;
    city: string;
    canTravel: boolean;
    languages: string[];
  };
  professionalInfo?: {
    role: string;
    experienceYears: number;
    education: string;
    certifications: string[];
    previousWork: string;
  };
}

// GET: Retrieve specific creator's intake form
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get creator document
    const doc = await adminDb.collection('creators').doc(id).get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'المبدع غير موجود' }, 
        { status: 404 }
      );
    }

    const creatorData = { id: doc.id, ...doc.data() } as { id: string; intakeForm?: IntakeForm; [key: string]: unknown };

    return NextResponse.json({
      creator: creatorData,
      intakeForm: creatorData.intakeForm || null
    });

  } catch (error) {
    console.error('Error fetching creator intake:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل البيانات' }, 
      { status: 500 }
    );
  }
}

// PUT: Update specific creator's intake form
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { intakeForm, status }: {
      intakeForm: IntakeForm;
      status?: string;
    } = body;

    // Check if creator exists
    const doc = await adminDb.collection('creators').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'المبدع غير موجود' }, 
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      intakeForm,
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.email
    };

    // Update basic fields from intake form if provided
    if (intakeForm.personalInfo) {
      updateData.fullName = intakeForm.personalInfo.fullName;
      updateData.contact = {
        email: intakeForm.personalInfo.email,
        phone: intakeForm.personalInfo.phone,
        whatsapp: intakeForm.personalInfo.whatsapp,
        instagram: intakeForm.personalInfo.instagram
      };
      updateData.city = intakeForm.personalInfo.city;
      updateData.canTravel = intakeForm.personalInfo.canTravel;
      updateData.languages = intakeForm.personalInfo.languages;
    }

    if (intakeForm.professionalInfo) {
      updateData.role = intakeForm.professionalInfo.role;
      updateData.experienceYears = intakeForm.professionalInfo.experienceYears;
      updateData.education = intakeForm.professionalInfo.education;
      updateData.certifications = intakeForm.professionalInfo.certifications;
      updateData.previousWork = intakeForm.professionalInfo.previousWork;
    }

    // Update status if provided
    if (status) {
      updateData.status = status;
    }

    // Update document
    await adminDb.collection('creators').doc(id).update(updateData);

    // Log the action
    await adminDb.collection('audit_log').add({
      action: 'creator_intake_updated',
      entityType: 'creator',
      entityId: id,
      userId: session.user.email,
      timestamp: new Date().toISOString(),
      details: {
        updatedFields: Object.keys(updateData),
        status: status || 'no_status_change'
      }
    });

    return NextResponse.json({
      success: true,
      message: status === 'intake_draft' ? 'تم حفظ المسودة' : 'تم تحديث البيانات'
    });

  } catch (error) {
    console.error('Error updating creator intake:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في تحديث البيانات' }, 
      { status: 500 }
    );
  }
}

// DELETE: Remove creator's intake form (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if creator exists
    const doc = await adminDb.collection('creators').doc(id).get();
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'المبدع غير موجود' }, 
        { status: 404 }
      );
    }

    const creatorData = doc.data();

    // Only allow deletion if status is draft or rejected
    if (creatorData?.status === 'approved' || creatorData?.status === 'under_review') {
      return NextResponse.json(
        { error: 'لا يمكن حذف مبدع معتمد أو قيد المراجعة' }, 
        { status: 400 }
      );
    }

    // Delete the document
    await adminDb.collection('creators').doc(id).delete();

    // Log the action
    await adminDb.collection('audit_log').add({
      action: 'creator_intake_deleted',
      entityType: 'creator',
      entityId: id,
      userId: session.user.email,
      timestamp: new Date().toISOString(),
      details: {
        deletedCreator: {
          name: creatorData?.fullName,
          email: creatorData?.contact?.email,
          status: creatorData?.status
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف المبدع'
    });

  } catch (error) {
    console.error('Error deleting creator intake:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حذف المبدع' }, 
      { status: 500 }
    );
  }
}
