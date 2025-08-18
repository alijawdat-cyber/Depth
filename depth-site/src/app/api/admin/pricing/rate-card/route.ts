import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';
import { getActiveRateCard } from '@/lib/catalog/read';

// Minimal endpoints used by UI
export async function GET() {
  try {
    const rateCard = await getActiveRateCard();
    return NextResponse.json({ ok: true, rateCard });
  } catch (error) {
    console.error('[rate-card.GET] error', error);
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = await req.json();
    const rateCard = body?.rateCard as { id?: string; version?: string; versionId?: string; status?: string } | undefined;
    if (!rateCard) {
      return NextResponse.json({ ok: false, error: 'INVALID_BODY' }, { status: 400 });
    }

    const id = (rateCard as { versionId?: string }).versionId || (rateCard as { id?: string }).id || 'active';
    const docRef = adminDb.collection('pricing_rate_card').doc(id);
    await docRef.set({ ...rateCard, updatedAt: new Date() }, { merge: true });

    return NextResponse.json({ ok: true, rateCard: { ...rateCard, versionId: id } });
  } catch (error) {
    console.error('[rate-card.PUT] error', error);
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 });
  }
}

interface RateCardItem {
  id: string;
  category: string;
  subcategory: string;
  processing: string;
  basePrice: number;
  creatorCost: {
    T1: number;
    T2: number;
    T3: number;
  };
  margin: number;
  priceFloor: number;
  lastUpdated: string;
  updatedBy: string;
}

interface RateCardVersion {
  id?: string;
  version: string;
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  createdBy: string;
  items: RateCardItem[];
  guardrails: unknown;
  notes?: string;
}

// PUT: Update rate card (legacy rate_cards collection) - unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function PUT_LEGACY(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { rateCard }: { rateCard: RateCardVersion } = body;

    if (!rateCard || !rateCard.items || !Array.isArray(rateCard.items)) {
      return NextResponse.json(
        { error: 'بيانات جدول الأسعار غير صالحة' }, 
        { status: 400 }
      );
    }

    // If activating new version, archive current active version
    if (rateCard.status === 'active') {
      const activeSnapshot = await adminDb
        .collection('rate_cards')
        .where('status', '==', 'active')
        .get();

      const batch = adminDb.batch();
      activeSnapshot.docs.forEach(doc => {
        batch.update(doc.ref, { 
          status: 'archived',
          archivedAt: new Date().toISOString(),
          archivedBy: session.user.email
        });
      });
      await batch.commit();
    }

    // Generate new version number if not provided
    if (!rateCard.version) {
      const latestSnapshot = await adminDb
        .collection('rate_cards')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

      let versionNumber = 1;
      if (!latestSnapshot.empty) {
        const latestVersion = latestSnapshot.docs[0].data().version;
        const match = latestVersion.match(/v(\d+)/);
        if (match) {
          versionNumber = parseInt(match[1]) + 1;
        }
      }
      rateCard.version = `v${versionNumber}`;
    }

    // Prepare rate card data
    const userEmail = session.user.email ?? 'unknown';
    const rateCardData = {
      ...rateCard,
      updatedAt: new Date().toISOString(),
      updatedBy: userEmail,
      items: rateCard.items.map(item => ({
        ...item,
        lastUpdated: new Date().toISOString(),
        updatedBy: userEmail
      }))
    };

    // Save to Firestore
    let docRef;
    if (rateCard.id) {
      // Update existing
      docRef = adminDb.collection('rate_cards').doc(rateCard.id);
      await docRef.update(rateCardData);
    } else {
      // Create new
      rateCardData.createdAt = new Date().toISOString();
      rateCardData.createdBy = userEmail;
      docRef = await adminDb.collection('rate_cards').add(rateCardData);
    }

    // Log the action
    await adminDb.collection('audit_log').add({
      action: rateCard.id ? 'rate_card_updated' : 'rate_card_created',
      entityType: 'rate_card',
      entityId: docRef.id,
      userId: userEmail,
      timestamp: new Date().toISOString(),
      details: {
        version: rateCard.version,
        status: rateCard.status,
        itemsCount: rateCard.items.length
      }
    });

    return NextResponse.json({
      success: true,
      rateCard: { id: docRef.id, ...rateCardData },
      message: rateCard.status === 'active' ? 'تم تفعيل جدول الأسعار' : 'تم حفظ جدول الأسعار'
    });

  } catch (error) {
    console.error('Error updating rate card:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حفظ جدول الأسعار' }, 
      { status: 500 }
    );
  }
}

// GET: Retrieve rate cards (legacy rate_cards collection) - unused
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function GET_LEGACY(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');

    let query = adminDb.collection('rate_cards')
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    const rateCards = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      rateCards,
      total: rateCards.length
    });

  } catch (error) {
    console.error('Error fetching rate cards:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل جداول الأسعار' }, 
      { status: 500 }
    );
  }
}
