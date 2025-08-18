import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase/admin';
import { RateCardVersion, VersionChange, VersionDiff, VersionDiffResponse } from '@/types/governance';

const DiffSchema = z.object({
  fromVersionId: z.string().min(1),
  toVersionId: z.string().min(1)
});

function diffNumericMaps(
  prev: Record<string, number> | undefined,
  next: Record<string, number> | undefined,
  type: VersionChange['type'],
  fieldName: 'subcategoryId' | 'vertical' | 'processing' | 'condition'
): VersionChange[] {
  const changes: VersionChange[] = [];
  const keys = new Set<string>([...Object.keys(prev || {}), ...Object.keys(next || {})]);
  for (const key of keys) {
    const oldValue = (prev || {})[key];
    const newValue = (next || {})[key];
    if (typeof oldValue === 'number' && typeof newValue === 'number' && oldValue !== newValue) {
      const changePercent = oldValue === 0 ? 100 : ((newValue - oldValue) / Math.abs(oldValue)) * 100;
      changes.push({
        type,
        [fieldName]: key,
        oldValue,
        newValue,
        changePercent
      });
    }
  }
  return changes;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string })?.role !== 'admin') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });
    }

    const body = await request.json();
    const { fromVersionId, toVersionId } = DiffSchema.parse(body);

    const [fromSnap, toSnap] = await Promise.all([
      adminDb.collection('governance_versions').doc(fromVersionId).get().then((d) => (d.exists ? { id: d.id, ...d.data() } as RateCardVersion : null)),
      adminDb.collection('governance_versions').doc(toVersionId).get().then((d) => (d.exists ? { id: d.id, ...d.data() } as RateCardVersion : null))
    ]);

    if (!fromSnap || !toSnap) {
      return NextResponse.json({ error: 'Version not found' }, { status: 404 });
    }

    const fromRC = fromSnap.rateCard;
    const toRC = toSnap.rateCard;

    const baseChanges = diffNumericMaps(fromRC.baseRates, toRC.baseRates, 'base_rate', 'subcategoryId');
    const verticalChanges = diffNumericMaps(fromRC.modifiers?.verticals, toRC.modifiers?.verticals, 'modifier', 'vertical');
    const processingChanges = diffNumericMaps(fromRC.modifiers?.processing, toRC.modifiers?.processing, 'modifier', 'processing');
    const conditionChanges = diffNumericMaps(fromRC.modifiers?.conditions, toRC.modifiers?.conditions, 'modifier', 'condition');

    const fxChanges: VersionChange[] = [];
    if (fromRC.fx?.rate !== toRC.fx?.rate) {
      const oldValue = fromRC.fx?.rate ?? 0;
      const newValue = toRC.fx?.rate ?? 0;
      const changePercent = oldValue === 0 ? 100 : ((newValue - oldValue) / Math.abs(oldValue)) * 100;
      fxChanges.push({ type: 'fx_rate', oldValue, newValue, changePercent });
    }

    const changes = [...baseChanges, ...verticalChanges, ...processingChanges, ...conditionChanges, ...fxChanges];

    const summary = {
      totalChanges: changes.length,
      increasedCount: changes.filter(c => c.newValue > c.oldValue).length,
      decreasedCount: changes.filter(c => c.newValue < c.oldValue).length,
      avgChangePercent: changes.length ? changes.reduce((s, c) => s + c.changePercent, 0) / changes.length : 0
    };

    const diff: VersionDiff = {
      versionFrom: fromSnap.versionId,
      versionTo: toSnap.versionId,
      changes,
      summary
    };

    const response: VersionDiffResponse = {
      diff,
      fromVersion: fromSnap,
      toVersion: toSnap
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'بيانات غير صحيحة', details: error.issues.map(i => i.message) }, { status: 400 });
    }
    console.error('[governance/versions/diff] error', error);
    return NextResponse.json({ error: 'خطأ داخلي' }, { status: 500 });
  }
}


