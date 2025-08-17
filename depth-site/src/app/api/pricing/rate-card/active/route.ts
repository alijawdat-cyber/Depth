import { NextResponse } from 'next/server';
import { getActiveRateCard } from '@/lib/catalog/read';

// GET /api/pricing/rate-card/active
export async function GET() {
  try {
    const rateCard = await getActiveRateCard();
    if (!rateCard) {
      return NextResponse.json({ ok: false, error: 'NO_ACTIVE_RATE_CARD' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, rateCard });
  } catch (error) {
    console.error('[rate-card.active] error', error);
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 });
  }
}