// API endpoint لنموذج إدخال المبدعين الشامل
// متوافق مع docs/catalog/03-Creator-Intake-Form.md

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

// Types for Creator Intake Form
interface CreatorIntakeForm {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    whatsapp: string;
    instagram?: string;
    city: string;
    canTravel: boolean;
    languages: string[];
  };
  professionalInfo: {
    role: 'photographer' | 'videographer' | 'designer' | 'producer';
    experienceYears: number;
    education?: string;
    certifications: string[];
    previousWork?: string;
  };
  skills: Record<string, Record<string, {
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    experienceYears: number;
    description?: string;
  }>>;
  equipment: {
    cameras: EquipmentItem[];
    lenses: EquipmentItem[];
    lighting: EquipmentItem[];
    audio: EquipmentItem[];
    accessories: EquipmentItem[];
    specialSetups: EquipmentItem[];
  };
  capacity: {
    maxAssetsPerDay: number;
    workingDays: string[];
    standardSLA: number;
    rushSLA: number;
    preferredHours: { start: string; end: string };
    peakSeasons?: string[];
  };
  verticals: {
    id: string;
    experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsOfExperience: number;
    portfolioSamples: string[];
    notes?: string;
  }[];
  portfolio: {
    category: string;
    vertical: string;
    title: string;
    description: string;
    imageUrl: string;
    clientType?: string;
    year: number;
  }[];
  internalCost: Record<string, Record<string, number>>;
  compliance: {
    clinicsTraining: boolean;
    ndaSigned: boolean;
    equipmentAgreement: boolean;
    backgroundCheck?: boolean;
  };
}

interface EquipmentItem {
  type: string;
  brand: string;
  model: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  owned: boolean;
  quantity?: number;
  notes?: string;
}

// POST: Create new creator intake form
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { intakeForm, status = 'intake_submitted' }: {
      intakeForm: CreatorIntakeForm;
      status?: string;
    } = body;

    // Validate required fields
    if (!intakeForm.personalInfo.fullName || 
        !intakeForm.personalInfo.email || 
        !intakeForm.personalInfo.phone ||
        !intakeForm.personalInfo.city) {
      return NextResponse.json(
        { error: 'المعلومات الأساسية مطلوبة' }, 
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingCreator = await adminDb
      .collection('creators')
      .where('contact.email', '==', intakeForm.personalInfo.email)
      .limit(1)
      .get();

    if (!existingCreator.empty) {
      return NextResponse.json(
        { error: 'هذا البريد الإلكتروني مسجل مسبقاً' }, 
        { status: 400 }
      );
    }

    // Create creator document
    const creatorData = {
      // Basic info from intake form
      fullName: intakeForm.personalInfo.fullName,
      role: intakeForm.professionalInfo.role,
      contact: {
        email: intakeForm.personalInfo.email,
        phone: intakeForm.personalInfo.phone,
        whatsapp: intakeForm.personalInfo.whatsapp,
        instagram: intakeForm.personalInfo.instagram
      },
      city: intakeForm.personalInfo.city,
      canTravel: intakeForm.personalInfo.canTravel,
      languages: intakeForm.personalInfo.languages,
      
      // Professional info
      experienceYears: intakeForm.professionalInfo.experienceYears,
      education: intakeForm.professionalInfo.education,
      certifications: intakeForm.professionalInfo.certifications,
      previousWork: intakeForm.professionalInfo.previousWork,

      // Full intake form data
      intakeForm,

      // Status and metadata
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: session.user.email,

      // Scoring (will be filled by admin evaluation)
      score: null,
      tier: null,
      evaluation: null
    };

    // Save to Firestore
    const docRef = await adminDb.collection('creators').add(creatorData);

    // Log the action
    await adminDb.collection('audit_log').add({
      action: 'creator_intake_submitted',
      entityType: 'creator',
      entityId: docRef.id,
      userId: session.user.email,
      timestamp: new Date().toISOString(),
      details: {
        creatorName: intakeForm.personalInfo.fullName,
        role: intakeForm.professionalInfo.role,
        status
      }
    });

    return NextResponse.json({
      success: true,
      creatorId: docRef.id,
      message: status === 'intake_draft' ? 'تم حفظ المسودة' : 'تم إرسال النموذج للمراجعة'
    });

  } catch (error) {
    console.error('Error creating creator intake:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حفظ البيانات' }, 
      { status: 500 }
    );
  }
}

// GET: Retrieve all intake forms (for admin review)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = adminDb.collection('creators')
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    const intakeForms = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Calculate stats
    const allSnapshot = await adminDb.collection('creators').get();
    const stats = {
      total: allSnapshot.size,
      byStatus: {
        intake_draft: 0,
        intake_submitted: 0,
        under_review: 0,
        approved: 0,
        rejected: 0
      }
    };

    allSnapshot.docs.forEach(doc => {
      const data = doc.data();
      const creatorStatus = data.status;
      if (stats.byStatus.hasOwnProperty(creatorStatus)) {
        stats.byStatus[creatorStatus as keyof typeof stats.byStatus]++;
      }
    });

    return NextResponse.json({
      intakeForms,
      stats,
      total: intakeForms.length
    });

  } catch (error) {
    console.error('Error fetching intake forms:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل البيانات' }, 
      { status: 500 }
    );
  }
}
