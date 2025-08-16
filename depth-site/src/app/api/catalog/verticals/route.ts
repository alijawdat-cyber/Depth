import { NextResponse } from 'next/server';
import { getVerticals } from '@/lib/catalog/read';

export async function GET() {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const items = await getVerticals();
    return NextResponse.json({ success: true, requestId, items });
  } catch (error) {
    console.error('[catalog.verticals] error', { requestId, error });
    return NextResponse.json({ success: false, code: 'SERVER_ERROR', message: 'Failed to fetch verticals', requestId }, { status: 500 });
  }
}


