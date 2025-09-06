// ================================ // التقييمات (Reviews) - SSOT V2.1
// - يتبع مخطط الوثائق: 02-database/01-database-schema.md (قسم reviews) // مرجع المخطط
// - يُستخدم للتقارير ولوحات الإدارة وحساب متوسطات التقييم // الغرض
// - تقييم واحد لكل طرف لكل مشروع؛ التقييم 1-5 مع تعليق اختياري // سياسة التقييم
// ================================ // ترويسة

import type { ISODateString } from '../types/core'; // نوع تاريخ ISO من الأنواع الأساسية
import { projectMap } from '../projects/projects'; // خريطة المشاريع للتحقق من الحالة

// أنواع المساعدة البسيطة // تعليق
export type ReviewId = string; // معرف التقييم (rev_*)
export type ProjectId = string; // معرف المشروع (p_*)
export type UserId = string; // معرف المستخدم (client_* | creator_* | admin_* ...)

// الكيان الرئيسي للتقييم حسب الوثائق // تعليق
export interface ReviewEntity { // كيان Review
	id: ReviewId; // معرف التقييم (PK)
	projectId: ProjectId; // معرف المشروع (FK)
	reviewerId: UserId; // معرف المُقيم (عميل/مبدع)
	revieweeId: UserId; // معرف المُقَيَّم (مبدع/عميل)
	rating: 1 | 2 | 3 | 4 | 5; // التقييم من 1 إلى 5
	comment?: string; // تعليق اختياري
	isPublic: boolean; // هل يظهر للعامة
	createdAt: ISODateString; // تاريخ الإنشاء
	updatedAt: ISODateString; // آخر تحديث
} // نهاية ReviewEntity

// مُدخل إنشاء تقييم جديد // تعليق
export interface CreateReviewInput { // مدخل create
	projectId: ProjectId; // مشروع الهدف
	reviewerId: UserId; // من يكتب التقييم
	revieweeId: UserId; // على من التقييم
	rating: 1 | 2 | 3 | 4 | 5; // قيمة التقييم
	comment?: string; // تعليق اختياري
	isPublic?: boolean; // إن لم يُمرر نفترض true
} // نهاية CreateReviewInput

// بيانات نموذجية متوافقة مع معرفات النظام الحالية (مشاريع/مستخدمين) // ملاحظات البيانات
export const reviews: ReviewEntity[] = [ // جدول التقييمات النموذجية
	{ id: 'rev_001', projectId: 'p_001_restaurant', reviewerId: 'client_002', revieweeId: 'creator_001', rating: 5, comment: 'عمل ممتاز وجودة عالية', isPublic: true, createdAt: '2025-08-28T12:00:00.000Z', updatedAt: '2025-08-28T12:00:00.000Z' }, // عميل المطعم يقيّم المبدع
	{ id: 'rev_002', projectId: 'p_001_restaurant', reviewerId: 'creator_001', revieweeId: 'client_002', rating: 5, comment: 'تعاون رائع ودفع سريع', isPublic: true, createdAt: '2025-08-29T09:10:00.000Z', updatedAt: '2025-08-29T09:10:00.000Z' }, // المبدع يقيّم العميل لنفس المشروع
	{ id: 'rev_003', projectId: 'p_002_salon_campaign', reviewerId: 'client_001', revieweeId: 'creator_002', rating: 4, comment: 'نتيجة جيدة وبعض الملاحظات الطفيفة', isPublic: true, createdAt: '2025-08-30T15:20:00.000Z', updatedAt: '2025-08-30T15:20:00.000Z' }, // عميل ألبسة يقيّم مبدعًا (حملة صالون)
	{ id: 'rev_004', projectId: 'p_002_salon_campaign', reviewerId: 'creator_002', revieweeId: 'client_001', rating: 5, comment: 'تنسيق محترف ومواعيد واضحة', isPublic: true, createdAt: '2025-08-31T11:05:00.000Z', updatedAt: '2025-08-31T11:05:00.000Z' }, // رد تقييم من المبدع
	{ id: 'rev_005', projectId: 'p_004_personal_session', reviewerId: 'client_002', revieweeId: 'creator_003', rating: 5, comment: 'جلسة رائعة وصور مميزة', isPublic: true, createdAt: '2025-09-01T10:00:00.000Z', updatedAt: '2025-09-01T10:00:00.000Z' }, // مشروع جلسة شخصية
]; // نهاية البيانات النموذجية

// فهارس مساعدة للوصول السريع // تعليق
export const reviewsByProject: Record<ProjectId, ReviewEntity[]> = reviews.reduce((acc, r) => { (acc[r.projectId] ||= []).push(r); return acc; }, {} as Record<ProjectId, ReviewEntity[]>); // حسب المشروع
export const reviewsByReviewee: Record<UserId, ReviewEntity[]> = reviews.reduce((acc, r) => { (acc[r.revieweeId] ||= []).push(r); return acc; }, {} as Record<UserId, ReviewEntity[]>); // حسب المقَيَّم
export const reviewsByReviewer: Record<UserId, ReviewEntity[]> = reviews.reduce((acc, r) => { (acc[r.reviewerId] ||= []).push(r); return acc; }, {} as Record<UserId, ReviewEntity[]>); // حسب المُقيم

// مرشحات الاستعلام البسيطة // تعليق
export interface ReviewFilter { // فلتر استعلام
	projectId?: ProjectId; // تصفية بالمشروع
	reviewerId?: UserId; // تصفية بالمُقيم
	revieweeId?: UserId; // تصفية بالمقَيَّم
} // نهاية ReviewFilter

// دوال قائمة/استرجاع // تعليق
export const listReviews = (filter?: ReviewFilter): ReviewEntity[] => { // إرجاع قائمة تقييمات مع فلتر اختياري
	const arr = reviews.slice(); // نسخة قابلة للتصفية
	if (!filter) return arr; // إن لم يُرسل فلتر نعيد الكل
	return arr.filter(r => // تطبيق الفلاتر
		(filter.projectId ? r.projectId === filter.projectId : true) && // شرط المشروع
		(filter.reviewerId ? r.reviewerId === filter.reviewerId : true) && // شرط المُقيم
		(filter.revieweeId ? r.revieweeId === filter.revieweeId : true) // شرط المقَيَّم
	); // نهاية الفلترة
}; // نهاية listReviews

export const getReviewsForProject = (projectId: ProjectId): ReviewEntity[] => reviewsByProject[projectId] || []; // تقييمات مشروع
export const getReviewsForUser = (userId: UserId): ReviewEntity[] => reviewsByReviewee[userId] || []; // تقييمات لشخص كمقَيَّم

// حساب متوسط التقييم لشخص (كمُقَيَّم) // تعليق
export const getAverageRatingForUser = (userId: UserId): number => { // متوسط تقييم
	const arr = reviewsByReviewee[userId] || []; // جلب التقييمات
	if (!arr.length) return 0; // إن لا يوجد تقييمات نعيد صفر
	const sum = arr.reduce((s, r) => s + r.rating, 0); // مجموع القيم
	return Math.round((sum / arr.length) * 100) / 100; // متوسط بدقة خانتين
}; // نهاية المتوسط

// تحقق من إمكانية إنشاء تقييم جديد (تقييم واحد لكل طرف لكل مشروع) // تعليق
export const canCreateReview = (projectId: ProjectId, reviewerId: UserId, revieweeId: UserId): boolean => { // صلاحية الإنشاء
	const existing = reviews.find(r => r.projectId === projectId && r.reviewerId === reviewerId && r.revieweeId === revieweeId); // بحث عن مثيل سابق
	return !existing; // يمكن إذا لا يوجد سابق
}; // نهاية canCreateReview

// مولد معرفات بسيط للتقييمات // تعليق
const nextReviewId = (): ReviewId => { // توليد rev_***
	const n = reviews.length + 1; // العدد التالي
	return `rev_${String(n).padStart(3, '0')}`; // بناء المعرف
}; // نهاية nextReviewId

// إضافة تقييم جديد مع التحقق // تعليق
export const createReview = (input: CreateReviewInput): ReviewEntity => { // إنشاء Review
	const { projectId, reviewerId, revieweeId, rating, comment, isPublic = true } = input; // تفكيك القيم
	if (rating < 1 || rating > 5) throw new Error('التقييم يجب أن يكون بين 1 و 5'); // تحقق النطاق
	// سياسة:
	// لا يُسمح بإنشاء تقييم إلا بعد اكتمال المشروع (status = 'completed') وفق الوثائق V2.0
	const proj = projectMap[projectId];
	if (!proj) throw new Error('المشروع غير موجود');
	if (proj.status !== 'completed') throw new Error('لا يمكن إضافة تقييم إلا بعد اكتمال المشروع');
	if (!canCreateReview(projectId, reviewerId, revieweeId)) throw new Error('لا يمكن إنشاء أكثر من تقييم واحد لنفس الطرف والمشروع'); // سياسة التفرد
	const now = new Date().toISOString() as ISODateString; // توقيت الآن
	const entity: ReviewEntity = { // بناء الكيان
		id: nextReviewId(), // معرف جديد
		projectId, // ربط المشروع
		reviewerId, // من يكتب
		revieweeId, // من يُقيّم
		rating: rating as 1 | 2 | 3 | 4 | 5, // قيمة مصنفة
		comment, // التعليق
		isPublic, // العلنية
		createdAt: now, // إنشاء
		updatedAt: now, // تحديث
	}; // نهاية الكيان
	reviews.push(entity); // إضافة للمصفوفة
	(reviewsByProject[projectId] ||= []).push(entity); // تحديث فهرس المشروع
	(reviewsByReviewee[revieweeId] ||= []).push(entity); // تحديث فهرس المقَيَّم
	(reviewsByReviewer[reviewerId] ||= []).push(entity); // تحديث فهرس المُقيم
	return entity; // إرجاع الكيان المنشأ
}; // نهاية createReview

// تلخيص سريع للتقارير // تعليق
export const getReviewsSummary = () => { // مُلخص
	const total = reviews.length; // إجمالي التقييمات
	const forCreators = reviews.filter(r => r.revieweeId.startsWith('creator_')).length; // تقييمات تخص المبدعين
	const forClients = reviews.filter(r => r.revieweeId.startsWith('client_')).length; // تقييمات تخص العملاء
	const avgAll = total ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / total) * 100) / 100 : 0; // متوسط عام
	return { total, forCreators, forClients, avgAll }; // الإخراج المختصر
}; // نهاية الملخص

// سجل/ريجستري نمطي للتصدير والمراقبة // تعليق
export const REVIEWS_SCHEMA_VERSION = '2.1.0'; // رقم نسخة المخطط
export const reviewsRegistry = { // كائن السجل
	version: REVIEWS_SCHEMA_VERSION, // النسخة
	count: reviews.length, // عدد العناصر
	all: reviews, // كامل البيانات
	byProject: reviewsByProject, // حسب المشروع
	byReviewee: reviewsByReviewee, // حسب المقَيَّم
	byReviewer: reviewsByReviewer, // حسب المُقيم
}; // نهاية السجل

// Reviews V2.1 - التقييمات // تذييل
