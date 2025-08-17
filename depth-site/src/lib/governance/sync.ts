// دالة توحيد ومزامنة بُنى الحوكمة مع النظام التشغيلي
import { adminDb } from '@/lib/firebase/admin';
import { RateCardVersion } from '@/types/governance';
import { RateCard } from '@/types/catalog';

/**
 * تحويل بنية RateCardVersion (governance) إلى RateCard (catalog/pricing)
 */
export function convertGovernanceToOperational(governanceVersion: RateCardVersion): RateCard {
  const { rateCard } = governanceVersion;
  
  // تحويل البُنى المختلفة
  const operationalRateCard: RateCard = {
    versionId: governanceVersion.versionId,
    status: governanceVersion.status as 'active' | 'archived' | 'draft',
    effectiveFrom: governanceVersion.effectiveFrom,
    
    // تحويل baseRates → basePricesIQD
    basePricesIQD: rateCard.baseRates,
    
    // تحويل modifiers.verticals → verticalModifiers  
    verticalModifiers: rateCard.modifiers?.verticals || {},
    
    // تحويل modifiers.processing → processingLevels
    processingLevels: {
      raw_only: rateCard.modifiers?.processing?.raw_only || -0.10,
      raw_basic: rateCard.modifiers?.processing?.raw_basic || 0.00,
      full_retouch: rateCard.modifiers?.processing?.full_retouch || 0.35
    },
    
    // معاملات افتراضية من النظام الحالي
    modifiers: {
      rushPct: 0.20, // افتراضي 20%
      creatorTierPct: { T1: 0.00, T2: 0.05, T3: 0.10 },
      rawPct: -0.10,
      retouchMinPct: 0.30,
      retouchMaxPct: 0.40
    },
    
    // إعدادات الحماية الافتراضية
    guardrails: {
      minMarginDefault: 0.50,
      minMarginHardStop: 0.45
    },
    
    // تقريب افتراضي
    roundingIQD: 250,
    
    // سياسة FX
    fxPolicy: {
      mode: 'manual' as const,
      lastRate: rateCard.fx?.rate || 1500,
      lastDate: rateCard.fx?.updatedAt || new Date().toISOString(),
      source: rateCard.fx?.source || 'manual'
    },
    
    // إضافة تواريخ التحديث
    createdAt: governanceVersion.createdAt,
    updatedAt: new Date().toISOString()
  };
  
  return operationalRateCard;
}

/**
 * مزامنة إصدار الحوكمة النشط إلى pricing_rate_card
 */
export async function syncGovernanceToOperational(governanceVersionId: string): Promise<{
  success: boolean;
  operationalVersionId?: string;
  error?: string;
}> {
  try {
    // قراءة إصدار الحوكمة
    const governanceDoc = await adminDb
      .collection('governance_versions')
      .doc(governanceVersionId)
      .get();
      
    if (!governanceDoc.exists) {
      return { success: false, error: 'إصدار الحوكمة غير موجود' };
    }
    
    const governanceVersion = { 
      id: governanceDoc.id, 
      ...governanceDoc.data() 
    } as RateCardVersion;
    
    if (governanceVersion.status !== 'active') {
      return { success: false, error: 'يمكن مزامنة الإصدارات النشطة فقط' };
    }
    
    // تحويل البنية
    const operationalRateCard = convertGovernanceToOperational(governanceVersion);
    
    // أرشفة النسخة النشطة الحالية في pricing_rate_card
    const activeQuery = await adminDb
      .collection('pricing_rate_card')
      .where('status', '==', 'active')
      .get();
      
    const batch = adminDb.batch();
    
    activeQuery.forEach(doc => {
      batch.update(doc.ref, { 
        status: 'archived',
        updatedAt: new Date().toISOString()
      });
    });
    
    // إنشاء/تحديث الإصدار الجديد
    const operationalRef = adminDb
      .collection('pricing_rate_card')
      .doc(operationalRateCard.versionId);
      
    batch.set(operationalRef, operationalRateCard, { merge: true });
    
    // تنفيذ المعاملة
    await batch.commit();
    
    console.log(`[governance-sync] Synced version ${governanceVersion.versionId} to operational`);
    
    return {
      success: true,
      operationalVersionId: operationalRateCard.versionId
    };
    
  } catch (error) {
    console.error('[governance-sync] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'خطأ غير معروف'
    };
  }
}

/**
 * مزامنة عكسية: تحويل pricing_rate_card النشط إلى governance format
 * لاستخدامها في "استخدام التسعير الحالي كأساس"
 */
export async function loadCurrentOperationalAsGovernanceBase(): Promise<{
  success: boolean;
  rateCard?: RateCardVersion['rateCard'];
  error?: string;
}> {
  try {
    const activeQuery = await adminDb
      .collection('pricing_rate_card')
      .where('status', '==', 'active')
      .limit(1)
      .get();
      
    if (activeQuery.empty) {
      return { success: false, error: 'لا يوجد تسعير نشط حالياً' };
    }
    
    const operationalDoc = activeQuery.docs[0];
    const operational = operationalDoc.data() as RateCard;
    
    // تحويل عكسي للبنية
    const governanceRateCard: RateCardVersion['rateCard'] = {
      baseRates: operational.basePricesIQD || {},
      modifiers: {
        verticals: operational.verticalModifiers || {},
        processing: {
          raw_only: operational.processingLevels?.raw_only || -0.10,
          raw_basic: operational.processingLevels?.raw_basic || 0.00,
          full_retouch: Array.isArray(operational.processingLevels?.full_retouch) 
            ? (operational.processingLevels.full_retouch[0] + operational.processingLevels.full_retouch[1]) / 2
            : (operational.processingLevels?.full_retouch as number) || 0.35
        },
        conditions: {}
      },
      fx: {
        rate: operational.fxPolicy?.lastRate || 1500,
        source: operational.fxPolicy?.source || 'manual',
        updatedAt: operational.fxPolicy?.lastDate || new Date().toISOString()
      }
    };
    
    return {
      success: true,
      rateCard: governanceRateCard
    };
    
  } catch (error) {
    console.error('[governance-sync] Load current operational error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'خطأ في تحميل التسعير الحالي'
    };
  }
}
