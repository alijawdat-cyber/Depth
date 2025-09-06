import { Creator, ProjectRequest, SalariedEmployee } from '@/data/types';
import { getSubcategoryBasePrice, calculateLineItemPrice, roundToNearest500 } from '@/data/calculations';

export type TeamType = 'freelance' | 'salaried' | 'both';

export interface MatchResult {
  id: string;
  kind: 'freelance' | 'salaried';
  name: string;
  rating?: number;
  completedProjects?: number;
  city?: string;
  experienceLevel?: Creator['experienceLevel'];
  equipmentTier?: Creator['equipmentTier'];
  isAvailable?: boolean;
  estCreatorRate: number; // تقدير تقريبي لسعر المبدع للوحدة (IQD)
  matchScore: number; // 0-100
  reasons: string[];
}

// استخراج تخصص الطلب من الفئة الفرعية → فئة عليا (photo|video|design|editing)
const subcategoryToSpecialty = (request: ProjectRequest): 'photo' | 'video' | 'design' | 'editing' | null => {
  const cid = request.categoryId;
  switch (cid) {
    case 'cat_photo': return 'photo';
    case 'cat_video': return 'video';
    case 'cat_design': return 'design';
    case 'cat_editing': return 'editing';
    default: return null;
  }
};

// تقدير سريع لكلفة المبدع للوحدة الواحدة اعتماداً على المتطلبات
export const estimateCreatorUnitRate = (request: ProjectRequest, creator: Pick<Creator, 'experienceLevel' | 'equipmentTier' | 'hasOwnEquipment'>): number => {
  const firstItem = request.items?.[0];
  const subId = request.subcategoryId ?? firstItem?.subcategoryId;
  if (!subId) return 0;
  const base = getSubcategoryBasePrice(subId) || 0;
  const processingKey = request.processingLevel ?? firstItem?.processingLevel ?? 'basic';
  const experienceKey = creator.experienceLevel;
  const equipmentKey = creator.equipmentTier;
  const rushKey = request.isRush ? 'rush' : 'normal';
  const ownershipKey = creator.hasOwnEquipment ? 'owned' : 'agency_equipment';
  const locationKey = request.location;
  const { unitCreatorPrice } = calculateLineItemPrice(base, 1, processingKey, experienceKey, equipmentKey, rushKey, ownershipKey, locationKey);
  return roundToNearest500(unitCreatorPrice);
};

// حساب درجة المطابقة وأسبابها
export const calculateMatchScore = (request: ProjectRequest, candidate: Creator | SalariedEmployee): MatchResult => {
  const specialty = subcategoryToSpecialty(request);
  const reasons: string[] = [];
  let score = 0;
  const reqDate = new Date(request.preferredDeliveryDate);
  const daysMap: Array<'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'> = ['sun','mon','tue','wed','thu','fri','sat'];
  const dIdx = reqDate.getUTCDay();
  const reqDay = ((): 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' => {
    const val = daysMap[dIdx];
    return val === 'sat' ? 'sat' : val;
  })();

  type Candidate = Creator | SalariedEmployee;
  const isCreator = (c: Candidate): c is Creator => (c as Creator).specialties !== undefined;
  const isSalaried = (c: Candidate): c is SalariedEmployee => 'department' in c && !('specialties' in c);

  let estCreatorRate = 0;

  if (isCreator(candidate)) {
    // تخصص
    if (specialty && candidate.specialties.includes(specialty)) {
      score += 40; reasons.push('تخصص مطابق');
    }
    // خبرة
    switch (candidate.experienceLevel) {
      case 'expert': score += 20; reasons.push('خبرة عالية'); break;
      case 'experienced': score += 12; reasons.push('خبرة جيدة'); break;
      case 'fresh': score += 4; reasons.push('مبتدئ'); break;
    }
    // معدات
    if (candidate.equipmentTier === 'platinum') { score += 8; reasons.push('معدات بلاتينية'); }
    else if (candidate.equipmentTier === 'gold') { score += 5; reasons.push('معدات ذهبية'); }
    else { score += 2; reasons.push('معدات أساسية'); }
    // تقييم
    if (candidate.rating >= 4.8) { score += 12; reasons.push('تقييم ممتاز'); }
    else if (candidate.rating >= 4.5) { score += 9; reasons.push('تقييم عالي'); }
    else if (candidate.rating >= 4.0) { score += 6; reasons.push('تقييم جيد'); }
    // توفر
  if (candidate.isAvailable && candidate.onboardingStatus === 'approved') { score += 10; reasons.push('متاح وموافق'); }
  // التعارض بالتاريخ
  const busy = candidate.availability?.busyDates || [];
  const daysOff = candidate.availability?.daysOff || [];
  const availableFrom = candidate.availability?.availableFrom ? new Date(candidate.availability.availableFrom) : null;
  const reqDateIso = request.preferredDeliveryDate.slice(0,10);
  if (busy.includes(reqDateIso)) { score -= 20; reasons.push('تعارض بتاريخ التسليم'); }
  if (daysOff.includes(reqDay)) { score -= 8; reasons.push('يوم إجازة'); }
  if (availableFrom && availableFrom > reqDate) { score -= 12; reasons.push('غير متاح قبل الموعد'); }
    // موقع (تقريبياً: إذا نفس المدينة ضمن بغداد)
    if (candidate.location?.city === 'بغداد' && request.location !== 'far') { score += 4; reasons.push('قرب مكاني'); }

    // ميزانية: إذا التقدير أقل من السقف، نكافئ، وإذا أعلى نعاقب قليلاً
    estCreatorRate = estimateCreatorUnitRate(request, candidate);
    if (request.budget?.max && estCreatorRate <= request.budget.max) { score += 6; reasons.push('ضمن الميزانية'); }
    else { score -= 6; reasons.push('فوق الميزانية'); }

    // استعجال
    if (request.isRush) {
      if (candidate.equipmentTier !== 'silver') { score += 4; reasons.push('يدعم الاستعجال'); }
      else { score -= 3; reasons.push('غير مناسب للاستعجال'); }
    }

    // تقليم الحدود
    score = Math.max(0, Math.min(100, score));

    return {
      id: candidate.id,
      kind: 'freelance',
      name: candidate.displayName || candidate.fullName,
      rating: candidate.rating,
      completedProjects: candidate.completedProjects,
      city: candidate.location?.city,
      experienceLevel: candidate.experienceLevel,
      equipmentTier: candidate.equipmentTier,
      isAvailable: candidate.isAvailable,
      estCreatorRate,
      matchScore: score,
      reasons,
    };
  }

  if (isSalaried(candidate)) {
    // الموظف: نعتبر كلفة المبدع المباشرة 0 (داخلي) ونكافئ التخصص حسب القسم
    const deptMap: Record<string, 'photo' | 'video' | 'design' | 'editing' | null> = {
      photography: 'photo', videography: 'video', design: 'design', editing: 'editing', admin: null,
    };
    const dept = deptMap[candidate.department] ?? null;
    if (specialty && dept && specialty === dept) { score += 40; reasons.push('تخصص مناسب (موظف)'); }
    // فعالية داخلية
    score += 15; reasons.push('موارد داخلية');
    // نشاط
  if (candidate.isActive) { score += 10; reasons.push('نشط ومتواجد'); }
  // التعارض بالتاريخ للموظف
  const busy = candidate.availability?.busyDates || [];
  const daysOff = candidate.availability?.daysOff || [];
  const availableFrom = candidate.availability?.availableFrom ? new Date(candidate.availability.availableFrom) : null;
  const reqDateIso = request.preferredDeliveryDate.slice(0,10);
  if (busy.includes(reqDateIso)) { score -= 15; reasons.push('مشغول بالموعد'); }
  if (daysOff.includes(reqDay)) { score -= 6; reasons.push('إجازة موظف'); }
  if (availableFrom && availableFrom > reqDate) { score -= 8; reasons.push('يتوفر بعد الموعد'); }
    // تقدير الكلفة 0 للمقارنة (الدفع خارجياً غير لازم)
    estCreatorRate = 0;
    // ميزانية دائماً مناسبة
    score += 6; reasons.push('لا تكلفة إضافية');
    // تقليم
    score = Math.max(0, Math.min(100, score));
    return {
      id: candidate.id,
      kind: 'salaried',
      name: candidate.fullName,
      estCreatorRate,
      matchScore: score,
      reasons,
    };
  }

  // fallback الآمن: نقرأ حقول مشتركة متاحة في النوعين
  return {
    id: 'id' in candidate ? (candidate as Creator).id || (candidate as SalariedEmployee).id : 'unknown',
    kind: 'freelance',
    name: 'fullName' in candidate ? (candidate as Creator).fullName || (candidate as SalariedEmployee).fullName : 'مرشح',
    estCreatorRate: 0,
    matchScore: 0,
    reasons: ['مرشح غير معروف'],
  };
};
