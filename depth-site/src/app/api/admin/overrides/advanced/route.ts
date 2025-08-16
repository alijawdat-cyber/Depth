// API endpoint لنظام التعديلات المتقدم - متوافق مع docs/roles/admin/05-Rate-Override-Policy.md

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

interface PriceOverrideRequest {
  id?: string;
  quoteId: string;
  clientName: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  
  originalPrice: number;
  requestedPrice: number;
  discountAmount: number;
  discountPercentage: number;
  
  reason: string;
  justification: string;
  competitorPrice?: number;
  expectedVolume?: number;
  strategicValue?: string;
  
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  marginImpact: number;
  profitabilityRisk: string;
  
  approvals: Array<{
    level: 'manager' | 'director' | 'ceo';
    approver: string;
    status: 'pending' | 'approved' | 'rejected';
    timestamp?: string;
    notes?: string;
  }>;
  
  conditions: string[];
  expiryDate?: string;
  usageLimit?: number;
  usageCount?: number;
  
  auditLog: Array<{
    action: string;
    user: string;
    timestamp: string;
    details: Record<string, unknown>;
  }>;
}

// POST: Create new override request
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as { request: PriceOverrideRequest };
    const { request: overrideRequest } = body;

    // Validate required fields
    if (!overrideRequest.quoteId || 
        !overrideRequest.clientName || 
        !overrideRequest.originalPrice || 
        !overrideRequest.requestedPrice) {
      return NextResponse.json(
        { error: 'بيانات الطلب غير مكتملة' }, 
        { status: 400 }
      );
    }

    // Calculate discount details
    const discountAmount = overrideRequest.originalPrice - overrideRequest.requestedPrice;
    const discountPercentage = discountAmount / overrideRequest.originalPrice;

    // Validate discount limits (basic check)
    if (discountPercentage > 0.50) { // 50% max
      return NextResponse.json(
        { error: 'التخفيض المطلوب يتجاوز الحد الأقصى المسموح (50%)' }, 
        { status: 400 }
      );
    }

    // Prepare request data
    const requestData: PriceOverrideRequest = {
      ...overrideRequest,
      discountAmount,
      discountPercentage,
      requestedBy: session.user.email || '',
      requestedAt: new Date().toISOString(),
      status: 'pending',
      auditLog: [
        ...overrideRequest.auditLog,
        {
          action: 'request_created',
          user: session.user.email || '',
          timestamp: new Date().toISOString(),
          details: {
            originalPrice: overrideRequest.originalPrice,
            requestedPrice: overrideRequest.requestedPrice,
            discountPercentage: discountPercentage * 100
          }
        }
      ]
    };

    // Save to Firestore
    const docRef = await adminDb.collection('price_overrides').add(requestData);

    // Log the action
    await adminDb.collection('audit_log').add({
      action: 'override_request_created',
      entityType: 'price_override',
      entityId: docRef.id,
      userId: session.user.email,
      timestamp: new Date().toISOString(),
      details: {
        quoteId: overrideRequest.quoteId,
        clientName: overrideRequest.clientName,
        discountPercentage: discountPercentage * 100,
        riskLevel: overrideRequest.riskLevel
      }
    });

    return NextResponse.json({
      success: true,
      request: { id: docRef.id, ...requestData },
      message: 'تم إنشاء طلب التعديل بنجاح'
    });

  } catch (error) {
    console.error('Error creating override request:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في إنشاء طلب التعديل' }, 
      { status: 500 }
    );
  }
}

// GET: Retrieve override requests
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const riskLevel = searchParams.get('riskLevel');
    const dateRange = searchParams.get('dateRange');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = adminDb.collection('price_overrides')
      .orderBy('requestedAt', 'desc')
      .limit(limit);

    // Apply filters
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }

    if (riskLevel && riskLevel !== 'all') {
      query = query.where('riskLevel', '==', riskLevel);
    }

    // Date range filter
    if (dateRange && dateRange !== 'all') {
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

      query = query.where('requestedAt', '>=', startDate.toISOString());
    }

    const snapshot = await query.get();
    const requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Calculate summary stats
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      rejected: requests.filter(r => r.status === 'rejected').length,
      totalDiscountRequested: requests.reduce((sum, r) => sum + (r.discountAmount || 0), 0),
      averageDiscount: requests.length > 0 
        ? requests.reduce((sum, r) => sum + (r.discountPercentage || 0), 0) / requests.length 
        : 0
    };

    return NextResponse.json({
      requests,
      stats,
      total: requests.length
    });

  } catch (error) {
    console.error('Error fetching override requests:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل طلبات التعديل' }, 
      { status: 500 }
    );
  }
}
