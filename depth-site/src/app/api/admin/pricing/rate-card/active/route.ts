import { NextResponse } from 'next/server';
import { getActiveRateCard } from '@/lib/catalog/read';

export async function GET() {
  try {
    const rateCard = await getActiveRateCard();
    return NextResponse.json({ ok: true, rateCard });
  } catch (error) {
    console.error('[rate-card.active.GET] error', error);
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 });
  }
}