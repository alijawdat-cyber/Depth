import { NextResponse } from 'next/server';
import { getActiveRateCard } from '@/lib/catalog/read';

export async function GET() {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const rateCard = await getActiveRateCard();
    if (!rateCard) {
      return NextResponse.json({ success: true, requestId, rateCard: null });
    }
    return NextResponse.json({ success: true, requestId, rateCard });
  } catch (error) {
    console.error('[pricing.rate-card.active] error', { requestId, error });
    return NextResponse.json({ success: false, code: 'SERVER_ERROR', message: 'Failed to fetch active rate card', requestId }, { status: 500 });
  }
}


