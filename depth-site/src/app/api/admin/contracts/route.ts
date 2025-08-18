import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/admin/contracts
 * 
 * جلب جميع العقود مع إمكانية الفلترة
 * Auth: admin only
 */
export async function GET() {
  const requestId = crypto.randomUUID();
  
  try {
    // التحقق من المصادقة والصلاحيات
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'غير مصرح - تسجيل الدخول مطلوب', requestId },
        { status: 401 }
      );
    }

    const userRole = (session.user as { role?: string }).role || 'client';
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'غير مصرح - صلاحية admin مطلوبة', requestId },
        { status: 403 }
      );
    }

    // بيانات وهمية للـ MVP
    const mockContracts = [
      {
        id: '1',
        type: 'sow',
        status: 'draft',
        title: 'SOW - مشروع التصوير الطبي',
        clientId: 'client1',
        clientName: 'عيادة الأمل',
        clientEmail: 'info@alamal-clinic.com',
        projectId: 'project1',
        value: 5000000,
        currency: 'IQD',
        createdAt: new Date().toISOString(),
        content: {
          deliverables: [
            {
              id: '1',
              title: 'تصوير المنتجات',
              description: 'تصوير احترافي للمنتجات الطبية',
              category: 'photography',
              processing: 'premium',
              quantity: 10,
              unitPrice: 500000,
              totalPrice: 5000000,
              sla: '72 ساعة'
            }
          ]
        }
      }
    ];

    return NextResponse.json({
      success: true,
      requestId,
      contracts: mockContracts
    });

  } catch (error) {
    console.error(`[contracts-get] ${requestId} - Error:`, error);
    
    return NextResponse.json(
      { 
        error: 'خطأ في جلب العقود', 
        requestId 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/contracts
 */
export async function POST(req: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'غير مصرح - تسجيل الدخول مطلوب', requestId },
        { status: 401 }
      );
    }

    const body = await req.json();

    const contract = {
      id: Math.random().toString(36).substring(7),
      ...body,
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      requestId,
      contract
    }, { status: 201 });

  } catch (error) {
    console.error(`[contracts-create] ${requestId} - Error:`, error);
    
    return NextResponse.json(
      { 
        error: 'خطأ في إنشاء العقد', 
        requestId 
      },
      { status: 500 }
    );
  }
}