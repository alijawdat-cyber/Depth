// ================================
// أنواع المشاريع والمهام الموحدة (SSOT)
// - متوافقة مع V2.1 وتستند إلى أنواع التسعير الموحدة
// - تُستخدم عبر: المشاريع، المهام، العروض، العقود، الفواتير، الحسابات
// ================================

import type {
  ProcessingLevel, // مستوى المعالجة للمهمة
  ExperienceLevel, // مستوى الخبرة
  EquipmentTier, // فئة المعدات
  LocationKey, // نوع موقع التنفيذ
  RushKey, // مفتاح الاستعجال
  OwnershipKey, // مفتاح ملكية المعدات
  PricingCalculation, // نتيجة حساب التسعير
  PricingFactorsSnapshot, // لقطة عوامل التسعير
} from './pricing';

// حالات المهمة  // not_started | in_progress | review | revision | completed | on_hold | cancelled
export type TaskStatus =
  | 'pending' // بديل موحّد لـ not_started
  | 'assigned' // بعد تعيين المبدع وقبل بدء التنفيذ
  | 'not_started' // توافقي قديم → يُعرض كـ pending
  | 'in_progress'
  | 'review'
  | 'revision'
  | 'completed'
  | 'on_hold'
  | 'cancelled';

// حالات المشروع  // draft | planning | in-progress | review | completed | cancelled | on-hold | pending | active
export type ProjectStatus =
  | 'draft'
  | 'planning'
  | 'in-progress'
  | 'review'
  | 'completed'
  | 'cancelled'
  | 'on-hold'
  | 'pending'
  | 'active';

// أولوية المشروع  // low | normal | high | urgent
export type ProjectPriority = 'low' | 'normal' | 'high' | 'urgent';

// اقتراح مبدع مبسط للمهام  // يُستخدم للعَرْض فقط
export interface TaskCreatorSuggestion {
  creatorId: string; // معرّف المبدع
  creatorName: string; // اسم المبدع
  matchScore: number; // درجة المطابقة 0-100
  reasons?: string[]; // أسباب الترشيح
}

// مهمة مشروع موحّدة  // هي الوحدة القابلة للتسعير والتتبع
export interface ProjectTask {
  id: string; // معرّف المهمة
  projectId: string; // معرّف المشروع
  categoryId: string; // فئة رئيسية (تصوير/فيديو/تصميم/مونتاج)
  subcategoryId: string; // فئة فرعية محددة
  quantity: number; // الكمية المطلوبة
  processingLevel: ProcessingLevel; // مستوى المعالجة للمخرجات
  rushKey?: RushKey; // مفتاح الاستعجال
  ownershipKey?: OwnershipKey; // ملكية المعدات
  locationKey?: LocationKey; // موقع التنفيذ

  // مفاتيح تؤثر على التسعير (تُحفظ لضمان إعادة حساب متطابقة)
  experienceKey: ExperienceLevel; // مستوى الخبرة المستخدم
  equipmentTier: EquipmentTier; // شريحة/فئة المعدات المستخدمة

  suggestedCreators?: TaskCreatorSuggestion[]; // ترشيحات مبدعين
  assignedCreatorId?: string; // المبدع المعين
  assignedCreatorName?: string; // اسم المبدع المعين
  assignmentReason?: string; // سبب التعيين

  // تعيين موظف براتب ثابت (اختياري)
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;

  pricingBasePrice?: number; // السعر الأساسي للوحدة (من الفئة الفرعية)
  pricingFactors?: PricingFactorsSnapshot; // لقطة عوامل التسعير المستخدمة
  pricing?: Pick<
    PricingCalculation,
    'unitCreatorPrice' | 'totalCreatorPrice' | 'agencyMarginPercent' | 'agencyMarginAmount' | 'clientPrice'
  >; // نتائج التسعير للمهمة

  status: TaskStatus; // حالة المهمة
  dueDate?: string; // تاريخ الاستحقاق/التسليم للمهمة
  priority?: 'low' | 'normal' | 'high' | 'urgent'; // أولوية المهمة
  progress: number; // نسبة الإنجاز 0-100
  estimatedHours: number; // الساعات التقديرية
  actualHours?: number; // الساعات الفعلية
  startDate?: string; // تاريخ البدء الفعلي
  plannedEndDate?: string; // تاريخ الانتهاء المخطط
  completedDate?: string; // تاريخ الإنجاز الفعلي

  requirements?: string; // متطلبات إضافية
  specialInstructions?: string; // تعليمات خاصة
  notes?: string; // ملاحظات عامة

  referenceFiles?: string[]; // ملفات مرجعية
  deliverableFiles?: string[]; // ملفات التسليم
  fileFormat?: string; // صيغة الملفات المطلوبة
  dimensions?: string; // الأبعاد المطلوبة
  colorProfile?: string; // نموذج الألوان

  createdAt: string; // تاريخ الإنشاء
  updatedAt: string; // تاريخ التحديث
}

// إجماليات التسعير للمشروع  // مجاميع مشتقة من المهام (SSOT)
export interface ProjectTotals {
  totalBasePrice: number; // مجموع الأسعار الأساسية
  totalCreatorPrice: number; // مجموع أسعار المبدعين
  totalClientPrice: number; // السعر النهائي للعميل
  totalMarginAmount: number; // إجمالي هامش الوكالة
  marginPercentage: number; // نسبة الهامش المستخدمة
}

// جهة الإنشاء/الموافقة المبسطة  // معلومات إدارية بسيطة
export interface SimpleUserRef {
  id: string; // المعرّف
  name: string; // الاسم
}

// مشروع موحّد  // الوعاء الجامع للمهام والأجماليات والحالة
export interface UnifiedProject {
  id: string; // معرّف المشروع
  name: string; // الاسم المختصر
  title: string; // عنوان واضح للمشروع
  description?: string; // وصف تفصيلي

  clientId: string; // معرّف العميل
  client: SimpleUserRef; // مرجع العميل المختصر
  industryId: string; // معرّف الصناعة
  industryName?: string; // اسم الصناعة (للعرض)

  category: 'photography' | 'videography' | 'design' | 'editing' | 'mixed'; // نوع المشروع الرئيسي
  tasks: ProjectTask[]; // المهام الموحّدة
  pricing: ProjectTotals; // إجماليات التسعير

  status: ProjectStatus; // حالة المشروع
  priority: ProjectPriority; // أولوية التنفيذ
  isRush: boolean; // مشروع مستعجل
  location: LocationKey; // موقع التنفيذ العام
  budgetIQD?: number; // ميزانية تقريبية (اختياري)

  requestedDate: string; // تاريخ الطلب الأصلي
  approvedDate?: string; // تاريخ موافقة الإدارة
  startDate?: string; // تاريخ البدء الفعلي
  deadline: string; // تاريخ التسليم المطلوب
  completedDate?: string; // تاريخ الإنجاز الفعلي
  // حقول داعمة للفهرسة والتقارير
  overallProgress?: number; // إجمالي تقدم المشروع 0-100
  plannedDeliveryDate?: string; // تاريخ التسليم المخطط (قد يختلف عن deadline)
  isLate?: boolean; // متأخر (وجود أي مهمة متأخرة)

  originalRequestId?: string; // ربط بطلب المشروع الأصلي
  requestSubcategoryId?: string; // الفئة الفرعية من الطلب

  createdBy: SimpleUserRef; // منشئ المشروع
  approvedBy?: string; // معرّف المسؤول الموافق
  isArchived: boolean; // فلاغ أرشفة مستقل عن الحالة

  clientRequirements?: string; // متطلبات العميل
  internalNotes?: string; // ملاحظات داخلية

  estimatedDuration: number; // المدة التقديرية بالأيام
  actualDuration?: number; // المدة الفعلية
  clientSatisfactionRating?: number; // تقييم العميل

  tags?: string[]; // وسوم
  complexity?: 'simple' | 'medium' | 'complex' | 'enterprise'; // تعقيد

  createdAt: string; // تاريخ الإنشاء
  updatedAt: string; // تاريخ التحديث
}
