import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';
import { OverrideStats, PriceOverride } from '@/types/governance';
import { getActiveRateCard } from '@/lib/catalog/read';
import { extractGuardrailsConfig, checkMargins, validateOverride } from '@/lib/pricing/guardrails';
import type { RateCard } from '@/types/catalog';

// GET /api/pricing/overrides?status=
export async function GET(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || role !== 'admin') {
      return NextResponse.json({ success: false, code: 'UNAUTHORIZED', message: 'Admin access required', requestId }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = adminDb.collection('overrides').orderBy('createdAt', 'desc').limit(100);
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    const snapshot = await query.get();
    const overrides: PriceOverride[] = snapshot.docs.map((d) => {
      const data = d.data() as Omit<PriceOverride, 'id'>;
      return { id: d.id, ...data };
    });

    // Stats
    const stats: OverrideStats = overrides.reduce<OverrideStats>((acc, o) => {
      acc.total += 1;
      if (o.status === 'pending') acc.pending += 1;
      if (o.status === 'approved') acc.approved += 1;
      if (o.status === 'rejected') acc.rejected += 1;
      return acc;
    }, { pending: 0, approved: 0, rejected: 0, total: 0, avgChangePercent: 0 });
    if (overrides.length > 0) {
      stats.avgChangePercent = overrides.reduce((s, o) => s + (o.changePercent || 0), 0) / overrides.length;
    }

    return NextResponse.json({ success: true, requestId, overrides, stats });
  } catch (error) {
    console.error('[pricing.overrides] GET error', { requestId, error });
    return NextResponse.json({ success: false, code: 'SERVER_ERROR', message: 'Failed to fetch overrides', requestId }, { status: 500 });
  }
}

const UpdateSchema = z.object({
  id: z.string().min(1),
  action: z.enum(['approve', 'reject', 'counter']),
  counterPriceIQD: z.number().nonnegative().optional(),
  reason: z.string().optional()
});

// PUT /api/pricing/overrides { id, action, counterPriceIQD?, reason? }
export async function PUT(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || role !== 'admin') {
      return NextResponse.json({ success: false, code: 'UNAUTHORIZED', message: 'Admin access required', requestId }, { status: 401 });
    }

    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, code: 'VALIDATION_ERROR', message: 'بيانات غير صحيحة', errors: parsed.error.issues, requestId }, { status: 400 });
    }

    const { id, action, counterPriceIQD, reason } = parsed.data;
    const docRef = adminDb.collection('overrides').doc(id);
    const snap = await docRef.get();
    if (!snap.exists) {
      return NextResponse.json({ success: false, code: 'NOT_FOUND', message: 'الطلب غير موجود', requestId }, { status: 404 });
    }

    const override = { id: snap.id, ...(snap.data() as Omit<PriceOverride, 'id'>) } as PriceOverride;

    // Load active rate card for guardrails
    const rateCard = await getActiveRateCard();
    if (!rateCard) {
      return NextResponse.json({ success: false, code: 'NO_RATE_CARD', message: 'لا يوجد جدول أسعار نشط', requestId }, { status: 500 });
    }
    const guardrails = extractGuardrailsConfig(rateCard as RateCard);

    // Determine base price (currentPriceIQD acts as base here)
    const basePrice = override.currentPriceIQD;
    const targetPrice = action === 'counter' && typeof counterPriceIQD === 'number' ? counterPriceIQD : (action === 'approve' ? override.requestedPriceIQD : override.currentPriceIQD);

    // Cap check for approve/counter
    if (action === 'approve' || action === 'counter') {
      const capCheck = validateOverride(basePrice, targetPrice, guardrails);
      if (!capCheck.valid) {
        return NextResponse.json({ success: false, code: 'CAP_EXCEEDED', message: 'تجاوز الحد الأقصى للتعديل', warnings: capCheck.warnings, maxAllowed: capCheck.maxAllowed, requestId }, { status: 400 });
      }
    }

    // Margin check (needs estimated cost). If override carries cost, use it; else skip with warn.
    const estCost = (override as unknown as { estimatedCostIQD?: number }).estimatedCostIQD;
    if (estCost && (action === 'approve' || action === 'counter')) {
      const marginCheck = checkMargins(targetPrice, estCost, guardrails);
      if (marginCheck.status === 'hard_stop') {
        return NextResponse.json({ success: false, code: 'MARGIN_HARD_STOP', message: 'الهامش أقل من الحد الأدنى القاسي', warnings: marginCheck.warnings, requestId }, { status: 400 });
      }
    }

    const adminEmail = session.user?.email as string;
    const now = new Date().toISOString();
    const updatePayload: Partial<PriceOverride> = {
      updatedAt: now,
      adminResponse: {
        adminEmail,
        decision: action,
        counterPriceIQD: action === 'counter' ? counterPriceIQD : undefined,
        reason: reason || (action === 'approve' ? 'موافقة' : action === 'reject' ? 'رفض' : 'اقتراح بديل'),
        decidedAt: now
      }
    } as Partial<PriceOverride>;

    if (action === 'approve') updatePayload.status = 'approved';
    if (action === 'reject') updatePayload.status = 'rejected';
    if (action === 'counter') updatePayload.status = 'countered';

    await docRef.update(updatePayload);

    // Audit entry (optional collection)
    try {
      await adminDb.collection('audit').add({
        timestamp: now,
        action: action === 'approve' ? 'override_approve' : action === 'reject' ? 'override_reject' : 'override_counter',
        userId: adminEmail,
        userRole: 'admin',
        entityType: 'override',
        entityId: id,
        details: { reason: updatePayload.adminResponse?.reason, counterPriceIQD },
        metadata: { requestId }
      });
    } catch (e) {
      console.warn('[pricing.overrides] audit write failed', e);
    }

    const updated = await docRef.get();
    const updatedData = updated.data() as Omit<PriceOverride, 'id'>;
    return NextResponse.json({ success: true, requestId, override: { id, ...updatedData } });
  } catch (error) {
    console.error('[pricing.overrides] PUT error', { requestId, error });
    return NextResponse.json({ success: false, code: 'SERVER_ERROR', message: 'Failed to update override', requestId }, { status: 500 });
  }
}


