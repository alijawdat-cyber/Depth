// ================================
// إعدادات النظام (System Settings) - SSOT
// - المرجع المركزي لهامش الوكالة والعملة واللغة والإشعارات
// - تُستخدم من قبل وحدات التسعير والحسابات والبريد
// ================================

// تعريف واجهة إعدادات النظام  // بنية قابلة للتوسّع لاحقاً
export interface SystemSettings {
	id: string; // معرف الإعدادات
	/**
	 * نسبة هامش الوكالة بصيغة عشرية (0.25 = 25%).
	 * ملاحظة: كانت سابقاً تُستخدم قيم مثل 2.25 (225%) مما يسبب لبساً وتضخيماً.
	 */
	defaultMarginPercent: number; 
	/** للعرض فقط: النسبة بشكل 0-100 (مثال 25). */
	defaultMarginPercentForDisplay?: number;
	/** بديل اصطلاحي اختياري يحافظ على التوافق: نفس قيمة defaultMarginPercent */
	defaultMarginMultiplier?: number;
	currency: 'IQD'; // العملة الافتراضية
	language: 'ar' | 'en'; // اللغة الافتراضية
	notificationEmail: string; // بريد إشعار إداري
	updatedAt: string; // آخر تحديث ISO
}

// نسخة إعدادات افتراضية (SSOT)  // تُستخدم عبر النظام
export const systemSettings: SystemSettings = Object.freeze({
	id: 'sys_cfg_001', // معرّف ثابت
	// اعتماد الدلالة العشرية: 0.25 = 25%
	defaultMarginPercent: 0.25,
	defaultMarginPercentForDisplay: 25,
	defaultMarginMultiplier: 0.25,
	currency: 'IQD', // الدينار العراقي
	language: 'ar', // العربية
	notificationEmail: 'admin@depth.example', // بريد الإشعارات
	updatedAt: '2025-09-05T00:00:00.000Z', // تاريخ تحديث
});

// دالة مساعدة: الحصول على نسبة هامش الوكالة  // للاستخدام داخل الحسابات
export const getAgencyMarginPercent = (): number => systemSettings.defaultMarginPercent; // إرجاع النسبة العشرية (0.25)

// دالة مساعدة: العملة الافتراضية  // للاستخدام في الفوترة/العقود
export const getDefaultCurrency = (): 'IQD' => systemSettings.currency; // العملة

// دالة مساعدة: اللغة الافتراضية  // للاستخدام في الواجهة/القوالب
export const getDefaultLanguage = (): 'ar' | 'en' => systemSettings.language; // اللغة
// System Settings V2.1 - إعدادات النظام
