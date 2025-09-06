// ================================ // ملف منظم
// ترشيحات المبدعين (Creator Recommendations) V2.1 - SSOT // وصف عام
// - خوارزمية بسيطة لترتيب المبدعين حسب التوافق مع الفئة الفرعية والصناعة // الهدف
// - يستهلك: creatorSubcategories + subcategoryIndustryLinks + creators + industries // الترابط
// - يجهّز مخرجات قابلة للاستخدام في واجهات اختيار المبدعين للمشاريع/المهام // الاستخدام
// ================================ // فاصل

import { // استيراد روابط الفئة↔الصناعة
	linksBySubcategory, // خريطة: subcategoryId -> روابط
	listIndustriesForSubcategory, // دالة: قائمة روابط مرتبة بالصناعة
} from '../services/subcategoryIndustryLinks'; // مصدر روابط التوافق
import { // استيراد اختصصاصات المبدعين
	creatorSubcategories, // بيانات الربط (مبدع→فئات فرعية)
	creatorSubcategoriesByCreator, // خريطة وصول سريعة
} from '../services/creatorSubcategories'; // مصدر اختصاصات المبدعين
import { // استيراد المبدعين
	creators, // قائمة المبدعين
	creatorById, // خريطة مبدع حسب المعرف
} from '../core/creators'; // مصدر بيانات المبدعين
import { // استيراد الصناعات
	getIndustryById, // جلب كائن الصناعة
} from '../services/industries'; // مصدر الصناعات
import { // توفر وأعلام المبدعين
	getFlags as getAvailabilityFlags,
} from '../system/creatorAvailability';
import type { CreatorCity } from '../types/entities';

// أدوات وقت مساعدة // تواريخ وحماية
const nowIso = (): string => new Date().toISOString(); // إرجاع الوقت الحالي بصيغة ISO

// نوع نتيجة الترشيح // عقد المخرجات
export interface CreatorRecommendation { // واجهة الترشيح
	creatorId: string; // معرف المبدع
	creatorName: string; // اسم المبدع
	score: number; // درجة 0-100
	reasons: string[]; // أسباب نصية عربية
	subcategoryMatch: boolean; // هل يمتلك خبرة في الفئة الفرعية
	industryMatchScore: number; // درجة ملاءمة الصناعة 0-100
	yearsOfExperience?: number; // سنوات خبرة تقريبية
	averageRating?: number; // تقييم 0-5
	profileMultiplier?: number; // معامل ملف (للمعلومة)
	// تفصيل الدرجات لشفافية أعلى
	breakdown?: {
		base: number; // نقاط أساس لمطابقة الفئة
		industry: number; // مساهمة الصناعة (0..30)
		experience: number; // مساهمة سنوات الخبرة (0..10)
		rating: number; // مساهمة التقييم (0..10)
		proximity?: number; // قرب جغرافي (+5 عند التطابق)
		rush?: number; // ملاءمة الاستعجال (+5 أو -10)
		budget?: number; // غير مطبق حالياً
		dueDate?: number; // غير مطبق حالياً
		total: number; // المجموع النهائي بعد القيود
	};
} // نهاية الواجهة

// حراسة القيم العددية // دوال صغيرة
const clamp = (n: number, min: number, max: number): number => Math.max(min, Math.min(max, n)); // ضبط ضمن نطاق

// حساب درجة الترشيح // دالة أساسية
const computeRecommendationScore = (params: { // مدخلات الحساب
	hasSubcategory: boolean; // امتلاك الفئة الفرعية
	industryLinkScore?: number; // درجة رابط الصناعة (0-100)
	yearsOfExperience?: number; // خبرة تقريبية
	averageRating?: number; // تقييم 0-5
}): { base: number; industry: number; experience: number; rating: number; total: number } => { // مكونات
	if (!params.hasSubcategory) return { base: 0, industry: 0, experience: 0, rating: 0, total: 0 }; // لا نقاط
	const base = 50; // أساس لنقاط المطابقة للفئة
	const industry = (clamp(params.industryLinkScore ?? 0, 0, 100) / 100) * 30; // حتى 30 نقطة للصناعة
	const experience = (clamp(params.yearsOfExperience ?? 0, 0, 5) / 5) * 10; // حتى 10 نقاط للسنوات (سقف 5)
	const rating = ((clamp(params.averageRating ?? 0, 0, 5) / 5) * 10); // حتى 10 نقاط للتقييم
	const total = clamp(Math.round(base + industry + experience + rating), 0, 100);
	return { base, industry, experience, rating, total };
}; // نهاية الدالة

// بناء أسباب الترشيح بالعربية // دالة توضيح
const buildReasons = (args: { // مدخلات الشرح
	subcategoryId: string; // الفئة الفرعية
	industryId?: string; // الصناعة (اختياري)
	industryLinkScore?: number; // درجة الصناعة
	yearsOfExperience?: number; // سنوات الخبرة
	averageRating?: number; // التقييم
}): string[] => { // مصفوفة أسباب
	const reasons: string[] = []; // مصفوفة فارغة
	reasons.push('مطابقة للفئة الفرعية المطلوبة'); // سبب أساسي
	if (typeof args.industryLinkScore === 'number') { // إن توفرت درجة الصناعة
		const indName = args.industryId ? (getIndustryById(args.industryId)?.nameAr || 'الصناعة المطلوبة') : 'الصناعة المطلوبة'; // اسم الصناعة
		reasons.push(`ملاءمة مع ${indName} بدرجة ${args.industryLinkScore}`); // سبب الصناعة
	} // نهاية الشرط
	if (typeof args.yearsOfExperience === 'number') reasons.push(`خبرة تقريبية ${args.yearsOfExperience} سنة`); // سبب الخبرة
	if (typeof args.averageRating === 'number') reasons.push(`تقييم عام ${args.averageRating.toFixed(1)} من 5`); // سبب التقييم
	return reasons; // إرجاع الأسباب
}; // نهاية الدالة

// دالة مساعده: إيجاد درجة ملاءمة الصناعة لفئة فرعية // Lookup بسيط
const getIndustryFitForSubcategory = (subcategoryId: string, industryId?: string): number | undefined => { // درجة 0-100
	if (!industryId) { // إن لم تحدد الصناعة
		const top = listIndustriesForSubcategory(subcategoryId)[0]; // استخدم أعلى رابط كمرجع
		return top?.score; // قد تكون غير معرّفة
	} // نهاية الشرط
	const links = linksBySubcategory[subcategoryId] || []; // روابط الفئة
	const match = links.find((l) => l.industryId === industryId); // ابحث عن الصناعة
	return match?.score; // قد لا توجد
}; // نهاية الدالة

// التوصية لمعرّف فئة فرعية + صناعة اختيارية // الواجهة الرئيسية
export const recommendCreatorsForSubcategory = (params: { // عقد الإدخال
	subcategoryId: string; // الفئة الفرعية المطلوبة
	industryId?: string; // الصناعة (اختياري)
	limit?: number; // حد أعلى لعدد النتائج
	clientCity?: CreatorCity; // مدينة العميل لتقريب جغرافي بسيط
	rush?: boolean; // هل المهمة مستعجلة
  dueDate?: string; // موعد التسليم المرغوب
  budgetIQD?: number; // ميزانية تقريبية (اختياري)
}): CreatorRecommendation[] => { // مصفوفة ترشيحات
	const { subcategoryId, industryId, limit = 5, clientCity, rush, dueDate, budgetIQD } = params; // تفكيك المعطيات
	const industryScore = getIndustryFitForSubcategory(subcategoryId, industryId); // درجة الصناعة
	const recos: CreatorRecommendation[] = []; // مصفوفة نواتج

	for (const creator of creators) { // مر على جميع المبدعين
		if (!creator.isActive) continue; // تجاهل غير النشطين
		const cs = creatorSubcategoriesByCreator[creator.id]; // جلب اختصاصات المبدع
		const hasSub = !!cs && cs.subcategoryIds.includes(subcategoryId); // هل يملك الفئة
		if (!hasSub) continue; // نحتاج مطابقة الفئة الفرعية
				const baseComp = computeRecommendationScore({ // حساب درجات أساسية
			hasSubcategory: true, // مطابقة
			industryLinkScore: industryScore, // ملاءمة الصناعة
			yearsOfExperience: cs?.yearsOfExperience, // خبرة
			averageRating: cs?.averageRating, // تقييم
		}); // نهاية الحساب
				let score = baseComp.total;
		const reasons = buildReasons({ // أسباب أولية
			subcategoryId,
			industryId,
			industryLinkScore: industryScore,
			yearsOfExperience: cs?.yearsOfExperience,
			averageRating: cs?.averageRating,
		});

		// قرب جغرافي بسيط عبر مطابقة المدينة
		if (clientCity && creator.city) {
			if (creator.city === clientCity) {
				score = clamp(score + 5, 0, 100);
				reasons.push('قرب جغرافي: نفس مدينة العميل');
			}
		}

		// مطابقة أعلام الاستعجال
		if (rush) {
			const flags = getAvailabilityFlags(creator.id);
			if (flags?.rushAvailable) {
				score = clamp(score + 5, 0, 100);
				reasons.push('يدعم الأعمال المستعجلة');
			} else {
				score = clamp(score - 10, 0, 100);
				reasons.push('لا يفضّل الأعمال المستعجلة');
			}
		}

				// مراعاة بسبب الموعد النهائي: تقريبي حسب القرب من الآن
				let dueDateDeltaScore: number | undefined;
				if (dueDate) {
					const now = Date.now();
					const diffDays = Math.ceil((new Date(dueDate).getTime() - now) / (1000 * 60 * 60 * 24));
					// <=3 أيام: صارم
					if (diffDays <= 3) {
						const flags = getAvailabilityFlags(creator.id);
						if (flags?.rushAvailable) {
							score = clamp(score + 3, 0, 100);
							dueDateDeltaScore = 3;
							reasons.push('جاهز لمواعيد قريبة جداً');
						} else {
							score = clamp(score - 5, 0, 100);
							dueDateDeltaScore = -5;
							reasons.push('قد لا يتناسب مع موعد قريب');
						}
					} else if (diffDays <= 7) {
						const flags = getAvailabilityFlags(creator.id);
						if (flags?.rushAvailable) {
							score = clamp(score + 2, 0, 100);
							dueDateDeltaScore = 2;
							reasons.push('ملائم لمواعيد خلال أسبوع');
						} else {
							score = clamp(score - 2, 0, 100);
							dueDateDeltaScore = -2;
							reasons.push('قد يحتاج لوقت أطول قليلاً');
						}
					} else {
						dueDateDeltaScore = 0;
					}
				}

				// ملاءمة الميزانية التقريبية باستخدام profileMultiplier كمؤشر
				let budgetScore: number | undefined;
				if (typeof budgetIQD === 'number') {
					const pm = creator.profileMultiplier ?? 1.0;
					if (pm <= 0.95) {
						score = clamp(score + 2, 0, 100);
						budgetScore = 2;
						reasons.push('ملائم للميزانية');
					} else if (pm >= 1.1) {
						score = clamp(score - 3, 0, 100);
						budgetScore = -3;
						reasons.push('قد يتجاوز الميزانية');
					} else {
						budgetScore = 0;
					}
				}
		if (score <= 0) continue; // تجاهل إن كانت 0
		recos.push({ // أضف ترشيح
			creatorId: creator.id, // معرف
			creatorName: creator.name, // اسم
			score, // درجة
			reasons, // أسباب
			subcategoryMatch: true, // تطابق فئة
			industryMatchScore: industryScore ?? 0, // درجة الصناعة
			yearsOfExperience: cs?.yearsOfExperience, // خبرة
			averageRating: cs?.averageRating, // تقييم
			profileMultiplier: creator.profileMultiplier, // معامل ملف
						breakdown: {
							base: baseComp.base,
							industry: baseComp.industry,
							experience: baseComp.experience,
							rating: baseComp.rating,
			  proximity: (clientCity && creator.city && creator.city === clientCity) ? 5 : undefined,
			  rush: rush ? (getAvailabilityFlags(creator.id)?.rushAvailable ? 5 : -10) : undefined,
			  budget: budgetScore,
			  dueDate: dueDateDeltaScore,
							total: score,
						},
		}); // نهاية الدفع
	} // نهاية الحلقة

	recos.sort((a, b) => b.score - a.score); // ترتيب تنازلي حسب الدرجة
	return recos.slice(0, clamp(limit, 1, 20)); // إرجاع ضمن الحد الأعلى (1..20)
}; // نهاية الدالة

// غلاف ملائم: إرجاع قائمة أعلى المبدعين // اختصار اسم دالّة
export const listTopCreatorsFor = (subcategoryId: string, industryId?: string, limit = 5): CreatorRecommendation[] => // تعريف الدالة
	recommendCreatorsForSubcategory({ subcategoryId, industryId, limit }); // تفويض التنفيذ

// شرح توصية لمبدع محدد // أداة مساعده
export const explainRecommendation = (creatorId: string, subcategoryId: string, industryId?: string): string[] => { // أسباب نصية
	const c = creatorById[creatorId]; // جلب المبدع
	const cs = creatorSubcategoriesByCreator[creatorId]; // جلب اختصاصاته
	if (!c || !cs) return ['لا تتوفر بيانات كافية عن هذا المبدع']; // حراسة
	if (!cs.subcategoryIds.includes(subcategoryId)) return ['المبدع لا يمتلك خبرة مباشرة في الفئة الفرعية المطلوبة']; // عدم تطابق
	const industryScore = getIndustryFitForSubcategory(subcategoryId, industryId); // درجة الصناعة
	return buildReasons({ // إرجاع أسباب مبنية
		subcategoryId, // فئة
		industryId, // صناعة
		industryLinkScore: industryScore, // درجة
		yearsOfExperience: cs.yearsOfExperience, // خبرة
		averageRating: cs.averageRating, // تقييم
	}); // نهاية الإرجاع
}; // نهاية الدالة

// ملخص سريع // تقارير مبسطة
export const getCreatorRecommendationsSummary = () => { // دالة التلخيص
	const totalCreators = creators.length; // عدد المبدعين
	const totalMappings = creatorSubcategories.length; // عدد خرائط الاختصاص
	const activeCreators = creators.filter((c) => c.isActive).length; // عدد النشطين
	return { totalCreators, activeCreators, totalMappings, generatedAt: nowIso() }; // نتيجة الملخص
}; // نهاية الدالة

// سجل تجميعي للوصول // Registry
export const CREATOR_RECOMMENDATIONS_SCHEMA_VERSION = '2.1.0'; // نسخة المخطط
export const creatorRecommendationsRegistry = { // السجل
	version: CREATOR_RECOMMENDATIONS_SCHEMA_VERSION, // النسخة
	summary: getCreatorRecommendationsSummary, // ملخص
	recommendForSubcategory: recommendCreatorsForSubcategory, // دالة رئيسية
	listTopFor: listTopCreatorsFor, // دالة مساعدة
	explain: explainRecommendation, // شرح الأسباب
}; // نهاية السجل
// Creator Recommendations V2.1 - الترشيحات الذكية
