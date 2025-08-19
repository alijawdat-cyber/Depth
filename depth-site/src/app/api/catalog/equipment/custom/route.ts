import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

// Accept custom equipment submission from a creator (pending_review)
const CustomEquipmentSchema = z.object({
  name: z.string().min(2),
  brand: z.string().min(1),
  model: z.string().optional().default(''),
  category: z.enum(['camera', 'lens', 'lighting', 'audio', 'accessory', 'special_setup']),
  description: z.string().optional().default(''),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']).default('good')
});

export async function POST(req: NextRequest) {
  const requestId = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, code: 'UNAUTHORIZED', message: 'Login required', requestId }, { status: 401 });
    }

    const body = await req.json();
    const data = CustomEquipmentSchema.parse(body);

    const docRef = adminDb.collection('equipment_custom_submissions').doc();
    const now = new Date().toISOString();
    const record = {
      ...data,
      userId: session.user.email.toLowerCase(),
      status: 'pending_review',
      createdAt: now,
      updatedAt: now,
      requestId
    };
    await docRef.set(record);

    return NextResponse.json({ success: true, requestId, data: { id: docRef.id } });
  } catch (error) {
    console.error('[public.catalog.equipment.custom] error', { requestId, error });
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, code: 'VALIDATION_ERROR', message: 'Invalid data', issues: error.issues, requestId }, { status: 400 });
    }
    return NextResponse.json({ success: false, code: 'SERVER_ERROR', message: 'Failed to submit custom equipment', requestId }, { status: 500 });
  }
}
