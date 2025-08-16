// API endpoint لتقييم المبدعين - متوافق مع docs/catalog/04-Admin-Evaluation-Form.md
// الغرض: حفظ تقييمات الإدارة وحساب النقاط والدرجات

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase/admin';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

interface AdminEvaluation {
  qualityAssessment: {
    score: number;
    weight: 0.40;
    criteria: {
      technicalSkill: number;
      creativity: number;
      consistency: number;
      attentionToDetail: number;
    };
    portfolioReview: {
      overallRating: number;
      bestSamples: string[];
      improvementAreas: string[];
    };
    notes: string;
  };
  speedAssessment: {
    score: number;
    weight: 0.25;
    criteria: {
      deliveryTime: number;
      responsiveness: number;
      efficiency: number;
    };
    slaPerformance: {
      standardSLA: number;
      rushSLA: number;
      averageDelivery: number;
      onTimePercentage: number;
    };
    notes: string;
  };
  reliabilityAssessment: {
    score: number;
    weight: 0.20;
    criteria: {
      punctuality: number;
      communication: number;
      professionalism: number;
      consistency: number;
    };
    trackRecord: {
      completedProjects: number;
      cancelledProjects: number;
      clientFeedback: number;
    };
    notes: string;
  };
  complianceAssessment: {
    score: number;
    weight: 0.15;
    criteria: {
      ndaCompliance: boolean;
      equipmentCompliance: boolean;
      clinicsTraining: boolean;
      safetyProtocols: number;
    };
    certifications: {
      required: string[];
      completed: string[];
      pending: string[];
    };
    notes: string;
  };
  totalScore: number;
  tier: 'T1' | 'T2' | 'T3';
  recommendation: 'approve' | 'reject' | 'conditional_approve';
  conditions?: string[];
  evaluatedBy: string;
  evaluatedAt: string;
  reviewNotes: string;
}

// PUT: Save creator evaluation
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: creatorId } = await params;
    const body = await request.json();
    const { evaluation, status = 'evaluated', updateTier = false }: {
      evaluation: AdminEvaluation;
      status?: string;
      updateTier?: boolean;
    } = body;

    // Validate evaluation data
    if (!evaluation || typeof evaluation.totalScore !== 'number') {
      return NextResponse.json(
        { error: 'بيانات التقييم غير صالحة' }, 
        { status: 400 }
      );
    }

    // Check if creator exists
    const creatorDoc = await adminDb.collection('creators').doc(creatorId).get();
    if (!creatorDoc.exists) {
      return NextResponse.json(
        { error: 'المبدع غير موجود' }, 
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {
      evaluation: {
        ...evaluation,
        evaluatedBy: session.user.email,
        evaluatedAt: new Date().toISOString()
      },
      updatedAt: new Date().toISOString(),
      updatedBy: session.user.email
    };

    // Update status if provided
    if (status) {
      updateData.status = status;
    }

    // Update tier and score if evaluation is complete
    if (updateTier) {
      updateData.score = Math.round(evaluation.totalScore);
      updateData.tier = evaluation.tier;

      // Determine final status based on recommendation
      if (evaluation.recommendation === 'approve') {
        updateData.status = 'approved';
      } else if (evaluation.recommendation === 'reject') {
        updateData.status = 'rejected';
      } else if (evaluation.recommendation === 'conditional_approve') {
        updateData.status = 'conditional_approved';
      }
    }

    // Update creator document
    await adminDb.collection('creators').doc(creatorId).update(updateData);

    // Log the evaluation
    await adminDb.collection('audit_log').add({
      action: 'creator_evaluated',
      entityType: 'creator',
      entityId: creatorId,
      userId: session.user.email,
      timestamp: new Date().toISOString(),
      details: {
        totalScore: evaluation.totalScore,
        tier: evaluation.tier,
        recommendation: evaluation.recommendation,
        finalStatus: updateData.status
      }
    });

    // If approved, update rate card with internal costs
    if (updateTier && evaluation.recommendation === 'approve') {
      try {
        await updateRateCardWithCreatorCosts(creatorId, evaluation.tier);
      } catch (error) {
        console.warn('Failed to update rate card with creator costs:', error);
        // Don't fail the evaluation if rate card update fails
      }
    }

    return NextResponse.json({
      success: true,
      message: updateTier ? 'تم إكمال التقييم وتحديث الدرجة' : 'تم حفظ التقييم',
      evaluation: updateData.evaluation,
      finalStatus: updateData.status
    });

  } catch (error) {
    console.error('Error saving creator evaluation:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في حفظ التقييم' }, 
      { status: 500 }
    );
  }
}

// GET: Retrieve creator evaluation
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: creatorId } = await params;

    // Get creator document
    const doc = await adminDb.collection('creators').doc(creatorId).get();
    
    if (!doc.exists) {
      return NextResponse.json(
        { error: 'المبدع غير موجود' }, 
        { status: 404 }
      );
    }

    const creatorData = { id: doc.id, ...doc.data() } as { id: string; evaluation?: AdminEvaluation; [key: string]: unknown };

    return NextResponse.json({
      creator: creatorData,
      evaluation: creatorData.evaluation || null
    });

  } catch (error) {
    console.error('Error fetching creator evaluation:', error);
    return NextResponse.json(
      { error: 'فشل في تحميل البيانات' }, 
      { status: 500 }
    );
  }
}

// Helper function to update rate card with creator internal costs
async function updateRateCardWithCreatorCosts(creatorId: string, tier: 'T1' | 'T2' | 'T3') {
  try {
    // Get creator data
    const creatorDoc = await adminDb.collection('creators').doc(creatorId).get();
    if (!creatorDoc.exists) return;

    const creatorData = creatorDoc.data();
    const internalCosts = creatorData?.intakeForm?.internalCost;

    if (!internalCosts || Object.keys(internalCosts).length === 0) {
      return; // No internal costs to add
    }

    // Get active rate card
    const rateCardSnapshot = await adminDb
      .collection('rate_cards')
      .where('status', '==', 'active')
      .limit(1)
      .get();

    if (rateCardSnapshot.empty) {
      console.warn('No active rate card found');
      return;
    }

    const rateCardDoc = rateCardSnapshot.docs[0];
    const rateCardData = rateCardDoc.data();

    // Update creator costs in rate card
    const updatedRateCard = {
      ...rateCardData,
      creatorCosts: {
        ...rateCardData.creatorCosts,
        [creatorId]: {
          tier,
          costs: internalCosts,
          updatedAt: new Date().toISOString()
        }
      },
      updatedAt: new Date().toISOString()
    };

    await adminDb.collection('rate_cards').doc(rateCardDoc.id).update(updatedRateCard);

    // Log the rate card update
    await adminDb.collection('audit_log').add({
      action: 'rate_card_creator_added',
      entityType: 'rate_card',
      entityId: rateCardDoc.id,
      userId: 'system',
      timestamp: new Date().toISOString(),
      details: {
        creatorId,
        tier,
        costsAdded: Object.keys(internalCosts).length
      }
    });

  } catch (error) {
    console.error('Error updating rate card with creator costs:', error);
    throw error;
  }
}
