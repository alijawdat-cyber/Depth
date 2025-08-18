import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
// Note: lazy import inside handler to capture module-load errors in try/catch

const BodySchema = z.object({ mode: z.enum(['full','rate-card','taxonomy','equipment']).optional().default('full') });

export async function POST(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as unknown as { role?: string })?.role;
    // Allow internal seeding via header when SEED_INTERNAL_KEY is set (dev/staging bootstrap)
    const seedKey = req.headers.get('x-seed-key');
    const internalKey = process.env.SEED_INTERNAL_KEY;
    const allowInternal = Boolean(internalKey && seedKey && internalKey === seedKey);
    if (!allowInternal) {
      if (!session?.user || role !== 'admin') {
        return NextResponse.json({ ok: false, code: 'UNAUTHORIZED', message: 'Admin only', requestId }, { status: 401 });
      }
    }

    const raw = await req.json().catch(() => ({}));
    const { mode } = BodySchema.parse(raw);
    const mod = await import('@/lib/catalog/seed');
    const result = await mod.seedCatalog(mode as 'full' | 'taxonomy' | 'rate-card' | 'equipment');
    return NextResponse.json({ ok: true, requestId, ...result });
  } catch (error) {
    console.error('[catalog.seed] error', { requestId, error });
    const msg = (error instanceof Error ? error.message : String(error)).slice(0, 300);
    return NextResponse.json({ ok: false, code: 'SERVER_ERROR', message: 'Failed to seed catalog', requestId, detail: msg }, { status: 500 });
  }
}


