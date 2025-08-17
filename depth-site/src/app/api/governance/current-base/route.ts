import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { loadCurrentOperationalAsGovernanceBase } from '@/lib/governance/sync';

/**
 * GET /api/governance/current-base
 * تحميل التسعير الحالي كأساس لإنشاء إصدار جديد
 */
export async function GET() {
  try {
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string })?.role !== 'admin') {
      return NextResponse.json(
        { error: 'غير مصرح لك بالوصول' },
        { status: 401 }
      );
    }

    const result = await loadCurrentOperationalAsGovernanceBase();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        rateCard: result.rateCard
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'فشل في تحميل التسعير الحالي' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('[governance/current-base] GET error:', error);
    return NextResponse.json(
      { error: 'خطأ في تحميل التسعير الحالي' },
      { status: 500 }
    );
  }
}
