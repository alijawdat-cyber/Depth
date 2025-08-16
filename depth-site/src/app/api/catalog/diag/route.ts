import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { env } from '@/lib/env';

export async function GET() {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const checks: Record<string, unknown> = {
      hasProjectId: Boolean(env.FIREBASE_PROJECT_ID),
      hasClientEmail: Boolean(env.FIREBASE_CLIENT_EMAIL),
      privateKeyLen: (env.FIREBASE_PRIVATE_KEY || '').length,
    };

    // Try a lightweight read from Firestore
    const snap = await adminDb.collection('health').limit(1).get().catch((e: unknown) => ({ error: e })) as { error?: unknown; size?: number };
    if ('error' in snap) {
      checks.firestore = { ok: false, error: String((snap as { error: unknown }).error).slice(0, 300) };
    } else {
      checks.firestore = { ok: true, count: snap.size };
    }

    return NextResponse.json({ ok: true, requestId, checks });
  } catch (error) {
    return NextResponse.json({ ok: false, requestId, code: 'DIAG_ERROR', message: String(error).slice(0, 500) }, { status: 500 });
  }
}


