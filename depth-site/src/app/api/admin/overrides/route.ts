// API موحد لنظام التعديلات - أساسي ومتقدم
// متوافق مع docs/roles/admin/05-Rate-Override-Policy.md

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import { 
  PriceOverride, 
  OverrideStats, 
  OverrideListResponse,
  OverrideCreateRequest 
} from '@/types/governance';
import { getActiveRateCard } from '@/lib/catalog/read';
import { extractGuardrailsConfig, validateOverride } from '@/lib/pricing/guardrails-engine';

// Validation schemas
const createOverrideSchema = z.object({
  type: z.enum(['basic', 'advanced']),
  subcategoryId: z.string(),
  vertical: z.string(),
  processing: z.string(),
  requestedPriceIQD: z.number().positive(),
  reason: z.string().min(10),
  justification: z.string().optional(),
  competitorPrice: z.number().optional(),
  expectedVolume: z.number().optional(),
  strategicValue: z.string().optional(),
  quoteId: z.string().optional(),
  clientName: z.string().optional(),
});

// GET: Retrieve override requests (موحد للنوعين)
export async function GET(request: NextRequest): Promise<NextResponse<OverrideListResponse | { error: string }>> {
  const requestId = crypto.randomUUID();
  
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;
    
    if (!session?.user || role !== 'admin') {
      return NextResponse.json({ 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const status = searchParams.get('status') || 'all';
    const riskLevel = searchParams.get('riskLevel') || 'all';
    const dateRange = searchParams.get('dateRange') || 'all';
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');

    // بناء الاستعلام
    let query = adminDb.collection('overrides')
      .orderBy('createdAt', 'desc')
      .limit(limit);

    // تطبيق الفلاتر
    if (type !== 'all') {
      query = query.where('type', '==', type);
    }

    if (status !== 'all') {
      query = query.where('status', '==', status);
    }

    if (riskLevel !== 'all' && type === 'advanced') {
      query = query.where('riskLevel', '==', riskLevel);
    }

    // فلتر النطاق الزمني
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'quarter':
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        default:
          startDate = new Date(0);
      }

      query = query.where('createdAt', '>=', startDate.toISOString());
    }

    const snapshot = await query.get();
    const overrides = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PriceOverride[];

    // تطبيق فلتر البحث النصي (client-side لأن Firestore لا يدعم LIKE)
    let filteredOverrides = overrides;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredOverrides = overrides.filter(override => 
        override.reason.toLowerCase().includes(searchLower) ||
        override.subcategoryId.toLowerCase().includes(searchLower) ||
        override.clientName?.toLowerCase().includes(searchLower) ||
        override.creatorEmail?.toLowerCase().includes(searchLower)
      );
    }

    // حساب الإحصائيات
    const stats: OverrideStats = filteredOverrides.reduce((acc, override) => {
      acc.total += 1;
      acc[override.status] = (acc[override.status] || 0) + 1;
      acc[override.type] = (acc[override.type] || 0) + 1;
      acc.totalDiscountRequested += override.discountAmount || 0;
      
      return acc;
    }, {
      pending: 0,
      approved: 0,
      rejected: 0,
      countered: 0,
      expired: 0,
      total: 0,
      basic: 0,
      advanced: 0,
      avgChangePercent: 0,
      totalDiscountRequested: 0
    });

    // حساب متوسط نسبة التغيير
    if (filteredOverrides.length > 0) {
      stats.avgChangePercent = filteredOverrides.reduce(
        (sum, override) => sum + Math.abs(override.changePercent), 0
      ) / filteredOverrides.length;
    }

    // تحديد مستوى المخاطر السائد
    const riskLevels = filteredOverrides
      .filter(o => o.riskLevel)
      .map(o => o.riskLevel!);
    
    if (riskLevels.length > 0) {
      const riskCounts = riskLevels.reduce((acc, level) => {
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      stats.avgRiskLevel = Object.entries(riskCounts)
        .sort(([,a], [,b]) => b - a)[0][0] as 'low' | 'medium' | 'high' | 'critical';
    }

    const response: OverrideListResponse = {
      success: true,
      overrides: filteredOverrides,
      stats,
      total: filteredOverrides.length,
      requestId
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching overrides:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل طلبات التعديل' },
      { status: 500 }
    );
  }
}

// POST: Create new override request
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;
    
    if (!session?.user || role !== 'admin') {
      return NextResponse.json({ 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createOverrideSchema.parse(body) as OverrideCreateRequest;

    // الحصول على السعر الحالي من Rate Card
    const rateCard = await getActiveRateCard();
    if (!rateCard) {
      return NextResponse.json(
        { error: 'لا يوجد جدول أسعار نشط' },
        { status: 400 }
      );
    }

    const currentPrice = rateCard.basePricesIQD?.[validatedData.subcategoryId];
    if (!currentPrice) {
      return NextResponse.json(
        { error: 'السعر الحالي غير موجود للفئة المحددة' },
        { status: 400 }
      );
    }

    // حساب تفاصيل التخفيض
    const discountAmount = currentPrice - validatedData.requestedPriceIQD;
    const changePercent = (discountAmount / currentPrice) * 100;

    // التحقق من حواجز التخفيض
    const guardrails = extractGuardrailsConfig(rateCard);
    const validation = validateOverride(
      currentPrice,
      validatedData.requestedPriceIQD,
      guardrails
    );

    if (!validation.isValid && validatedData.type === 'basic') {
      return NextResponse.json(
        { error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    // تحديد مستوى المخاطر للنوع المتقدم
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (validatedData.type === 'advanced') {
      if (Math.abs(changePercent) > 30) riskLevel = 'critical';
      else if (Math.abs(changePercent) > 20) riskLevel = 'high';
      else if (Math.abs(changePercent) > 10) riskLevel = 'medium';
    }

    // إنشاء بيانات الطلب
    const overrideData: Omit<PriceOverride, 'id'> = {
      type: validatedData.type,
      requestedBy: session.user.email || '',
      creatorEmail: validatedData.type === 'basic' ? (session.user.email || undefined) : undefined,
      quoteId: validatedData.quoteId,
      clientName: validatedData.clientName,
      subcategoryId: validatedData.subcategoryId,
      vertical: validatedData.vertical,
      processing: validatedData.processing,
      currentPriceIQD: currentPrice,
      requestedPriceIQD: validatedData.requestedPriceIQD,
      changePercent,
      discountAmount,
      reason: validatedData.reason,
      justification: validatedData.justification,
      competitorPrice: validatedData.competitorPrice,
      expectedVolume: validatedData.expectedVolume,
      strategicValue: validatedData.strategicValue,
      riskLevel: validatedData.type === 'advanced' ? riskLevel : undefined,
      marginImpact: validatedData.type === 'advanced' ? validation.finalMargin : undefined,
      profitabilityRisk: validatedData.type === 'advanced' ? 
        validation.warnings.join(', ') || 'معقول' : undefined,
      status: 'pending',
      approvals: validatedData.type === 'advanced' ? [
        {
          level: 'manager',
          approver: '',
          status: 'pending'
        }
      ] : undefined,
      auditLog: [{
        action: 'request_created',
        user: session.user.email || '',
        timestamp: new Date().toISOString(),
        details: {
          type: validatedData.type,
          originalPrice: currentPrice,
          requestedPrice: validatedData.requestedPriceIQD,
          changePercent: changePercent
        }
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // حفظ في Firestore
    const docRef = await adminDb.collection('overrides').add(overrideData);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      override: { id: docRef.id, ...overrideData },
      requestId
    });

  } catch (error) {
    console.error('Error creating override:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'بيانات الطلب غير صحيحة', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'فشل في إنشاء طلب التعديل' },
      { status: 500 }
    );
  }
}
