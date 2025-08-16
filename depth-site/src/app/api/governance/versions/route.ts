import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import { 
  RateCardVersion, 
  VersionListResponse, 
  GovernanceStats,
  AuditLogEntry
} from '@/types/governance';

// Validation schemas
const VersionListSchema = z.object({
  status: z.enum(['draft', 'active', 'archived']).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0)
});

const VersionCreateSchema = z.object({
  reason: z.string().min(1, 'سبب التغيير مطلوب'),
  effectiveFrom: z.string().datetime('تاريخ السريان يجب أن يكون بصيغة ISO'),
  rateCard: z.object({
    baseRates: z.record(z.string(), z.number()),
    modifiers: z.object({
      verticals: z.record(z.string(), z.number()),
      processing: z.record(z.string(), z.number()),
      conditions: z.record(z.string(), z.number())
    }),
    fx: z.object({
      rate: z.number(),
      source: z.string(),
      updatedAt: z.string()
    })
  })
});

const VersionUpdateSchema = z.object({
  id: z.string(),
  status: z.enum(['active', 'archived']),
  reason: z.string().optional()
});

/**
 * GET /api/governance/versions
 * List rate card versions with filtering and stats
 */
export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string })?.role !== 'admin') {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const query = VersionListSchema.parse({
      status: searchParams.get('status'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset')
    });

    // Build Firestore query
    let versionsQuery = adminDb.collection('governance_versions')
      .orderBy('createdAt', 'desc')
      .limit(query.limit)
      .offset(query.offset);

    if (query.status) {
      versionsQuery = versionsQuery.where('status', '==', query.status);
    }

    // Execute query
    const versionsSnapshot = await versionsQuery.get();
    const versions: RateCardVersion[] = [];

    versionsSnapshot.forEach(doc => {
      const data = doc.data();
      versions.push({
        id: doc.id,
        ...data
      } as RateCardVersion);
    });

    // Get total count - simplified approach
    const allVersionsSnapshot = await adminDb.collection('governance_versions').get();
    const allVersions = allVersionsSnapshot.docs.map(doc => doc.data());
    const total = query.status 
      ? allVersions.filter(v => v.status === query.status).length 
      : allVersions.length;

    // Calculate governance stats
    const stats = await calculateGovernanceStats();

    const response: VersionListResponse = {
      versions,
      total,
      stats
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[governance/versions] GET error:', error);
    return NextResponse.json(
      { error: 'خطأ في تحميل الإصدارات' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/governance/versions
 * Create a new rate card version
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string })?.role !== 'admin') {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = VersionCreateSchema.parse(body);

    // Generate version ID (YYYY.MM.DD format)
    const now = new Date();
    const versionId = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;

    // Check if version already exists for today
    const existingVersionQuery = await adminDb
      .collection('governance_versions')
      .where('versionId', '==', versionId)
      .get();

    if (!existingVersionQuery.empty) {
      return NextResponse.json(
        { error: `إصدار بتاريخ ${versionId} موجود بالفعل` },
        { status: 400 }
      );
    }

    // Create new version document
    const newVersion: Omit<RateCardVersion, 'id'> = {
      versionId,
      status: 'draft',
      effectiveFrom: validatedData.effectiveFrom,
      createdAt: now.toISOString(),
      createdBy: session.user.email!,
      reason: validatedData.reason,
      rateCard: validatedData.rateCard,
      changes: [] // Will be calculated when comparing with previous version
    };

    // Save to Firestore
    const docRef = await adminDb.collection('governance_versions').add(newVersion);

    // Log audit entry
    await createAuditLog({
      action: 'version_create',
      userId: session.user.email!,
      userRole: 'admin',
      entityType: 'rate_card',
      entityId: docRef.id,
      details: {
        versionId,
        reason: validatedData.reason
      }
    });

    return NextResponse.json({
      id: docRef.id,
      ...newVersion
    });

  } catch (error) {
    console.error('[governance/versions] POST error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'بيانات غير صحيحة',
          details: error.issues.map(e => e.message)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'خطأ في إنشاء الإصدار' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/governance/versions
 * Update version status (activate/archive)
 */
export async function PUT(request: NextRequest) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string })?.role !== 'admin') {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = VersionUpdateSchema.parse(body);

    // Get existing version
    const versionDoc = await adminDb.collection('governance_versions').doc(validatedData.id).get();
    
    if (!versionDoc.exists) {
      return NextResponse.json(
        { error: 'الإصدار غير موجود' },
        { status: 404 }
      );
    }

    const versionData = versionDoc.data() as RateCardVersion;

    // If activating, deactivate all other active versions
    if (validatedData.status === 'active') {
      const activeVersionsQuery = await adminDb
        .collection('governance_versions')
        .where('status', '==', 'active')
        .get();

      const batch = adminDb.batch();
      activeVersionsQuery.forEach(doc => {
        batch.update(doc.ref, { 
          status: 'archived',
          effectiveTo: new Date().toISOString()
        });
      });
      await batch.commit();
    }

    // Update the version
    const updateData: Partial<RateCardVersion> = {
      status: validatedData.status
    };

    if (validatedData.status === 'archived') {
      updateData.effectiveTo = new Date().toISOString();
    }

    await versionDoc.ref.update(updateData);

    // Log audit entry
    await createAuditLog({
      action: 'version_publish',
      userId: session.user.email!,
      userRole: 'admin',
      entityType: 'rate_card',
      entityId: validatedData.id,
      details: {
        versionId: versionData.versionId,
        oldValue: versionData.status,
        newValue: validatedData.status,
        reason: validatedData.reason
      }
    });

    return NextResponse.json({
      ...versionData,
      ...updateData,
      id: validatedData.id
    });

  } catch (error) {
    console.error('[governance/versions] PUT error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'بيانات غير صحيحة',
          details: error.issues.map(e => e.message)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'خطأ في تحديث الإصدار' },
      { status: 500 }
    );
  }
}

// Helper function to calculate governance stats
async function calculateGovernanceStats(): Promise<GovernanceStats> {
  try {
    // Get active version
    const activeVersionQuery = await adminDb
      .collection('governance_versions')
      .where('status', '==', 'active')
      .limit(1)
      .get();

    const activeVersion = activeVersionQuery.empty ? null : activeVersionQuery.docs[0].data() as RateCardVersion;

    // Count total versions
    const totalVersionsSnapshot = await adminDb.collection('governance_versions').count().get();
    const totalVersions = totalVersionsSnapshot.data().count;

    // Count pending quotes (assuming quotes collection exists)
    const pendingQuotesSnapshot = await adminDb
      .collection('quotes')
      .where('status', '==', 'sent')
      .count()
      .get();
    const pendingQuotes = pendingQuotesSnapshot.data().count;

    // Get recent audit entries count
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentAuditSnapshot = await adminDb
      .collection('audit_log')
      .where('timestamp', '>=', sevenDaysAgo.toISOString())
      .count()
      .get();
    const recentAuditCount = recentAuditSnapshot.data().count;

    return {
      activeVersion: activeVersion?.versionId || 'لا يوجد',
      totalVersions,
      pendingQuotes,
      pendingOverrides: 0, // Will implement when overrides system is added
      lastVersionDate: activeVersion?.createdAt || '',
      avgChangePercent: 0, // Will calculate from version changes
      recentAuditCount
    };
  } catch (error) {
    console.error('Error calculating governance stats:', error);
    return {
      activeVersion: 'خطأ',
      totalVersions: 0,
      pendingQuotes: 0,
      pendingOverrides: 0,
      lastVersionDate: '',
      avgChangePercent: 0,
      recentAuditCount: 0
    };
  }
}

// Helper function to create audit log entry
async function createAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
  try {
    const auditEntry: Omit<AuditLogEntry, 'id'> = {
      ...entry,
      timestamp: new Date().toISOString()
    };

    await adminDb.collection('audit_log').add(auditEntry);
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw - audit logging shouldn't break main functionality
  }
}
