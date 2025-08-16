import { NextRequest, NextResponse } from 'next/server';
import { getSubcategories } from '@/lib/catalog/read';

export async function GET(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const items = await getSubcategories(categoryId);
    return NextResponse.json({ success: true, requestId, items });
  } catch (error) {
    console.error('[catalog.subcategories] error', { requestId, error });
    return NextResponse.json({ success: false, code: 'SERVER_ERROR', message: 'Failed to fetch subcategories', requestId }, { status: 500 });
  }
}


