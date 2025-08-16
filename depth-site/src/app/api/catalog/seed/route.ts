import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { seedCatalog, type SeedMode } from '@/lib/catalog/seed';

const BodySchema = z.object({ mode: z.enum(['full','rate-card','taxonomy']).optional().default('full') });

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
    const result = await seedCatalog(mode as SeedMode);
    return NextResponse.json({ ok: true, requestId, ...result });
  } catch (error) {
    console.error('[catalog.seed] error', { requestId, error });
    return NextResponse.json({ ok: false, code: 'SERVER_ERROR', message: 'Failed to seed catalog', requestId }, { status: 500 });
  }
}


